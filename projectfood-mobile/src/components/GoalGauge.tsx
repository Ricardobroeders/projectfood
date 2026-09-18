import { type ReactNode, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withDelay, withTiming, type SharedValue } from 'react-native-reanimated';

import { motion } from '@/constants/motion';
import { colors } from '@/constants/theme';

/** The arc spans 200°, from 100° left of straight up to 100° right of it. */
const SWEEP = 200;
const SEG_LEN = 26;
const SEG_W = 8;

type Props = {
  /** Plants tasted this week. Values above `max` light every segment in the done colour. */
  value: number;
  /** Segments in the arc, one per plant of the weekly goal. */
  max: number;
  /** Width of the arc. */
  size?: number;
  /** Sits in the middle of the arc: the number and its label. */
  children?: ReactNode;
};

/**
 * Weekly goal gauge: one segment per plant, filling from empty to the week's count when the
 * screen opens (fill class). The lit colour runs red → orange → green with the count and turns
 * dark green when the goal is met.
 */
export function GoalGauge({ value, max, size = 280, children }: Props) {
  const fill = useSharedValue(0);
  useEffect(() => {
    fill.value = 0;
    fill.value = withDelay(150, withTiming(Math.min(value, max), motion.fill));
  }, [value, max, fill]);

  const radius = size / 2 - SEG_LEN / 2;
  const height = Math.round(radius * (1 + Math.cos(((180 - SWEEP / 2) * Math.PI) / 180)) + SEG_LEN);
  const done = value >= max;
  return (
    <View style={{ width: size, height }}>
      {Array.from({ length: max }, (_, i) => {
        const angle = -SWEEP / 2 + (i * SWEEP) / (max - 1);
        return (
          <View key={i} pointerEvents="none" style={[styles.slot, { left: size / 2 - SEG_W / 2, top: radius, transform: [{ rotate: `${angle}deg` }, { translateY: -radius }] }]}>
            <Segment index={i} fill={fill} max={max} done={done} />
          </View>
        );
      })}
      <View style={[styles.center, { top: radius * 0.45 }]}>{children}</View>
    </View>
  );
}

function Segment({ index, fill, max, done }: { index: number; fill: SharedValue<number>; max: number; done: boolean }) {
  const style = useAnimatedStyle(() => {
    const lit = fill.value >= index + 0.5;
    const ratio = Math.min(1, fill.value / max);
    const on = done ? colors.gaugeDone : interpolateColor(ratio, [0, 0.5, 1], [colors.gaugeLow, colors.gaugeMid, colors.gaugeHigh]);
    return { backgroundColor: lit ? on : colors.hairline };
  });
  return <Animated.View style={[styles.segment, style]} />;
}

const styles = StyleSheet.create({
  slot: { position: 'absolute', width: SEG_W, height: SEG_LEN },
  segment: { width: SEG_W, height: SEG_LEN, borderRadius: SEG_W / 2 },
  center: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
});
