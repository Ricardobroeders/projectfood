import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const ALL_CATEGORIES = ['fruit', 'vegetable', 'herb', 'nut_seed', 'legume', 'whole_grain', 'ferment']
const LANG: Record<string, string> = { en: 'English', nl: 'Dutch', it: 'Italian' }

function currentWeekStart(): string {
  const today = new Date()
  const day = today.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  return monday.toLocaleDateString('en-CA')
}

export async function POST() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ws = currentWeekStart()
  const weekEnd = new Date(ws)
  weekEnd.setDate(weekEnd.getDate() + 6)
  const we = weekEnd.toLocaleDateString('en-CA')

  // Return cached advice if it already exists for this week AND has enriched fields
  const { data: existing } = await supabase
    .from('weekly_advice')
    .select('advice')
    .eq('user_id', user.id)
    .eq('week_start', ws)
    .maybeSingle()

  // Old rows lack `category` on suggestions — fall through to regenerate them
  const hasEnrichedAdvice = existing?.advice?.suggestions?.[0]?.category != null
  if (existing && hasEnrichedAdvice) {
    // Backfill images if cached advice has none (case-sensitive .in() bug meant image_url was always null)
    const needsImages = existing.advice.suggestions.some((s: any) => s.image_url == null)
    if (!needsImages) return NextResponse.json({ advice: existing.advice })

    const { data: allPlants } = await supabase.from('plants').select('name, image_url')
    const imageMap: Record<string, string | null> = {}
    for (const row of (allPlants ?? []) as { name: string; image_url: string | null }[]) {
      imageMap[row.name.toLowerCase()] = row.image_url
    }
    const enriched = {
      ...existing.advice,
      suggestions: existing.advice.suggestions.map((s: any) => ({
        ...s,
        image_url: imageMap[s.plant.toLowerCase()] ?? s.image_url ?? null,
      })),
    }
    await supabase
      .from('weekly_advice')
      .upsert({ user_id: user.id, week_start: ws, advice: enriched }, { onConflict: 'user_id,week_start' })
    return NextResponse.json({ advice: enriched })
  }

  // User locale for response language
  const { data: settings } = await supabase
    .from('user_settings')
    .select('locale')
    .eq('user_id', user.id)
    .maybeSingle()
  const locale = settings?.locale ?? 'en'
  const language = LANG[locale] ?? 'English'

  // Plant frequency this week (all logs, not deduplicated)
  const { data: logs } = await supabase
    .from('plant_logs')
    .select('plant_id, plants(name, category)')
    .eq('user_id', user.id)
    .gte('logged_on', ws)
    .lte('logged_on', we)

  const freq: Record<string, { name: string; category: string; count: number }> = {}
  for (const log of (logs ?? []) as any[]) {
    const p = log.plants
    if (!p) continue
    if (!freq[log.plant_id]) freq[log.plant_id] = { name: p.name, category: p.category, count: 0 }
    freq[log.plant_id].count++
  }

  const plants = Object.values(freq).sort((a, b) => b.count - a.count)
  const covered = [...new Set(plants.map((p) => p.category))]
  const missing = ALL_CATEGORIES.filter((c) => !covered.includes(c))
  const month = new Date().toLocaleString('en-US', { month: 'long' })
  const plantLines = plants.map((p) => `- ${p.name} (${p.category}) — ${p.count}x`).join('\n')

  const systemPrompt = `You are a plant-diversity and nutrition advisor for a gut health app called Project Food.
Users track 30 different plants per week to support gut health and microbiome diversity.
Your job: suggest 6–8 plants to add to next week's shopping list, and mark exactly 1–2 of them as a "top pick" (featured: true) — the ones that would make the biggest difference given this week's gaps.

Reasoning priority (use ALL of these angles across all suggestions):
1. Nutritional gaps — what nutrients, compounds, or health benefits are missing?
2. Missing or underrepresented plant categories
3. Repetition — if a plant was logged 4+ times, suggest a variety swap in the same category
4. Seasonality for ${month} in the Northern Hemisphere
5. Synergy — foods that boost absorption of other foods already eaten this week

For each suggestion provide:
- plant: the plant name
- category: EXACTLY one of: fruit, vegetable, herb, nut_seed, legume, whole_grain, ferment
- meal_context: a very short (3–6 word) meal idea e.g. "For Thursday dinner", "Easy weekday breakfast", "Throw on tonight's pasta"
- reason: 1 sentence on the specific benefit or gap it fills (used in detailed view)
- why: ONLY for featured suggestions — a punchy 5–8 word gut health benefit e.g. "Prebiotic fiber your gut bacteria love"
- featured: true for your 1–2 top picks, false for the rest

Respond in ${language}.
Return ONLY valid JSON:
{"summary":"...","suggestions":[{"plant":"...","category":"vegetable","meal_context":"...","reason":"...","why":"...","featured":false}]}
(omit the "why" field entirely for non-featured suggestions)`

  const userMessage = `Week: ${ws} – ${we}
Plants logged this week (${plants.length} unique):
${plantLines || '(none)'}

Categories covered: ${covered.join(', ') || 'none'}
Categories not logged this week: ${missing.join(', ') || 'none'}
Current month: ${month}`

  let adviceRaw: any
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      response_format: { type: 'json_object' },
    })
    adviceRaw = JSON.parse(completion.choices[0].message.content ?? '{}')
  } catch {
    return NextResponse.json({ error: 'Failed to generate advice' }, { status: 500 })
  }

  // Look up image_url for suggested plants — fetch all and match lowercase to avoid
  // case-sensitivity issues with .in() (Postgres string comparison is case-sensitive)
  const { data: plantRows } = await supabase.from('plants').select('name, image_url')
  const imageByName: Record<string, string | null> = {}
  for (const row of (plantRows ?? []) as { name: string; image_url: string | null }[]) {
    imageByName[row.name.toLowerCase()] = row.image_url
  }

  // Attach image_url to each suggestion (case-insensitive lookup)
  const advice = {
    ...adviceRaw,
    suggestions: (adviceRaw.suggestions ?? []).map((s: any) => ({
      ...s,
      image_url: imageByName[s.plant.toLowerCase()] ?? null,
    })),
  }

  // Upsert so old rows without enriched fields get overwritten
  const { error } = await supabase
    .from('weekly_advice')
    .upsert({ user_id: user.id, week_start: ws, advice }, { onConflict: 'user_id,week_start' })

  if (error) {
    return NextResponse.json({ error: 'Failed to store advice' }, { status: 500 })
  }

  return NextResponse.json({ advice })
}
