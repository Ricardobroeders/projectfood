import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPush, type Subscription } from '@/lib/push'

type NotifCopy = { title: string; body: string; url: string }

const COPY: Record<string, Record<string, NotifCopy>> = {
  inactivity_reminder: {
    en: { title: 'Project Food 🌿', body: "Your plants are waiting! Log what you've eaten and unlock your weekly grocery advice.", url: '/log' },
    nl: { title: 'Project Food 🌿', body: 'Je planten wachten! Log wat je gegeten hebt en ontgrendel je weekadvies.', url: '/log' },
    it: { title: 'Project Food 🌿', body: 'Le tue piante ti aspettano! Registra quello che hai mangiato e sblocca i tuoi consigli settimanali.', url: '/log' },
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

async function alreadySentSince(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  type: string,
  since: string,
) {
  const { data } = await supabase
    .from('notification_log')
    .select('id')
    .eq('user_id', userId)
    .eq('type', type)
    .gte('sent_at', since + 'T00:00:00+00:00')
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

export async function GET(req: Request) {
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
      notif_daily_reminder, notif_streak_rescue, notif_weekly_nudge,
      push_subscriptions (endpoint, p256dh, auth, failure_count)
    `)
    .eq('notifications_enabled', true)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!users?.length) return NextResponse.json({ ok: true, sent: 0 })

  let sent = 0
  const errors: string[] = []

  for (const user of users as any[]) {
    try {
      const subs: Sub[] = user.push_subscriptions ?? []
      if (!subs.length) continue

      const tz = user.timezone ?? 'Europe/Amsterdam'
      const locale = (user.locale ?? 'en') as 'en' | 'nl' | 'it'
      const today = localDate(tz)
      const dayOfWeek = localDayOfWeek(tz)

      // --- Inactivity reminder (2+ days no log, max once every 3 days) ---
      if (user.notif_daily_reminder) {
        const threeDaysAgo = new Date(today)
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
        const since = threeDaysAgo.toLocaleDateString('en-CA')

        if (!(await alreadySentSince(supabase, user.user_id, 'inactivity_reminder', since))) {
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)
          const { data: recentLogs } = await supabase
            .from('plant_logs').select('id').eq('user_id', user.user_id)
            .gte('logged_on', yesterday.toLocaleDateString('en-CA')).limit(1)

          if (!recentLogs?.length) {
            const tmpl = COPY['inactivity_reminder'][locale] ?? COPY['inactivity_reminder']['en']
            await deliverToUser(supabase, subs, tmpl)
            await logSent(supabase, user.user_id, 'inactivity_reminder')
            sent++
          }
        }
      }

      // --- Streak rescue (fires if streak >= 3 and user hasn't logged today) ---
      if (user.notif_streak_rescue) {
        if (!(await alreadySentSince(supabase, user.user_id, 'streak_rescue', today))) {
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
        if (!(await alreadySentSince(supabase, user.user_id, 'weekly_nudge', today))) {
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
    } catch (err: any) {
      console.error(`[cron/notifications] failed for user ${user.user_id}:`, err?.message ?? err)
      errors.push(user.user_id)
    }
  }

  return NextResponse.json({ ok: true, sent, errors })
}
