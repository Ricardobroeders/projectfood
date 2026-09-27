import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { Cup } from '@/components/Cup';
import { motion, REWARD_POP_FROM } from '@/constants/motion';
import { colors, fonts, radii } from '@/constants/theme';
import { useHousehold } from '@/features/household/queries';
import { CARD_LEVELS } from '@/features/plants/cardLevel';
import { usePlantCatalog } from '@/features/plants/catalog';
import { PlantImage } from '@/features/plants/PlantImage';
import { useUi } from '@/state/ui';

const HIDDEN_Y = 640;
const TILE = 200;

/**
 * The gold card celebration (Ricardo, 2026-09-27): the 15th taste of one plant mints its gold card,
 * and that is the moment the render and the ground turn gold everywhere in the app. The sheet shows
 * the plant the way it will look from now on, which is the whole reward.
 *
 * Fired from the log mutation, so a tap on the row and a chip in the member menu both reach it. It
 * waits for the member menu and the fact card to be out of the way, and the achievement celebration
 * waits for it: one sheet at a time, this one first because it belongs to the tap that just happened.
 */
export function GoldCardSheet() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const goldCard = useUi((s) => s.goldCard);
  const picker = useUi((s) => s.picker);
  const factCard = useUi((s) => s.factCard);
  const hideGoldCard = useUi((s) => s.hideGoldCard);
  const { catalog } = usePlantCatalog();
  const { data: hh } = useHousehold();

  const wanted = goldCard !== null && picker === null && factCard === null;
  // Held for the sheet's whole life, so the store can be cleared while it slides away.
  const [shown, setShown] = useState<{ plantId: string; memberIds: string[] } | null>(null);
  const visible = shown !== null;

  useEffect(() => {
    if (wanted && shown === null) setShown(goldCard);
  }, [wanted, goldCard, shown]);

  const backdrop = useSharedValue(0);
  const slide = useSharedValue(HIDDEN_Y);
  const pop = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      backdrop.value = 0;
      slide.value = HIDDEN_Y;
      pop.value = 0;
      return;
    }
    backdrop.value = withTiming(1, motion.backdrop);
    slide.value = withTiming(0, motion.sheetIn);
    // reward class: the tile arrives after the sheet has, and the haptic lands with it
    pop.value = withDelay(200, withSpring(1, motion.reward));
    const id = setTimeout(() => void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 260);
    return () => clearTimeout(id);
  }, [visible, backdrop, slide, pop]);

  const onClosed = useCallback(() => {
    setShown(null);
    hideGoldCard();
  }, [hideGoldCard]);

  const close = useCallback(() => {
    backdrop.value = withTiming(0, motion.backdrop);
    slide.value = withTiming(HIDDEN_Y, motion.sheetOut, (finished) => {
      if (finished) scheduleOnRN(onClosed);
    });
  }, [backdrop, slide, onClosed]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: slide.value }] }));
  const tileStyle = useAnimatedStyle(() => ({
    opacity: pop.value,
    transform: [{ scale: interpolate(pop.value, [0, 1], [REWARD_POP_FROM, 1]) }],
  }));

  const plant = shown ? catalog.byId[shown.plantId] : undefined;
  if (!shown || !plant) return null;

  // Whose card it is. The count is per member, so gold belongs to the one who did the tasting.
  const who = (hh?.members ?? [])
    .filter((m) => shown.memberIds.includes(m.id))
    .map((m) => m.name)
    .join(', ');
  const body = t('celebration.goldCardBody', { n: CARD_LEVELS.gold });

  return (
    <Modal visible transparent statusBarTranslucent animationType="none" onRequestClose={close}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityRole="button" />
        </Animated.View>
        <Animated.View style={[styles.sheet, { paddingBottom: 20 + insets.bottom }, sheetStyle]}>
          <View style={styles.handle} />
          <View style={styles.eyebrowRow}>
            <Cup level="gold" size={22} />
            <Text style={styles.eyebrow}>{t('unlocks.goldReached')}</Text>
          </View>
          <Animated.View style={[styles.tile, tileStyle]}>
            <PlantImage plant={plant} size={152} gold />
          </Animated.View>
          <Text style={styles.title}>{plant.name}</Text>
          <Text style={styles.body}>{who ? `${who} · ${body}` : body}</Text>
          <Pressable style={({ pressed }) => [styles.primary, pressed && { backgroundColor: colors.accentPressed }]} onPress={close} accessibilityRole="button">
            <Text style={styles.primaryText}>{t('common.done')}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(31,27,22,0.32)' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl, paddingHorizontal: 24, paddingTop: 12, alignItems: 'center', gap: 8 },
  handle: { width: 40, height: 4, borderRadius: radii.full, backgroundColor: colors.hairline, marginBottom: 2 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eyebrow: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 16, letterSpacing: 1.2, color: colors.goldInk, textTransform: 'uppercase' },
  tile: { width: TILE, height: TILE, borderRadius: radii.xl, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  title: { fontFamily: fonts.extrabold, fontSize: 28, lineHeight: 34, color: colors.ink, textAlign: 'center', marginTop: 4 },
  body: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 22, color: colors.ink2, textAlign: 'center', maxWidth: 300 },
  primary: { alignSelf: 'stretch', backgroundColor: colors.accent, borderRadius: radii.md, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  primaryText: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 22, color: colors.onAccent },
});
