import { Canvas, DashPathEffect, RoundedRect, rect, rrect } from '@shopify/react-native-skia';
import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

type Props = PropsWithChildren<{ size: number; color: string; locked?: boolean }>;

/** A collectable stamp: rounded ground with a dashed inner edge that reads as perforation. */
export function Stamp({ size, color, locked = false, children }: Props) {
  const inset = size * 0.085;
  const outer = size * 0.2;
  const inner = size * 0.14;
  return (
    <View style={{ width: size, height: size }}>
      <Canvas style={[StyleSheet.absoluteFill, { width: size, height: size }]}>
        <RoundedRect rect={rrect(rect(0, 0, size, size), outer, outer)} color={locked ? colors.locked : color} />
        <RoundedRect
          rect={rrect(rect(inset, inset, size - inset * 2, size - inset * 2), inner, inner)}
          style="stroke"
          strokeWidth={size * 0.022}
          color={locked ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.9)'}>
          <DashPathEffect intervals={[size * 0.06, size * 0.05]} />
        </RoundedRect>
      </Canvas>
      <View style={styles.center}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
