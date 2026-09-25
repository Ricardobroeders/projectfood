import { type ReactNode, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withDelay, withTiming, type SharedValue } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { motion } from '@/constants/motion';
import { colors } from '@/constants/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

/** The arc spans 200°, from 100° left of straight up to 100° right of it. */
const SWEEP = 200;
/** Radial length of a wedge. */
const SEG_LEN = 28;
/** Air between two wedges, in degrees, before the rounding stroke eats into it. */
const GAP = 2.6;
/** A stroke in the wedge's own colour rounds its corners (the SVG Ricardo drew, 2026-09-25). */
const ROUND = 3;

/**
 * Every wedge owns a colour by its place on the arc, red at the start through dark green at the
 * end, in five even bands (Ricardo's SVG, 2026-09-25). A wedge shows its colour once that plant
 * is counted and stays light grey until then; the arc reads as a ladder that fills, not as one
 * colour that changes.
 */
const BAND_COLORS = [colors.gaugeLow, colors.gaugeMid, colors.gaugeYellow, colors.gaugeHigh, colors.gaugeDone];

/** Colour of the wedge at `index` (0-based) on an arc of `max` wedges. */
function wedgeColor(index: number, max: number): string {
  'worklet';
  const band = Math.min(BAND_COLORS.length - 1, Math.floor((index * BAND_COLORS.length) / max));
  return BAND_COLORS[band];
}

/** The colour of the wedge a count lands on; the Log screen's week chip borrows it so both read the same. */
export function bandColor(count: number, max = 30): string {
  return wedgeColor(Math.max(0, Math.min(count, max) - 1), max);
}

type Props = {
  /** Plants tasted this week. Values above `max` light every wedge. */
  value: number;
  /** Wedges in the arc, one per plant of the weekly goal. */
  max: number;
  /** Width of the arc. */
  size?: number;
  /** Sits in the middle of the arc: the number and its label. */
  children?: ReactNode;
};

const rad = (deg: number) => (deg * Math.PI) / 180;

/** An annular sector centred on `angle` (degrees from straight up, clockwise), `half` degrees each side. */
function wedgePath(cx: number, cy: number, inner: number, outer: number, angle: number, half: number): string {
  const a0 = rad(angle - half - 90);
  const a1 = rad(angle + half - 90);
  const p = (r: number, a: number) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  return `M${p(inner, a0)} L${p(outer, a0)} A${outer} ${outer} 0 0 1 ${p(outer, a1)} L${p(inner, a1)} A${inner} ${inner} 0 0 0 ${p(inner, a0)} Z`;
}

/**
 * Weekly goal gauge: one wedge per plant, filling from empty to the week's count when the screen
 * opens (fill class). Wedges are tapered like the drawn SVG, wider on the outside.
 */
export function GoalGauge({ value, max, size = 280, children }: Props) {
  const fill = useSharedValue(0);
  useEffect(() => {
    fill.value = 0;
    fill.value = withDelay(150, withTiming(Math.min(value, max), motion.fill));
  }, [value, max, fill]);

  const outer = size / 2 - ROUND;
  const inner = outer - SEG_LEN;
  const cx = size / 2;
  const cy = size / 2;
  // The arc's lowest point: the outer radius at 100° off vertical.
  const height = Math.round(cy + outer * Math.cos(rad(180 - SWEEP / 2)) + ROUND);
  const step = SWEEP / (max - 1);
  const half = (step - GAP) / 2;

  return (
    <View style={{ width: size, height }}>
      <Svg width={size} height={height} pointerEvents="none">
        {Array.from({ length: max }, (_, i) => (
          <Wedge key={i} index={i} d={wedgePath(cx, cy, inner, outer, -SWEEP / 2 + i * step, half)} color={wedgeColor(i, max)} fill={fill} />
        ))}
      </Svg>
      <View style={[styles.center, { top: cy * 0.45, bottom: 0 }]}>{children}</View>
    </View>
  );
}

function Wedge({ index, d, color, fill }: { index: number; d: string; color: string; fill: SharedValue<number> }) {
  const animatedProps = useAnimatedProps(() => {
    const on = fill.value >= index + 0.5 ? color : colors.hairline;
    return { fill: on, stroke: on };
  });
  return <AnimatedPath d={d} animatedProps={animatedProps} strokeWidth={ROUND} strokeLinejoin="round" />;
}

const styles = StyleSheet.create({
  center: { position: 'absolute', left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
});
