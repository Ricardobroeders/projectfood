import { Image, type ImageSource } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

/** Points sampled around the outline; the polygon reads as a curve at any size the app uses. */
const N = 72;
/** The shapes in cycle order, as a unit radius per angle (1 = the box's half width). */
const SHAPES = 4;
/** One shape to the next. */
const PERIOD = 720;
/** The outline turns this much per shape, so the hexagon reads as turning rather than flickering. */
const TURN_PER_SHAPE = Math.PI / 3;
const TAU = Math.PI * 2;

/**
 * Unit radius of shape `k` at angle `a`, shape-local. The first shape is a squircle just outside
 * a rounded-square icon, so a morph over the splash icon starts with nothing clipped.
 */
function radius(k: number, a: number): number {
  'worklet';
  switch (k) {
    case 0: {
      // superellipse n = 8: flat sides, corners at 1.30 (the icon's own rounded corners sit at 1.25)
      const n = 8;
      return Math.pow(Math.pow(Math.abs(Math.cos(a)), n) + Math.pow(Math.abs(Math.sin(a)), n), -1 / n);
    }
    case 1:
      return 1;
    case 2: {
      // regular hexagon, a vertex at angle 0, circumradius 1.08
      const m = ((a % (Math.PI / 3)) + Math.PI / 3) % (Math.PI / 3);
      return (1.08 * Math.cos(Math.PI / 6)) / Math.cos(m - Math.PI / 6);
    }
    default:
      // four soft lobes
      return 0.9 + 0.12 * Math.cos(4 * a);
  }
}

function smoothstep(f: number): number {
  'worklet';
  return f * f * (3 - 2 * f);
}

type Props = {
  size: number;
  /** Morph a window over this image (the splash icon); the cover around it is `bg`. */
  source?: ImageSource | number;
  bg?: string;
  /** Without an image: a solid shape in this colour, the in-app spinner. */
  color?: string;
  /** Hold the first shape this long before the cycle starts (the splash hand-off). */
  delay?: number;
};

/**
 * A shape that morphs while it turns (M3 expressive shape morph; Ricardo, 2026-09-24): squircle
 * → circle → hexagon → four lobes, and round again, a sixth of a turn per shape. Over an image it
 * is a window, drawn as a cover with the shape cut out (even-odd), which keeps it a plain animated
 * path: no clip path to invalidate. On its own it is the app's spinner.
 */
export function ShapeMorph({ size, source, bg = '#FFFFFF', color = '#A39B91', delay = 0 }: Props) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = 0;
    progress.value = withDelay(delay, withRepeat(withTiming(SHAPES, { duration: SHAPES * PERIOD, easing: Easing.linear }), -1, false));
  }, [progress, delay]);

  const c = size / 2;
  const window = !!source;
  const animatedProps = useAnimatedProps(() => {
    const t = progress.value;
    const i = Math.floor(t) % SHAPES;
    const j = (i + 1) % SHAPES;
    const f = smoothstep(t - Math.floor(t));
    const turn = t * TURN_PER_SHAPE;
    let d = window ? `M0 0H${size}V${size}H0Z` : '';
    for (let k = 0; k < N; k++) {
      const a = (k / N) * TAU;
      const r = c * (radius(i, a) * (1 - f) + radius(j, a) * f);
      const x = c + r * Math.cos(a + turn);
      const y = c + r * Math.sin(a + turn);
      d += `${k === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return { d: d + 'Z' };
  });

  return (
    <View style={{ width: size, height: size }}>
      {source ? <Image source={source} style={StyleSheet.absoluteFill} contentFit="contain" /> : null}
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <AnimatedPath animatedProps={animatedProps} fill={window ? bg : color} fillRule="evenodd" />
      </Svg>
    </View>
  );
}
