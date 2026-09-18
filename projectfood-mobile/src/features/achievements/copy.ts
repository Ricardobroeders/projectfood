import type { TFunction } from 'i18next';

import { type Achievement, levelName } from './definitions';

/** The body line for one rung: "Taste 40 vegetables"; Regulars changes metric per rung. */
export function rungBody(t: TFunction, a: Achievement, level: number, n: number): string {
  if (a.id === 'regulars') return t(`stamps.regulars.rungs.${Math.min(Math.max(level, 1), 4)}` as 'stamps.regulars.rungs.1', { n });
  return t(`stamps.${a.id}.body`, { n });
}

/** "Silver" etc. for a level ≥ 1. */
export function levelLabel(t: TFunction, level: number): string {
  return t(`levels.${levelName(level)}`);
}
