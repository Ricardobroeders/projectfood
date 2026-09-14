import * as Haptics from 'expo-haptics';
import { Lock } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { ProgressBar } from '@/components/ProgressBar';
import { Stamp } from '@/components/Stamp';
import { motion, REWARD_POP_FROM } from '@/constants/motion';
import { colors, fonts, iconFor } from '@/constants/theme';
import { ACHIEVEMENTS, type Achievement } from '@/data/achievements';
import { useStore } from '@/state/store';

type ShelfStampProps = {
  achievement: Achievement;
  unlocked: boolean;
  current: number;
  target: number;
  label: string;
  onPress: () => void;
};

function ShelfStamp({ achievement, unlocked, current, target, label, onPress }: ShelfStampProps) {
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

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  const Icon = unlocked ? achievement.icon : Lock;
  const shown = Math.min(current, target);
  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${shown} / ${target}`}>
      <Animated.View style={style}>
        <Stamp size={64} color={achievement.color} locked={!unlocked}>
          <Icon size={iconFor(64)} color={unlocked ? (achievement.fg ?? '#FFFFFF') : colors.lockedInk} />
        </Stamp>
      </Animated.View>
      <Text style={[styles.label, !unlocked && { color: colors.ink3 }]} numberOfLines={1}>
        {label}
      </Text>
      {/* Ricardo's ask (2026-09-14): a green bar under every achievement with "3/5" so the goal is visible. */}
      <ProgressBar value={current} max={target} height={4} style={styles.bar} />
      <Text style={[styles.count, unlocked && { color: colors.success }]}>
        {shown}/{target}
      </Text>
    </Pressable>
  );
}

export function StampShelf() {
  const { unlocked, progress, t, dispatch } = useStore();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelf}>
      {ACHIEVEMENTS.map((a) => (
        <ShelfStamp
          key={a.id}
          achievement={a}
          unlocked={unlocked.includes(a.id)}
          current={progress[a.id].current}
          target={progress[a.id].target}
          label={t.stamps[a.id].title}
          onPress={() => dispatch({ type: 'openAchievement', id: a.id })}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  shelf: { paddingHorizontal: 20, gap: 14, paddingVertical: 4 },
  item: { width: 76, alignItems: 'center', gap: 6 },
  label: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 14, color: colors.ink2, textAlign: 'center' },
  bar: { width: 56, alignSelf: 'center' },
  count: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 14, color: colors.ink3, marginTop: -2 },
});
