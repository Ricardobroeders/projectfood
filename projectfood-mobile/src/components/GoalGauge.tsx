import { type ReactNode, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming, type SharedValue } from 'react-native-reanimated';

import { motion } from '@/constants/motion';
import { colors } from '@/constants/theme';

/** The arc spans 200°, from 100° left of straight up to 100° right of it. */
const SWEEP = 200;
const SEG_LEN = 26;
const SEG_W = 8;

/** Colour bands by plant count, stepped: the whole lit arc takes the band of the current count. */
const BANDS: { upTo: number; color: string }[] = [
  { upTo: 7, color: colors.gaugeLow },
  { upTo: 15, color: colors.gaugeMid },
  { upTo: 23, color: colors.gaugeYellow },
  { upTo: Infinity, color: colors.gaugeHigh },
];

/** The lit colour for a count, shared with the Log screen's week meter so both read the same. */
export function bandColor(count: number): string {
  'worklet';
  for (const b of BANDS) if (count <= b.upTo) return b.color;
  return colors.gaugeHigh;
}

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
 * screen opens (fill class). The lit colour steps red → orange → yellow → green with the count
 * and turns dark green when the goal is met.
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
            <Segment index={i} fill={fill} done={done} />
          </View>
        );
      })}
      <View style={[styles.center, { top: radius * 0.45 }]}>{children}</View>
    </View>
  );
}

function Segment({ index, fill, done }: { index: number; fill: SharedValue<number>; done: boolean }) {
  const style = useAnimatedStyle(() => {
    const lit = fill.value >= index + 0.5;
    const on = done ? colors.gaugeDone : bandColor(Math.round(fill.value));
    return { backgroundColor: lit ? on : colors.hairline };
  });
  return <Animated.View style={[styles.segment, style]} />;
}

const styles = StyleSheet.create({
  slot: { position: 'absolute', width: SEG_W, height: SEG_LEN },
  segment: { width: SEG_W, height: SEG_LEN, borderRadius: SEG_W / 2 },
  center: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
});
