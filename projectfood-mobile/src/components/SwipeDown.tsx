import { useMemo, type PropsWithChildren } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector, type NativeGesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { motion } from '@/constants/motion';

/** Finger travel before a drag counts as a swipe. */
const SLOP = 14;
/** Past this the surface is let go on release whatever the speed; a flick lets go sooner. */
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 900;

type Opts = {
  /** The vertical offset the gesture drives; 0 = at rest, never above it. */
  y: SharedValue<number>;
  /** Scroll offset of a scroll view inside; the swipe only starts while that content sits at the top. */
  scrollY?: SharedValue<number>;
  /**
   * The scroll view inside, as a native gesture, so the swipe runs alongside it. Without this the
   * scroll claims any vertical drag after Android's 8 px slop and the swipe never gets its 14.
   */
  scrollGesture?: NativeGesture;
  onDismiss: () => void;
};

/**
 * A downward pan that dismisses (Ricardo, 2026-09-24: a surface that slides in from the bottom
 * asks to be swiped back down). The surface follows the finger; on release it is let go past a
 * distance or on a flick, otherwise it settles back in the sheet class, no bounce. Activation is
 * manual so a scroll view inside keeps its own drags: the swipe takes over only when the content
 * is at the top and the finger moves down more than sideways.
 */
export function useSwipeDown({ y, scrollY, scrollGesture, onDismiss }: Opts) {
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const base = useSharedValue(0);
  const inner = scrollY ?? null;
  return useMemo(() => {
    const pan = Gesture.Pan()
        .manualActivation(true)
        .onTouchesDown((e) => {
          startX.value = e.allTouches[0].x;
          startY.value = e.allTouches[0].y;
        })
        .onTouchesMove((e, state) => {
          const t = e.allTouches[0];
          const dy = t.y - startY.value;
          const dx = Math.abs(t.x - startX.value);
          if ((inner && inner.value > 0) || dy < -SLOP || (dx > SLOP && dx > dy)) state.fail();
          else if (dy > SLOP && dy > dx) {
            base.value = dy;
            state.activate();
          }
        })
        .onUpdate((e) => {
          y.value = Math.max(0, e.translationY - base.value);
        })
        .onEnd((e) => {
          if (y.value > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY) scheduleOnRN(onDismiss);
          else y.value = withTiming(0, motion.sheetIn);
        });
    return scrollGesture ? pan.simultaneousWithExternalGesture(scrollGesture) : pan;
  }, [y, inner, scrollGesture, onDismiss, startX, startY, base]);
}

type Props = PropsWithChildren<{ onDismiss: () => void; scrollY?: SharedValue<number>; scrollGesture?: NativeGesture; style?: StyleProp<ViewStyle> }>;

/** A full screen that can be swiped down to leave; the modal plant page uses it. */
export function SwipeDown({ onDismiss, scrollY, scrollGesture, style, children }: Props) {
  const y = useSharedValue(0);
  const pan = useSwipeDown({ y, scrollY, scrollGesture, onDismiss });
  const drag = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.fill, style, drag]}>{children}</Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
