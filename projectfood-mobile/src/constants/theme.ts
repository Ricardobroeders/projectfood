/**
 * Project Food mobile tokens (POC, 2026-09-07).
 * Carried over from the live PWA (projectfood-app/app/globals.css) with two changes decided on
 * the first device test:
 * - the page background moves from warm cream to white so food colours carry the colour;
 * - no drop shadows anywhere. Distinction comes from grey surfaces (bgSoft) on white.
 */
/**
 * Accent candidates (branding round, 2026-09-09). The PWA yellow sits close to ZOE's brand yellow,
 * and on our screens the food already owns yellow, green, red and orange. Switch with
 * `EXPO_PUBLIC_ACCENT=<name>` when starting Metro (restart with --clear to pick up a change).
 * `onAccent` is the text/icon colour that sits on the accent: dark ink on light accents, white on
 * saturated ones.
 */
const ACCENTS = {
  /** Current PWA yellow. ZOE-adjacent. */
  marigold: { accent: '#F5C518', pressed: '#F59A0E', soft: '#FBEDB5', row: '#FFF6D6', onAccent: '#1F1B16' },
  /** The hue no plant owns: a blueberry periwinkle. Distinct from every food competitor. */
  blueberry: { accent: '#5B6CF0', pressed: '#4353D9', soft: '#E6E9FD', row: '#EEF0FE', onAccent: '#FFFFFF' },
  /** Warm and kid-friendly; borders on the fruit tint. */
  coral: { accent: '#F2695C', pressed: '#D9503F', soft: '#FDE1DC', row: '#FFF0EC', onAccent: '#FFFFFF' },
  /** Low-risk shift: warmer amber, still yellow-family. */
  amber: { accent: '#F5A524', pressed: '#D98A0E', soft: '#FDEBC8', row: '#FFF4DE', onAccent: '#1F1B16' },
} as const;

export type AccentName = keyof typeof ACCENTS;
const ACCENT_NAME: AccentName = (process.env.EXPO_PUBLIC_ACCENT as AccentName | undefined) && process.env.EXPO_PUBLIC_ACCENT! in ACCENTS ? (process.env.EXPO_PUBLIC_ACCENT as AccentName) : 'marigold';
const A = ACCENTS[ACCENT_NAME];
export const accentName = ACCENT_NAME;

export const colors = {
  bg: '#FFFFFF',
  bgSoft: '#F6F5F2',
  surface: '#FFFFFF',
  hairline: '#ECEAE5',
  ink: '#1F1B16',
  ink2: '#6B645C',
  ink3: '#A39B91',
  accent: A.accent as string,
  accentPressed: A.pressed as string,
  accentSoft: A.soft as string,
  onAccent: A.onAccent as string,
  checkedRow: A.row as string,
  /** Reward metal for card levels; stays gold regardless of the brand accent. */
  gold: '#F5C518',
  locked: '#ECEAE5',
  lockedInk: '#B8B2A9',
} as const;

/**
 * Corner radius scale. The radius follows the element's height, roughly one third of it,
 * snapped to this scale (device test round 2):
 * - sm 12  → chips, filters, pills, small tiles (≤ 40pt tall)
 * - md 18  → buttons, inputs, medium tiles (41–64pt)
 * - lg 24  → list rows, cards, album tiles (65–140pt)
 * - xl 32  → hero cards, sheets, full-size cards (> 140pt)
 * - full   → only for elements that are genuinely round: avatars, the check circle, dots,
 *            icon-only buttons whose width equals their height. Never for text pills.
 * Nested elements take the same step as their parent or one smaller, never larger.
 */
export const radii = { sm: 12, md: 18, lg: 24, xl: 32, full: 999 } as const;

/** Radius for a box of the given height, per the scale above. */
export function radiusFor(height: number): number {
  if (height <= 40) return radii.sm;
  if (height <= 64) return radii.md;
  if (height <= 140) return radii.lg;
  return radii.xl;
}

/** Icon size for a container: about 45% of its side, so icons sit in balance with their box. */
export function iconFor(container: number): number {
  return Math.max(16, Math.round(container * 0.45));
}

export const fonts = {
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

export type Category = 'fruit' | 'vegetable' | 'herb' | 'nut_seed' | 'legume' | 'whole_grain' | 'ferment';

/** Category accents: fg for text/icons, bg for tinted grounds. Same values as the PWA. */
export const CATS: Record<Category, { fg: string; bg: string }> = {
  fruit: { fg: '#C2533D', bg: '#FBD9CC' },
  vegetable: { fg: '#4F7A3D', bg: '#DDEACB' },
  herb: { fg: '#3C6A60', bg: '#CFE5DD' },
  nut_seed: { fg: '#7E5530', bg: '#F1DFC4' },
  legume: { fg: '#6A4880', bg: '#E5D6EE' },
  whole_grain: { fg: '#9C7A2E', bg: '#F3E6BD' },
  ferment: { fg: '#6B7A87', bg: '#DFE3E8' },
};

export const CAT_ORDER: Category[] = ['vegetable', 'fruit', 'herb', 'nut_seed', 'legume', 'whole_grain', 'ferment'];
