import * as Haptics from 'expo-haptics';
import { Lock } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { ProgressBar } from '@/components/ProgressBar';
import { Stamp } from '@/components/Stamp';
import { motion, REWARD_POP_FROM } from '@/constants/motion';
import { colors, fonts, iconFor } from '@/constants/theme';
import { ACHIEVEMENTS, type Achievement, type AchievementId, type ProgressEntry } from '@/features/achievements/definitions';

type ShelfStampProps = {
  achievement: Achievement;
  unlocked: boolean;
  current: number;
  target: number;
  label: string;
  size?: number;
  onPress: () => void;
};

export function ShelfStamp({ achievement, unlocked, current, target, label, size = 64, onPress }: ShelfStampProps) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const wasUnlocked = useRef(unlocked);

  useEffect(() => {
    if (unlocked && !wasUnlocked.current) {
      // reward class: a new stamp pops onto the shelf
      scale.value = withSequence(withTiming(REWARD_POP_FROM, { duration: 0 }), withDelay(120, withSpring(1, motion.reward)));
      rotate.value = withSequence(withTiming(-8, { duration: 0 }), withDelay(120, withSpring(0, motion.reward)));
    }
    wasUnlocked.current = unlocked;
  }, [unlocked, scale, rotate]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }] }));

  const Icon = unlocked ? achievement.icon : Lock;
  const shown = Math.min(current, target);
  return (
    <Pressable
      style={({ pressed }) => [styles.item, { width: size + 12 }, pressed && { opacity: 0.7 }]}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${shown} / ${target}`}>
      <Animated.View style={style}>
        <Stamp size={size} color={achievement.color} locked={!unlocked}>
          <Icon size={iconFor(size)} color={unlocked ? (achievement.fg ?? '#FFFFFF') : colors.lockedInk} />
        </Stamp>
      </Animated.View>
      <Text style={[styles.label, !unlocked && { color: colors.ink3 }]} numberOfLines={1}>
        {label}
      </Text>
      <ProgressBar value={current} max={target} height={4} style={{ width: size - 8, alignSelf: 'center' }} />
      <Text style={[styles.count, unlocked && { color: colors.success }]}>
        {shown}/{target}
      </Text>
    </Pressable>
  );
}

type ShelfProps = {
  /** Progress for the current view (one member's own stamps plus the household's). */
  entries: Record<AchievementId, ProgressEntry>;
  unlocked: (id: AchievementId) => boolean;
  onPress: (id: AchievementId) => void;
};

/** Horizontal shelf of all stamps with the green progress bar and "3/5" under each (Ricardo, 2026-09-14). */
export function StampShelf({ entries, unlocked, onPress }: ShelfProps) {
  const { t } = useTranslation();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelf}>
      {ACHIEVEMENTS.map((a) => {
        const e = entries[a.id] ?? { current: 0, target: 1 };
        return (
          <ShelfStamp
            key={a.id}
            achievement={a}
            unlocked={unlocked(a.id)}
            current={e.current}
            target={e.target}
            label={t(`stamps.${a.id}.title`)}
            onPress={() => onPress(a.id)}
          />
        );
      })}
    </ScrollView>
  );
}

/** The same stamps as a wrapping grid, for the Unlocks screen. */
export function StampGrid({ entries, unlocked, onPress }: ShelfProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.grid}>
      {ACHIEVEMENTS.map((a) => {
        const e = entries[a.id] ?? { current: 0, target: 1 };
        return (
          <ShelfStamp
            key={a.id}
            achievement={a}
            unlocked={unlocked(a.id)}
            current={e.current}
            target={e.target}
            label={t(`stamps.${a.id}.title`)}
            onPress={() => onPress(a.id)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  shelf: { paddingHorizontal: 20, gap: 14, paddingVertical: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 18, paddingHorizontal: 20 },
  item: { alignItems: 'center', gap: 6 },
  label: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 14, color: colors.ink2, textAlign: 'center' },
  count: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 14, color: colors.ink3, marginTop: -2 },
});
