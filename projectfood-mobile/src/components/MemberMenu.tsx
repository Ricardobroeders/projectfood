import * as Haptics from 'expo-haptics';
import { Check, X } from 'lucide-react-native';
import { useCallback, useEffect, useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { interpolate, useAnimatedReaction, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming, type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { MemberAvatar } from '@/components/MemberAvatar';
import { EXPRESSIVE_STAGGER, motion, REWARD_POP_FROM } from '@/constants/motion';
import { CATS, colors, fonts, radii, radiusFor } from '@/constants/theme';
import { track } from '@/features/events/track';
import { type Member, useHousehold } from '@/features/household/queries';
import { dateKey, tasteMapFor } from '@/features/logs/model';
import { useLogMutations, useWeekLogs } from '@/features/logs/queries';
import { usePlantCatalog } from '@/features/plants/catalog';
import { PlantImage } from '@/features/plants/PlantImage';
import { type Point, useDefaultIds, useUi } from '@/state/ui';
import { useGoldPlants } from '@/features/plants/useGoldPlants';

/** The origin: a disc under the finger, the plant on it (or a close cross for the default set). */
const DISC = 56;
const CHIP_H = 48;
const GAP = 8;
/** The column is this wide; the chips hug whichever side faces the finger. */
const MENU_W = 240;
const MARGIN = 16;
/** Chips leave the origin this small (amplitude rule: a spring that travels far starts close). */
const SCALE_FROM = 0.6;

/**
 * Who tasted this plant, as a menu that grows out of the finger (2026-09-24, replaces the bottom
 * sheet). Hold a plant and one chip per member fans out from the touch point, staggered, in the
 * expressive class; each chip is a live toggle of today's log for that member, so the row behind
 * the menu updates as you tap. From the "logging for" bar the same menu edits the default set.
 * Exits are quick and never bounce. The pick for a plant becomes the default for the next taps,
 * as it always has.
 */
export function MemberMenu() {
  const picker = useUi((s) => s.picker);
  if (!picker) return null;
  // Keyed per opening: the springs run on mount and the geometry is fixed for the menu's life.
  return <MenuBody key={`${picker.plantId ?? 'bar'}:${picker.at.x}:${picker.at.y}`} plantId={picker.plantId} at={picker.at} />;
}

function MenuBody({ plantId, at }: { plantId: string | null; at: Point }) {
  const { width: W } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const closePicker = useUi((s) => s.closePicker);
  const setDefaultIds = useUi((s) => s.setDefaultIds);
  const { data: hh } = useHousehold();
  const hid = hh?.household.id;
  const members = hh?.members ?? [];
  const defaultIds = useDefaultIds(hid, members.map((m) => m.id));
  const { catalog } = usePlantCatalog();
  const plant = plantId ? catalog.byId[plantId] : null;
  // the disc the menu grows from carries the plant, so it turns gold with it
  const gold = useGoldPlants().has(plantId ?? '');
  const { data: logs } = useWeekLogs(hid);
  const { logTaste, unlogTaste } = useLogMutations(hid);
  const today = dateKey();

  // The chips mirror what is stored: today's tasters of the plant, or the default set for the bar.
  const tasters = useMemo(() => (plantId ? (tasteMapFor(logs ?? [], today)[plantId] ?? []) : null), [logs, today, plantId]);
  const selected = tasters ?? defaultIds;

  // Geometry: the disc sits under the finger; the chips stack upward unless the finger is too
  // high for them, then downward. They hug the disc's side nearest the screen edge the finger is on.
  const n = members.length;
  const column = n * CHIP_H + (n - 1) * GAP;
  const up = at.y - DISC / 2 - GAP - column >= insets.top + MARGIN;
  const right = at.x >= W / 2;
  const left = Math.min(Math.max(right ? at.x + DISC / 2 - MENU_W : at.x - DISC / 2, MARGIN), W - MARGIN - MENU_W);
  const top = up ? at.y - DISC / 2 - GAP - column : at.y + DISC / 2 + GAP;

  const backdrop = useSharedValue(0);
  const disc = useSharedValue(0);
  // Flips to 1 on close; every chip watches it and puts itself away.
  const closing = useSharedValue(0);

  useEffect(() => {
    backdrop.value = withTiming(1, motion.backdrop);
    disc.value = withSpring(1, motion.expressive);
  }, [backdrop, disc]);

  const finish = useCallback(() => {
    // The pick for a plant is the default for the next taps (sticky since the POC); the bar edits it directly.
    if (hid && plantId && tasters && tasters.length) setDefaultIds(hid, tasters);
    closePicker();
  }, [hid, plantId, tasters, setDefaultIds, closePicker]);

  const close = useCallback(() => {
    if (closing.value) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    closing.value = 1;
    backdrop.value = withTiming(0, motion.backdrop);
    disc.value = withTiming(0, motion.expressiveOut, (finished) => {
      if (finished) scheduleOnRN(finish);
    });
  }, [backdrop, closing, disc, finish]);

  const toggle = (id: string) => {
    Haptics.selectionAsync();
    const on = selected.includes(id);
    if (plantId) {
      if (on) unlogTaste.mutate({ plantId, memberIds: [id], day: today });
      else {
        logTaste.mutate({ plantId, memberIds: [id], day: today });
        track('plant_logged', { plant_id: plantId, members: 1, via: 'menu' }, hid);
      }
    } else if (hid) {
      setDefaultIds(hid, on ? defaultIds.filter((x) => x !== id) : [...defaultIds, id]);
    }
  };

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));
  const discStyle = useAnimatedStyle(() => ({
    opacity: disc.value,
    transform: [{ scale: interpolate(disc.value, [0, 1], [REWARD_POP_FROM, 1]) }],
  }));

  return (
    <Modal visible transparent statusBarTranslucent animationType="none" onRequestClose={close}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityRole="button" />
      </Animated.View>

      <View pointerEvents="box-none" style={[styles.column, { left, top, alignItems: right ? 'flex-end' : 'flex-start' }]}>
        {members.map((m, i) => (
          <Chip
            key={m.id}
            member={m}
            on={selected.includes(m.id)}
            /* the chip nearest the disc leaves first */
            delay={60 + (up ? n - 1 - i : i) * EXPRESSIVE_STAGGER}
            closing={closing}
            /* where the chip's slot is relative to the disc centre, so it can start there */
            dy={at.y - (top + i * (CHIP_H + GAP) + CHIP_H / 2)}
            origin={`${right ? 'right' : 'left'} ${up ? 'bottom' : 'top'}`}
            onPress={() => toggle(m.id)}
          />
        ))}
      </View>

      <Animated.View style={[styles.disc, { left: at.x - DISC / 2, top: at.y - DISC / 2, backgroundColor: plant ? (gold ? colors.goldSoft : CATS[plant.category].bg) : colors.ink }, discStyle]}>
        <Pressable style={styles.discPress} onPress={close} accessibilityRole="button" accessibilityLabel={plant?.name}>
          {plant ? <PlantImage plant={plant} size={40} gold={gold} /> : <X size={22} color={colors.surface} strokeWidth={2.5} />}
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

type ChipProps = {
  member: Member;
  on: boolean;
  /** ms after opening before this chip leaves the origin. */
  delay: number;
  closing: SharedValue<number>;
  dy: number;
  origin: string;
  onPress: () => void;
};

function Chip({ member, on, delay, closing, dy, origin, onPress }: ChipProps) {
  // 0 = at the origin, small and clear; 1 = in its slot. A spring out, a short timing back.
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(delay, withSpring(1, motion.expressive));
  }, [p, delay]);
  useAnimatedReaction(
    () => closing.value,
    (now, before) => {
      if (now && !before) p.value = withTiming(0, motion.expressiveOut);
    },
  );
  const style = useAnimatedStyle(() => ({
    opacity: Math.min(1, p.value * 1.6),
    transform: [{ translateY: dy * (1 - p.value) }, { scale: SCALE_FROM + (1 - SCALE_FROM) * p.value }],
  }));
  return (
    <Animated.View style={[style, { transformOrigin: origin }]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.chip, on && styles.chipOn, pressed && { opacity: 0.8 }]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: on }}
        accessibilityLabel={member.name}>
        <MemberAvatar member={member} size={30} muted={!on} />
        <Text style={[styles.chipText, !on && { color: colors.ink2 }]} numberOfLines={1}>
          {member.name}
        </Text>
        <View style={[styles.check, on && styles.checkOn]}>{on ? <Check size={14} color={colors.onAccent} strokeWidth={3} /> : null}</View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(31,27,22,0.32)' },
  column: { position: 'absolute', width: MENU_W, gap: GAP },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 10, height: CHIP_H, paddingLeft: 9, paddingRight: 10, borderRadius: radiusFor(CHIP_H), backgroundColor: colors.surface },
  chipOn: { backgroundColor: colors.accentSoft },
  chipText: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink, maxWidth: 140 },
  check: { width: 22, height: 22, borderRadius: radii.full, borderWidth: 2, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  disc: { position: 'absolute', width: DISC, height: DISC, borderRadius: radii.full },
  discPress: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
