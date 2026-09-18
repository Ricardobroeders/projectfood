import { Canvas, RoundedRect, rect, rrect } from '@shopify/react-native-skia';
import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';
import { LEVEL_COLORS, levelName } from '@/features/achievements/definitions';

type Props = PropsWithChildren<{ size: number; color: string; locked?: boolean; /** 1–4 draws the level ring in bronze, silver, gold or platinum. */ level?: number }>;

/** A collectable stamp: a rounded ground in the goal's colour; the render sits on it (no inner edge since 2026-09-18). */
export function Stamp({ size, color, locked = false, level = 0, children }: Props) {
  const outer = size * 0.2;
  const ring = Math.max(2, size * 0.06);
  return (
    <View style={{ width: size, height: size }}>
      <Canvas style={[StyleSheet.absoluteFill, { width: size, height: size }]}>
        <RoundedRect rect={rrect(rect(0, 0, size, size), outer, outer)} color={locked ? colors.locked : color} />
        {level > 0 ? (
          <RoundedRect rect={rrect(rect(ring / 2, ring / 2, size - ring, size - ring), outer - ring / 2, outer - ring / 2)} style="stroke" strokeWidth={ring} color={LEVEL_COLORS[levelName(level)]} />
        ) : null}
      </Canvas>
      <View style={styles.center}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
