import { useEffect, useState } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { motion } from '@/constants/motion';
import { colors } from '@/constants/theme';

type Props = { value: number; max: number; height?: number; color?: string; style?: ViewStyle };

/**
 * Progress toward a goal. The fill eases to its new width (number class, no bounce); the track is
 * the hairline grey. Radius is half the height: a bar this thin is a line with round caps.
 */
export function ProgressBar({ value, max, height = 6, color = colors.success, style }: Props) {
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const [trackWidth, setTrackWidth] = useState(0);
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(trackWidth * ratio, motion.number);
  }, [ratio, trackWidth, width]);

  const fill = useAnimatedStyle(() => ({ width: width.value }));

  return (
    <View
      style={[styles.track, { height, borderRadius: height / 2 }, style]}
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max, now: Math.min(value, max) }}>
      <Animated.View style={[styles.fill, { backgroundColor: color, borderRadius: height / 2 }, fill]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { alignSelf: 'stretch', backgroundColor: colors.hairline, overflow: 'hidden' },
  fill: { height: '100%' },
});
