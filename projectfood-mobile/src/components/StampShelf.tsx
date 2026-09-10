import { BookOpen, LayoutGrid, Lock, type LucideIcon, Smile, Sun, Zap } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { Stamp } from '@/components/Stamp';
import { motion, REWARD_POP_FROM } from '@/constants/motion';
import { colors, fonts, iconFor } from '@/constants/theme';
import type { AchievementId } from '@/i18n';
import { useStore } from '@/state/store';

export const STAMP_META: Record<AchievementId, { color: string; icon: LucideIcon }> = {
  first_bites: { color: colors.accent, icon: Smile },
  curious: { color: '#6A4880', icon: BookOpen },
  rainbow: { color: '#C2533D', icon: Sun },
  streak_7: { color: '#3C6A60', icon: Zap },
  album: { color: '#4F7A3D', icon: LayoutGrid },
};

const ORDER: AchievementId[] = ['first_bites', 'curious', 'rainbow', 'streak_7', 'album'];

function ShelfStamp({ id, unlocked, label }: { id: AchievementId; unlocked: boolean; label: string }) {
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

  const meta = STAMP_META[id];
  const Icon = unlocked ? meta.icon : Lock;
  return (
    <View style={styles.item}>
      <Animated.View style={style}>
        <Stamp size={64} color={meta.color} locked={!unlocked}>
          <Icon size={iconFor(64)} color={unlocked ? '#FFFFFF' : colors.lockedInk} />
        </Stamp>
      </Animated.View>
      <Text style={[styles.label, !unlocked && { color: colors.ink3 }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export function StampShelf() {
  const { unlocked, t } = useStore();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelf}>
      {ORDER.map((id) => (
        <ShelfStamp key={id} id={id} unlocked={unlocked.includes(id)} label={t.stamps[id]} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  shelf: { paddingHorizontal: 20, gap: 14, paddingVertical: 4 },
  item: { width: 72, alignItems: 'center', gap: 6 },
  label: { fontFamily: fonts.medium, fontSize: 11, color: colors.ink2, textAlign: 'center' },
});
