import type { TutorialAnchor } from '@/state/ui';

export type TutorialStep = {
  /** The control the hole is cut around. */
  anchor: TutorialAnchor;
  /** The tab that control lives on; Next navigates there when it differs from the current one. */
  tab: '/' | '/log';
  /** Key under `tutorial.steps` in the locale files (a union, so the typed i18n keys accept it). */
  key: TutorialStepKey;
  /** Corner radius of the hole: the control's own radius plus the hole's padding. */
  radius: number;
};
export type TutorialStepKey = 'logTab' | 'plantRow' | 'weekChip';

/**
 * The first minute: three balloons after onboarding, once per phone (Ricardo, 2026-09-30, from the
 * closed-test points "no onboarding" and "why 30"; [[decision-2026-09-30-first-minute-tutorial]]).
 * They speak to the person holding the phone. A fourth, on logging for the family, was dropped
 * the same day: onboarding step 2 already adds the family.
 */
export const TUTORIAL_STEPS: TutorialStep[] = [
  { anchor: 'logTab', tab: '/', key: 'logTab', radius: 16 },
  { anchor: 'plantRow', tab: '/log', key: 'plantRow', radius: 30 },
  { anchor: 'weekChip', tab: '/log', key: 'weekChip', radius: 18 },
];
