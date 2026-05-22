import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const LANG: Record<string, string> = { en: 'English', nl: 'Dutch', it: 'Italian' }

function currentWeekStart(): string {
  const today = new Date()
  const day = today.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  return monday.toLocaleDateString('en-CA')
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const selectedPlants: string[] = body.selected_plants ?? []
  if (selectedPlants.length === 0) {
    return NextResponse.json({ error: 'No plants selected' }, { status: 400 })
  }

  const ws = currentWeekStart()
  const weekEnd = new Date(ws)
  weekEnd.setDate(weekEnd.getDate() + 6)
  const we = weekEnd.toLocaleDateString('en-CA')

  // User locale for response language
  const { data: settings } = await supabase
    .from('user_settings')
    .select('locale')
    .eq('user_id', user.id)
    .maybeSingle()
  const locale = settings?.locale ?? 'en'
  const language = LANG[locale] ?? 'English'

  // Get plants already logged this week (unique names)
  const { data: logs } = await supabase
    .from('plant_logs')
    .select('plants(name)')
    .eq('user_id', user.id)
    .gte('logged_on', ws)
    .lte('logged_on', we)

  const alreadyLogged = [...new Set(
    ((logs ?? []) as any[]).map((l) => l.plants?.name).filter(Boolean) as string[]
  )]

  const systemPrompt = `You are a plant-diversity and gut health recipe advisor for an app called Project Food.
Generate exactly 3 complete, practical recipes. Each recipe must prominently feature one or more of the selected plants.

Rules for ingredients:
- need_to_buy: true — plant is in the selected shopping picks (user needs to buy it)
- need_to_buy: false — plant is already in the user's weekly logs (they have it)
- Non-plant pantry items (olive oil, salt, water, etc.) use category: null and need_to_buy: false

Valid category values: fruit, vegetable, herb, nut_seed, legume, whole_grain, ferment
Use null for non-plant ingredients.

For gut_note: write 1–2 sentences explaining the specific gut health benefit of this recipe (prebiotic fiber, polyphenols, live cultures, etc.).

Recipes should be easy to make (max 8 steps), practical for home cooking, and varied across the 3.
Respond in ${language}.

Return ONLY valid JSON:
{
  "recipes": [
    {
      "title": "Recipe Name",
      "time_minutes": 20,
      "serves": 2,
      "gut_note": "Short gut health explanation.",
      "ingredients": [
        {"name": "Chickpeas", "category": "legume", "need_to_buy": true},
        {"name": "Kale", "category": "vegetable", "need_to_buy": false},
        {"name": "Olive oil", "category": null, "need_to_buy": false}
      ],
      "steps": ["Step 1.", "Step 2."]
    }
  ]
}`

  const userMessage = `Selected shopping picks (need to buy): ${selectedPlants.join(', ')}
Plants already logged this week (already have): ${alreadyLogged.length > 0 ? alreadyLogged.join(', ') : 'none'}

Generate 3 recipes that prominently use the selected picks. Use the already-logged plants as supporting ingredients where natural. Mark need_to_buy correctly.`

  let recipesRaw: any
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
    recipesRaw = JSON.parse(completion.choices[0].message.content ?? '{}')
  } catch {
    return NextResponse.json({ error: 'Failed to generate recipes' }, { status: 500 })
  }

  const recipes = recipesRaw.recipes ?? []

  // Store this batch
  const { data: batch, error } = await supabase
    .from('recipe_batches')
    .insert({
      user_id: user.id,
      week_start: ws,
      selected_plants: selectedPlants,
      recipes,
    })
    .select('id, created_at, selected_plants, recipes')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to store recipes' }, { status: 500 })
  }

  return NextResponse.json({ batch })
}
