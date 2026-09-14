import { Bean, BookOpen, Carrot, Cherry, Flame, FlaskConical, LayoutGrid, Leaf, type LucideIcon, Nut, Rainbow, Smile, Sparkles, Trophy, Users, Utensils, Wheat } from 'lucide-react-native';

import { CATS, colors } from '@/constants/theme';
import { PLANTS, type Plant } from '@/data/plants';
import type { Member } from '@/state/store';

export type AchievementId =
  | 'first_bites'
  | 'curious'
  | 'full_table'
  | 'rainbow'
  | 'ten_tonight'
  | 'veg_5'
  | 'fruit_5'
  | 'herb_3'
  | 'nut_3'
  | 'legume_3'
  | 'grain_3'
  | 'ferment_2'
  | 'superfood_5'
  | 'album'
  | 'streak_7'
  | 'thirty';

/** What an achievement can look at. POC scope: tonight's log only, history comes with the backend. */
export type ProgressCtx = {
  /** Distinct plants with at least one taster tonight, in log order. */
  tasted: Plant[];
  tastes: Record<string, string[]>;
  members: Member[];
  cardOpened: boolean;
};

export type Achievement = {
  id: AchievementId;
  icon: LucideIcon;
  /** Stamp colour. Category goals borrow the category tint so the shelf reads like the log. */
  color: string;
  /** Icon colour on the stamp; white unless the stamp is light (gold). */
  fg?: string;
  xp: number;
  target: number | ((ctx: ProgressCtx) => number);
  progress: (ctx: ProgressCtx) => number;
};

const NIGHTSHADES = PLANTS.filter((p) => p.family === 'Solanaceae').length;
const inCategory = (cat: Plant['category']) => (ctx: ProgressCtx) => ctx.tasted.filter((p) => p.category === cat).length;

/**
 * The goal layer (KB: concept-achievement-system). Order is shelf order: the early ones unlock
 * within the first dinner, the category ones over a week, the last three are the long goals.
 */
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_bites', icon: Smile, color: colors.accent, xp: 50, target: 3, progress: (c) => c.tasted.length },
  { id: 'curious', icon: BookOpen, color: '#5B6CF0', xp: 50, target: 1, progress: (c) => (c.cardOpened ? 1 : 0) },
  {
    id: 'full_table',
    icon: Users,
    color: '#007C9A',
    xp: 50,
    target: (c) => Math.max(1, c.members.length),
    progress: (c) => c.members.filter((m) => Object.values(c.tastes).some((ids) => ids.includes(m.id))).length,
  },
  { id: 'rainbow', icon: Rainbow, color: '#C62A85', xp: 50, target: 5, progress: (c) => new Set(c.tasted.map((p) => p.color)).size },
  { id: 'ten_tonight', icon: Utensils, color: '#ED6825', xp: 50, target: 10, progress: (c) => c.tasted.length },
  { id: 'veg_5', icon: Carrot, color: CATS.vegetable.fg, xp: 50, target: 5, progress: inCategory('vegetable') },
  { id: 'fruit_5', icon: Cherry, color: CATS.fruit.fg, xp: 50, target: 5, progress: inCategory('fruit') },
  { id: 'herb_3', icon: Leaf, color: CATS.herb.fg, xp: 50, target: 3, progress: inCategory('herb') },
  { id: 'nut_3', icon: Nut, color: CATS.nut_seed.fg, xp: 50, target: 3, progress: inCategory('nut_seed') },
  { id: 'legume_3', icon: Bean, color: CATS.legume.fg, xp: 50, target: 3, progress: inCategory('legume') },
  { id: 'grain_3', icon: Wheat, color: CATS.whole_grain.fg, xp: 50, target: 3, progress: inCategory('whole_grain') },
  { id: 'ferment_2', icon: FlaskConical, color: CATS.ferment.fg, xp: 50, target: 2, progress: inCategory('ferment') },
  { id: 'superfood_5', icon: Sparkles, color: colors.success, xp: 50, target: 5, progress: (c) => c.tasted.filter((p) => p.superfood).length },
  { id: 'album', icon: LayoutGrid, color: '#D9503F', xp: 50, target: NIGHTSHADES, progress: (c) => c.tasted.filter((p) => p.family === 'Solanaceae').length },
  // No dinner history in the POC: tonight counts as day one of the streak.
  { id: 'streak_7', icon: Flame, color: '#F5A524', xp: 100, target: 7, progress: (c) => (c.tasted.length ? 1 : 0) },
  { id: 'thirty', icon: Trophy, color: colors.gold, fg: colors.ink, xp: 200, target: 30, progress: (c) => c.tasted.length },
];

export const ACHIEVEMENT_BY_ID = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a])) as Record<AchievementId, Achievement>;

export function targetOf(a: Achievement, ctx: ProgressCtx): number {
  return typeof a.target === 'function' ? a.target(ctx) : a.target;
}

export type Progress = Record<AchievementId, { current: number; target: number }>;

export function computeProgress(ctx: ProgressCtx): Progress {
  const out = {} as Progress;
  for (const a of ACHIEVEMENTS) out[a.id] = { current: a.progress(ctx), target: targetOf(a, ctx) };
  return out;
}
