import { createClient } from '@/lib/supabase/client'
import { type Category } from '@/lib/cats'

export type Advice = { summary: string; suggestions: { plant: string; reason: string }[] }
export type WeekRow = { week_start: string; variety: number; hit_goal: boolean }
export type AdviceRow = { week_start: string; advice: Advice }
export type CatRow = { category: Category; unique_count: number; total_in_category: number }

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
  ] = await Promise.all([
    supabase.rpc('current_week_plants'),
    supabase.rpc('weekly_variety'),
    supabase.from('plant_logs').select('plants(id, name, category, image_url)').eq('logged_on', today).eq('user_id', userId),
    supabase.from('plant_translations').select('plant_id, name').eq('locale', locale),
    supabase.from('weekly_advice').select('advice').eq('week_start', weekStart).maybeSingle(),
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

  const weekAdvice = (adviceRow?.advice as Advice) ?? null

  return { weekCount, daysLeft, byCategory, todayPlants, weekAdvice }
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

  const { data: settings } = await supabase
    .from('user_settings')
    .select('username, locale, notifications_enabled, notif_daily_reminder, notif_streak_rescue, notif_weekly_nudge, notif_reengagement, timezone, unlocked_borders, active_border')
    .eq('user_id', user.id)
    .single()

  return {
    userId: user.id,
    name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    email: user.email ?? null,
    avatar: user.user_metadata?.avatar_url ?? null,
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

export async function fetchAdvice() {
  const supabase = createClient()
  const { data } = await supabase
    .from('weekly_advice')
    .select('week_start, advice')
    .order('week_start', { ascending: false })
  return (data ?? []) as AdviceRow[]
}
