import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPush, type Subscription } from '@/lib/push'
import OpenAI from 'openai'

const ALL_CATEGORIES = ['fruit', 'vegetable', 'herb', 'nut_seed', 'legume', 'whole_grain']
const LANG: Record<string, string> = { en: 'English', nl: 'Dutch', it: 'Italian' }

const GOAL_REACHED_COPY: Record<string, { title: string; body: string }> = {
  en: { title: 'Project Food 🎉', body: '30 plants reached! Your grocery advice is ready.' },
  nl: { title: 'Project Food 🎉', body: '30 planten bereikt! Je boodschappenadvies staat klaar.' },
  it: { title: 'Project Food 🎉', body: '30 piante raggiunte! I tuoi consigli della spesa sono pronti.' },
}

function currentWeekStart(): string {
  const today = new Date()
  const day = today.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  return monday.toLocaleDateString('en-CA')
}

async function sendGoalReachedNotification(userId: string, locale: string) {
  try {
    const admin = createAdminClient()

    // Check user has goal_reached notifications enabled
    const { data: settings } = await admin
      .from('user_settings')
      .select('notifications_enabled, notif_goal_reached')
      .eq('user_id', userId)
      .single()

    if (!settings?.notifications_enabled || !settings?.notif_goal_reached) return

    // Check not already sent today
    const today = new Date().toLocaleDateString('en-CA')
    const { data: existing } = await admin
      .from('notification_log')
      .select('id')
      .eq('user_id', userId)
      .eq('type', 'goal_reached')
      .gte('sent_at', today + 'T00:00:00+00:00')
      .limit(1)
    if (existing?.length) return

    // Fetch subscriptions
    const { data: subs } = await admin
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth, failure_count')
      .eq('user_id', userId)
    if (!subs?.length) return

    const copy = GOAL_REACHED_COPY[locale] ?? GOAL_REACHED_COPY['en']

    for (const sub of subs as any[]) {
      const result = await sendPush(sub as Subscription, {
        title: copy.title,
        body: copy.body,
        data: { url: '/advice' },
      })
      if (result === 'gone') {
        const newCount = sub.failure_count + 1
        if (newCount >= 3) {
          await admin.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
        } else {
          await admin.from('push_subscriptions')
            .update({ failure_count: newCount, last_failure_at: new Date().toISOString() })
            .eq('endpoint', sub.endpoint)
        }
      } else {
        await admin.from('push_subscriptions')
          .update({ last_success_at: new Date().toISOString(), failure_count: 0 })
          .eq('endpoint', sub.endpoint)
      }
    }

    await admin.from('notification_log').insert({ user_id: userId, type: 'goal_reached' })
  } catch {
    // Non-fatal — advice was already saved, don't block the response
  }
}

export async function POST() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ws = currentWeekStart()
  const weekEnd = new Date(ws)
  weekEnd.setDate(weekEnd.getDate() + 6)
  const we = weekEnd.toLocaleDateString('en-CA')

  // Return cached advice if it already exists for this week
  const { data: existing } = await supabase
    .from('weekly_advice')
    .select('advice')
    .eq('user_id', user.id)
    .eq('week_start', ws)
    .maybeSingle()

  if (existing) return NextResponse.json({ advice: existing.advice })

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
Your job: suggest 3–5 plants to add to next week's shopping list.

Reasoning priority (use ALL of these angles, not just variety):
1. Nutritional gaps — what nutrients, compounds, or health benefits are missing?
   (e.g. probiotics, omega-3s, vitamin C, prebiotic fibre, polyphenols, folate, iron…)
2. Missing or underrepresented plant categories
3. Repetition — if a plant was logged 4+ times, suggest a variety swap in the same category
4. Seasonality for ${month} in the Northern Hemisphere

For each suggestion, the "reason" should name the specific benefit or nutrient it brings
that was absent or low this week (e.g. "Sauerkraut is rich in probiotics — you haven't
had any fermented foods this week.").

Keep reasons short (1–2 sentences), friendly and practical.
Respond in ${language}.
Return ONLY valid JSON: {"summary":"...","suggestions":[{"plant":"...","reason":"..."}]}`

  const userMessage = `Week: ${ws} – ${we}
Plants logged this week (${plants.length} unique):
${plantLines || '(none)'}

Categories covered: ${covered.join(', ') || 'none'}
Categories not logged this week: ${missing.join(', ') || 'none'}
Current month: ${month}`

  let advice: object
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
    advice = JSON.parse(completion.choices[0].message.content ?? '{}')
  } catch {
    return NextResponse.json({ error: 'Failed to generate advice' }, { status: 500 })
  }

  const { error } = await supabase
    .from('weekly_advice')
    .insert({ user_id: user.id, week_start: ws, advice })

  // 23505 = unique_violation (race condition — another request beat us)
  if (error && error.code !== '23505') {
    return NextResponse.json({ error: 'Failed to store advice' }, { status: 500 })
  }

  // Fire goal-reached push notification (non-blocking)
  sendGoalReachedNotification(user.id, locale)

  return NextResponse.json({ advice })
}
