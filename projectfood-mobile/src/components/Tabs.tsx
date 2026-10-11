import * as Haptics from 'expo-haptics';
import { type PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
import { type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent, Pressable, ScrollView, type StyleProp, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { colors, fonts } from '@/constants/theme';

export type Tab<K extends string> = { key: K; label: string };

/** Figma "ui components" (2026-09-14): 16px labels 28 apart, a 2px hairline, a 3px indicator under the active label. */
const GAP = 28;
const PAD = 20;
const HEIGHT = 44;

type Props<K extends string> = { tabs: Tab<K>[]; value: K; onChange: (key: K) => void };

/** Underline tabs that scroll horizontally. The indicator slides between labels; the active label scrolls into view. */
export function Tabs<K extends string>({ tabs, value, onChange }: Props<K>) {
  const scroll = useRef<ScrollView>(null);
  const layouts = useRef<Partial<Record<K, { x: number; width: number }>>>({});
  const scrollX = useRef(0);
  const [viewWidth, setViewWidth] = useState(0);
  const x = useSharedValue(0);
  /** The indicator is exactly as wide as the word above it (Ricardo, 2026-09-27), so it grows and
   *  shrinks between tabs instead of sliding a fixed bar. */
  const w = useSharedValue(0);
  const shown = useSharedValue(0);

  const place = (animated: boolean) => {
    const l = layouts.current[value];
    if (!l) return;
    const slide = { duration: 220, easing: Easing.out(Easing.cubic) };
    if (animated && shown.value) {
      x.value = withTiming(l.x, slide);
      w.value = withTiming(l.width, slide);
    } else {
      x.value = l.x;
      w.value = l.width;
    }
    shown.value = 1;
    if (!viewWidth) return;
    const left = l.x - scrollX.current;
    const right = left + l.width;
    if (left < PAD) scroll.current?.scrollTo({ x: Math.max(0, l.x - PAD), animated });
    else if (right > viewWidth - PAD) scroll.current?.scrollTo({ x: l.x + l.width - viewWidth + PAD, animated });
  };

  useEffect(() => {
    place(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, viewWidth]);

  const onLabelLayout = (key: K) => (e: LayoutChangeEvent) => {
    const first = !layouts.current[key];
    layouts.current[key] = { x: e.nativeEvent.layout.x, width: e.nativeEvent.layout.width };
    // The first measurement places the bar without motion; a re-measure animates, because the active
    // label is bold and so wider than it was when it was measured in medium.
    if (key === value) place(!first);
  };
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.current = e.nativeEvent.contentOffset.x;
  };

  const indicator = useAnimatedStyle(() => ({ opacity: shown.value, width: w.value, transform: [{ translateX: x.value }] }));

  return (
    <View style={styles.wrap} onLayout={(e) => setViewWidth(e.nativeEvent.layout.width)}>
      <View style={styles.line} />
      <ScrollView
        ref={scroll}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={32}
        contentContainerStyle={styles.row}>
        {tabs.map((tab) => {
          const active = tab.key === value;
          return (
            <Pressable
              key={tab.key}
              onLayout={onLabelLayout(tab.key)}
              onPress={() => {
                if (active) return;
                Haptics.selectionAsync();
                onChange(tab.key);
              }}
              style={styles.tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}>
              <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
        <Animated.View pointerEvents="none" style={[styles.indicator, indicator]} />
      </ScrollView>
    </View>
  );
}

/** Finger travel before a sideways drag counts as a swipe; a vertical drag past it is a scroll. */
const SWIPE_SLOP = 14;
/** Past this the tab changes on release whatever the speed; a flick changes it sooner. */
const SWITCH_DISTANCE = 72;
const SWITCH_VELOCITY = 700;

type PaneProps<K extends string> = PropsWithChildren<Props<K> & { style?: StyleProp<ViewStyle> }>;

/**
 * The content under a tab strip, swipeable sideways to the neighbouring tab (Ricardo, 2026-10-11:
 * skim the categories without reaching up to the strip). Activation is manual so a list inside
 * keeps its vertical drags and its taps and holds: the swipe takes over only once the finger has
 * moved sideways more than up or down. The strip's indicator slides as it does on a tap; the
 * content itself does not move, so the Log list's deferred render stays as it is.
 */
export function TabPane<K extends string>({ tabs, value, onChange, style, children }: PaneProps<K>) {
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const index = tabs.findIndex((tab) => tab.key === value);
  const prev = index > 0 ? tabs[index - 1].key : null;
  const next = index >= 0 && index < tabs.length - 1 ? tabs[index + 1].key : null;
  const go = (key: K | null) => {
    if (key === null) return;
    Haptics.selectionAsync();
    onChange(key);
  };
  const pan = useMemo(
    () =>
      Gesture.Pan()
        .manualActivation(true)
        .onTouchesDown((e) => {
          startX.value = e.allTouches[0].x;
          startY.value = e.allTouches[0].y;
        })
        .onTouchesMove((e, state) => {
          const t = e.allTouches[0];
          const dx = Math.abs(t.x - startX.value);
          const dy = Math.abs(t.y - startY.value);
          if (dy > SWIPE_SLOP && dy >= dx) state.fail();
          else if (dx > SWIPE_SLOP && dx > dy) state.activate();
        })
        .onEnd((e) => {
          const far = Math.abs(e.translationX) > SWITCH_DISTANCE || Math.abs(e.velocityX) > SWITCH_VELOCITY;
          if (!far) return;
          // Finger to the left pulls the next tab in; to the right, the previous one.
          scheduleOnRN(go, e.translationX < 0 ? next : prev);
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prev, next, onChange, startX, startY],
  );
  return (
    <GestureDetector gesture={pan}>
      <View style={style}>{children}</View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrap: { height: HEIGHT },
  line: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, backgroundColor: colors.hairline },
  row: { paddingHorizontal: PAD, gap: GAP, alignItems: 'flex-end', minHeight: HEIGHT },
  tab: { paddingBottom: 8, justifyContent: 'flex-end' },
  label: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 22, color: colors.ink2 },
  labelActive: { fontFamily: fonts.bold, color: colors.accent },
  indicator: { position: 'absolute', left: 0, bottom: 0, height: 3, borderRadius: 1.5, backgroundColor: colors.accent },
});
