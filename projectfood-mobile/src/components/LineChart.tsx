import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Svg, { Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

import { colors, fonts } from '@/constants/theme';

export type LinePoint = { key: string; value: number; label?: string };

type Props = {
  points: LinePoint[];
  /** A dashed line at this value with the number at its right end. */
  typical?: number;
  /** Height of the plot, without the date labels. */
  height?: number;
};

const LABEL_H = 18;
const GUTTER = 28;
const PAD_TOP = 6;

/**
 * Plants per day as a line (Ricardo, 2026-10-07: the day bars become a line with the typical
 * line through them). Straight segments, a soft fill under the line, the last point marked; the
 * date labels are the app's own Text, not SVG text.
 */
export function LineChart({ points, typical, height = 120 }: Props) {
  const [width, setWidth] = useState(0);
  const yMax = Math.max(typical ?? 0, ...points.map((p) => p.value), 1) * 1.08;
  const plotW = Math.max(0, width - GUTTER);
  const stepX = points.length > 1 ? plotW / (points.length - 1) : 0;
  const y = (v: number) => PAD_TOP + (height - PAD_TOP) * (1 - v / yMax);
  const xy = points.map((p, i) => [i * stepX, y(p.value)] as const);
  const line = xy.map(([x, yy], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${yy.toFixed(1)}`).join(' ');
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
            {typical ? <Line x1={0} x2={plotW} y1={y(typical)} y2={y(typical)} stroke={colors.ink2} strokeWidth={1} strokeDasharray="4 4" /> : null}
            <Path d={area} fill="url(#lineFill)" />
            <Path d={line} stroke={colors.accentPressed} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
            {last ? <Path d={`M${last[0]} ${last[1]} m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0`} fill={colors.accentPressed} /> : null}
          </Svg>
          {typical ? (
            <Text pointerEvents="none" style={[styles.typicalLabel, { top: y(typical) - 8 }]}>
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
  typicalLabel: { position: 'absolute', right: 0, fontFamily: fonts.semibold, fontSize: 11, lineHeight: 14, color: colors.ink2 },
});
