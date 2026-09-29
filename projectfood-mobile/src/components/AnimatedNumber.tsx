import { useEffect, useState } from 'react';
import { Text, type TextStyle } from 'react-native';
import { useAnimatedReaction, useSharedValue, withTiming, type WithTimingConfig } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { motion } from '@/constants/motion';

type Props = {
  value: number;
  /** Start here on mount instead of at `value` (e.g. 0 to count up when a screen opens). */
  from?: number;
  /** Timing class; the number class by default, the fill class next to a gauge. */
  timing?: WithTimingConfig;
  style?: TextStyle;
};

/**
 * A number that rolls to its new value. The shared value animates on the UI thread and only
 * hands a new integer back to React when it changes, so a roll from 0 to 30 is thirty cheap
 * re-renders of one Text. It used to be the ReText pattern (an editable=false TextInput fed
 * through animatedProps); iOS 26 draws a TextInput's text low in its box, which put the "0" of
 * the week chip under the "/30" (Ricardo, 2026-09-29), and a plain Text sits on the same
 * baseline as its neighbours everywhere.
 */
export function AnimatedNumber({ value, from, timing = motion.number, style }: Props) {
  const sv = useSharedValue(from ?? value);
  const [shown, setShown] = useState(Math.round(from ?? value));

  useEffect(() => {
    sv.value = withTiming(value, timing);
  }, [value, sv, timing]);

  useAnimatedReaction(
    () => Math.round(sv.value),
    (next, prev) => {
      if (next !== prev) scheduleOnRN(setShown, next);
    },
  );

  return <Text style={style}>{String(shown)}</Text>;
}
