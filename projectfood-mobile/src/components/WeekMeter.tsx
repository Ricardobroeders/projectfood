import { useEffect, useRef } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { AnimatedNumber } from '@/components/AnimatedNumber';
import { bandColor } from '@/components/GoalGauge';
import { ProgressBar } from '@/components/ProgressBar';
import { motion, REWARD_BUMP_PEAK } from '@/constants/motion';
import { colors, fonts, radii } from '@/constants/theme';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

/** A jump larger than this is a refetch or another device, not a tap at the table. */
const TAP_DELTA_MAX = 2;

type Props = {
  /** Distinct plants this week. */
  value: number;
  max: number;
  /** Caption under the bar; "This week". */
  label: string;
};

/**
 * The week's count where the tapping happens (2026-09-23). The Log screen showed nothing
 * accumulating — the gauge lives on Home, one screen away — so a dinner of five taps moved
 * nothing on screen. The number rolls, the bar steps in the gauge's band colour, and a plant
 * that is new for the week floats a +1 off the pill (reward class, nothing leaves its box).
 * A plant already logged this week moves nothing here, which is honest: the row's own check and
 * wiggle are the answer to that tap.
 */
export function WeekMeter({ value, max, label }: Props) {
  const done = value >= max;
  const color = done ? colors.gaugeDone : bandColor(Math.min(value, max));

  const bump = useSharedValue(1);
  const floatY = useSharedValue(0);
  const floatFade = useSharedValue(0);
  const delta = useSharedValue(1);
  // null until the first value is seen, so loading the week's logs is not celebrated as a tap.
  const prev = useRef<number | null>(null);

  useEffect(() => {
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
  }, [value, bump, floatY, floatFade, delta]);

  const pillStyle = useAnimatedStyle(() => ({ transform: [{ scale: bump.value }] }));
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
      <Animated.View style={[styles.pill, pillStyle]} accessibilityLabel={`${value} / ${max} ${label}`}>
        <View style={styles.row}>
          <AnimatedNumber value={value} style={styles.count} />
          <Text style={styles.max}>/{max}</Text>
        </View>
        <ProgressBar value={value} max={max} height={4} color={color} style={{ marginTop: 6 }} />
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { width: 104, borderRadius: radii.md, backgroundColor: colors.bgSoft, paddingHorizontal: 12, paddingVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' },
  count: { width: 34, textAlign: 'right', fontFamily: fonts.extrabold, fontSize: 22, lineHeight: 26, color: colors.ink, letterSpacing: -0.5 },
  max: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: colors.ink3 },
  label: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 15, color: colors.ink3, textAlign: 'center', marginTop: 4 },
  float: { position: 'absolute', left: 0, right: 0, top: -6, alignItems: 'center' },
  floatText: { padding: 0, margin: 0, includeFontPadding: false, fontFamily: fonts.bold, fontSize: 16, lineHeight: 20, color: colors.success, textAlign: 'center' },
});
