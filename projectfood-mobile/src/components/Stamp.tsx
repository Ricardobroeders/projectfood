import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

type Props = PropsWithChildren<{ size: number; color: string; locked?: boolean }>;

/** A collectable stamp: a rounded ground in the goal's colour; the render sits on it. Levels show as pips below, not as a ring. */
export function Stamp({ size, color, locked = false, children }: Props) {
  return <View style={[styles.ground, { width: size, height: size, borderRadius: size * 0.2, backgroundColor: locked ? colors.locked : color }]}>{children}</View>;
}

const styles = StyleSheet.create({
  ground: { alignItems: 'center', justifyContent: 'center' },
});
