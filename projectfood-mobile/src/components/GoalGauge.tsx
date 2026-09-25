import { type ReactNode, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withDelay, withTiming, type SharedValue } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { motion } from '@/constants/motion';
import { colors } from '@/constants/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

/** The arc spans 200°, from 100° left of straight up to 100° right of it. */
const SWEEP = 200;
/** Wedges on the arc (Ricardo, 2026-09-25: 30 was too many, 15 too chunky, 18 with the wider gaps). 30 plants make 1⅔ per wedge. */
const WEDGES = 18;
/**
 * Opacity of a wedge that is partly earned: its colour, softened. A wedge goes half at a quarter of
 * its span and full at three quarters, so with 0.6 wedge per plant every plant changes something.
 */
const HALF_LIT = 0.45;
/** Radial length of a wedge: taller than wide, like the drawing. */
const SEG_LEN = 32;
/** Air between two wedges, in degrees, before the rounding stroke eats into it (Ricardo, 2026-09-25: 2.6° felt chunky). */
const GAP = 5.4;
/** A stroke in the wedge's own colour rounds its corners (the SVG Ricardo drew, 2026-09-25). */
const ROUND = 3;

/**
 * Every wedge owns a colour by its place on the arc, red at the start through dark green at the
 * end, in five even bands (Ricardo's SVG, 2026-09-25). A wedge shows its colour once that plant
 * is counted and stays light grey until then; the arc reads as a ladder that fills, not as one
 * colour that changes.
 */
const BAND_COLORS = [colors.gaugeLow, colors.gaugeMid, colors.gaugeYellow, colors.gaugeHigh, colors.gaugeDone];

/** Colour of the wedge at `index` (0-based). */
function wedgeColor(index: number): string {
  'worklet';
  const band = Math.min(BAND_COLORS.length - 1, Math.floor((index * BAND_COLORS.length) / WEDGES));
  return BAND_COLORS[band];
}

/** The colour of the wedge a count of `goal` lands on; the Log screen's week chip borrows it so both read the same. */
export function bandColor(count: number, goal = 30): string {
  const plant = Math.max(0, Math.min(count, goal) - 1);
  return wedgeColor(Math.min(WEDGES - 1, Math.floor((plant * WEDGES) / goal)));
}

type Props = {
  /** Plants tasted this week. Values above `max` light every wedge. */
  value: number;
  /** The weekly goal in plants; the arc spreads it over its wedges. */
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
 * Weekly goal gauge: eighteen wedges for the thirty plants, filling from empty to the week's count
 * when the screen opens (fill class). Wedges are tapered like the drawn SVG, wider on the outside.
 */
export function GoalGauge({ value, max, size = 280, children }: Props) {
  // Progress in wedges, continuous: 30 plants over 18 wedges is 0.6 wedge per plant.
  const fill = useSharedValue(0);
  useEffect(() => {
    fill.value = 0;
    fill.value = withDelay(150, withTiming((Math.min(value, max) * WEDGES) / max, motion.fill));
  }, [value, max, fill]);

  const outer = size / 2 - ROUND;
  const inner = outer - SEG_LEN;
  const cx = size / 2;
  const cy = size / 2;
  const step = SWEEP / (WEDGES - 1);
  const half = (step - GAP) / 2;
  // The lowest point on screen: the outer corner of the last wedge, plus the rounding stroke.
  const height = Math.ceil(cy - outer * Math.cos(rad(SWEEP / 2 + half)) + ROUND);

  return (
    <View style={{ width: size, height }}>
      <Svg width={size} height={height} pointerEvents="none">
        {Array.from({ length: WEDGES }, (_, i) => (
          <Wedge key={i} index={i} d={wedgePath(cx, cy, inner, outer, -SWEEP / 2 + i * step, half)} color={wedgeColor(i)} fill={fill} />
        ))}
      </Svg>
      <View style={[styles.center, { top: cy * 0.45, bottom: 0 }]}>{children}</View>
    </View>
  );
}

function Wedge({ index, d, color, fill }: { index: number; d: string; color: string; fill: SharedValue<number> }) {
  const animatedProps = useAnimatedProps(() => {
    // full past three quarters of the wedge, half past a quarter, grey before
    const lit = fill.value >= index + 0.75 ? 1 : fill.value >= index + 0.25 ? HALF_LIT : 0;
    const on = lit > 0 ? color : colors.hairline;
    return { fill: on, stroke: on, fillOpacity: lit > 0 ? lit : 1, strokeOpacity: lit > 0 ? lit : 1 };
  });
  return <AnimatedPath d={d} animatedProps={animatedProps} strokeWidth={ROUND} strokeLinejoin="round" />;
}

const styles = StyleSheet.create({
  center: { position: 'absolute', left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
});
