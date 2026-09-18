import { Canvas, RoundedRect, rect, rrect } from '@shopify/react-native-skia';
import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

type Props = PropsWithChildren<{ size: number; color: string; locked?: boolean }>;

/** A collectable stamp: a rounded ground in the goal's colour; the render sits on it. Levels show as pips below, not as a ring. */
export function Stamp({ size, color, locked = false, children }: Props) {
  const outer = size * 0.2;
  return (
    <View style={{ width: size, height: size }}>
      <Canvas style={[StyleSheet.absoluteFill, { width: size, height: size }]}>
        <RoundedRect rect={rrect(rect(0, 0, size, size), outer, outer)} color={locked ? colors.locked : color} />
      </Canvas>
      <View style={styles.center}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
