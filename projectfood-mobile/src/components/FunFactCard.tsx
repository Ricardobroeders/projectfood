import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';

import { Stamp } from '@/components/Stamp';
import { STAMP_META } from '@/components/StampShelf';
import { CATS, colors, fonts, radii, shadows } from '@/constants/theme';
import { PLANT_BY_SLUG } from '@/data/plants';
import { useStore } from '@/state/store';

const CARD_W = 300;
const CARD_H = 420;

export function FunFactCard() {
  const { card, cardVisible, cardOpened, locale, t, dispatch } = useStore();
  const rotation = useSharedValue(0);
  const badge = useSharedValue(0);
  const enter = useSharedValue(0);

  useEffect(() => {
    if (cardVisible) {
      rotation.value = cardOpened ? 180 : 0;
      badge.value = cardOpened ? 1 : 0;
      enter.value = 0;
      enter.value = withSpring(1, { damping: 14, stiffness: 150 });
    }
  }, [cardVisible, cardOpened, rotation, badge, enter]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1200 }, { rotateY: `${rotation.value}deg` }],
    opacity: rotation.value < 90 ? 1 : 0,
  }));
  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1200 }, { rotateY: `${rotation.value + 180}deg` }],
    opacity: rotation.value >= 90 ? 1 : 0,
  }));
  const enterStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ scale: interpolate(enter.value, [0, 1], [0.85, 1], Extrapolation.CLAMP) }, { translateY: interpolate(enter.value, [0, 1], [40, 0]) }],
  }));
  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badge.value,
    transform: [{ scale: interpolate(badge.value, [0, 1], [0.5, 1]) }],
  }));

  const plant = card ? PLANT_BY_SLUG[card] : null;
  if (!plant) return null;
  const cat = CATS[plant.category];

  const flip = () => {
    const toBack = rotation.value < 90;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    rotation.value = withSpring(toBack ? 180 : 0, { damping: 16, stiffness: 120 });
    if (toBack && !cardOpened) {
      dispatch({ type: 'openCard' });
      badge.value = withDelay(350, withSpring(1, { damping: 8, stiffness: 180 }));
      setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 380);
    }
  };

  return (
    <Modal visible={cardVisible} transparent statusBarTranslucent animationType="fade" onRequestClose={() => dispatch({ type: 'hideCard' })}>
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => dispatch({ type: 'hideCard' })} />
        <Animated.View style={[styles.stage, enterStyle]}>
          <Pressable onPress={flip} style={styles.cardBox} accessibilityRole="button" accessibilityLabel={t.tapToFlip}>
            <Animated.View style={[styles.face, shadows.lg, { backgroundColor: cat.bg }, frontStyle]}>
              <Text style={[styles.eyebrow, { color: cat.fg }]}>{t.cats[plant.category].toUpperCase()}</Text>
              <Image source={plant.image} style={styles.hero} contentFit="contain" />
              <Text style={styles.name}>{plant.name[locale]}</Text>
              <Text style={styles.hint}>{t.tapToFlip}</Text>
            </Animated.View>
            <Animated.View style={[styles.face, shadows.lg, { backgroundColor: colors.surface }, backStyle]}>
              <View style={[styles.miniTile, { backgroundColor: cat.bg }]}>
                <Image source={plant.image} style={styles.mini} contentFit="contain" />
              </View>
              <Text style={[styles.eyebrow, { color: cat.fg }]}>{t.didYouKnow.toUpperCase()}</Text>
              <Text style={styles.fact}>{plant.fact[locale]}</Text>
              <Animated.View style={[styles.badge, badgeStyle]}>
                <Stamp size={44} color={STAMP_META.curious.color}>
                  <Feather name={STAMP_META.curious.icon} size={18} color="#FFFFFF" />
                </Stamp>
                <Text style={styles.badgeText}>{t.curiousUnlocked}</Text>
              </Animated.View>
            </Animated.View>
          </Pressable>
          <Pressable style={styles.close} onPress={() => dispatch({ type: 'hideCard' })} accessibilityRole="button" accessibilityLabel={t.close}>
            <Feather name="x" size={20} color={colors.ink} />
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(31,27,22,0.45)' },
  stage: { alignItems: 'center', gap: 20 },
  cardBox: { width: CARD_W, height: CARD_H },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radii.xl,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backfaceVisibility: 'hidden',
  },
  eyebrow: { fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1.2 },
  hero: { width: 200, height: 200 },
  name: { fontFamily: fonts.extrabold, fontSize: 30, color: colors.ink, textAlign: 'center' },
  hint: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink2, position: 'absolute', bottom: 22 },
  miniTile: { width: 84, height: 84, borderRadius: radii.lg, alignItems: 'center', justifyContent: 'center' },
  mini: { width: 60, height: 60 },
  fact: { fontFamily: fonts.semibold, fontSize: 21, lineHeight: 30, color: colors.ink, textAlign: 'center' },
  badge: {
    position: 'absolute',
    bottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.bgSoft,
    borderRadius: radii.full,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 14,
  },
  badgeText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  close: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
