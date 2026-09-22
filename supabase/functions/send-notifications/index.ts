// Dinner-time push for every household, every 15 minutes (pg_cron -> pg_net -> here).
// Rules (KB retention loop): the copy is a question that opens logging (D10); the streak keeper only
// when the streak is at risk (D7 freeze); marketing kinds off by default; three ignored in a row ->
// a week of silence; sent / delivered / opened / logged-within-3h recorded for every message.
// The rung nudge (KB achievement system) names one achievement that passed 50% or 75% of its next level,
// before dinner, at most one per household every three days, each mark once.
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

import { type Ctx, levelKey, nextRungs, type PlantRow, type RungState, type Threshold, thresholdOf } from './ladder.ts';
import { rungCopy } from './rung-copy.ts';

type Kind = 'dinner_question' | 'streak_keeper' | 'card_teaser' | 'family_30_nudge' | 'rung_nudge';
const ESSENTIAL = new Set<Kind>(['dinner_question', 'streak_keeper']);
const EXPO_PUSH = 'https://exp.host/--/api/v2/push';
/** A household hears about a rung at most this often. */
const RUNG_NUDGE_GAP_MS = 3 * 86400_000;

const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const admin = createClient(Deno.env.get('SUPABASE_URL')!, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

type Vars = { n?: number; kids?: string; member?: string; plant?: string; family?: string; rung?: RungState; owner?: string | null; threshold?: Threshold };
type Copy = { title: string; body: string };
const COPY: Record<string, Record<Kind, (v: Vars) => Copy>> = {
  en: {
    dinner_question: (v) => ({ title: 'Project Food', body: v.kids ? `What did ${v.kids} taste tonight?` : 'What did the family taste tonight?' }),
    streak_keeper: (v) => ({ title: 'One plant keeps the streak', body: `One plant tonight keeps the family streak at ${v.n}.` }),
    card_teaser: (v) => ({ title: 'A card is waiting', body: v.plant ? `${v.member}'s ${v.plant} card is one taste from the next level.` : 'The collection is waiting for tonight’s tastes.' }),
    family_30_nudge: (v) => ({ title: 'Almost 30', body: `${v.n} plants finish the family week.` }),
    rung_nudge: (v) => rungCopy('en', v.rung!, v.owner ?? null, v.threshold ?? 50),
  },
  nl: {
    dinner_question: (v) => ({ title: 'Project Food', body: v.kids ? `Wat heeft ${v.kids} vanavond geproefd?` : 'Wat heeft het gezin vanavond geproefd?' }),
    streak_keeper: (v) => ({ title: 'Eén plant houdt de reeks', body: `Eén plant vanavond houdt de gezinsreeks op ${v.n}.` }),
    card_teaser: (v) => ({ title: 'Er wacht een kaart', body: v.plant ? `De ${v.plant}-kaart van ${v.member} is één hap van het volgende niveau.` : 'De collectie wacht op de hapjes van vanavond.' }),
    family_30_nudge: (v) => ({ title: 'Bijna 30', body: `Nog ${v.n} planten en de gezinsweek is rond.` }),
    rung_nudge: (v) => rungCopy('nl', v.rung!, v.owner ?? null, v.threshold ?? 50),
  },
  it: {
    dinner_question: (v) => ({ title: 'Project Food', body: v.kids ? `Cosa ha assaggiato ${v.kids} stasera?` : 'Cosa ha assaggiato la famiglia stasera?' }),
    streak_keeper: (v) => ({ title: 'Una pianta salva la serie', body: `Una pianta stasera tiene la serie di famiglia a ${v.n}.` }),
    card_teaser: (v) => ({ title: 'Una carta ti aspetta', body: v.plant ? `La carta ${v.plant} di ${v.member} è a un assaggio dal prossimo livello.` : 'La collezione aspetta gli assaggi di stasera.' }),
    family_30_nudge: (v) => ({ title: 'Quasi 30', body: `${v.n} piante completano la settimana di famiglia.` }),
    rung_nudge: (v) => rungCopy('it', v.rung!, v.owner ?? null, v.threshold ?? 50),
  },
};
const copyFor = (locale: string, kind: Kind, v: Vars) => (COPY[locale] ?? COPY.en)[kind](v);

function localParts(tz: string, at: Date) {
  const f = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour12: false });
  const p = Object.fromEntries(f.formatToParts(at).map((x) => [x.type, x.value]));
  return { minutes: Number(p.hour) % 24 * 60 + Number(p.minute), weekday: p.weekday, date: `${p.year}-${p.month}-${p.day}` };
}
const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const shiftDate = (date: string, days: number) => {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

type Settings = {
  user_id: string; locale: string; notif_essential: boolean; notif_marketing: boolean; notif_daily_reminder: boolean; notif_streak_rescue: boolean;
  notif_reengagement: boolean; notif_weekly_nudge: boolean; notif_backoff_until: string | null; notifications_enabled: boolean;
};
type Token = { id: string; user_id: string; expo_push_token: string; failure_count: number };
type LogRow = { id: string; user_id: string; type: string; sent_at: string; opened_at: string | null; logged_within_3h: boolean | null };
type Member = { id: string; household_id: string; name: string; kind: string };
type NudgeRow = { member_id: string | null; achievement_id: string; level: number; threshold: number; sent: boolean; sent_at: string };
/** One message a household could get this run; `after` runs once it reached at least one phone. */
type Candidate = { kind: Kind; vars: Vars; url?: string; after?: () => Promise<void>; sent?: boolean };

function allowed(s: Settings, kind: Kind): boolean {
  if (ESSENTIAL.has(kind)) {
    if (!s.notif_essential) return false;
    return kind === 'dinner_question' ? s.notif_daily_reminder : s.notif_streak_rescue;
  }
  if (!s.notif_marketing) return false;
  return kind === 'card_teaser' || kind === 'rung_nudge' ? s.notif_reengagement : s.notif_weekly_nudge;
}

/** The plant catalogue, fetched once per run and only when a ladder needs it. */
function plantsOnce() {
  let p: Promise<Map<string, PlantRow>> | null = null;
  return () =>
    (p ??= (async () => {
      const { data } = await admin.from('plants').select('id, category, color, botanical_family, is_superfood').eq('is_active', true);
      return new Map<string, PlantRow>(((data ?? []) as PlantRow[]).map((r) => [r.id, r]));
    })());
}

/** Every owner's next rung for the household, from the same inputs and windows the app uses (400 days, 60 weeks). */
async function rungStates(hid: string, members: Member[], plants: Map<string, PlantRow>): Promise<RungState[]> {
  const [tastes, daily, weekly, streak, unlocks] = await Promise.all([
    admin.rpc('member_taste_counts', { p_household_id: hid }),
    admin.rpc('household_daily_activity', { p_household_id: hid, p_days: 400 }),
    admin.rpc('household_weekly_history', { p_household_id: hid, p_weeks: 60 }),
    admin.rpc('household_streak', { p_household_id: hid }),
    admin.from('achievement_unlocks').select('achievement_id, member_id, level').eq('household_id', hid),
  ]);
  const ctx: Ctx = {
    members: members.map((m) => ({ id: m.id, name: m.name })),
    tastes: (tastes.data ?? []) as Ctx['tastes'],
    daily: (daily.data ?? []) as Ctx['daily'],
    weekly: (weekly.data ?? []) as Ctx['weekly'],
    streak: ((streak.data ?? []) as Ctx['streak'][])[0] ?? null,
    plants,
  };
  const levels = new Map<string, number>();
  for (const u of (unlocks.data ?? []) as { achievement_id: string; member_id: string | null; level: number }[]) {
    const k = levelKey(u.achievement_id, u.member_id);
    levels.set(k, Math.max(levels.get(k) ?? 0, u.level));
  }
  return nextRungs(ctx, levels);
}

const rungRow = (hid: string, s: RungState, threshold: Threshold, sent: boolean) => ({ household_id: hid, member_id: s.memberId, achievement_id: s.id, level: s.level, threshold, sent });

/**
 * The one rung worth a push today: past 50% or 75% of its next level and not yet nudged at that mark.
 * A household's first run only records where it already stands (baseline), so old states never push.
 */
async function rungCandidate(hid: string, members: Member[], now: Date, plants: Map<string, PlantRow>): Promise<Candidate | null> {
  const [{ data: hh }, { data: nudgeRows }] = await Promise.all([
    admin.from('households').select('nudge_baseline_at').eq('id', hid).single(),
    admin.from('achievement_nudges').select('member_id, achievement_id, level, threshold, sent, sent_at').eq('household_id', hid),
  ]);
  const nudges = (nudgeRows ?? []) as NudgeRow[];
  const lastSent = nudges.filter((n) => n.sent).map((n) => n.sent_at).sort().pop();
  if (lastSent && new Date(lastSent).getTime() > now.getTime() - RUNG_NUDGE_GAP_MS) return null;

  const states = await rungStates(hid, members, plants);
  // highest mark already recorded per rung: a 75 row also covers 50
  const seen = new Map<string, number>();
  for (const n of nudges) {
    const k = `${levelKey(n.achievement_id, n.member_id)}:${n.level}`;
    seen.set(k, Math.max(seen.get(k) ?? 0, n.threshold));
  }
  const due: { s: RungState; t: Threshold }[] = [];
  for (const s of states) {
    const t = thresholdOf(s.fraction);
    if (t !== null && (seen.get(`${levelKey(s.id, s.memberId)}:${s.level}`) ?? 0) < t) due.push({ s, t });
  }

  if (!(hh as { nudge_baseline_at: string | null } | null)?.nudge_baseline_at) {
    if (due.length) await admin.from('achievement_nudges').insert(due.map((x) => rungRow(hid, x.s, x.t, false)));
    await admin.from('households').update({ nudge_baseline_at: now.toISOString() }).eq('id', hid);
    return null;
  }
  if (!due.length) return null;
  // the rung closest to done first; ties by fewest tastes left
  due.sort((a, b) => b.s.fraction - a.s.fraction || (a.s.target - a.s.current) - (b.s.target - b.s.current));
  const { s, t } = due[0];
  const owner = s.memberId ? (members.find((m) => m.id === s.memberId)?.name ?? null) : null;
  return {
    kind: 'rung_nudge',
    vars: { rung: s, owner, threshold: t },
    url: '/unlocks',
    after: async () => {
      await admin.from('achievement_nudges').insert(rungRow(hid, s, t, true));
    },
  };
}

async function sendPhase(now: Date) {
  const stats = { households: 0, sent: 0, skipped: 0 };
  const { data: households, error } = await admin.from('households').select('id, name, dinner_time, timezone').not('onboarded_at', 'is', null);
  if (error) throw error;
  if (!households?.length) return stats;
  const hids = households.map((h) => h.id);
  const plants = plantsOnce();

  const { data: hus } = await admin.from('household_users').select('household_id, user_id').in('household_id', hids);
  const userIds = [...new Set((hus ?? []).map((x) => x.user_id))];
  const { data: settingsRows } = await admin.from('user_settings').select('user_id, locale, notif_essential, notif_marketing, notif_daily_reminder, notif_streak_rescue, notif_reengagement, notif_weekly_nudge, notif_backoff_until, notifications_enabled').in('user_id', userIds);
  const { data: tokens } = await admin.from('push_tokens').select('id, user_id, expo_push_token, failure_count').in('user_id', userIds);
  const { data: members } = await admin.from('household_members').select('id, household_id, name, kind').in('household_id', hids).is('archived_at', null);
  const since = new Date(now.getTime() - 26 * 3600_000).toISOString();
  const { data: recentLogs } = await admin.from('notification_log').select('id, user_id, type, sent_at, opened_at, logged_within_3h').in('user_id', userIds).gte('sent_at', new Date(now.getTime() - 8 * 86400_000).toISOString()).order('sent_at', { ascending: false });

  const settingsBy = new Map((settingsRows ?? []).map((s) => [s.user_id, s as Settings]));
  const tokensBy = new Map<string, Token[]>();
  for (const t of (tokens ?? []) as Token[]) (tokensBy.get(t.user_id) ?? tokensBy.set(t.user_id, []).get(t.user_id)!).push(t);
  const logsBy = new Map<string, LogRow[]>();
  for (const l of (recentLogs ?? []) as LogRow[]) (logsBy.get(l.user_id) ?? logsBy.set(l.user_id, []).get(l.user_id)!).push(l);

  for (const h of households) {
    stats.households++;
    const users = (hus ?? []).filter((x) => x.household_id === h.id).map((x) => x.user_id);
    if (!users.some((u) => tokensBy.has(u))) continue;
    const local = localParts(h.timezone || 'Europe/Amsterdam', now);
    const dinner = toMinutes(h.dinner_time.slice(0, 5));
    const prepWindow = local.minutes >= dinner - 90 && local.minutes < dinner - 75;
    const askWindow = local.minutes >= dinner + 30 && local.minutes < dinner + 45;
    const keeperWindow = local.minutes >= Math.max(dinner + 90, 20 * 60 + 30) && local.minutes < 22 * 60 + 45;
    if (!askWindow && !keeperWindow && !prepWindow) continue;

    const { data: days } = await admin.from('plant_logs').select('logged_on').eq('household_id', h.id).gte('logged_on', shiftDate(local.date, -3));
    const loggedDays = new Set((days ?? []).map((d) => d.logged_on));
    const loggedToday = loggedDays.has(local.date);
    const hhMembers = ((members ?? []) as Member[]).filter((m) => m.household_id === h.id);
    const kids = hhMembers.filter((m) => m.kind === 'kid').map((m) => m.name);
    const kidsLabel = kids.length ? (kids.length === 1 ? kids[0] : `${kids.slice(0, -1).join(', ')} & ${kids[kids.length - 1]}`) : undefined;

    // household-level candidates in precedence order
    const candidates: Candidate[] = [];
    if (keeperWindow && !loggedToday) {
      const { data: streakRows } = await admin.rpc('household_streak', { p_household_id: h.id });
      const s = streakRows?.[0];
      if (s?.at_risk) candidates.push({ kind: 'streak_keeper', vars: { n: s.current_streak } });
    }
    if (askWindow && !loggedToday) candidates.push({ kind: 'dinner_question', vars: { kids: kidsLabel } });
    if (askWindow && loggedDays.size === 0) {
      const { data: counts } = await admin.rpc('member_taste_counts', { p_household_id: h.id });
      const close = ((counts ?? []) as { member_id: string; plant_id: string; tastes: number }[]).filter((c) => c.tastes === 4 || c.tastes === 9).sort((a, b) => b.tastes - a.tastes)[0];
      let vars: Vars = {};
      if (close) {
        const member = hhMembers.find((m) => m.id === close.member_id);
        const { data: tr } = await admin.from('plant_translations').select('locale, name').eq('plant_id', close.plant_id);
        vars = { member: member?.name, plant: tr?.find((x) => x.locale === 'en')?.name };
        (vars as Vars & { names?: Record<string, string> }).names = Object.fromEntries((tr ?? []).map((x) => [x.locale, x.name]));
      }
      candidates.push({ kind: 'card_teaser', vars });
    }
    if (askWindow && local.weekday === 'Sun') {
      const { data: variety } = await admin.rpc('household_weekly_variety', { p_household_id: h.id });
      if (typeof variety === 'number' && variety >= 25 && variety <= 29) candidates.push({ kind: 'family_30_nudge', vars: { n: 30 - variety } });
    }
    if (prepWindow) {
      const rung = await rungCandidate(h.id, hhMembers, now, await plants());
      if (rung) candidates.push(rung);
    }
    if (!candidates.length) continue;

    for (const uid of users) {
      const s = settingsBy.get(uid);
      const toks = tokensBy.get(uid) ?? [];
      if (!s || !toks.length) continue;
      const history = logsBy.get(uid) ?? [];
      // a log today lifts the backoff
      if (loggedToday && s.notif_backoff_until) await admin.from('user_settings').update({ notif_backoff_until: null }).eq('user_id', uid);
      else if (s.notif_backoff_until && s.notif_backoff_until >= local.date) {
        stats.skipped++;
        continue;
      }
      const sentToday = (kind: Kind) => history.some((l) => l.type === kind && l.sent_at >= since);
      const essentialToday = history.some((l) => ESSENTIAL.has(l.type as Kind) && l.sent_at >= since);
      const pick = candidates.find((c) => allowed(s, c.kind) && !sentToday(c.kind) && !(ESSENTIAL.has(c.kind) && essentialToday));
      if (!pick) {
        stats.skipped++;
        continue;
      }
      const names = (pick.vars as Vars & { names?: Record<string, string> }).names;
      const vars = names ? { ...pick.vars, plant: names[s.locale] ?? pick.vars.plant } : pick.vars;
      const copy = copyFor(s.locale, pick.kind, vars);

      for (const tok of toks) {
        const { data: row } = await admin.from('notification_log').insert({ user_id: uid, household_id: h.id, type: pick.kind, push_token_id: tok.id }).select('id').single();
        if (!row) continue;
        const res = await fetch(`${EXPO_PUSH}/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            to: tok.expo_push_token,
            title: copy.title,
            body: copy.body,
            data: { url: pick.url ?? '/log', log_id: row.id, type: pick.kind },
            channelId: ESSENTIAL.has(pick.kind) ? 'dinner' : 'marketing',
            priority: 'high',
          }),
        });
        const out = await res.json().catch(() => null);
        const ticket = out?.data?.id ?? (Array.isArray(out?.data) ? out.data[0]?.id : undefined);
        const ticketStatus = out?.data?.status ?? out?.data?.[0]?.status;
        if (ticket && ticketStatus === 'ok') {
          await admin.from('notification_log').update({ ticket_id: ticket }).eq('id', row.id);
          stats.sent++;
          pick.sent = true;
        } else {
          await admin.from('notification_log').update({ delivered: false }).eq('id', row.id);
          if (out?.data?.details?.error === 'DeviceNotRegistered') await dropToken(tok);
        }
      }
      // three ignored in a row -> a week of quiet (burning permission is worse than missing a day)
      const lastThree = history.filter((l) => l.logged_within_3h !== null).slice(0, 3);
      if (lastThree.length === 3 && lastThree.every((l) => !l.opened_at && l.logged_within_3h === false)) {
        await admin.from('user_settings').update({ notif_backoff_until: shiftDate(local.date, 7) }).eq('user_id', uid);
      }
    }
    for (const c of candidates) if (c.sent && c.after) await c.after();
  }
  return stats;
}

async function dropToken(tok: Token) {
  if (tok.failure_count + 1 >= 3) await admin.from('push_tokens').delete().eq('id', tok.id);
  else await admin.from('push_tokens').update({ failure_count: tok.failure_count + 1 }).eq('id', tok.id);
}

async function receiptsPhase(now: Date) {
  const { data: pending } = await admin
    .from('notification_log')
    .select('id, ticket_id, push_token_id')
    .not('ticket_id', 'is', null)
    .is('delivered_at', null)
    .is('delivered', null)
    .lte('sent_at', new Date(now.getTime() - 15 * 60_000).toISOString())
    .gte('sent_at', new Date(now.getTime() - 60 * 60_000).toISOString())
    .limit(300);
  if (!pending?.length) return 0;
  const res = await fetch(`${EXPO_PUSH}/getReceipts`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ids: pending.map((p) => p.ticket_id) }) });
  const out = await res.json().catch(() => null);
  const receipts = (out?.data ?? {}) as Record<string, { status: string; details?: { error?: string } }>;
  let delivered = 0;
  for (const p of pending) {
    const r = receipts[p.ticket_id!];
    if (!r) continue;
    if (r.status === 'ok') {
      await admin.from('notification_log').update({ delivered_at: now.toISOString(), delivered: true }).eq('id', p.id);
      delivered++;
    } else {
      await admin.from('notification_log').update({ delivered: false }).eq('id', p.id);
      if (r.details?.error === 'DeviceNotRegistered' && p.push_token_id) {
        const { data: tok } = await admin.from('push_tokens').select('id, user_id, expo_push_token, failure_count').eq('id', p.push_token_id).maybeSingle();
        if (tok) await dropToken(tok as Token);
      }
    }
  }
  return delivered;
}

async function outcomePhase(now: Date) {
  const { data: rows } = await admin
    .from('notification_log')
    .select('id, household_id, sent_at')
    .is('logged_within_3h', null)
    .lte('sent_at', new Date(now.getTime() - 3 * 3600_000).toISOString())
    .gte('sent_at', new Date(now.getTime() - 5 * 3600_000).toISOString())
    .limit(300);
  let n = 0;
  for (const r of rows ?? []) {
    if (!r.household_id) continue;
    const until = new Date(new Date(r.sent_at).getTime() + 3 * 3600_000).toISOString();
    const { count } = await admin.from('plant_logs').select('id', { count: 'exact', head: true }).eq('household_id', r.household_id).gte('logged_at', r.sent_at).lte('logged_at', until);
    await admin.from('notification_log').update({ logged_within_3h: (count ?? 0) > 0 }).eq('id', r.id);
    n++;
  }
  return n;
}

/** Read-only look at one household's ladder: every next rung, the ones past a mark with their copy, and the nudge history. Nothing is sent or written. */
async function probe(hid: string) {
  const [{ data: hh }, { data: memberRows }, { data: nudges }, plants] = await Promise.all([
    admin.from('households').select('id, name, dinner_time, timezone, nudge_baseline_at').eq('id', hid).maybeSingle(),
    admin.from('household_members').select('id, household_id, name, kind').eq('household_id', hid).is('archived_at', null),
    admin.from('achievement_nudges').select('member_id, achievement_id, level, threshold, sent, sent_at').eq('household_id', hid).order('sent_at', { ascending: false }),
    plantsOnce()(),
  ]);
  if (!hh) return { error: 'no such household' };
  const members = (memberRows ?? []) as Member[];
  const states = await rungStates(hid, members, plants);
  const due = states
    .map((s) => ({ s, t: thresholdOf(s.fraction) }))
    .filter((x): x is { s: RungState; t: Threshold } => x.t !== null)
    .map(({ s, t }) => {
      const owner = s.memberId ? (members.find((m) => m.id === s.memberId)?.name ?? null) : null;
      return { ...s, owner, threshold: t, en: rungCopy('en', s, owner, t), nl: rungCopy('nl', s, owner, t), it: rungCopy('it', s, owner, t) };
    });
  return { household: hh, members, states, due, nudges };
}

/** The scheduler proves itself with the vault-held cron secret (pg_cron -> pg_net); the service role key also works. */
async function authorized(req: Request): Promise<boolean> {
  const bearer = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (bearer && bearer === SERVICE_KEY) return true;
  const given = req.headers.get('x-cron-secret');
  if (!given) return false;
  const { data } = await admin.rpc('cron_secret');
  return typeof data === 'string' && data.length > 0 && data === given;
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);
  if (!(await authorized(req))) return json({ error: 'forbidden' }, 403);
  const now = new Date();
  try {
    const body = (await req.json().catch(() => null)) as { probe?: string } | null;
    if (body?.probe) return json(await probe(body.probe));
    const sent = await sendPhase(now);
    const delivered = await receiptsPhase(now);
    const outcomes = await outcomePhase(now);
    return json({ ok: true, at: now.toISOString(), ...sent, delivered, outcomes });
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
