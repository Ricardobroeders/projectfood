import { Easing, type WithSpringConfig, type WithTimingConfig } from 'react-native-reanimated';

/**
 * Motion classes (POC v1, 2026-09-07). Pick by what the element *is*, not by taste.
 *
 * - sheet:   drawers sliding in from an edge. Ease-out, never overshoot: a drawer has a wall behind it.
 * - modal:   things that appear in place (cards, dialogs). Fade + small scale with a gentle settle.
 * - reward:  celebrations (stamp pop, check circle, XP burst). Springy, overshoot welcome.
 *            This is the only bouncy class.
 * - toggle:  state changes on controls (check, chip). Quick spring, tiny overshoot.
 * - press:   touch feedback. 80 ms in, spring back.
 * - flip:    content swap. Smooth, clamped so faces never over-rotate.
 * - number:  counters rolling to a value. Ease-out timing.
 *
 * Rive assets replace these primitives per class, not per screen.
 */
export const motion = {
  sheetIn: { duration: 320, easing: Easing.out(Easing.cubic) } satisfies WithTimingConfig,
  sheetOut: { duration: 220, easing: Easing.in(Easing.cubic) } satisfies WithTimingConfig,
  backdrop: { duration: 200 } satisfies WithTimingConfig,
  modal: { damping: 18, stiffness: 190, mass: 0.9 } satisfies WithSpringConfig,
  reward: { damping: 7, stiffness: 170 } satisfies WithSpringConfig,
  rewardSoft: { damping: 8, stiffness: 240 } satisfies WithSpringConfig,
  toggle: { damping: 14, stiffness: 220 } satisfies WithSpringConfig,
  pressIn: { duration: 80 } satisfies WithTimingConfig,
  pressOut: { damping: 12, stiffness: 300 } satisfies WithSpringConfig,
  flip: { damping: 18, stiffness: 120, overshootClamping: true } satisfies WithSpringConfig,
  number: { duration: 650, easing: Easing.out(Easing.cubic) } satisfies WithTimingConfig,
} as const;
