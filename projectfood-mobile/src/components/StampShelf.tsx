import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { LevelPips } from '@/components/LevelPips';
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
  /** Cell width; defaults to the stamp plus a little air. The grid passes a column width. */
  width?: number;
  onPress: () => void;
};

export function ShelfStamp({ achievement, entry, level, label, size = 64, width, onPress }: ShelfStampProps) {
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
      style={({ pressed }) => [styles.item, { width: width ?? size + 12 }, pressed && { opacity: 0.7 }]}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${v.maxed ? t('unlocks.complete') : `${v.current} / ${v.target}`}`}>
      <Animated.View style={style}>
        <Stamp size={size} color={achievement.color} locked={!unlocked}>
          <StampArt achievement={achievement} size={size} unlocked={unlocked} />
        </Stamp>
      </Animated.View>
      <LevelPips level={level} max={v.maxLevel} />
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

const GRID_COLUMNS = 4;
const GRID_GAP = 8;
const GRID_PADDING = 20;

/** The same stamps as a grid for the Unlocks screen: explicit rows of four, so a short last row stays left with empty slots. */
export function StampGrid({ entries, levelOf, onPress }: ShelfProps) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const cell = Math.floor((width - GRID_PADDING * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS);
  const rows: Achievement[][] = [];
  for (let i = 0; i < ACHIEVEMENTS.length; i += GRID_COLUMNS) rows.push(ACHIEVEMENTS.slice(i, i + GRID_COLUMNS));
  return (
    <View style={styles.grid}>
      {rows.map((row) => (
        <View key={row[0].id} style={styles.gridRow}>
          {row.map((a) => (
            <ShelfStamp key={a.id} achievement={a} entry={entries[a.id]} level={levelOf(a.id)} label={t(`stamps.${a.id}.title`)} width={cell} onPress={() => onPress(a.id)} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  shelf: { paddingHorizontal: 20, gap: 14, paddingVertical: 4 },
  grid: { paddingHorizontal: GRID_PADDING, rowGap: 18 },
  gridRow: { flexDirection: 'row', justifyContent: 'flex-start', columnGap: GRID_GAP },
  item: { alignItems: 'center', gap: 5 },
  label: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 14, color: colors.ink2, textAlign: 'center' },
  count: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 14, color: colors.ink3, marginTop: -2 },
});
