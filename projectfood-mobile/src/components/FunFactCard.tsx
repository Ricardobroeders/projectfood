import * as Haptics from 'expo-haptics';
import { X } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';

import { Stamp } from '@/components/Stamp';
import { motion, REWARD_POP_FROM } from '@/constants/motion';
import { CATS, colors, fonts, iconFor, radii } from '@/constants/theme';
import { ACHIEVEMENT_BY_ID, levelKey } from '@/features/achievements/definitions';
import { useAchievements, useUnlockCurious } from '@/features/achievements/useAchievements';
import { usePlantCatalog } from '@/features/plants/catalog';
import { usePlantFact } from '@/features/plants/facts';
import { PlantImage } from '@/features/plants/PlantImage';
import { useUi } from '@/state/ui';

const CARD_W = 300;
const CARD_H = 420;

/** The flip card: clay render on the front, the kid fact on the back. Opening the back is the Curious stamp. */
export function FunFactCard() {
  const { t } = useTranslation();
  const factCard = useUi((s) => s.factCard);
  const hide = useUi((s) => s.hideFactCard);
  const { catalog } = usePlantCatalog();
  const { hid, levels } = useAchievements();
  const curious = useUnlockCurious(hid);
  const plant = factCard ? catalog.byId[factCard.plantId] : undefined;
  const { data: fact } = usePlantFact(plant?.id);
  const opened = levels.has(levelKey('curious', null));

  const rotation = useSharedValue(0);
  const badge = useSharedValue(0);
  const enter = useSharedValue(0);
  const openedRef = useRef(opened);
  openedRef.current = opened;
  const visible = !!factCard;

  useEffect(() => {
    if (visible) {
      rotation.value = 0;
      badge.value = openedRef.current ? 1 : 0;
      enter.value = 0;
      enter.value = withSpring(1, motion.modal); // modal class: appears in place, gentle settle
    }
  }, [visible, rotation, badge, enter]);

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
    transform: [{ scale: interpolate(enter.value, [0, 1], [0.9, 1], Extrapolation.CLAMP) }, { translateY: interpolate(enter.value, [0, 1], [24, 0]) }],
  }));
  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badge.value,
    transform: [{ scale: interpolate(badge.value, [0, 1], [REWARD_POP_FROM, 1]) }],
  }));

  if (!plant) return null;
  const cat = CATS[plant.category];
  const CuriousIcon = ACHIEVEMENT_BY_ID.curious.icon;

  const flip = () => {
    const toBack = rotation.value < 90;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    rotation.value = withSpring(toBack ? 180 : 0, motion.flip); // flip class: smooth, clamped
    if (toBack && !openedRef.current) {
      curious.mutate();
      badge.value = withDelay(350, withSpring(1, motion.reward)); // reward class: may bounce
      setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 380);
    }
  };

  return (
    <Modal visible={visible} transparent statusBarTranslucent animationType="fade" onRequestClose={hide}>
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={hide} />
        <Animated.View style={[styles.stage, enterStyle]}>
          <Pressable onPress={flip} style={styles.cardBox} accessibilityRole="button" accessibilityLabel={t('plant.tapToFlip')}>
            <Animated.View style={[styles.face, { backgroundColor: cat.bg }, frontStyle]}>
              <Text style={[styles.eyebrow, { color: cat.fg }]}>{t(`categories.${plant.category}`).toUpperCase()}</Text>
              <PlantImage plant={plant} size={200} />
              <Text style={styles.name}>{plant.name}</Text>
              <Text style={styles.hint}>{t('plant.tapToFlip')}</Text>
            </Animated.View>
            <Animated.View style={[styles.face, { backgroundColor: colors.surface }, backStyle]}>
              <View style={[styles.miniTile, { backgroundColor: cat.bg }]}>
                <PlantImage plant={plant} size={60} />
              </View>
              <Text style={[styles.eyebrow, { color: cat.fg }]}>{t('plant.didYouKnow').toUpperCase()}</Text>
              <Text style={styles.fact}>{fact?.kid_fact ?? plant.name}</Text>
              <Animated.View style={[styles.badge, badgeStyle]}>
                <Stamp size={44} color={ACHIEVEMENT_BY_ID.curious.color}>
                  <CuriousIcon size={iconFor(44)} color="#FFFFFF" />
                </Stamp>
                <Text style={styles.badgeText}>{t('celebration.curiousUnlocked')}</Text>
              </Animated.View>
            </Animated.View>
          </Pressable>
          <Pressable style={styles.close} onPress={hide} accessibilityRole="button" accessibilityLabel={t('common.close')}>
            <X size={iconFor(48)} color={colors.ink} />
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
  face: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: radii.xl, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 12, backfaceVisibility: 'hidden' },
  eyebrow: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 16, letterSpacing: 1.2 },
  name: { fontFamily: fonts.extrabold, fontSize: 30, lineHeight: 36, color: colors.ink, textAlign: 'center' },
  hint: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink2, position: 'absolute', bottom: 22 },
  miniTile: { width: 84, height: 84, borderRadius: radii.lg, alignItems: 'center', justifyContent: 'center' },
  fact: { fontFamily: fonts.semibold, fontSize: 21, lineHeight: 30, color: colors.ink, textAlign: 'center' },
  badge: { position: 'absolute', bottom: 22, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.bgSoft, borderRadius: radii.md, height: 56, paddingLeft: 6, paddingRight: 14 },
  badgeText: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: colors.ink },
  close: { width: 48, height: 48, borderRadius: radii.full, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
});
