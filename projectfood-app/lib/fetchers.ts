import { createClient } from '@/lib/supabase/client'
import { type Category } from '@/lib/cats'

export type Advice = { summary: string; suggestions: { plant: string; reason: string }[] }
export type WeekRow = { week_start: string; variety: number; hit_goal: boolean }
export type AdviceRow = { week_start: string; advice: Advice }
export type CatRow = { category: Category; unique_count: number; total_in_category: number }

export type EnrichedSuggestion = {
  plant: string
  category: Category
  meal_context: string
  reason: string
  why?: string
  featured: boolean
  image_url?: string | null
}

export type EnrichedAdvice = {
  summary: string
  suggestions: EnrichedSuggestion[]
}

export type RecipeIngredient = {
  name: string
  amount?: string
  category: Category | null
  need_to_buy: boolean
}

export type Recipe = {
  title: string
  time_minutes: number
  serves: number
  gut_note: string
  ingredients: RecipeIngredient[]
  steps: string[]
}

export type RecipeBatch = {
  id: string
  created_at: string
  selected_plants: string[]
  recipes: Recipe[]
}

export async function fetchHome([, locale]: [string, string]) {
  const supabase = createClient()
  const today = new Date().toLocaleDateString('en-CA')

  const dayOfWeekNow = new Date().getDay()
  const mondayOffset = dayOfWeekNow === 0 ? -6 : 1 - dayOfWeekNow
  const mondayDate = new Date()
  mondayDate.setDate(mondayDate.getDate() + mondayOffset)
  const weekStart = mondayDate.toLocaleDateString('en-CA')

  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id ?? ''

  const [
    { data: weekPlants },
    { data: variety },
    { data: todayLogs },
    { data: translations },
    { data: adviceRow },
    { data: settings },
    { data: completedResponses },
    { count: activeQuestionCount },
    { data: newestQuestion },
  ] = await Promise.all([
    supabase.rpc('current_week_plants'),
    supabase.rpc('weekly_variety'),
    supabase.from('plant_logs').select('plants(id, name, category, image_url)').eq('logged_on', today).eq('user_id', userId),
    supabase.from('plant_translations').select('plant_id, name').eq('locale', locale),
    supabase.from('weekly_advice').select('advice').eq('week_start', weekStart).maybeSingle(),
    supabase.from('user_settings').select('survey_dismissed_at').eq('user_id', userId).maybeSingle(),
    supabase.from('survey_responses').select('question_id').eq('user_id', userId).eq('status', 'complete'),
    supabase.from('survey_questions').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('survey_questions').select('created_at').eq('is_active', true).order('created_at', { ascending: false }).limit(1).maybeSingle(),
  ])

  const nameByPlantId = Object.fromEntries(
    ((translations ?? []) as { plant_id: string; name: string }[]).map((tr) => [tr.plant_id, tr.name])
  )

  const weekCount = (variety as number) ?? 0
  const dayOfWeek = new Date().getDay()
  const dayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const daysLeft = 6 - dayIdx

  const byCategory: Partial<Record<Category, string[]>> = {}
  for (const plant of (weekPlants as any[]) ?? []) {
    const cat = plant.category as Category
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat]!.push(nameByPlantId[plant.id] ?? plant.name)
  }

  const todayPlants = [...new Map(
    ((todayLogs ?? []) as any[])
      .map((l) => l.plants)
      .filter(Boolean)
      .map((p: any) => [p.id, { ...p, name: nameByPlantId[p.id] ?? p.name }])
  ).values()]

  const weekAdvice = (adviceRow?.advice as EnrichedAdvice) ?? null

  const completedIds = new Set((completedResponses ?? []).map((r: any) => r.question_id))
  const totalActive = activeQuestionCount ?? 0
  const answeredCount = (completedResponses ?? []).filter((r: any) => completedIds.has(r.question_id)).length
  const dismissedAt = settings?.survey_dismissed_at ? new Date(settings.survey_dismissed_at) : null
  const newestCreatedAt = newestQuestion?.created_at ? new Date(newestQuestion.created_at) : null
  const hasNewSinceDismisal = newestCreatedAt && dismissedAt ? newestCreatedAt > dismissedAt : true
  const hasPendingSurvey = answeredCount < totalActive && (!dismissedAt || hasNewSinceDismisal)

  return { weekCount, daysLeft, byCategory, todayPlants, weekAdvice, hasPendingSurvey, userId }
}

export async function fetchStats() {
  const supabase = createClient()
  const [
    { data: streak },
    { data: history },
    { data: breakdown },
  ] = await Promise.all([
    supabase.rpc('current_streak'),
    supabase.rpc('weekly_history', { p_weeks: 5 }),
    supabase.rpc('category_breakdown'),
  ])

  const cats = (breakdown as CatRow[]) ?? []
  const totalTried = cats.reduce((s, c) => s + c.unique_count, 0)
  const totalPlants = cats.reduce((s, c) => s + c.total_in_category, 0)

  return {
    streakCount: (streak as number) ?? 0,
    totalTried,
    totalPlants,
    weeks: (history as WeekRow[]) ?? [],
    cats,
  }
}

export async function fetchAccount([, locale]: [string, string]) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [
    { data: settings },
    { count: totalActive },
    { data: completedResponses },
  ] = await Promise.all([
    supabase
      .from('user_settings')
      .select('username, locale, notifications_enabled, notif_daily_reminder, notif_streak_rescue, notif_weekly_nudge, notif_reengagement, timezone, unlocked_borders, active_border, custom_avatar_image, custom_avatar_bg')
      .eq('user_id', user.id)
      .single(),
    supabase.from('survey_questions').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('survey_responses').select('question_id').eq('user_id', user.id).not('answer', 'is', null),
  ])

  return {
    userId: user.id,
    name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    email: user.email ?? null,
    avatar: settings?.custom_avatar_image
      ? `/images/avatars/${settings.custom_avatar_image}.png`
      : (user.user_metadata?.avatar_url ?? null),
    avatarBg: settings?.custom_avatar_bg ?? null,
    customAvatarImage: settings?.custom_avatar_image ?? null,
    username: settings?.username ?? null,
    currentLocale: (settings?.locale ?? locale) as 'en' | 'nl' | 'it',
    unlockedBorders: (settings?.unlocked_borders ?? []) as string[],
    activeBorder: (settings?.active_border ?? 'default') as string,
    notifSettings: {
      notificationsEnabled: settings?.notifications_enabled ?? false,
      notifDailyReminder: settings?.notif_daily_reminder ?? true,
      notifStreakRescue: settings?.notif_streak_rescue ?? true,
      notifWeeklyNudge: settings?.notif_weekly_nudge ?? true,
      notifReengagement: settings?.notif_reengagement ?? true,
      timezone: settings?.timezone ?? 'Europe/Amsterdam',
    },
    surveyProgress: {
      answered: (completedResponses ?? []).length,
      total: totalActive ?? 0,
    },
  }
}

export async function fetchLeaderboard() {
  const supabase = createClient()
  const { data } = await supabase.rpc('leaderboard', { p_limit: 15 })
  return (data as any[]) ?? []
}

export async function fetchStreakLeaderboard() {
  const supabase = createClient()
  const { data } = await supabase.rpc('leaderboard_streaks', { p_limit: 15 })
  return (data as any[]) ?? []
}

export async function searchUsers(query: string) {
  const supabase = createClient()
  const { data } = await supabase.rpc('search_users', { p_query: query })
  return (data as any[]) ?? []
}

export async function fetchPendingRequests() {
  const supabase = createClient()
  const { data } = await supabase.rpc('pending_requests')
  return (data ?? []) as { id: string; type: 'incoming' | 'outgoing'; other_user_id: string; username: string }[]
}

export async function fetchSocialFriends() {
  const supabase = createClient()
  const { data } = await supabase.rpc('social_friends')
  return (data as any[]) ?? []
}

export async function fetchFriendsLeaderboard() {
  const supabase = createClient()
  const { data } = await supabase.rpc('leaderboard_friends', { p_limit: 15 })
  return (data as any[]) ?? []
}

export async function fetchFriendsStreakLeaderboard() {
  const supabase = createClient()
  const { data } = await supabase.rpc('leaderboard_friends_streaks', { p_limit: 15 })
  return (data as any[]) ?? []
}

export async function fetchAchievementsStats() {
  const supabase = createClient()
  const { data } = await supabase.rpc('user_achievements_stats')
  return (data as any[])?.[0] ?? null
}

export async function fetchUserProfile(username: string) {
  const supabase = createClient()
  const { data } = await supabase.rpc('user_profile', { p_username: username })
  return (data as any[])?.[0] ?? null
}

export async function fetchUserDailyHistory(username: string) {
  const supabase = createClient()
  const { data } = await supabase.rpc('user_daily_history', { p_username: username, p_days: 30 })
  return (data ?? []) as { date: string; variety: number }[]
}

export async function fetchOwnDailyHistory() {
  const supabase = createClient()
  const { data } = await supabase.rpc('daily_history', { p_days: 30 })
  return (data ?? []) as { date: string; variety: number }[]
}

export async function fetchWeeklyVariety(): Promise<number> {
  const supabase = createClient()
  const { data } = await supabase.rpc('weekly_variety')
  return (data as number) ?? 0
}

function weekStartDate(): string {
  const dayOfWeek = new Date().getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const mondayDate = new Date()
  mondayDate.setDate(mondayDate.getDate() + mondayOffset)
  return mondayDate.toLocaleDateString('en-CA')
}

export async function fetchRecipeState(): Promise<RecipeBatch[]> {
  const supabase = createClient()
  const weekStart = weekStartDate()
  const { data } = await supabase
    .from('recipe_batches')
    .select('id, created_at, selected_plants, recipes')
    .eq('week_start', weekStart)
    .order('created_at', { ascending: false })
    .limit(6)
  return (data as RecipeBatch[]) ?? []
}

export async function fetchAdvice() {
  const supabase = createClient()
  const { data } = await supabase
    .from('weekly_advice')
    .select('week_start, advice')
    .order('week_start', { ascending: false })
  return (data ?? []) as AdviceRow[]
}

export type SurveyOption = { value: string; label: string }

export type SurveyQuestion = {
  id: string
  key: string
  section: string
  type: 'radio' | 'checkbox' | 'text' | 'number' | 'scale'
  options: SurveyOption[] | null
  display_order: number
  label: string
  help_text: string | null
}

export type SurveyResponse = {
  question_id: string
  answer: unknown
  status: 'draft' | 'complete'
  answered_at: string | null
}

export async function fetchSurvey([, locale]: [string, string]) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const resolveLocale = async (loc: string) => {
    const { data } = await supabase
      .from('survey_questions')
      .select('id, key, section, type, options, display_order, survey_question_translations!inner(label, help_text)')
      .eq('is_active', true)
      .eq('survey_question_translations.locale', loc)
      .order('display_order')
    return data
  }

  const [questionsRaw, questionsEn, { data: responsesRaw }] = await Promise.all([
    resolveLocale(locale),
    locale !== 'en' ? resolveLocale('en') : Promise.resolve(null),
    supabase
      .from('survey_responses')
      .select('question_id, answer, status, answered_at')
      .eq('user_id', user.id),
  ])

  // Fall back to EN for any question missing a translation in the requested locale
  const enById = new Map((questionsEn ?? []).map((q: any) => [q.id, q]))
  const questions: SurveyQuestion[] = ((questionsRaw ?? []) as any[]).map((q) => {
    const translations = q.survey_question_translations?.[0] ?? enById.get(q.id)?.survey_question_translations?.[0]
    return {
      id: q.id,
      key: q.key,
      section: q.section,
      type: q.type,
      options: q.options as SurveyOption[] | null,
      display_order: q.display_order,
      label: translations?.label ?? q.key,
      help_text: translations?.help_text ?? null,
    }
  })

  // If locale has no translations at all, fall back entirely to EN
  const resolved = questions.length > 0 ? questions : ((questionsEn ?? []) as any[]).map((q) => {
    const tr = q.survey_question_translations?.[0]
    return {
      id: q.id, key: q.key, section: q.section, type: q.type,
      options: q.options as SurveyOption[] | null,
      display_order: q.display_order,
      label: tr?.label ?? q.key,
      help_text: tr?.help_text ?? null,
    }
  })

  const responses: SurveyResponse[] = (responsesRaw ?? []) as SurveyResponse[]

  return { questions: resolved, responses, userId: user.id }
}
