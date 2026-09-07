import { useEffect } from 'react';
import { TextInput, type TextStyle } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';

import { motion } from '@/constants/motion';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

/** A number that rolls to its new value on the UI thread (classic ReText pattern). */
export function AnimatedNumber({ value, style }: { value: number; style?: TextStyle }) {
  const sv = useSharedValue(value);

  useEffect(() => {
    sv.value = withTiming(value, motion.number); // number class
  }, [value, sv]);

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
