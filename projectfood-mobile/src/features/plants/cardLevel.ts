/**
 * Card levels by tastes, where a taste is one plant on one day.
 *
 * Raised from 1 / 5 / 10 to 3 / 8 / 15 on 2026-09-26 (Ricardo: "so we keep the duration of earning
 * longer"). Gold at 10 had caught a third of every card the two heaviest accounts owned, so the
 * ladder had no top; at 15 it catches 22%.
 *
 * The rungs are placed against the PWA's churn curve, so one lands before each moment people left
 * (live `plant_logs`, 15 users, queried 2026-09-26). Median day the first card of each level fires:
 * bronze day 6, before the one-week exit that took a third of them; silver day 24, before the four
 * to five week exit; gold day 40, before the six to eight week exit. Every user who churned would
 * have left holding bronze cards, two of them silver.
 *
 * The card itself appears on the first taste and is not a level: it is the record of "this member
 * tasted this plant", which the Foods tried list and the parent's recap count.
 *
 * Platinum 25 (day 78) and diamond 50 (day 147) are agreed and held back (Ricardo, 2026-09-26:
 * "keep platinum and diamond out for now, we will add these later"). Adding one is a line here plus
 * a cup render; nothing else in the app needs to know.
 *
 * Targets are the same for every plant on purpose. A per-category target was tried and dropped:
 * ferment holds the highest count in the database (yoghurt) while it would have had the lowest
 * target, and new plants and categories keep arriving, which would move the goalposts under a
 * collection that must never reset.
 */
export const CARD_LEVELS = { bronze: 3, silver: 8, gold: 15 } as const;

export type CardLevel = keyof typeof CARD_LEVELS;
/** `none` never tasted · `tasted` collected, no metal yet · then the metals, lowest first. */
export type CardState = 'none' | 'tasted' | CardLevel;

/** The metals in order, lowest first. */
export const CARD_LEVEL_ORDER = Object.keys(CARD_LEVELS) as CardLevel[];

/** Where this card stands after `tastes` tasting days. */
export function cardStateFor(tastes: number): CardState {
  for (let i = CARD_LEVEL_ORDER.length - 1; i >= 0; i--) {
    const level = CARD_LEVEL_ORDER[i];
    if (tastes >= CARD_LEVELS[level]) return level;
  }
  return tastes >= 1 ? 'tasted' : 'none';
}

/** The next metal and the tastes still to go, or null once the top metal is reached. */
export function nextCardLevel(tastes: number): { level: CardLevel; remaining: number } | null {
  for (const level of CARD_LEVEL_ORDER) {
    if (tastes < CARD_LEVELS[level]) return { level, remaining: CARD_LEVELS[level] - tastes };
  }
  return null;
}

/** Copy key for "n more tastes to <metal>". */
export const MORE_TO_KEY = {
  bronze: 'unlocks.moreToBronze',
  silver: 'unlocks.moreToSilver',
  gold: 'unlocks.moreToGold',
} as const satisfies Record<CardLevel, string>;
