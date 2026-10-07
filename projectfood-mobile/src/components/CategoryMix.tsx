import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { motion } from '@/constants/motion';
import { type Category, CATS, colors, fonts } from '@/constants/theme';

export type MixRow = {
  category: Category;
  label: string;
  /** Share of everything logged, 0 to 100. */
  share: number;
  /** The typical household's share, drawn as a mark on the track. */
  typical: number;
};

const TRACK_H = 12;
/** Nearly square ends (Ricardo, 2026-10-07): full rounding hid whether the bar reached the mark. */
const RADIUS = 3;

/**
 * Your mix by category against the typical household (brainstorm 25, Ricardo 2026-10-07: a
 * horizontal bar per category, not a donut). The bar is yours, the mark is everyone's middle;
 * no verdict, no colour for above or below. Bars grow once on mount with the `fill` class.
 */
export function CategoryMix({ rows }: { rows: MixRow[] }) {
  const grow = useSharedValue(0);
  useEffect(() => {
    grow.value = withTiming(1, motion.fill);
  }, [grow]);
  // One scale for every row, so a 40 % bar is twice a 20 % bar; a little headroom past the longest.
  const max = Math.max(...rows.map((r) => Math.max(r.share, r.typical)), 1) * 1.1;
  return (
    <View style={styles.root}>
      {rows.map((r) => (
        <Row key={r.category} row={r} max={max} grow={grow} />
      ))}
    </View>
  );
}

function Row({ row, max, grow }: { row: MixRow; max: number; grow: SharedValue<number> }) {
  const fill = useAnimatedStyle(() => ({ width: `${(row.share / max) * 100 * grow.value}%` }));
  return (
    <View style={styles.row}>
      <Text style={styles.label} numberOfLines={1}>
        {row.label}
      </Text>
      <View style={styles.barRow}>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { backgroundColor: CATS[row.category].fg }, fill]} />
          <View pointerEvents="none" style={[styles.mark, { left: `${(row.typical / max) * 100}%` }]} />
        </View>
        <Text style={styles.value}>{Math.round(row.share)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 10 },
  // The label on its own line, so the track gets the full width (Ricardo, 2026-10-07).
  row: { gap: 2 },
  label: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 16, color: colors.ink2 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  track: { flex: 1, height: TRACK_H, borderRadius: RADIUS, backgroundColor: colors.surface, overflow: 'visible' },
  fill: { height: TRACK_H, borderRadius: RADIUS },
  // The typical mark stands 4 px proud of the track on both sides, so it reads above a bar of the same length.
  mark: { position: 'absolute', top: -4, width: 2, height: TRACK_H + 8, marginLeft: -1, borderRadius: 1, backgroundColor: colors.typical },
  value: { width: 36, textAlign: 'right', fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: colors.ink },
});
