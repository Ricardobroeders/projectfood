import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPush, type Subscription } from '@/lib/push'

type NotifCopy = { title: string; body: string; url: string }

const COPY: Record<string, Record<string, NotifCopy>> = {
  daily_reminder_streak: {
    en: { title: 'Project Food 🌱', body: "Don't break your {streak}-day streak! Log a plant before bed.", url: '/log' },
    nl: { title: 'Project Food 🌱', body: 'Breek je reeks van {streak} dagen niet! Log een plant voor het slapen.', url: '/log' },
    it: { title: 'Project Food 🌱', body: 'Non interrompere la tua serie di {streak} giorni! Registra una pianta prima di dormire.', url: '/log' },
  },
  daily_reminder: {
    en: { title: 'Project Food 🌱', body: 'What plants did you eat today? Log them in 10 seconds.', url: '/log' },
    nl: { title: 'Project Food 🌱', body: 'Welke planten heb je vandaag gegeten? Log ze in 10 seconden.', url: '/log' },
    it: { title: 'Project Food 🌱', body: 'Quali piante hai mangiato oggi? Registrale in 10 secondi.', url: '/log' },
  },
  streak_rescue: {
    en: { title: 'Project Food ⏰', body: 'Your {streak}-day streak is about to end. Quick — log one plant.', url: '/log' },
    nl: { title: 'Project Food ⏰', body: 'Je reeks van {streak} dagen loopt bijna af. Snel — log één plant.', url: '/log' },
    it: { title: 'Project Food ⏰', body: 'La tua serie di {streak} giorni sta per finire. Veloce — registra una pianta.', url: '/log' },
  },
  weekly_nudge: {
    en: { title: 'Project Food 🌿', body: '{remaining} plants to go before Sunday ends. Unlock your advice!', url: '/log' },
    nl: { title: 'Project Food 🌿', body: 'Nog {remaining} planten voor het einde van zondag. Ontgrendel je advies!', url: '/log' },
    it: { title: 'Project Food 🌿', body: 'Ancora {remaining} piante prima della fine di domenica. Sblocca i tuoi consigli!', url: '/log' },
  },
  reengagement: {
    en: { title: 'Project Food 🌱', body: 'Your gut microbiome misses you. Log a plant today.', url: '/log' },
    nl: { title: 'Project Food 🌱', body: 'Je darmmicrobioom mist je. Log vandaag een plant.', url: '/log' },
    it: { title: 'Project Food 🌱', body: 'Il tuo microbioma intestinale ti manca. Registra una pianta oggi.', url: '/log' },
  },
}

function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''))
}

function localDate(tz: string): string {
  try { return new Date().toLocaleDateString('en-CA', { timeZone: tz }) } catch { return new Date().toLocaleDateString('en-CA') }
}

function localDayOfWeek(tz: string): number {
  try {
    const d = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    return d.indexOf(new Date().toLocaleDateString('en-US', { weekday: 'short', timeZone: tz }))
  } catch { return new Date().getDay() }
}

function weekStartDate(tz: string): string {
  const today = new Date(localDate(tz))
  const day = today.getDay()
  const diff = day === 0 ? -6 : 1 - day
  today.setDate(today.getDate() + diff)
  return today.toLocaleDateString('en-CA')
}

type Sub = { endpoint: string; p256dh: string; auth: string; failure_count: number }

async function alreadySentToday(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  type: string,
  today: string,
) {
  const { data } = await supabase
    .from('notification_log')
    .select('id')
    .eq('user_id', userId)
    .eq('type', type)
    .gte('sent_at', today + 'T00:00:00+00:00')
    .limit(1)
  return (data?.length ?? 0) > 0
}

async function logSent(supabase: ReturnType<typeof createAdminClient>, userId: string, type: string) {
  await supabase.from('notification_log').insert({ user_id: userId, type })
}

async function deliverToUser(
  supabase: ReturnType<typeof createAdminClient>,
  subs: Sub[],
  payload: NotifCopy,
) {
  for (const sub of subs) {
    const result = await sendPush(sub as Subscription, {
      title: payload.title,
      body: payload.body,
      data: { url: payload.url },
    })
    if (result === 'gone') {
      const newCount = sub.failure_count + 1
      if (newCount >= 3) {
        await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
      } else {
        await supabase
          .from('push_subscriptions')
          .update({ failure_count: newCount, last_failure_at: new Date().toISOString() })
          .eq('endpoint', sub.endpoint)
      }
    } else {
      await supabase
        .from('push_subscriptions')
        .update({ last_success_at: new Date().toISOString(), failure_count: 0 })
        .eq('endpoint', sub.endpoint)
    }
  }
}

async function computeStreak(supabase: ReturnType<typeof createAdminClient>, userId: string): Promise<number> {
  // Count consecutive days with logs going back from yesterday
  const { data: logs } = await supabase
    .from('plant_logs')
    .select('logged_on')
    .eq('user_id', userId)
    .order('logged_on', { ascending: false })
    .limit(60)
  if (!logs?.length) return 0

  const dates = [...new Set((logs as { logged_on: string }[]).map((l) => l.logged_on))].sort().reverse()
  const today = new Date().toLocaleDateString('en-CA')
  let streak = 0
  let expected = new Date(today)
  expected.setDate(expected.getDate() - 1) // start from yesterday

  for (const date of dates) {
    const d = new Date(date)
    const exp = expected.toLocaleDateString('en-CA')
    if (date === exp) {
      streak++
      expected.setDate(expected.getDate() - 1)
    } else if (date < exp) {
      break
    }
  }
  return streak
}

export async function POST(req: Request) {
  const secret = req.headers.get('x-cron-secret') ?? req.headers.get('authorization')?.replace('Bearer ', '')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createAdminClient()

  // Fetch all opted-in users with their subscriptions
  const { data: users, error } = await supabase
    .from('user_settings')
    .select(`
      user_id, locale, timezone,
      notif_daily_reminder, notif_streak_rescue, notif_weekly_nudge, notif_reengagement,
      push_subscriptions (endpoint, p256dh, auth, failure_count)
    `)
    .eq('notifications_enabled', true)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!users?.length) return NextResponse.json({ ok: true, sent: 0 })

  let sent = 0

  for (const user of users as any[]) {
    const subs: Sub[] = user.push_subscriptions ?? []
    if (!subs.length) continue

    const tz = user.timezone ?? 'Europe/Amsterdam'
    const locale = (user.locale ?? 'en') as 'en' | 'nl' | 'it'
    const today = localDate(tz)
    const dayOfWeek = localDayOfWeek(tz)

    // --- Daily reminder (sent once per day to everyone who hasn't logged today) ---
    if (user.notif_daily_reminder) {
      if (!(await alreadySentToday(supabase, user.user_id, 'daily_reminder', today))) {
        const { data: todayLogs } = await supabase
          .from('plant_logs').select('id').eq('user_id', user.user_id).eq('logged_on', today).limit(1)

        if (!todayLogs?.length) {
          const streakCount = await computeStreak(supabase, user.user_id)
          const key = streakCount >= 1 ? 'daily_reminder_streak' : 'daily_reminder'
          const tmpl = COPY[key][locale] ?? COPY[key]['en']
          await deliverToUser(supabase, subs, { ...tmpl, body: fill(tmpl.body, { streak: streakCount }) })
          await logSent(supabase, user.user_id, 'daily_reminder')
          sent++
        }
      }
    }

    // --- Streak rescue (same run; only fires if streak >= 3 and user hasn't logged) ---
    if (user.notif_streak_rescue) {
      if (!(await alreadySentToday(supabase, user.user_id, 'streak_rescue', today))) {
        const { data: todayLogs } = await supabase
          .from('plant_logs').select('id').eq('user_id', user.user_id).eq('logged_on', today).limit(1)

        if (!todayLogs?.length) {
          const streakCount = await computeStreak(supabase, user.user_id)
          if (streakCount >= 3) {
            const tmpl = COPY['streak_rescue'][locale] ?? COPY['streak_rescue']['en']
            await deliverToUser(supabase, subs, { ...tmpl, body: fill(tmpl.body, { streak: streakCount }) })
            await logSent(supabase, user.user_id, 'streak_rescue')
            sent++
          }
        }
      }
    }

    // --- Sunday nudge (only on Sundays, 25–29 plants) ---
    if (user.notif_weekly_nudge && dayOfWeek === 0) {
      if (!(await alreadySentToday(supabase, user.user_id, 'weekly_nudge', today))) {
        const weekStart = weekStartDate(tz)
        const { data: weekLogs } = await supabase
          .from('plant_logs').select('plant_id').eq('user_id', user.user_id).gte('logged_on', weekStart)
        const weekCount = new Set((weekLogs ?? []).map((l: any) => l.plant_id)).size

        if (weekCount >= 25 && weekCount < 30) {
          const tmpl = COPY['weekly_nudge'][locale] ?? COPY['weekly_nudge']['en']
          await deliverToUser(supabase, subs, { ...tmpl, body: fill(tmpl.body, { remaining: 30 - weekCount }) })
          await logSent(supabase, user.user_id, 'weekly_nudge')
          sent++
        }
      }
    }

    // --- Re-engagement (3–13 days inactive) ---
    if (user.notif_reengagement) {
      if (!(await alreadySentToday(supabase, user.user_id, 'reengagement', today))) {
        const { data: lastLog } = await supabase
          .from('plant_logs').select('logged_on').eq('user_id', user.user_id)
          .order('logged_on', { ascending: false }).limit(1)

        if (lastLog?.length) {
          const diffDays = Math.floor(
            (new Date(today).getTime() - new Date((lastLog[0] as any).logged_on).getTime()) / 86400000,
          )
          if (diffDays >= 3 && diffDays < 14) {
            const tmpl = COPY['reengagement'][locale] ?? COPY['reengagement']['en']
            await deliverToUser(supabase, subs, tmpl)
            await logSent(supabase, user.user_id, 'reengagement')
            sent++
          }
        }
      }
    }
  }

  return NextResponse.json({ ok: true, sent })
}
