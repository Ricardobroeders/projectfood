import { useEffect } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { FadeOut, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { motion } from '@/constants/motion';
import { colors, radiusFor } from '@/constants/theme';

type Props = {
  count: number;
  /** Row height; the rows are the exact size of the ones they stand in for. */
  height: number;
  /** Width of the image tile on the left. */
  tile: number;
  gap?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Placeholder rows that claim a list's space before its rows exist (pulse class), then fade out
 * under the real rows as they arrive (reveal class). Opaque, so it also covers a list being replaced.
 */
export function SkeletonRows({ count, height, tile, gap = 8, style }: Props) {
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(0.55, motion.pulse), -1, true);
  }, [pulse]);
  const breathing = useAnimatedStyle(() => ({ opacity: pulse.value }));
  return (
    <Animated.View style={[styles.wrap, style]} exiting={FadeOut.duration(160)} pointerEvents="none">
      <Animated.View style={breathing}>
        {Array.from({ length: count }, (_, i) => (
          <View key={i} style={[styles.row, { height, marginBottom: gap, borderRadius: radiusFor(height) }]}>
            <View style={[styles.tile, { width: tile, height }]} />
            <View style={[styles.line, { width: `${42 + ((i * 17) % 30)}%` }]} />
          </View>
        ))}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.bg },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: colors.bgSoft, overflow: 'hidden' },
  tile: { backgroundColor: colors.hairline },
  line: { height: 14, borderRadius: 7, backgroundColor: colors.hairline },
});
