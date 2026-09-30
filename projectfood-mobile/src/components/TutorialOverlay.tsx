import { usePathname, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Svg, { Defs, Mask, Rect } from 'react-native-svg';

import { colors, fonts, radii } from '@/constants/theme';
import { track } from '@/features/events/track';
import { useHousehold } from '@/features/household/queries';
import { TUTORIAL_STEPS } from '@/features/tutorial/steps';
import { useUi } from '@/state/ui';

/** Air between the lit control and the hole's edge. */
const HOLE_PAD = 6;
/** From the hole to the balloon. */
const GAP = 12;
const MARGIN = 16;
const CARET = 14;
/** Ricardo, 2026-09-30: 0.55 was a touch heavy. */
const DIM = 'rgba(31, 27, 22, 0.45)';
/** A balloon needs about this much; below the hole when there is room, above it otherwise. */
const BALLOON_ROOM = 260;

/**
 * The tutorial's coach marks: a dim layer with a rounded hole around the lit control (an SVG mask,
 * so the corners follow the control; four transparent pressables around the hole swallow taps, the
 * control itself stays live), a white balloon with a caret, a step counter, Next or Done, and an X
 * that ends it. Mounted once in the tabs layout, in the same box as the tabs and the tab bar, so
 * the window rectangles the anchors measure are the coordinates it draws in.
 */
export function TutorialOverlay() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const step = useUi((s) => s.tutorialStep);
  const anchors = useUi((s) => s.tutorialAnchors);
  const setStep = useUi((s) => s.setTutorialStep);
  const endTutorial = useUi((s) => s.endTutorial);
  const hid = useHousehold().data?.household.id;
  // The overlay's own box, measured: the window height on Android can include or exclude the
  // system bars depending on the phone, this is what the balloon is placed against.
  const [box, setBox] = useState({ w: 0, h: 0 });

  const total = TUTORIAL_STEPS.length;
  const def = step ? TUTORIAL_STEPS[step - 1] : null;

  // Step 1 lights the Log tab; arriving on Log, by Next or by tapping the tab itself, moves on.
  useEffect(() => {
    if (step === 1 && pathname === '/log') setStep(2);
  }, [step, pathname, setStep]);

  if (!step || !def) return null;

  const next = () => {
    track('tutorial', { step, action: step === total ? 'done' : 'next' }, hid);
    if (step === total) {
      endTutorial(hid);
      return;
    }
    const nextDef = TUTORIAL_STEPS[step];
    if (nextDef.tab !== pathname) router.navigate(nextDef.tab);
    setStep(step + 1);
  };
  const skip = () => {
    track('tutorial', { step, action: 'skip' }, hid);
    endTutorial(hid);
  };

  const rect = anchors[def.anchor];
  const hole = rect ? { x: rect.x - HOLE_PAD, y: rect.y - HOLE_PAD, w: rect.width + 2 * HOLE_PAD, h: rect.height + 2 * HOLE_PAD } : null;
  const W = box.w;
  const H = box.h;

  // Below the hole when there is room, else above it, anchored by its bottom edge so its height
  // never has to be known; the caret points at the control's centre.
  const balloonW = Math.max(200, Math.min(360, W - 2 * MARGIN));
  let placement: ViewStyle = { top: H / 2 - 120 };
  let below = true;
  let left = (W - balloonW) / 2;
  let caretX = balloonW / 2;
  if (hole) {
    const cx = hole.x + hole.w / 2;
    left = Math.min(Math.max(MARGIN, cx - balloonW / 2), W - MARGIN - balloonW);
    caretX = Math.min(Math.max(28, cx - left), balloonW - 28);
    const spaceBelow = H - (hole.y + hole.h);
    const spaceAbove = hole.y;
    below = spaceBelow >= BALLOON_ROOM || spaceBelow >= spaceAbove;
    placement = below ? { top: hole.y + hole.h + GAP } : { bottom: H - hole.y + GAP };
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none" onLayout={(e) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
      {W > 0 && H > 0 ? (
        <Svg pointerEvents="none" style={StyleSheet.absoluteFill} width={W} height={H}>
          <Defs>
            <Mask id="tutorial-hole" x={0} y={0} width={W} height={H} maskUnits="userSpaceOnUse">
              <Rect x={0} y={0} width={W} height={H} fill="#FFFFFF" />
              {hole ? <Rect x={hole.x} y={hole.y} width={hole.w} height={hole.h} rx={def.radius} ry={def.radius} fill="#000000" /> : null}
            </Mask>
          </Defs>
          <Rect x={0} y={0} width={W} height={H} fill={DIM} mask="url(#tutorial-hole)" />
          {hole ? <Rect x={hole.x} y={hole.y} width={hole.w} height={hole.h} rx={def.radius} ry={def.radius} fill="none" stroke={colors.surface} strokeWidth={2} /> : null}
        </Svg>
      ) : null}
      {hole ? (
        <>
          <Blocker style={{ top: 0, left: 0, right: 0, height: Math.max(0, hole.y) }} />
          <Blocker style={{ top: hole.y + hole.h, left: 0, right: 0, bottom: 0 }} />
          <Blocker style={{ top: hole.y, height: hole.h, left: 0, width: Math.max(0, hole.x) }} />
          <Blocker style={{ top: hole.y, height: hole.h, left: hole.x + hole.w, right: 0 }} />
        </>
      ) : (
        <Blocker style={StyleSheet.absoluteFill as ViewStyle} />
      )}
      {W > 0 ? (
        <Animated.View key={step} entering={FadeIn.duration(180)} style={[styles.balloon, { width: balloonW, left }, placement]}>
          {hole ? <View style={[styles.caret, below ? { top: -CARET / 2 } : { bottom: -CARET / 2 }, { left: caretX - CARET / 2 }]} /> : null}
          <View style={styles.head}>
            <Text style={styles.title}>{t(`tutorial.steps.${def.key}.title`)}</Text>
            <Pressable onPress={skip} hitSlop={10} accessibilityRole="button" accessibilityLabel={t('tutorial.skip')} style={styles.close}>
              <X size={18} color={colors.ink3} />
            </Pressable>
          </View>
          <Text style={styles.body}>{t(`tutorial.steps.${def.key}.body`)}</Text>
          <View style={styles.foot}>
            <Text style={styles.counter}>{t('tutorial.counter', { n: step, total })}</Text>
            <Pressable onPress={next} style={({ pressed }) => [styles.next, pressed && { opacity: 0.85 }]} accessibilityRole="button">
              <Text style={styles.nextText}>{step === total ? t('tutorial.done') : t('tutorial.next')}</Text>
            </Pressable>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}

/** A transparent piece around the hole; it swallows taps so only the lit control and the balloon respond. */
function Blocker({ style }: { style: ViewStyle }) {
  return <Pressable style={[styles.blocker, style]} onPress={() => undefined} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />;
}

const styles = StyleSheet.create({
  blocker: { position: 'absolute' },
  balloon: { position: 'absolute', padding: 18, borderRadius: radii.lg, backgroundColor: colors.surface, gap: 8 },
  caret: { position: 'absolute', width: CARET, height: CARET, backgroundColor: colors.surface, transform: [{ rotate: '45deg' }], borderRadius: 3 },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  title: { flex: 1, fontFamily: fonts.bold, fontSize: 17, lineHeight: 22, color: colors.ink },
  close: { marginTop: 1, marginRight: -4 },
  body: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, color: colors.ink2 },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  counter: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink3 },
  next: { height: 40, paddingHorizontal: 18, borderRadius: radii.sm, backgroundColor: colors.ink, justifyContent: 'center' },
  nextText: { fontFamily: fonts.semibold, fontSize: 14, color: '#FFFFFF' },
});
