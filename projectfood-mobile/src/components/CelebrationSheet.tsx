import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useCallback, useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { Stamp } from '@/components/Stamp';
import { StampPress } from '@/components/StampPress';
import { STAMP_META } from '@/components/StampShelf';
import { motion } from '@/constants/motion';
import { CATS, colors, fonts, radii } from '@/constants/theme';
import { PLANT_BY_SLUG } from '@/data/plants';
import { useStore } from '@/state/store';

const HIDDEN_Y = 640;
const STAMP_SIZE = 132;

export function CelebrationSheet() {
  const { celebration, card, checked, locale, t, dispatch } = useStore();
  const insets = useSafeAreaInsets();
  const visible = celebration === 'first_bites';

  const backdrop = useSharedValue(0);
  const slide = useSharedValue(HIDDEN_Y);

  useEffect(() => {
    if (visible) {
      // sheet class: ease out, no overshoot. The stamp inside is the reward.
      backdrop.value = withTiming(1, motion.backdrop);
      slide.value = withTiming(0, motion.sheetIn);
    } else {
      backdrop.value = 0;
      slide.value = HIDDEN_Y;
    }
  }, [visible, backdrop, slide]);

  const onLanded = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, []);

  /** Slide the sheet out first, then let the store close the modal. */
  const close = useCallback(
    (then: 'dismissCelebration' | 'showCard') => {
      backdrop.value = withTiming(0, motion.backdrop);
      slide.value = withTiming(HIDDEN_Y, motion.sheetOut, (finished) => {
        if (finished) scheduleOnRN(dispatch, { type: then });
      });
    },
    [backdrop, slide, dispatch],
  );

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: slide.value }] }));

  const plant = card ? PLANT_BY_SLUG[card] : null;
  const tasted = checked.slice(0, 3).map((s) => PLANT_BY_SLUG[s]).filter(Boolean);

  return (
    <Modal visible={visible} transparent statusBarTranslucent animationType="none" onRequestClose={() => close('dismissCelebration')}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => close('dismissCelebration')} />
        </Animated.View>
        <Animated.View style={[styles.sheet, { paddingBottom: 20 + insets.bottom }, sheetStyle]}>
          <View style={styles.handle} />
          <StampPress size={STAMP_SIZE} color={STAMP_META.first_bites.color} play={visible} onLanded={onLanded}>
            <Stamp size={STAMP_SIZE} color={STAMP_META.first_bites.color}>
              {plant ? <Image source={plant.image} style={styles.stampImage} contentFit="contain" /> : null}
            </Stamp>
          </StampPress>
          <Text style={styles.title}>{t.firstBitesTitle}</Text>
          <Text style={styles.body}>{t.firstBitesBody}</Text>
          {visible ? (
            <View style={styles.tasted}>
              {tasted.map((p, i) => (
                <Animated.View
                  key={p.slug}
                  entering={FadeInDown.delay(560 + i * 90).duration(320)}
                  style={[styles.tastedTile, { backgroundColor: CATS[p.category].bg }]}
                  accessibilityLabel={p.name[locale]}>
                  <Image source={p.image} style={styles.tastedImage} contentFit="contain" />
                </Animated.View>
              ))}
              <Animated.View entering={FadeInDown.delay(560 + tasted.length * 90).duration(320)} style={styles.bonus}>
                <Text style={styles.bonusText}>{t.bonus}</Text>
              </Animated.View>
            </View>
          ) : null}
          <Pressable style={({ pressed }) => [styles.primary, pressed && { backgroundColor: colors.accentPressed }]} onPress={() => close('showCard')}>
            <Text style={styles.primaryText}>{t.showCard}</Text>
          </Pressable>
          <Pressable style={styles.secondary} onPress={() => close('dismissCelebration')}>
            <Text style={styles.secondaryText}>{t.later}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(31,27,22,0.32)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: 'center',
    gap: 8,
  },
  handle: { width: 40, height: 4, borderRadius: radii.full, backgroundColor: colors.hairline, marginBottom: 2 },
  stampImage: { width: 88, height: 88 },
  title: { fontFamily: fonts.extrabold, fontSize: 28, lineHeight: 34, color: colors.ink, textAlign: 'center' },
  body: { fontFamily: fonts.medium, fontSize: 16, color: colors.ink2, textAlign: 'center', lineHeight: 22, maxWidth: 300 },
  tasted: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, height: 52 },
  tastedTile: { width: 52, height: 52, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  tastedImage: { width: 36, height: 36 },
  bonus: { backgroundColor: colors.accentSoft, borderRadius: radii.sm, paddingHorizontal: 12, height: 32, justifyContent: 'center', marginLeft: 4 },
  bonusText: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 18, color: colors.ink },
  primary: {
    alignSelf: 'stretch',
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  primaryText: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 22, color: colors.onAccent },
  secondary: { paddingVertical: 12 },
  secondaryText: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink2 },
});
