import { Canvas, Group, Path } from '@shopify/react-native-skia';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useDerivedValue, useSharedValue, withDelay, withTiming, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { colors } from '@/constants/theme';

/** A rounded four-point star, unit size, centred on 0,0. */
const STAR = 'M0 -1 C0.12 -0.12 0.12 -0.12 1 0 C0.12 0.12 0.12 0.12 0 1 C-0.12 0.12 -0.12 0.12 -1 0 C-0.12 -0.12 -0.12 -0.12 0 -1 Z';

const SPARKLES = [
  { angle: -110, start: 0.0, size: 9 },
  { angle: -40, start: 0.12, size: 7 },
  { angle: 20, start: 0.06, size: 8 },
  { angle: 80, start: 0.2, size: 6 },
  { angle: 150, start: 0.1, size: 8 },
  { angle: 215, start: 0.24, size: 6 },
] as const;

const SPARKLE_COLORS = [colors.accent, '#C2533D', '#4F7A3D', colors.accentPressed, '#6A4880', colors.accent];

function Sparkle({ index, progress, cx, cy, radius }: { index: number; progress: SharedValue<number>; cx: number; cy: number; radius: number }) {
  const s = SPARKLES[index];
  const rad = (s.angle * Math.PI) / 180;
  const transform = useDerivedValue(() => {
    const t = Math.min(1, Math.max(0, (progress.value - s.start) / 0.6));
    const r = radius + 16 * t;
    const scale = Math.sin(t * Math.PI) * s.size;
    return [{ translateX: cx + Math.cos(rad) * r }, { translateY: cy + Math.sin(rad) * r }, { scale: Math.max(scale, 0.001) }, { rotate: t * 0.8 }];
  });
  return (
    <Group transform={transform}>
      <Path path={STAR} color={SPARKLE_COLORS[index]} />
    </Group>
  );
}

type Props = PropsWithChildren<{
  /** Side of the stamp inside. The effect area is 1.7× that. */
  size: number;
  /** Ink colour for the ring, normally the stamp's colour. */
  color: string;
  play: boolean;
  /** Fires the moment the stamp lands: the right place for a haptic. */
  onLanded?: () => void;
}>;

/**
 * Reward-class celebration: the stamp comes down like a rubber stamp, an ink ring pulses out and
 * fades, six small sparkles twinkle around it. Everything stays inside this component's box.
 */
export function StampPress({ size, color, play, onLanded, children }: Props) {
  const area = Math.round(size * 1.7);
  const press = useSharedValue(0); // 0 = hovering above the sheet, 1 = landed
  const ring = useSharedValue(0);
  const spark = useSharedValue(0);

  useEffect(() => {
    if (!play) {
      press.value = 0;
      ring.value = 0;
      spark.value = 0;
      return;
    }
    press.value = withDelay(
      200,
      withTiming(1, { duration: 240, easing: Easing.in(Easing.cubic) }, (finished) => {
        if (!finished) return;
        ring.value = withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) });
        spark.value = withTiming(1, { duration: 760, easing: Easing.out(Easing.quad) });
        if (onLanded) scheduleOnRN(onLanded);
      }),
    );
  }, [play, press, ring, spark, onLanded]);

  const stampStyle = useAnimatedStyle(() => ({
    opacity: interpolate(press.value, [0, 0.25, 1], [0, 1, 1]),
    transform: [{ scale: interpolate(press.value, [0, 1], [1.12, 1]) }, { rotate: `${interpolate(press.value, [0, 1], [-6, 0])}deg` }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ring.value === 0 ? 0 : 0.5 * (1 - ring.value),
    transform: [{ scale: interpolate(ring.value, [0, 1], [1, 1.38]) }],
  }));

  return (
    <View style={{ width: area, height: area, alignItems: 'center', justifyContent: 'center' }}>
      <Canvas style={[StyleSheet.absoluteFill, { width: area, height: area }]} pointerEvents="none">
        {SPARKLES.map((_, i) => (
          <Sparkle key={i} index={i} progress={spark} cx={area / 2} cy={area / 2} radius={size * 0.62} />
        ))}
      </Canvas>
      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', width: size, height: size, borderRadius: size * 0.2, borderWidth: 3, borderColor: color }, ringStyle]}
      />
      <Animated.View style={stampStyle}>{children}</Animated.View>
    </View>
  );
}
