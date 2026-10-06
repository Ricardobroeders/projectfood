import { Image } from 'expo-image';
import { Lock } from 'lucide-react-native';

import { colors, iconFor } from '@/constants/theme';
import { STAMP_IMAGES, STAMP_IMAGES_GREY } from '@/data/stampImages.generated';
import type { Achievement } from '@/features/achievements/definitions';

type Props = { achievement: Achievement; size: number; unlocked?: boolean; color?: string };

/**
 * The face of a stamp: the prize render when one is bundled (its grey twin while locked, so the
 * goal stays visible without its colour; Ricardo, 2026-10-06), otherwise the line icon, or a lock
 * for a locked icon-only stamp.
 */
export function StampArt({ achievement, size, unlocked = true, color }: Props) {
  const colour = achievement.image ? STAMP_IMAGES[achievement.image] : undefined;
  const source = unlocked ? colour : (achievement.image && STAMP_IMAGES_GREY[achievement.image]) || colour;
  if (source) {
    const art = Math.round(size * 0.88);
    return <Image source={source} style={{ width: art, height: art, opacity: unlocked ? 1 : 0.7 }} contentFit="contain" transition={120} />;
  }
  const Icon = unlocked ? achievement.icon : Lock;
  return <Icon size={iconFor(size)} color={unlocked ? (color ?? achievement.fg ?? '#FFFFFF') : colors.lockedInk} />;
}
