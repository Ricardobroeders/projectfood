import { useEffect, useRef } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { AnimatedNumber } from '@/components/AnimatedNumber';
import { bandColor } from '@/components/GoalGauge';
import { motion, REWARD_BUMP_PEAK } from '@/constants/motion';
import { colors, fonts, radii } from '@/constants/theme';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** A jump larger than this is a refetch or another device, not a tap at the table. */
const TAP_DELTA_MAX = 2;
const RING = 18;
const STROKE = 3;
const R = (RING - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

type Props = {
  /** Distinct plants this week. */
  value: number;
  max: number;
  /** Spoken label; the chip itself stays as terse as the streak chip. */
  label: string;
};

/**
 * The week's count where the tapping happens (2026-09-23; a chip like Home's streak since
 * 2026-09-24, Ricardo: the first cut was "very different from the daily streak and a bit bulky").
 * A small ring fills in the gauge's band colour, the number rolls, and a plant that is new for
 * the week floats a +1 off the chip (reward class, nothing leaves its box). A plant already logged
 * this week moves nothing here, which is honest: the row's own check and wiggle answer that tap.
 */
export function WeekMeter({ value, max, label }: Props) {
  const done = value >= max;
  const color = done ? colors.gaugeDone : bandColor(Math.min(value, max));

  const ring = useSharedValue(Math.min(1, max > 0 ? value / max : 0));
  const bump = useSharedValue(1);
  const floatY = useSharedValue(0);
  const floatFade = useSharedValue(0);
  const delta = useSharedValue(1);
  // null until the first value is seen, so loading the week's logs is not celebrated as a tap.
  const prev = useRef<number | null>(null);

  useEffect(() => {
    ring.value = withTiming(Math.min(1, max > 0 ? value / max : 0), motion.number);
    const before = prev.current;
    prev.current = value;
    if (before === null || value <= before) return;
    bump.value = withSequence(withTiming(REWARD_BUMP_PEAK, { duration: 110, easing: Easing.out(Easing.quad) }), withSpring(1, motion.rewardSoft));
    const d = value - before;
    if (d > TAP_DELTA_MAX) return;
    delta.value = d;
    floatY.value = 0;
    floatFade.value = withSequence(withTiming(1, { duration: 120 }), withDelay(240, withTiming(0, { duration: 320 })));
    floatY.value = withTiming(-22, { duration: 680, easing: Easing.out(Easing.cubic) });
  }, [value, max, ring, bump, floatY, floatFade, delta]);

  const chipStyle = useAnimatedStyle(() => ({ transform: [{ scale: bump.value }] }));
  const ringProps = useAnimatedProps(() => ({ strokeDashoffset: CIRCUMFERENCE * (1 - ring.value) }));
  const floatStyle = useAnimatedStyle(() => ({ opacity: floatFade.value, transform: [{ translateY: floatY.value }] }));
  const floatProps = useAnimatedProps(() => {
    const text = `+${Math.round(delta.value)}`;
    return { text, defaultValue: text };
  });

  return (
    <View>
      <Animated.View style={[styles.float, floatStyle]} pointerEvents="none">
        <AnimatedTextInput editable={false} underlineColorAndroid="transparent" animatedProps={floatProps} style={styles.floatText} />
      </Animated.View>
      <Animated.View style={[styles.chip, chipStyle]} accessibilityLabel={`${value} / ${max} ${label}`}>
        <Svg width={RING} height={RING}>
          <Circle cx={RING / 2} cy={RING / 2} r={R} stroke={colors.hairline} strokeWidth={STROKE} fill="none" />
          <AnimatedCircle
            cx={RING / 2}
            cy={RING / 2}
            r={R}
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            animatedProps={ringProps}
            transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
          />
        </Svg>
        <View style={styles.row}>
          <AnimatedNumber value={value} style={styles.count} />
          <Text style={styles.max}>/{max}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Same chip as the streak on Home: 36 high, small radius, the soft accent.
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingHorizontal: 12, borderRadius: radii.sm, backgroundColor: colors.accentSoft },
  row: { flexDirection: 'row', alignItems: 'baseline' },
  count: { minWidth: 18, textAlign: 'right', fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: colors.ink },
  max: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: colors.ink },
  float: { position: 'absolute', left: 0, right: 0, top: -8, alignItems: 'center' },
  floatText: { padding: 0, margin: 0, includeFontPadding: false, fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, color: colors.success, textAlign: 'center' },
});
