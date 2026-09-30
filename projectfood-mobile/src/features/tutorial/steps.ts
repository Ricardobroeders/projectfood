import type { TutorialAnchor } from '@/state/ui';

export type TutorialStep = {
  /** The control the hole is cut around. */
  anchor: TutorialAnchor;
  /** The tab that control lives on; Next navigates there when it differs from the current one. */
  tab: '/' | '/log';
  /** Key under `tutorial.steps` in the locale files (a union, so the typed i18n keys accept it). */
  key: TutorialStepKey;
};
export type TutorialStepKey = 'logTab' | 'plantRow' | 'weekChip' | 'family';

/**
 * The first minute: four balloons after onboarding, once per phone (Ricardo, 2026-09-30, from the
 * closed-test points "no onboarding" and "why 30"; [[decision-2026-09-30-first-minute-tutorial]]).
 * They speak to the person holding the phone; the last one opens the family up.
 */
export const TUTORIAL_STEPS: TutorialStep[] = [
  { anchor: 'logTab', tab: '/', key: 'logTab' },
  { anchor: 'plantRow', tab: '/log', key: 'plantRow' },
  { anchor: 'weekChip', tab: '/log', key: 'weekChip' },
  { anchor: 'forBar', tab: '/log', key: 'family' },
];
