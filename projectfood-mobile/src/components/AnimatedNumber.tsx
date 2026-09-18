import { useEffect } from 'react';
import { TextInput, type TextStyle } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming, type WithTimingConfig } from 'react-native-reanimated';

import { motion } from '@/constants/motion';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type Props = {
  value: number;
  /** Start here on mount instead of at `value` (e.g. 0 to count up when a screen opens). */
  from?: number;
  /** Timing class; the number class by default, the fill class next to a gauge. */
  timing?: WithTimingConfig;
  style?: TextStyle;
};

/** A number that rolls to its new value on the UI thread (classic ReText pattern). */
export function AnimatedNumber({ value, from, timing = motion.number, style }: Props) {
  const sv = useSharedValue(from ?? value);

  useEffect(() => {
    sv.value = withTiming(value, timing);
  }, [value, sv, timing]);

  const animatedProps = useAnimatedProps(() => {
    const text = String(Math.round(sv.value));
    return { text, defaultValue: text };
  });

  return (
    <AnimatedTextInput
      editable={false}
      underlineColorAndroid="transparent"
      animatedProps={animatedProps}
      style={[{ padding: 0, margin: 0, includeFontPadding: false } as TextStyle, style]}
    />
  );
}
