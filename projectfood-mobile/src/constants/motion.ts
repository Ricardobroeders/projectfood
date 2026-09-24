import { Easing, FadeIn, type WithSpringConfig, type WithTimingConfig } from 'react-native-reanimated';

/**
 * Motion classes (POC v1, 2026-09-07). Pick by what the element *is*, not by taste.
 *
 * - sheet:   drawers sliding in from an edge. Ease-out, never overshoot: a drawer has a wall behind it.
 * - modal:   things that appear in place (cards, dialogs). Fade + small scale with a gentle settle.
 * - reward:  celebrations (stamp pop, check circle, XP chip). Springy, but overshoot stays under
 *            ~8% and an element never leaves its own box. This is the only bouncy class.
 * - toggle:  state changes on controls (check, chip). Quick spring, tiny overshoot.
 * - press:   touch feedback. 80 ms in, spring back.
 * - flip:    content swap. Smooth, clamped so faces never over-rotate.
 * - number:  counters rolling to a value. Ease-out timing.
 * - swap:    content replaced in place (a list under a filter tab). Short fade plus a slide
 *            in the direction of travel. Ease-out, never overshoot.
 * - reveal:  rows filling in over their skeleton. A fade in place, no travel (the skeleton already
 *            holds the row's spot), staggered 35 ms per row for the first screenful only; rows
 *            that mount while scrolling appear plainly. Ease-out.
 * - pulse:   skeleton placeholders breathing while the real rows are built. Slow and symmetric.
 * - expressive: a menu growing out of the finger (the member menu on a held plant, 2026-09-24).
 *           M3 expressive spatial: a spring at damping ratio ~0.65 (about 7% overshoot), each
 *           item leaving the origin 40 ms after the one before it. Exits are timing, faster, and
 *           never bounce: the menu is put away, not thrown.
 *
 * Amplitude rule (device test round 2): a spring's overshoot grows with the distance it travels,
 * so reward pops start close to their target (0.7 → 1, not 0.4 → 1) and scale peaks stay ≤ 1.12.
 * Rive assets replace these primitives per class, not per screen.
 */
export const motion = {
  sheetIn: { duration: 320, easing: Easing.out(Easing.cubic) } satisfies WithTimingConfig,
  sheetOut: { duration: 220, easing: Easing.in(Easing.cubic) } satisfies WithTimingConfig,
  backdrop: { duration: 200 } satisfies WithTimingConfig,
  modal: { damping: 18, stiffness: 190, mass: 0.9 } satisfies WithSpringConfig,
  reward: { damping: 12, stiffness: 200, mass: 0.8 } satisfies WithSpringConfig,
  rewardSoft: { damping: 14, stiffness: 240 } satisfies WithSpringConfig,
  toggle: { damping: 14, stiffness: 220 } satisfies WithSpringConfig,
  pressIn: { duration: 80 } satisfies WithTimingConfig,
  pressOut: { damping: 12, stiffness: 300 } satisfies WithSpringConfig,
  flip: { damping: 18, stiffness: 120, overshootClamping: true } satisfies WithSpringConfig,
  number: { duration: 650, easing: Easing.out(Easing.cubic) } satisfies WithTimingConfig,
  swap: { duration: 200, easing: Easing.out(Easing.cubic) } satisfies WithTimingConfig,
  reveal: { duration: 260, easing: Easing.out(Easing.cubic) } satisfies WithTimingConfig,
  pulse: { duration: 700, easing: Easing.inOut(Easing.quad) } satisfies WithTimingConfig,
  // fill class: a gauge or meter filling to its value when a screen opens; no bounce, that is for rewards
  fill: { duration: 1100, easing: Easing.out(Easing.cubic) } satisfies WithTimingConfig,
  // damping = 2 · ζ · √(stiffness · mass) with ζ = 0.65
  expressive: { damping: 26.6, stiffness: 420, mass: 1 } satisfies WithSpringConfig,
  expressiveOut: { duration: 160, easing: Easing.in(Easing.cubic) } satisfies WithTimingConfig,
} as const;

/** Delay between items leaving the origin of an expressive menu. */
export const EXPRESSIVE_STAGGER = 40;

/** Where reward pops start from, so the settle stays inside the element's box. */
export const REWARD_POP_FROM = 0.7;
/** Peak scale for a "bump" on an element that stays in place (check circle, clay render). */
export const REWARD_BUMP_PEAK = 1.1;

const REVEAL_STAGGER = 35;
/** How many rows take part in the cascade: about one screenful. */
export const REVEAL_ROWS = 8;

/** Entrance for a list row by index (reveal class); undefined past the first screenful. */
export function revealFor(index: number) {
  if (index >= REVEAL_ROWS) return undefined;
  return FadeIn.duration(motion.reveal.duration).delay(index * REVEAL_STAGGER).easing(motion.reveal.easing);
}
