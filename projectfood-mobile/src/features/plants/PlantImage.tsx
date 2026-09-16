import { Image, type ImageStyle } from 'expo-image';
import type { StyleProp } from 'react-native';

import { PLANT_IMAGES } from '@/data/plantImages.generated';
import type { Plant } from '@/features/plants/catalog';

type Props = { plant: Pick<Plant, 'slug' | 'imageUrl'>; size: number; style?: StyleProp<ImageStyle> };

/** Bundled 256px clay render by slug; falls back to the bucket URL for plants added after this build. */
export function PlantImage({ plant, size, style }: Props) {
  const source = PLANT_IMAGES[plant.slug] ?? (plant.imageUrl ? { uri: plant.imageUrl } : undefined);
  return <Image source={source} style={[{ width: size, height: size }, style]} contentFit="contain" transition={120} cachePolicy="memory-disk" />;
}
