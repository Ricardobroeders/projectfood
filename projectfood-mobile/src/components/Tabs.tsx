import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, fonts } from '@/constants/theme';

export type Tab<K extends string> = { key: K; label: string };

/** Figma "ui components" (2026-09-14): 16px labels 28 apart, a 2px hairline, a 36×3 indicator under the active label. */
const INDICATOR_W = 36;
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
  const shown = useSharedValue(0);

  const place = (animated: boolean) => {
    const l = layouts.current[value];
    if (!l) return;
    const target = l.x + (l.width - INDICATOR_W) / 2;
    if (animated && shown.value) x.value = withTiming(target, { duration: 220, easing: Easing.out(Easing.cubic) });
    else x.value = target;
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
    layouts.current[key] = { x: e.nativeEvent.layout.x, width: e.nativeEvent.layout.width };
    if (key === value) place(false);
  };
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.current = e.nativeEvent.contentOffset.x;
  };

  const indicator = useAnimatedStyle(() => ({ opacity: shown.value, transform: [{ translateX: x.value }] }));

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

const styles = StyleSheet.create({
  wrap: { height: HEIGHT },
  line: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, backgroundColor: colors.hairline },
  row: { paddingHorizontal: PAD, gap: GAP, alignItems: 'flex-end', minHeight: HEIGHT },
  tab: { paddingBottom: 8, justifyContent: 'flex-end' },
  label: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 22, color: colors.ink2 },
  labelActive: { fontFamily: fonts.bold, color: colors.accent },
  indicator: { position: 'absolute', left: 0, bottom: 0, width: INDICATOR_W, height: 3, borderRadius: 1.5, backgroundColor: colors.accent },
});
