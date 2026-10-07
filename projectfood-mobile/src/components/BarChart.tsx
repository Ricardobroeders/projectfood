import { useEffect } from 'react';
import { type StyleProp, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { motion } from '@/constants/motion';
import { colors, fonts } from '@/constants/theme';

export type Bar = {
  key: string;
  value: number;
  color: string;
  /** Text under the bar. Most bars leave it empty so the row stays readable. */
  label?: string;
  /** Drawn lighter: a period that is still running (this week). */
  muted?: boolean;
  /** Only the column, no bar: a day that has not come yet. */
  future?: boolean;
};

type Props = {
  bars: Bar[];
  /** A line at this value with the number at its right end; the scale never drops below it. */
  goal?: number;
  /** A dashed line at this value: the typical household (brainstorm 25). Drawn like the goal, lighter. */
  typical?: number;
  /** Height of the bar area, without the value and date labels. */
  height?: number;
  /** The value above each bar; only for rows with a dozen bars or fewer. */
  showValues?: boolean;
  /** Where a label sits: centred under its bar (weeks) or starting at the bar's left edge (a Monday among days). */
  labelAlign?: 'center' | 'start';
  style?: StyleProp<ViewStyle>;
};

/** A bar with value 0 still shows as a stub, so a quiet week is a mark, not a hole. */
const STUB = 3;
const LABEL_H = 18;
const VALUE_H = 16;
/** Room for the goal number at the right end of its line. */
const GOAL_GUTTER = 28;

/**
 * The stats screen's two charts (2026-09-30, the PWA's "Weekly history" brought over): plain
 * views, no SVG text, so the labels use the app's own font. The bars grow once on mount with the
 * `fill` class, the same motion as Home's gauge; nothing here bounces.
 */
export function BarChart({ bars, goal, typical, height = 140, showValues = false, labelAlign = 'center', style }: Props) {
  const grow = useSharedValue(0);
  useEffect(() => {
    grow.value = withTiming(1, motion.fill);
  }, [grow]);

  const headroom = showValues ? VALUE_H : 4;
  const yMax = Math.max(goal ?? 0, typical ?? 0, ...bars.map((b) => b.value), 1);
  const barMaxH = height - headroom;
  const goalBottom = goal ? LABEL_H + (goal / yMax) * barMaxH : 0;
  const typicalBottom = typical ? LABEL_H + (typical / yMax) * barMaxH : 0;
  const gutter = goal || typical ? GOAL_GUTTER : 0;

  return (
    <View style={[styles.root, { height: height + LABEL_H }, style]}>
      {goal ? (
        <>
          <View pointerEvents="none" style={[styles.goalLine, { bottom: goalBottom, right: gutter }]} />
          <Text pointerEvents="none" style={[styles.goalLabel, { bottom: goalBottom + 2 }]}>
            {goal}
          </Text>
        </>
      ) : null}
      {typical ? (
        <>
          <View pointerEvents="none" style={[styles.typicalLine, { bottom: typicalBottom, right: gutter }]} />
          <Text pointerEvents="none" style={[styles.typicalLabel, { bottom: typicalBottom - 6 }]}>
            {typical}
          </Text>
        </>
      ) : null}
      <View style={[styles.columns, { paddingRight: gutter, gap: bars.length > 14 ? 3 : 6 }]}>
        {bars.map((b) => (
          <Column key={b.key} bar={b} height={barMaxH * (b.value / yMax)} grow={grow} showValue={showValues} labelAlign={labelAlign} />
        ))}
      </View>
    </View>
  );
}

function Column({ bar, height, grow, showValue, labelAlign }: { bar: Bar; height: number; grow: SharedValue<number>; showValue: boolean; labelAlign: 'center' | 'start' }) {
  const barStyle = useAnimatedStyle(() => ({ height: Math.max(STUB, height * grow.value) }));
  return (
    <View style={styles.column}>
      {showValue && bar.value > 0 ? <Text style={styles.value}>{bar.value}</Text> : null}
      {bar.future ? (
        <View style={{ height: STUB }} />
      ) : bar.value > 0 ? (
        <Animated.View style={[styles.bar, { backgroundColor: bar.color, opacity: bar.muted ? 0.55 : 1 }, barStyle]} />
      ) : (
        <View style={[styles.bar, { height: STUB, backgroundColor: colors.hairline }]} />
      )}
      <View style={styles.labelSlot}>
        {bar.label ? (
          <Text numberOfLines={1} style={[styles.label, labelAlign === 'center' ? styles.labelCenter : styles.labelStart]}>
            {bar.label}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignSelf: 'stretch' },
  columns: { flex: 1, flexDirection: 'row', alignItems: 'flex-end' },
  column: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar: { alignSelf: 'stretch', borderRadius: 3 },
  value: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: VALUE_H, color: colors.ink2 },
  labelSlot: { height: LABEL_H, alignSelf: 'stretch' },
  label: { position: 'absolute', bottom: 0, fontFamily: fonts.medium, fontSize: 11, lineHeight: 16, color: colors.ink3 },
  labelCenter: { left: -24, right: -24, textAlign: 'center' },
  labelStart: { left: 0, width: 64, textAlign: 'left' },
  goalLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: colors.ink3, opacity: 0.6 },
  typicalLine: { position: 'absolute', left: 0, right: 0, height: 0, borderTopWidth: 1, borderStyle: 'dashed', borderColor: colors.ink2, borderRadius: 1 },
  typicalLabel: { position: 'absolute', right: 0, fontFamily: fonts.semibold, fontSize: 11, lineHeight: 14, color: colors.ink2 },
  goalLabel: { position: 'absolute', right: 0, fontFamily: fonts.semibold, fontSize: 11, lineHeight: 14, color: colors.ink2 },
});
