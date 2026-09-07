/**
 * Project Food mobile tokens (POC, 2026-09-07).
 * Carried over from the live PWA (projectfood-app/app/globals.css) with two changes decided on
 * the first device test:
 * - the page background moves from warm cream to white so food colours carry the colour;
 * - no drop shadows anywhere. Distinction comes from grey surfaces (bgSoft) on white.
 */
export const colors = {
  bg: '#FFFFFF',
  bgSoft: '#F6F5F2',
  surface: '#FFFFFF',
  hairline: '#ECEAE5',
  ink: '#1F1B16',
  ink2: '#6B645C',
  ink3: '#A39B91',
  accent: '#F5C518',
  accentPressed: '#F59A0E',
  accentSoft: '#FBEDB5',
  checkedRow: '#FFF6D6',
  locked: '#ECEAE5',
  lockedInk: '#B8B2A9',
} as const;

export const radii = { sm: 12, md: 18, lg: 24, xl: 32, full: 999 } as const;

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
