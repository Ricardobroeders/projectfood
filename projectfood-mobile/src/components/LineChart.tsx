import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Svg, { Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

import { colors, fonts } from '@/constants/theme';

export type LinePoint = { key: string; value: number; label?: string };

type Props = {
  points: LinePoint[];
  /** A dashed line at this value, labelled on the axis like a tick. */
  typical?: number;
  /** Height of the plot, without the date labels. */
  height?: number;
};

const LABEL_H = 18;
/** The value axis at the right, where the goal and typical numbers already sit in the bar chart. */
const AXIS_W = 30;
const PAD_TOP = 8;

/** Tick step so the axis shows 3 to 5 round numbers. */
function tickStep(max: number): number {
  for (const step of [1, 2, 5, 10, 20, 50]) if (max / step <= 5) return step;
  return 100;
}

/** A smooth curve through the points (Catmull-Rom turned into cubic beziers), which never overshoots a neighbour by much. */
function curve(xy: (readonly [number, number])[]): string {
  if (xy.length < 2) return '';
  let d = `M${xy[0][0].toFixed(1)} ${xy[0][1].toFixed(1)}`;
  for (let i = 0; i < xy.length - 1; i++) {
    const p0 = xy[Math.max(0, i - 1)];
    const p1 = xy[i];
    const p2 = xy[i + 1];
    const p3 = xy[Math.min(xy.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/**
 * Plants per day as a line (Ricardo, 2026-10-07: the day bars become a line with the typical
 * line through them; the next morning: curved, taller, with a value axis and faint grid lines).
 * A soft fill under the curve, the last point marked; every label is the app's own Text.
 */
export function LineChart({ points, typical, height = 160 }: Props) {
  const [width, setWidth] = useState(0);
  const rawMax = Math.max(typical ?? 0, ...points.map((p) => p.value), 1);
  const step = tickStep(rawMax);
  const yMax = Math.ceil(rawMax / step) * step + (rawMax % step === 0 ? 0 : 0);
  const ticks = Array.from({ length: Math.floor(yMax / step) + 1 }, (_, i) => i * step);
  const plotW = Math.max(0, width - AXIS_W);
  const stepX = points.length > 1 ? plotW / (points.length - 1) : 0;
  const y = (v: number) => PAD_TOP + (height - PAD_TOP) * (1 - v / yMax);
  const xy = points.map((p, i) => [i * stepX, y(p.value)] as const);
  const line = curve(xy);
  const area = xy.length ? `${line} L${xy[xy.length - 1][0].toFixed(1)} ${height} L0 ${height} Z` : '';
  const last = xy[xy.length - 1];

  return (
    <View style={{ height: height + LABEL_H, alignSelf: 'stretch' }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 ? (
        <Animated.View entering={FadeIn.duration(320)} style={StyleSheet.absoluteFill}>
          <Svg width={width} height={height}>
            <Defs>
              <LinearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.accent} stopOpacity={0.28} />
                <Stop offset="1" stopColor={colors.accent} stopOpacity={0.02} />
              </LinearGradient>
            </Defs>
            {ticks.map((v) => (
              <Line key={v} x1={0} x2={plotW} y1={y(v)} y2={y(v)} stroke={colors.hairline} strokeWidth={1} />
            ))}
            {typical ? <Line x1={0} x2={plotW} y1={y(typical)} y2={y(typical)} stroke={colors.ink2} strokeWidth={1} strokeDasharray="4 4" /> : null}
            <Path d={area} fill="url(#lineFill)" />
            <Path d={line} stroke={colors.accentPressed} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
            {last ? <Path d={`M${last[0]} ${last[1]} m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0`} fill={colors.accentPressed} /> : null}
          </Svg>
          {ticks.map((v) =>
            // The typical number takes the tick's place when they would overlap.
            typical && Math.abs(y(v) - y(typical)) < 12 ? null : (
              <Text key={v} pointerEvents="none" style={[styles.tick, { top: y(v) - 7 }]}>
                {v}
              </Text>
            ),
          )}
          {typical ? (
            <Text pointerEvents="none" style={[styles.tick, styles.typicalLabel, { top: y(typical) - 7 }]}>
              {typical}
            </Text>
          ) : null}
          {points.map((p, i) =>
            p.label ? (
              <Text key={p.key} numberOfLines={1} style={[styles.label, { left: i * stepX, top: height + 2 }]}>
                {p.label}
              </Text>
            ) : null,
          )}
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { position: 'absolute', width: 64, fontFamily: fonts.medium, fontSize: 11, lineHeight: 16, color: colors.ink3 },
  tick: { position: 'absolute', right: 0, width: AXIS_W - 6, textAlign: 'right', fontFamily: fonts.medium, fontSize: 11, lineHeight: 14, color: colors.ink3 },
  typicalLabel: { fontFamily: fonts.semibold, color: colors.ink2 },
});
