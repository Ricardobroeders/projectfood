import { Canvas, Circle } from '@shopify/react-native-skia';
import { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Easing, useDerivedValue, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';

const PALETTE = ['#F5C518', '#C2533D', '#4F7A3D', '#6A4880', '#3C6A60', '#F59A0E', '#7E5530'];

type Particle = { angle: number; speed: number; color: string; r: number; drift: number };

function Dot({ p, t, w, h }: { p: Particle; t: SharedValue<number>; w: number; h: number }) {
  const cx = useDerivedValue(() => w / 2 + Math.cos(p.angle) * p.speed * t.value + p.drift * t.value * t.value);
  const cy = useDerivedValue(() => h * 0.42 + Math.sin(p.angle) * p.speed * t.value + 460 * t.value * t.value);
  const opacity = useDerivedValue(() => 1 - Math.max(0, (t.value - 0.55) / 0.45));
  return <Circle cx={cx} cy={cy} r={p.r} color={p.color} opacity={opacity} />;
}

/** A single burst of confetti drawn with Skia, driven by one shared value. */
export function Confetti({ width, height, play }: { width: number; height: number; play: boolean }) {
  const t = useSharedValue(0);
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 44 }, (_, i) => ({
        angle: -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3,
        speed: 140 + Math.random() * 280,
        color: PALETTE[i % PALETTE.length],
        r: 3 + Math.random() * 5,
        drift: (Math.random() - 0.5) * 120,
      })),
    [],
  );

  useEffect(() => {
    if (play) {
      t.value = 0;
      t.value = withTiming(1, { duration: 1500, easing: Easing.out(Easing.quad) });
    }
  }, [play, t]);

  return (
    <Canvas style={[StyleSheet.absoluteFill, { width, height }]} pointerEvents="none">
      {particles.map((p, i) => (
        <Dot key={i} p={p} t={t} w={width} h={height} />
      ))}
    </Canvas>
  );
}
