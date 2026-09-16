import { Image, type ImageStyle } from 'expo-image';
import { useRef } from 'react';
import { Image as RNImage, type StyleProp } from 'react-native';

import { PLANT_IMAGES } from '@/data/plantImages.generated';
import { perfImage } from '@/features/dev/perf';
import type { Plant } from '@/features/plants/catalog';

type Props = { plant: Pick<Plant, 'slug' | 'imageUrl'>; size: number; style?: StyleProp<ImageStyle> };

/** Bundled 256px clay render by slug; falls back to the bucket URL for plants added after this build. */
export function PlantImage({ plant, size, style }: Props) {
  const source = PLANT_IMAGES[plant.slug] ?? (plant.imageUrl ? { uri: plant.imageUrl } : undefined);
  const t0 = useRef(0);
  const timing = __DEV__
    ? {
        onLoadStart: () => {
          t0.current = performance.now();
        },
        onLoad: () => {
          if (t0.current) perfImage(performance.now() - t0.current, typeof source === 'number' ? RNImage.resolveAssetSource(source)?.uri : undefined);
        },
      }
    : undefined;
  return <Image source={source} style={[{ width: size, height: size }, style]} contentFit="contain" transition={120} cachePolicy="memory-disk" {...timing} />;
}
