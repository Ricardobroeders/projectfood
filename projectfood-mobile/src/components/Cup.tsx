import { Image, type ImageStyle } from 'expo-image';
import type { StyleProp } from 'react-native';

import { CUP_IMAGES, type CupLevel } from '@/data/cupImages.generated';

/** The card-level cup: bronze at the first taste, silver at 5, gold at 10. */
export function Cup({ level, size, style }: { level: CupLevel; size: number; style?: StyleProp<ImageStyle> }) {
  return <Image source={CUP_IMAGES[level]} style={[{ width: size, height: size }, style]} contentFit="contain" transition={120} />;
}
