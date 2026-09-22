// The achievement ladder, server side. A mirror of projectfood-mobile/src/features/achievements/definitions.ts:
// the targets and metrics must stay identical (Ricardo tunes rungs there, then here). Curious is left
// out: one binary rung, nothing to be halfway to.

export type TasteCount = { member_id: string; plant_id: string; tastes: number };
export type PlantRow = { id: string; category: string; color: string | null; botanical_family: string | null; is_superfood: boolean };
export type DailyRow = { day: string; member_id: string | null; distinct_plants: number };
export type WeekRow = { week_start: string; variety: number; colours: number | null; active_days: number | null };
export type StreakRow = { current_streak: number; longest_streak: number };
export type MemberRow = { id: string; name: string };

/** Everything a ladder may look at: the same inputs the app's ProgressCtx carries. */
export type Ctx = {
  members: MemberRow[];
  tastes: TasteCount[];
  daily: DailyRow[];
  weekly: WeekRow[];
  streak: StreakRow | null;
  plants: Map<string, PlantRow>;
};

type Metric = (ctx: Ctx, memberId?: string) => number;
type Rung = { target: number; progress: Metric };
export type Ladder = { id: string; scope: 'member' | 'household'; rungs: Rung[] };

/** Plants this member has tasted on at least `minDays` different days (a taste row is one plant on one day). */
function memberPlants(ctx: Ctx, memberId: string | undefined, minDays = 1): PlantRow[] {
  if (!memberId) return [];
  const out: PlantRow[] = [];
  for (const t of ctx.tastes) {
    if (t.member_id !== memberId || t.tastes < minDays) continue;
    const p = ctx.plants.get(t.plant_id);
    if (p) out.push(p);
  }
  return out;
}

const inCategory = (cat: string, minDays = 1): Metric => (c, m) => memberPlants(c, m, minDays).filter((p) => p.category === cat).length;
const superfoods = (minDays: number): Metric => (c, m) => memberPlants(c, m, minDays).filter((p) => p.is_superfood).length;
const nightshades = (minDays: number): Metric => (c, m) => memberPlants(c, m, minDays).filter((p) => p.botanical_family === 'Solanaceae').length;
const cardsAtLeast = (n: number): Metric => (c, m) => (m ? c.tastes.filter((t) => t.member_id === m && t.tastes >= n).length : 0);
const mostTastesOfOne: Metric = (c, m) => (m ? Math.max(0, ...c.tastes.filter((t) => t.member_id === m).map((t) => t.tastes)) : 0);
/** Weeks in the history whose row passes; the RPC already includes the current week. */
const weeksWhere = (pass: (w: WeekRow) => boolean): Metric => (c) => c.weekly.filter(pass).length;

const rungs = (m: Metric, ...targets: number[]): Rung[] => targets.map((target) => ({ target, progress: m }));
/** A discovery ladder: the first rung counts every plant, the higher rungs only plants tasted on two days (no one-day dump). */
const discovery = (once: Metric, twice: Metric, ...targets: number[]): Rung[] => targets.map((target, i) => ({ target, progress: i === 0 ? once : twice }));
const category = (cat: string, ...targets: number[]): Rung[] => discovery(inCategory(cat), inCategory(cat, 2), ...targets);

const fullTable: Metric = (c) => {
  // plants every member of the family has tasted; a family of one has no shared table yet
  if (c.members.length < 2) return 0;
  const active = new Set(c.members.map((m) => m.id));
  const perPlant = new Map<string, Set<string>>();
  for (const t of c.tastes) {
    if (!active.has(t.member_id)) continue;
    (perPlant.get(t.plant_id) ?? perPlant.set(t.plant_id, new Set()).get(t.plant_id)!).add(t.member_id);
  }
  let n = 0;
  for (const s of perPlant.values()) if (s.size === active.size) n += 1;
  return n;
};
const bigDinner: Metric = (c) => Math.max(0, ...c.daily.filter((d) => d.member_id === null).map((d) => d.distinct_plants));
const regularTable: Metric = (c) => new Set(c.daily.filter((d) => d.member_id === null && d.distinct_plants > 0).map((d) => d.day)).size;
const tableTalk: Metric = (c) => Math.max(c.streak?.longest_streak ?? 0, c.streak?.current_streak ?? 0);

export const LADDERS: Ladder[] = [
  { id: 'explorer', scope: 'member', rungs: discovery((c, m) => memberPlants(c, m).length, (c, m) => memberPlants(c, m, 2).length, 3, 50, 100, 200) },
  { id: 'full_table', scope: 'household', rungs: rungs(fullTable, 1, 10, 30, 100) },
  { id: 'rainbow', scope: 'household', rungs: rungs(weeksWhere((w) => (w.colours ?? 0) >= 5), 1, 4, 12, 52) },
  { id: 'big_dinner', scope: 'household', rungs: rungs(bigDinner, 10, 15, 20, 30) },
  { id: 'regular_table', scope: 'household', rungs: rungs(regularTable, 5, 20, 60, 200) },
  { id: 'steady_weeks', scope: 'household', rungs: rungs(weeksWhere((w) => (w.active_days ?? 0) >= 4), 1, 4, 12, 40) },
  { id: 'green_machine', scope: 'member', rungs: category('vegetable', 5, 20, 40, 76) },
  { id: 'fruit_basket', scope: 'member', rungs: category('fruit', 5, 12, 25, 49) },
  { id: 'herb_garden', scope: 'member', rungs: category('herb', 3, 8, 15, 26) },
  { id: 'nutcracker', scope: 'member', rungs: category('nut_seed', 3, 8, 15, 27) },
  { id: 'bean_counter', scope: 'member', rungs: category('legume', 3, 6, 10, 21) },
  { id: 'grain_train', scope: 'member', rungs: category('whole_grain', 3, 5, 8, 17) },
  { id: 'bubbly', scope: 'member', rungs: category('ferment', 2, 4, 6, 8) },
  { id: 'superfood', scope: 'member', rungs: discovery(superfoods(1), superfoods(2), 5, 15, 30, 44) },
  { id: 'tomato_family', scope: 'member', rungs: discovery(nightshades(1), nightshades(2), 5, 10, 18) },
  {
    id: 'regulars',
    scope: 'member',
    // the card ladder: 10 silver cards, 10 gold cards, 10 plants tasted 25 times, one plant tasted 50 times
    rungs: [
      { target: 10, progress: cardsAtLeast(5) },
      { target: 10, progress: cardsAtLeast(10) },
      { target: 10, progress: cardsAtLeast(25) },
      { target: 50, progress: mostTastesOfOne },
    ],
  },
  { id: 'table_talk', scope: 'household', rungs: rungs(tableTalk, 7, 14, 30, 100) },
  { id: 'family_of_thirty', scope: 'household', rungs: rungs(weeksWhere((w) => w.variety >= 30), 1, 4, 12, 52) },
];

/** One owner's next rung: the level it would reach and how far along it is. */
export type RungState = { id: string; memberId: string | null; level: number; current: number; target: number; fraction: number };

export const levelKey = (id: string, memberId: string | null | undefined) => `${id}:${memberId ?? 'household'}`;

/** The next rung of every achievement for every owner. `levels` = highest level held, keyed by levelKey. Maxed achievements are left out. */
export function nextRungs(ctx: Ctx, levels: Map<string, number>): RungState[] {
  const out: RungState[] = [];
  for (const l of LADDERS) {
    const owners: (string | null)[] = l.scope === 'household' ? [null] : ctx.members.map((m) => m.id);
    for (const owner of owners) {
      const held = levels.get(levelKey(l.id, owner)) ?? 0;
      const r = l.rungs[held];
      if (!r) continue;
      const current = r.progress(ctx, owner ?? undefined);
      out.push({ id: l.id, memberId: owner, level: held + 1, current, target: r.target, fraction: current / r.target });
    }
  }
  return out;
}

export type Threshold = 50 | 75;

/** The push moment a rung sits at: 50 or 75 (KB: a level that crosses 50% and 75% is a push moment). A finished rung waits for its unlock, not a nudge. */
export function thresholdOf(fraction: number): Threshold | null {
  if (fraction >= 1) return null;
  if (fraction >= 0.75) return 75;
  if (fraction >= 0.5) return 50;
  return null;
}
