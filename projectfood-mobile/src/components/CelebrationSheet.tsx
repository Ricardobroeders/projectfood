import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Confetti } from '@/components/Confetti';
import { Stamp } from '@/components/Stamp';
import { STAMP_META } from '@/components/StampShelf';
import { colors, fonts, radii, shadows } from '@/constants/theme';
import { PLANT_BY_SLUG } from '@/data/plants';
import { useStore } from '@/state/store';

export function CelebrationSheet() {
  const { celebration, card, t, dispatch } = useStore();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const visible = celebration === 'first_bites';

  const backdrop = useSharedValue(0);
  const slide = useSharedValue(600);
  const pop = useSharedValue(0.4);

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      backdrop.value = withTiming(1, { duration: 220 });
      slide.value = withSpring(0, { damping: 18, stiffness: 160 });
      pop.value = withDelay(180, withSpring(1, { damping: 7, stiffness: 170 }));
    } else {
      backdrop.value = 0;
      slide.value = 600;
      pop.value = 0.4;
    }
  }, [visible, backdrop, slide, pop]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: slide.value }] }));
  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));

  const plant = card ? PLANT_BY_SLUG[card] : null;

  return (
    <Modal visible={visible} transparent statusBarTranslucent animationType="none" onRequestClose={() => dispatch({ type: 'dismissCelebration' })}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => dispatch({ type: 'dismissCelebration' })} />
        </Animated.View>
        <Confetti width={width} height={height} play={visible} />
        <Animated.View style={[styles.sheet, shadows.lg, { paddingBottom: 20 + insets.bottom }, sheetStyle]}>
          <View style={styles.handle} />
          <Animated.View style={[styles.stampWrap, popStyle]}>
            <Stamp size={132} color={STAMP_META.first_bites.color}>
              {plant ? <Image source={plant.image} style={styles.stampImage} contentFit="contain" /> : null}
            </Stamp>
          </Animated.View>
          <Text style={styles.title}>{t.firstBitesTitle}</Text>
          <Text style={styles.body}>{t.firstBitesBody}</Text>
          <View style={styles.bonus}>
            <Text style={styles.bonusText}>{t.bonus}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.primary, pressed && { backgroundColor: colors.accentPressed }]}
            onPress={() => dispatch({ type: 'showCard' })}>
            <Text style={styles.primaryText}>{t.showCard}</Text>
          </Pressable>
          <Pressable style={styles.secondary} onPress={() => dispatch({ type: 'dismissCelebration' })}>
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
    gap: 10,
  },
  handle: { width: 40, height: 4, borderRadius: radii.full, backgroundColor: colors.bgSoft, marginBottom: 10 },
  stampWrap: { marginBottom: 6 },
  stampImage: { width: 88, height: 88 },
  title: { fontFamily: fonts.extrabold, fontSize: 28, color: colors.ink, textAlign: 'center' },
  body: { fontFamily: fonts.medium, fontSize: 16, color: colors.ink2, textAlign: 'center', lineHeight: 22, maxWidth: 300 },
  bonus: { backgroundColor: colors.accentSoft, borderRadius: radii.full, paddingHorizontal: 14, paddingVertical: 6, marginTop: 4 },
  bonusText: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  primary: {
    alignSelf: 'stretch',
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryText: { fontFamily: fonts.bold, fontSize: 17, color: colors.ink },
  secondary: { paddingVertical: 12 },
  secondaryText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink2 },
});
