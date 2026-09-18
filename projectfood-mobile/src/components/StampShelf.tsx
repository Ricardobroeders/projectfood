import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { ProgressBar } from '@/components/ProgressBar';
import { Stamp } from '@/components/Stamp';
import { StampArt } from '@/components/StampArt';
import { motion, REWARD_POP_FROM } from '@/constants/motion';
import { colors, fonts } from '@/constants/theme';
import { ACHIEVEMENTS, type Achievement, type AchievementId, type ProgressEntry, stampView } from '@/features/achievements/definitions';

type ShelfStampProps = {
  achievement: Achievement;
  entry: ProgressEntry | undefined;
  /** Level held, 0 = locked. */
  level: number;
  label: string;
  size?: number;
  onPress: () => void;
};

export function ShelfStamp({ achievement, entry, level, label, size = 64, onPress }: ShelfStampProps) {
  const { t } = useTranslation();
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const wasLevel = useRef(level);

  useEffect(() => {
    if (level > wasLevel.current) {
      // reward class: a new stamp (or a new ring) pops onto the shelf
      scale.value = withSequence(withTiming(REWARD_POP_FROM, { duration: 0 }), withDelay(120, withSpring(1, motion.reward)));
      rotate.value = withSequence(withTiming(-8, { duration: 0 }), withDelay(120, withSpring(0, motion.reward)));
    }
    wasLevel.current = level;
  }, [level, scale, rotate]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }] }));

  const v = stampView(entry, level);
  const unlocked = level > 0;
  return (
    <Pressable
      style={({ pressed }) => [styles.item, { width: size + 12 }, pressed && { opacity: 0.7 }]}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${v.maxed ? t('unlocks.complete') : `${v.current} / ${v.target}`}`}>
      <Animated.View style={style}>
        <Stamp size={size} color={achievement.color} locked={!unlocked} level={level}>
          <StampArt achievement={achievement} size={size} unlocked={unlocked} />
        </Stamp>
      </Animated.View>
      <Text style={[styles.label, !unlocked && { color: colors.ink3 }]} numberOfLines={1}>
        {label}
      </Text>
      <ProgressBar value={v.current} max={v.target} height={4} style={{ width: size - 8, alignSelf: 'center' }} />
      <Text style={[styles.count, v.maxed && { color: colors.success }]}>{v.maxed ? t('unlocks.complete') : `${v.current}/${v.target}`}</Text>
    </Pressable>
  );
}

type ShelfProps = {
  /** Progress for the current view (one member's own stamps plus the household's). */
  entries: Record<AchievementId, ProgressEntry>;
  levelOf: (id: AchievementId) => number;
  onPress: (id: AchievementId) => void;
};

/** Horizontal shelf of all stamps with the progress bar to the next rung under each (Ricardo, 2026-09-14). */
export function StampShelf({ entries, levelOf, onPress }: ShelfProps) {
  const { t } = useTranslation();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelf}>
      {ACHIEVEMENTS.map((a) => (
        <ShelfStamp key={a.id} achievement={a} entry={entries[a.id]} level={levelOf(a.id)} label={t(`stamps.${a.id}.title`)} onPress={() => onPress(a.id)} />
      ))}
    </ScrollView>
  );
}

/** The same stamps as a wrapping grid, for the Unlocks screen. */
export function StampGrid({ entries, levelOf, onPress }: ShelfProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.grid}>
      {ACHIEVEMENTS.map((a) => (
        <ShelfStamp key={a.id} achievement={a} entry={entries[a.id]} level={levelOf(a.id)} label={t(`stamps.${a.id}.title`)} onPress={() => onPress(a.id)} />
      ))}
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
