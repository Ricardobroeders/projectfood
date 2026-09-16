import { Bean, BookOpen, Carrot, Cherry, Flame, FlaskConical, LayoutGrid, Leaf, type LucideIcon, Nut, Rainbow, Smile, Sparkles, Trophy, Users, Utensils, Wheat } from 'lucide-react-native';

import { CATS, colors, type Category } from '@/constants/theme';
import type { Member } from '@/features/household/queries';
import type { LogRow } from '@/features/logs/model';
import type { DailyRow, Streak, TasteCount, WeekRow } from '@/features/logs/queries';
import type { Plant } from '@/features/plants/catalog';

export type AchievementId =
  | 'first_bites'
  | 'curious'
  | 'full_table'
  | 'rainbow'
  | 'big_dinner'
  | 'veg_5'
  | 'fruit_5'
  | 'herb_3'
  | 'nut_3'
  | 'legume_3'
  | 'grain_3'
  | 'ferment_2'
  | 'superfood_5'
  | 'tomato_family'
  | 'streak_7'
  | 'thirty';

/** member = one stamp per kid, never ranked; household = shared by the family (KB rule 7). */
export type Scope = 'member' | 'household';

/** Everything an achievement may look at. Real history now, not tonight only. */
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

export type Achievement = {
  id: AchievementId;
  scope: Scope;
  icon: LucideIcon;
  /** Stamp colour. Category goals borrow the category tint so the shelf reads like the log. */
  color: string;
  /** Icon colour on the stamp; white unless the stamp is light (gold). */
  fg?: string;
  target: number | ((ctx: ProgressCtx) => number);
  /** `memberId` is set for member-scoped achievements. */
  progress: (ctx: ProgressCtx, memberId?: string) => number;
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

const inCategory = (cat: Category) => (ctx: ProgressCtx, m?: string) => memberPlants(ctx, m).filter((p) => p.category === cat).length;

/**
 * The goal layer (KB: concept-achievement-system). Shelf order is the difficulty ladder: the first
 * ones unlock at the first dinner, the category ones over weeks, the last three are the long goals.
 */
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_bites', scope: 'member', icon: Smile, color: colors.accent, fg: colors.onAccent, target: 3, progress: (c, m) => memberPlants(c, m).length },
  { id: 'curious', scope: 'household', icon: BookOpen, color: '#5B6CF0', target: 1, progress: (c) => (c.curiousOpened ? 1 : 0) },
  {
    id: 'full_table',
    scope: 'household',
    icon: Users,
    color: '#007C9A',
    target: (c) => Math.max(1, c.members.length),
    progress: (c) => {
      const active = new Set(c.members.map((m) => m.id));
      const perPlant = new Map<string, Set<string>>();
      for (const t of c.tasteCounts) {
        if (!active.has(t.member_id)) continue;
        (perPlant.get(t.plant_id) ?? perPlant.set(t.plant_id, new Set()).get(t.plant_id)!).add(t.member_id);
      }
      let best = 0;
      for (const s of perPlant.values()) best = Math.max(best, s.size);
      return best;
    },
  },
  {
    id: 'rainbow',
    scope: 'household',
    icon: Rainbow,
    color: '#C62A85',
    target: 5,
    progress: (c) => new Set(c.weekLogs.map((r) => c.plantsById[r.plant_id]?.color).filter(Boolean)).size,
  },
  {
    id: 'big_dinner',
    scope: 'household',
    icon: Utensils,
    color: '#ED6825',
    target: 10,
    progress: (c) => {
      let best = 0;
      for (const d of c.daily) if (d.member_id === null) best = Math.max(best, d.distinct_plants);
      // today's optimistic rows may be ahead of the server aggregate
      const today = new Set(c.weekLogs.filter((r) => r.logged_on === c.weekLogs[c.weekLogs.length - 1]?.logged_on).map((r) => r.plant_id)).size;
      return Math.max(best, today);
    },
  },
  { id: 'veg_5', scope: 'member', icon: Carrot, color: CATS.vegetable.fg, target: 5, progress: inCategory('vegetable') },
  { id: 'fruit_5', scope: 'member', icon: Cherry, color: CATS.fruit.fg, target: 5, progress: inCategory('fruit') },
  { id: 'herb_3', scope: 'member', icon: Leaf, color: CATS.herb.fg, target: 3, progress: inCategory('herb') },
  { id: 'nut_3', scope: 'member', icon: Nut, color: CATS.nut_seed.fg, target: 3, progress: inCategory('nut_seed') },
  { id: 'legume_3', scope: 'member', icon: Bean, color: CATS.legume.fg, target: 3, progress: inCategory('legume') },
  { id: 'grain_3', scope: 'member', icon: Wheat, color: CATS.whole_grain.fg, target: 3, progress: inCategory('whole_grain') },
  { id: 'ferment_2', scope: 'member', icon: FlaskConical, color: CATS.ferment.fg, target: 2, progress: inCategory('ferment') },
  { id: 'superfood_5', scope: 'member', icon: Sparkles, color: colors.success, target: 5, progress: (c, m) => memberPlants(c, m).filter((p) => p.superfood).length },
  { id: 'tomato_family', scope: 'member', icon: LayoutGrid, color: '#D9503F', target: 5, progress: (c, m) => memberPlants(c, m).filter((p) => p.family === 'Solanaceae').length },
  { id: 'streak_7', scope: 'household', icon: Flame, color: '#F5A524', target: 7, progress: (c) => Math.max(c.streak?.longest_streak ?? 0, c.streak?.current_streak ?? 0) },
  {
    id: 'thirty',
    scope: 'household',
    icon: Trophy,
    color: colors.gold,
    fg: colors.ink,
    target: 30,
    progress: (c) => Math.max(0, ...c.weekly.map((w) => w.variety), new Set(c.weekLogs.map((r) => r.plant_id)).size),
  },
];

export const ACHIEVEMENT_BY_ID = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a])) as Record<AchievementId, Achievement>;

export function targetOf(a: Achievement, ctx: ProgressCtx): number {
  return typeof a.target === 'function' ? a.target(ctx) : a.target;
}

export type ProgressEntry = { current: number; target: number };
export type Progress = {
  household: Record<AchievementId, ProgressEntry>;
  byMember: Record<string, Record<AchievementId, ProgressEntry>>;
};

export function computeProgress(ctx: ProgressCtx): Progress {
  const household = {} as Record<AchievementId, ProgressEntry>;
  const byMember: Progress['byMember'] = {};
  for (const m of ctx.members) byMember[m.id] = {} as Record<AchievementId, ProgressEntry>;
  for (const a of ACHIEVEMENTS) {
    const target = targetOf(a, ctx);
    if (a.scope === 'household') {
      household[a.id] = { current: a.progress(ctx), target };
    } else {
      for (const m of ctx.members) byMember[m.id][a.id] = { current: a.progress(ctx, m.id), target };
    }
  }
  return { household, byMember };
}

/** The view of one member: their own stamps plus the family's shared ones. */
export function progressFor(progress: Progress, memberId: string | null): Record<AchievementId, ProgressEntry> {
  const out = { ...progress.household } as Record<AchievementId, ProgressEntry>;
  if (memberId && progress.byMember[memberId]) Object.assign(out, progress.byMember[memberId]);
  return out;
}

export type NextGoal = { id: AchievementId; memberId: string | null; remaining: number; current: number; target: number };

/** The nearest unfinished goals by remaining effort (KB rule 2: the next goal is always visible). */
export function nearestGoals(progress: Progress, unlockedKeys: Set<string>, limit = 3): NextGoal[] {
  const out: NextGoal[] = [];
  const push = (id: AchievementId, memberId: string | null, e: ProgressEntry) => {
    if (unlockedKeys.has(unlockKey(id, memberId)) || e.current >= e.target) return;
    out.push({ id, memberId, remaining: e.target - e.current, current: e.current, target: e.target });
  };
  for (const [id, e] of Object.entries(progress.household) as [AchievementId, ProgressEntry][]) push(id, null, e);
  for (const [mid, entries] of Object.entries(progress.byMember)) {
    for (const [id, e] of Object.entries(entries) as [AchievementId, ProgressEntry][]) push(id, mid, e);
  }
  out.sort((a, b) => a.remaining - b.remaining || a.target - b.target);
  return out.slice(0, limit);
}

export function unlockKey(id: AchievementId, memberId: string | null | undefined): string {
  return `${id}:${memberId ?? 'household'}`;
}
