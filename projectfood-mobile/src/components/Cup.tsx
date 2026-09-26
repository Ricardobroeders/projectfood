import { Image, type ImageStyle } from 'expo-image';
import type { StyleProp } from 'react-native';

import { CUP_IMAGES, type CupLevel } from '@/data/cupImages.generated';

/** The card-level cup; the thresholds live in `features/plants/cardLevel.ts` (bronze 3, silver 8, gold 15). */
export function Cup({ level, size, style }: { level: CupLevel; size: number; style?: StyleProp<ImageStyle> }) {
  return <Image source={CUP_IMAGES[level]} style={[{ width: size, height: size }, style]} contentFit="contain" transition={120} />;
}
