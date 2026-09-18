import { Image, type ImageStyle } from 'expo-image';
import type { StyleProp } from 'react-native';

import type { Category } from '@/constants/theme';
import { CATEGORY_IMAGES } from '@/data/categoryImages.generated';

/** The category's clay render, or nothing for a category without one yet. */
export function CategoryImage({ category, size, style }: { category: Category; size: number; style?: StyleProp<ImageStyle> }) {
  const source = CATEGORY_IMAGES[category];
  if (!source) return null;
  return <Image source={source} style={[{ width: size, height: size }, style]} contentFit="contain" transition={120} />;
}
