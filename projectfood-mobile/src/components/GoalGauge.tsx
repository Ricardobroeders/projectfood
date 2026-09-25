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
/**
 * A stroke in the wedge's own colour rounds its corners; the corner radius is half of it (the SVG
 * Ricardo drew, 2026-09-25; 3 → 8 the same day, "slightly bigger, more playful"). The stroke grows
 * the wedge by half its width on every side, so the path length and gap below are set net of it.
 */
const ROUND = 8;
/** Radial length of the wedge path; on screen it is this plus the stroke (35), taller than wide like the drawing. */
const SEG_LEN = 27;
/** Air between two wedge paths, in degrees; on screen about 8 px after the stroke has eaten into it (5.4° at ROUND 3 felt right). */
const GAP = 7.9;

/**
 * Every wedge owns a colour by its place on the arc, red at the start through dark green at the
 * end (Ricardo's SVG, 2026-09-25). A wedge shows its colour once that plant is counted and stays
 * light grey until then; the arc reads as a ladder that fills, not as one colour that changes.
 * Bands of 3 / 3 / 4 / 4 / 4 wedges: more green than red (Ricardo, 2026-09-25: "a bit more optimistic").
 */
const BANDS: { wedges: number; color: string }[] = [
  { wedges: 3, color: colors.gaugeLow },
  { wedges: 3, color: colors.gaugeMid },
  { wedges: 4, color: colors.gaugeYellow },
  { wedges: 4, color: colors.gaugeHigh },
  { wedges: 4, color: colors.gaugeDone },
];

/** Colour of the wedge at `index` (0-based). */
function wedgeColor(index: number): string {
  'worklet';
  let start = 0;
  for (const b of BANDS) {
    if (index < start + b.wedges) return b.color;
    start += b.wedges;
  }
  return BANDS[BANDS.length - 1].color;
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

  // Path radii; the stroke adds ROUND / 2 outside and inside, so the drawn arc touches the box edge.
  const outer = size / 2 - ROUND / 2;
  const inner = outer - SEG_LEN;
  const cx = size / 2;
  const cy = size / 2;
  const step = SWEEP / (WEDGES - 1);
  const half = (step - GAP) / 2;
  // The lowest point on screen: the outer corner of the last wedge, plus its half of the rounding stroke.
  const height = Math.ceil(cy - outer * Math.cos(rad(SWEEP / 2 + half)) + ROUND / 2 + 1);

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
