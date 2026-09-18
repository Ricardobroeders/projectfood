import type { ImageSourcePropType } from 'react-native';

import type { Locale } from '@/features/i18n';

/** Language flags from the `images/flags` bucket (2026-09-18), bundled as SVG; expo-image renders them natively. */
export const FLAGS: Record<Locale, ImageSourcePropType> = {
  en: require('@/assets/flags/en.svg'),
  nl: require('@/assets/flags/nl.svg'),
  it: require('@/assets/flags/it.svg'),
  de: require('@/assets/flags/de.svg'),
  fr: require('@/assets/flags/fr.svg'),
};
