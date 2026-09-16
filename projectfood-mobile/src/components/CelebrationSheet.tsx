import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { Stamp } from '@/components/Stamp';
import { StampPress } from '@/components/StampPress';
import { motion } from '@/constants/motion';
import { colors, fonts, iconFor, radii } from '@/constants/theme';
import { ACHIEVEMENT_BY_ID, type AchievementId } from '@/features/achievements/definitions';
import { type UnlockRow, useAchievements, useMarkUnlocksSeen } from '@/features/achievements/useAchievements';
import { dateKey } from '@/features/logs/model';
import { usePlantCatalog } from '@/features/plants/catalog';
import { usePlantFact } from '@/features/plants/facts';
import { PlantImage } from '@/features/plants/PlantImage';
import { useUi } from '@/state/ui';

const HIDDEN_Y = 640;
const STAMP_SIZE = 132;

/**
 * One celebration per session (KB rule 5): every unlock with seen_at null stacks into this sheet,
 * the first one pressed down like a rubber stamp, the rest lined up under it. Also the replay for
 * a log entered after bedtime: "earned last night".
 */
export function CelebrationSheet() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { hid, members, ctx, unlocks, ready } = useAchievements();
  const { catalog } = usePlantCatalog();
  const picker = useUi((s) => s.picker);
  const factCard = useUi((s) => s.factCard);
  const showFactCard = useUi((s) => s.showFactCard);
  const markSeen = useMarkUnlocksSeen(hid);

  const unseen = unlocks.filter((u) => !u.seen_at);
  const wanted = ready && unseen.length > 0 && picker === null && factCard === null;
  const [shown, setShown] = useState<UnlockRow[] | null>(null);
  const visible = shown !== null;

  useEffect(() => {
    if (wanted && shown === null) setShown(unseen);
  }, [wanted, unseen, shown]);

  const backdrop = useSharedValue(0);
  const slide = useSharedValue(HIDDEN_Y);
  useEffect(() => {
    if (visible) {
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

  // The plant most recently tasted this week: the face of a First bites stamp and the fact card.
  const lastRow = ctx.weekLogs[ctx.weekLogs.length - 1];
  const plant = lastRow ? catalog.byId[lastRow.plant_id] : undefined;
  const { data: fact } = usePlantFact(plant?.id);

  // Worklets can only schedule a function that already lives on the RN runtime, so the close
  // handler is a stable reference and the per-call payload travels through a ref.
  const pending = useRef<{ ids: string[]; then?: () => void } | null>(null);
  const onClosed = useCallback(() => {
    const p = pending.current;
    pending.current = null;
    setShown(null);
    if (p) {
      markSeen.mutate(p.ids);
      p.then?.();
    }
  }, [markSeen]);

  const finish = useCallback(
    (then?: () => void) => {
      pending.current = { ids: (shown ?? []).map((u) => u.id), then };
      backdrop.value = withTiming(0, motion.backdrop);
      slide.value = withTiming(HIDDEN_Y, motion.sheetOut, (finished) => {
        if (finished) scheduleOnRN(onClosed);
      });
    },
    [shown, backdrop, slide, onClosed],
  );

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: slide.value }] }));

  if (!shown || shown.length === 0) return null;
  const first = shown[0];
  const firstId = first.achievement_id as AchievementId;
  const a = ACHIEVEMENT_BY_ID[firstId] ?? ACHIEVEMENT_BY_ID.first_bites;
  const FirstIcon = a.icon;
  const isFirstBites = firstId === 'first_bites';
  const lastNight = shown.some((u) => dateKey(new Date(u.unlocked_at)) < dateKey());
  const rest = shown.slice(1, 7);
  const memberName = first.member_id ? members.find((m) => m.id === first.member_id)?.name : null;
  const title = shown.length === 1 ? (isFirstBites ? t('celebration.firstBitesTitle') : t('celebration.newStampTitle')) : t('celebration.newStampsTitle', { n: shown.length });
  const body = isFirstBites ? t('celebration.firstBitesBody') : `${t(`stamps.${firstId}.title`)} · ${t(`stamps.${firstId}.body`, { n: (typeof a.target === 'number' ? a.target : a.target(ctx)) })}`;

  return (
    <Modal visible transparent statusBarTranslucent animationType="none" onRequestClose={() => finish()}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => finish()} />
        </Animated.View>
        <Animated.View style={[styles.sheet, { paddingBottom: 20 + insets.bottom }, sheetStyle]}>
          <View style={styles.handle} />
          {lastNight ? <Text style={styles.eyebrow}>{t('celebration.lastNight')}</Text> : null}
          <StampPress size={STAMP_SIZE} color={a.color} play={visible} onLanded={onLanded}>
            <Stamp size={STAMP_SIZE} color={a.color}>
              {isFirstBites && plant ? <PlantImage plant={plant} size={88} /> : <FirstIcon size={iconFor(STAMP_SIZE)} color={a.fg ?? '#FFFFFF'} />}
            </Stamp>
          </StampPress>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{memberName ? `${memberName} · ${body}` : body}</Text>
          {rest.length > 0 ? (
            <View style={styles.rest}>
              {rest.map((u, i) => {
                const ra = ACHIEVEMENT_BY_ID[u.achievement_id as AchievementId];
                if (!ra) return null;
                const Icon = ra.icon;
                return (
                  <Animated.View key={u.id} entering={FadeInDown.delay(560 + i * 90).duration(320)}>
                    <Stamp size={44} color={ra.color}>
                      <Icon size={iconFor(44)} color={ra.fg ?? '#FFFFFF'} />
                    </Stamp>
                  </Animated.View>
                );
              })}
              {shown.length > 7 ? <Text style={styles.more}>+{shown.length - 7}</Text> : null}
            </View>
          ) : null}
          {isFirstBites && plant && fact ? (
            <>
              <Pressable style={({ pressed }) => [styles.primary, pressed && { backgroundColor: colors.accentPressed }]} onPress={() => finish(() => showFactCard(plant.id))}>
                <Text style={styles.primaryText}>{t('celebration.showCard')}</Text>
              </Pressable>
              <Pressable style={styles.secondary} onPress={() => finish()}>
                <Text style={styles.secondaryText}>{t('celebration.later')}</Text>
              </Pressable>
            </>
          ) : (
            <Pressable style={({ pressed }) => [styles.primary, pressed && { backgroundColor: colors.accentPressed }]} onPress={() => finish()}>
              <Text style={styles.primaryText}>{t('common.done')}</Text>
            </Pressable>
          )}
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
  eyebrow: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 16, letterSpacing: 1.2, color: colors.ink3, textTransform: 'uppercase' },
  title: { fontFamily: fonts.extrabold, fontSize: 28, lineHeight: 34, color: colors.ink, textAlign: 'center' },
  body: { fontFamily: fonts.medium, fontSize: 16, color: colors.ink2, textAlign: 'center', lineHeight: 22, maxWidth: 300 },
  rest: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, minHeight: 44 },
  more: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink2, marginLeft: 4 },
  primary: { alignSelf: 'stretch', backgroundColor: colors.accent, borderRadius: radii.md, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  primaryText: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 22, color: colors.onAccent },
  secondary: { paddingVertical: 12 },
  secondaryText: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink2 },
});
