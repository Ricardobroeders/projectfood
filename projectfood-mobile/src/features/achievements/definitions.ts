import { Bean, BookOpen, Carrot, Cherry, Flame, FlaskConical, LayoutGrid, Leaf, type LucideIcon, Nut, Rainbow, Smile, Sparkles, Stamp as StampIcon, Trophy, Users, Utensils, Wheat } from 'lucide-react-native';

import { CATS, colors, type Category } from '@/constants/theme';
import type { Member } from '@/features/household/queries';
import { type LogRow, weekStartOf } from '@/features/logs/model';
import type { DailyRow, Streak, TasteCount, WeekRow } from '@/features/logs/queries';
import type { Plant } from '@/features/plants/catalog';

export type AchievementId =
  | 'explorer'
  | 'curious'
  | 'full_table'
  | 'rainbow'
  | 'big_dinner'
  | 'green_machine'
  | 'fruit_basket'
  | 'herb_garden'
  | 'nutcracker'
  | 'bean_counter'
  | 'grain_train'
  | 'bubbly'
  | 'superfood'
  | 'tomato_family'
  | 'regulars'
  | 'table_talk'
  | 'family_of_thirty';

/** member = one stamp per kid, never ranked; household = shared by the family (KB rule 7). */
export type Scope = 'member' | 'household';

/** Level names, in order. A stamp's level is the number of rungs reached (0 = locked). */
export const LEVEL_NAMES = ['bronze', 'silver', 'gold', 'platinum'] as const;
export type LevelName = (typeof LEVEL_NAMES)[number];
export const LEVEL_COLORS: Record<LevelName, string> = { bronze: '#C98A5B', silver: '#A9ADB5', gold: '#E3B341', platinum: '#8FD3E8' };

/** Everything an achievement may look at. Real history, not tonight only. */
export type ProgressCtx = {
  members: Member[];
  tasteCounts: TasteCount[];
  weekLogs: LogRow[];
  daily: DailyRow[];
  weekly: WeekRow[];
  streak: Streak | null;
  plantsById: Record<string, Plant>;
  curiousOpened: boolean;
};

type Metric = (ctx: ProgressCtx, memberId?: string) => number;

/** One rung of a stamp's ladder. `progress` overrides the stamp's metric (Regulars changes metric per rung). */
export type Rung = { target: number; progress?: Metric };

export type Achievement = {
  id: AchievementId;
  scope: Scope;
  icon: LucideIcon;
  /** Prize render id in assets/stamps (bucket achievements/achievement-<id>.png); the icon is the fallback. */
  image?: string;
  /** Stamp colour. Category goals borrow the category tint so the shelf reads like the log. */
  color: string;
  /** Icon colour on the stamp; white unless the stamp is light (gold). */
  fg?: string;
  /** Targets per level: first week, first month, a season, a year (KB ladder, calibrated 2026-09-18). */
  rungs: Rung[];
  /** `memberId` is set for member-scoped achievements. */
  progress: Metric;
};

function memberPlants(ctx: ProgressCtx, memberId: string | undefined): Plant[] {
  if (!memberId) return [];
  const out: Plant[] = [];
  for (const t of ctx.tasteCounts) {
    if (t.member_id !== memberId) continue;
    const p = ctx.plantsById[t.plant_id];
    if (p) out.push(p);
  }
  return out;
}

const inCategory = (cat: Category): Metric => (ctx, m) => memberPlants(ctx, m).filter((p) => p.category === cat).length;
/** Plants this member has tasted at least n times (card levels: 5 = silver, 10 = gold). */
const cardsAtLeast = (n: number): Metric => (ctx, m) => (m ? ctx.tasteCounts.filter((t) => t.member_id === m && t.tastes >= n).length : 0);
const mostTastesOfOne: Metric = (ctx, m) => (m ? Math.max(0, ...ctx.tasteCounts.filter((t) => t.member_id === m).map((t) => t.tastes)) : 0);

const rungs = (...targets: number[]): Rung[] => targets.map((target) => ({ target }));

/** Weeks whose server row passes `pass`, with this week judged live from the log rows as well. */
function weeksWhere(ctx: ProgressCtx, pass: (w: WeekRow) => boolean, thisWeekLive: boolean): number {
  const thisWeek = weekStartOf();
  let n = 0;
  let thisWeekCounted = false;
  for (const w of ctx.weekly) {
    if (w.week_start === thisWeek) {
      if (pass(w) || thisWeekLive) {
        n += 1;
        thisWeekCounted = true;
      }
    } else if (pass(w)) n += 1;
  }
  if (!thisWeekCounted && thisWeekLive && !ctx.weekly.some((w) => w.week_start === thisWeek)) n += 1;
  return n;
}

/**
 * The goal layer (KB: concept-achievement-system). Shelf order is the difficulty ladder. Every
 * stamp climbs through up to four rungs; level 1 is the stamp as it shipped in the store POC.
 */
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'explorer', image: 'explorer', scope: 'member', icon: Smile, color: colors.accent, fg: colors.onAccent, rungs: rungs(3, 50, 100, 200), progress: (c, m) => memberPlants(c, m).length },
  { id: 'curious', image: 'curious', scope: 'household', icon: BookOpen, color: '#5B6CF0', rungs: rungs(1), progress: (c) => (c.curiousOpened ? 1 : 0) },
  {
    id: 'full_table',
    image: 'full_table',
    scope: 'household',
    icon: Users,
    color: '#007C9A',
    rungs: rungs(1, 10, 30, 100),
    // plants every member of the family has tasted; a family of one has no shared table yet
    progress: (c) => {
      if (c.members.length < 2) return 0;
      const active = new Set(c.members.map((m) => m.id));
      const perPlant = new Map<string, Set<string>>();
      for (const t of c.tasteCounts) {
        if (!active.has(t.member_id)) continue;
        (perPlant.get(t.plant_id) ?? perPlant.set(t.plant_id, new Set()).get(t.plant_id)!).add(t.member_id);
      }
      let n = 0;
      for (const s of perPlant.values()) if (s.size === active.size) n += 1;
      return n;
    },
  },
  {
    id: 'rainbow',
    image: 'rainbow',
    scope: 'household',
    icon: Rainbow,
    color: '#C62A85',
    rungs: rungs(1, 4, 12, 52),
    // weeks with five colours on the table
    progress: (c) => weeksWhere(c, (w) => (w.colours ?? 0) >= 5, new Set(c.weekLogs.map((r) => c.plantsById[r.plant_id]?.color).filter(Boolean)).size >= 5),
  },
  {
    id: 'big_dinner',
    image: 'big_dinner',
    scope: 'household',
    icon: Utensils,
    color: '#ED6825',
    rungs: rungs(10, 15, 20, 30),
    progress: (c) => {
      let best = 0;
      for (const d of c.daily) if (d.member_id === null) best = Math.max(best, d.distinct_plants);
      // today's optimistic rows may be ahead of the server aggregate
      const lastDay = c.weekLogs[c.weekLogs.length - 1]?.logged_on;
      const today = new Set(c.weekLogs.filter((r) => r.logged_on === lastDay).map((r) => r.plant_id)).size;
      return Math.max(best, today);
    },
  },
  { id: 'green_machine', image: 'green_machine', scope: 'member', icon: Carrot, color: CATS.vegetable.fg, rungs: rungs(5, 20, 40, 76), progress: inCategory('vegetable') },
  { id: 'fruit_basket', image: 'fruit_basket', scope: 'member', icon: Cherry, color: CATS.fruit.fg, rungs: rungs(5, 12, 25, 49), progress: inCategory('fruit') },
  { id: 'herb_garden', image: 'herb_garden', scope: 'member', icon: Leaf, color: CATS.herb.fg, rungs: rungs(3, 8, 15, 26), progress: inCategory('herb') },
  { id: 'nutcracker', image: 'nutcracker', scope: 'member', icon: Nut, color: CATS.nut_seed.fg, rungs: rungs(3, 8, 15, 27), progress: inCategory('nut_seed') },
  { id: 'bean_counter', image: 'bean_counter', scope: 'member', icon: Bean, color: CATS.legume.fg, rungs: rungs(3, 6, 10, 21), progress: inCategory('legume') },
  { id: 'grain_train', image: 'grain_train', scope: 'member', icon: Wheat, color: CATS.whole_grain.fg, rungs: rungs(3, 5, 8, 17), progress: inCategory('whole_grain') },
  { id: 'bubbly', image: 'bubbly', scope: 'member', icon: FlaskConical, color: CATS.ferment.fg, rungs: rungs(2, 4, 6, 8), progress: inCategory('ferment') },
  { id: 'superfood', image: 'superfood', scope: 'member', icon: Sparkles, color: colors.success, rungs: rungs(5, 15, 30, 44), progress: (c, m) => memberPlants(c, m).filter((p) => p.superfood).length },
  { id: 'tomato_family', image: 'tomato_family', scope: 'member', icon: LayoutGrid, color: '#D9503F', rungs: rungs(5, 10, 18), progress: (c, m) => memberPlants(c, m).filter((p) => p.family === 'Solanaceae').length },
  {
    id: 'regulars',
    image: 'regulars',
    scope: 'member',
    icon: StampIcon,
    color: '#7A5C3E',
    // the card ladder: 10 silver cards, 10 gold cards, 10 plants tasted 25 times, one plant tasted 50 times
    rungs: [
      { target: 10, progress: cardsAtLeast(5) },
      { target: 10, progress: cardsAtLeast(10) },
      { target: 10, progress: cardsAtLeast(25) },
      { target: 50, progress: mostTastesOfOne },
    ],
    progress: cardsAtLeast(5),
  },
  { id: 'table_talk', image: 'table_talk', scope: 'household', icon: Flame, color: '#F5A524', rungs: rungs(7, 14, 30, 100), progress: (c) => Math.max(c.streak?.longest_streak ?? 0, c.streak?.current_streak ?? 0) },
  {
    id: 'family_of_thirty',
    image: 'family_of_thirty',
    scope: 'household',
    icon: Trophy,
    color: colors.gold,
    fg: colors.ink,
    rungs: rungs(1, 4, 12, 52),
    progress: (c) => weeksWhere(c, (w) => w.variety >= 30, new Set(c.weekLogs.map((r) => r.plant_id)).size >= 30),
  },
];

export const ACHIEVEMENT_BY_ID = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a])) as Record<AchievementId, Achievement>;

export type RungProgress = { current: number; target: number };
export type ProgressEntry = { rungs: RungProgress[] };
export type Progress = {
  household: Record<AchievementId, ProgressEntry>;
  byMember: Record<string, Record<AchievementId, ProgressEntry>>;
};

export function computeProgress(ctx: ProgressCtx): Progress {
  const household = {} as Record<AchievementId, ProgressEntry>;
  const byMember: Progress['byMember'] = {};
  for (const m of ctx.members) byMember[m.id] = {} as Record<AchievementId, ProgressEntry>;
  const entry = (a: Achievement, m?: string): ProgressEntry => ({ rungs: a.rungs.map((r) => ({ target: r.target, current: (r.progress ?? a.progress)(ctx, m) })) });
  for (const a of ACHIEVEMENTS) {
    if (a.scope === 'household') household[a.id] = entry(a);
    else for (const m of ctx.members) byMember[m.id][a.id] = entry(a, m.id);
  }
  return { household, byMember };
}

/** The view of one member: their own stamps plus the family's shared ones. */
export function progressFor(progress: Progress, memberId: string | null): Record<AchievementId, ProgressEntry> {
  const out = { ...progress.household } as Record<AchievementId, ProgressEntry>;
  if (memberId && progress.byMember[memberId]) Object.assign(out, progress.byMember[memberId]);
  return out;
}

/** What a stamp shows: the level held (from the unlock rows) and the way to the next rung. */
export type StampView = { level: number; maxLevel: number; current: number; target: number; remaining: number; maxed: boolean };

export function stampView(entry: ProgressEntry | undefined, level: number): StampView {
  const rungs = entry?.rungs ?? [];
  const maxLevel = rungs.length;
  const maxed = maxLevel > 0 && level >= maxLevel;
  const next = maxed ? rungs[maxLevel - 1] : (rungs[level] ?? { current: 0, target: 1 });
  const current = maxed ? next.target : Math.min(next.current, next.target);
  return { level, maxLevel, current, target: next.target, remaining: maxed ? 0 : Math.max(0, next.target - next.current), maxed };
}

export function levelName(level: number): LevelName {
  return LEVEL_NAMES[Math.min(Math.max(level, 1), LEVEL_NAMES.length) - 1];
}

export type NextGoal = { id: AchievementId; memberId: string | null; level: number; remaining: number; current: number; target: number };

/** The nearest unfinished rungs by remaining effort (KB rule 2: the next goal is always visible). */
export function nearestGoals(progress: Progress, levels: Map<string, number>, limit = 3): NextGoal[] {
  const out: NextGoal[] = [];
  const push = (id: AchievementId, memberId: string | null, e: ProgressEntry) => {
    const v = stampView(e, levels.get(levelKey(id, memberId)) ?? 0);
    // remaining 0 while not maxed means the unlock row is on its way; nothing left to aim at
    if (v.maxed || v.remaining === 0) return;
    out.push({ id, memberId, level: v.level + 1, remaining: v.remaining, current: v.current, target: v.target });
  };
  for (const [id, e] of Object.entries(progress.household) as [AchievementId, ProgressEntry][]) push(id, null, e);
  for (const [mid, entries] of Object.entries(progress.byMember)) {
    for (const [id, e] of Object.entries(entries) as [AchievementId, ProgressEntry][]) push(id, mid, e);
  }
  out.sort((a, b) => a.remaining - b.remaining || a.target - b.target);
  return out.slice(0, limit);
}

/** Key of a stamp for one owner (member or the household). */
export function levelKey(id: AchievementId, memberId: string | null | undefined): string {
  return `${id}:${memberId ?? 'household'}`;
}

/** Key of one unlock row: stamp, owner and level. */
export function unlockKey(id: AchievementId, memberId: string | null | undefined, level: number): string {
  return `${levelKey(id, memberId)}:${level}`;
}
