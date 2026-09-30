import { usePathname, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, useWindowDimensions, View, type ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, radii } from '@/constants/theme';
import { track } from '@/features/events/track';
import { useHousehold } from '@/features/household/queries';
import { TUTORIAL_STEPS } from '@/features/tutorial/steps';
import { useUi } from '@/state/ui';

/** Air between the lit control and the hole's edge. */
const HOLE_PAD = 6;
const HOLE_RADIUS = 14;
/** From the hole to the balloon. */
const GAP = 12;
const MARGIN = 16;
const CARET = 14;
const DIM = 'rgba(31, 27, 22, 0.55)';

/**
 * The tutorial's coach marks: a dim layer with a hole around the lit control (four rectangles, so
 * the control itself stays live and a tap on it counts), a white balloon with a caret, a step
 * counter, Next or Done, and an X that ends it. Mounted once in the tabs layout above the tab bar.
 */
export function TutorialOverlay() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { width: W, height: H } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const step = useUi((s) => s.tutorialStep);
  const anchors = useUi((s) => s.tutorialAnchors);
  const picker = useUi((s) => s.picker);
  const setStep = useUi((s) => s.setTutorialStep);
  const endTutorial = useUi((s) => s.endTutorial);
  const hid = useHousehold().data?.household.id;
  const [balloonH, setBalloonH] = useState(0);

  const total = TUTORIAL_STEPS.length;
  const def = step ? TUTORIAL_STEPS[step - 1] : null;

  // Step 1 lights the Log tab; arriving on Log, by Next or by tapping the tab itself, moves on.
  useEffect(() => {
    if (step === 1 && pathname === '/log') setStep(2);
  }, [step, pathname, setStep]);

  // The last step lights the who-logs bar; opening it is the lesson taken, the balloon goes.
  useEffect(() => {
    if (step === total && picker) {
      track('tutorial', { step, action: 'tapped' }, hid);
      endTutorial();
    }
  }, [step, picker, total, hid, endTutorial]);

  if (!step || !def) return null;

  const next = () => {
    track('tutorial', { step, action: step === total ? 'done' : 'next' }, hid);
    if (step === total) {
      endTutorial();
      return;
    }
    const nextDef = TUTORIAL_STEPS[step];
    if (nextDef.tab !== pathname) router.navigate(nextDef.tab);
    setStep(step + 1);
  };
  const skip = () => {
    track('tutorial', { step, action: 'skip' }, hid);
    endTutorial();
  };

  const rect = anchors[def.anchor];
  const hole = rect ? { x: rect.x - HOLE_PAD, y: rect.y - HOLE_PAD, w: rect.width + 2 * HOLE_PAD, h: rect.height + 2 * HOLE_PAD } : null;

  // The balloon sits under the hole when there is room, else above it; the caret points at the control's centre.
  const balloonW = Math.min(360, W - 2 * MARGIN);
  let below = true;
  let top = (H - balloonH) / 2;
  let left = (W - balloonW) / 2;
  let caretX = balloonW / 2;
  if (hole) {
    const cx = hole.x + hole.w / 2;
    left = Math.min(Math.max(MARGIN, cx - balloonW / 2), W - MARGIN - balloonW);
    caretX = Math.min(Math.max(28, cx - left), balloonW - 28);
    below = hole.y + hole.h + GAP + balloonH + MARGIN + insets.bottom <= H;
    top = below ? hole.y + hole.h + GAP : hole.y - GAP - balloonH;
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {hole ? (
        <>
          <Dim style={{ top: 0, left: 0, right: 0, height: Math.max(0, hole.y) }} />
          <Dim style={{ top: hole.y + hole.h, left: 0, right: 0, bottom: 0 }} />
          <Dim style={{ top: hole.y, height: hole.h, left: 0, width: Math.max(0, hole.x) }} />
          <Dim style={{ top: hole.y, height: hole.h, left: hole.x + hole.w, right: 0 }} />
          <View pointerEvents="none" style={[styles.ring, { top: hole.y, left: hole.x, width: hole.w, height: hole.h }]} />
        </>
      ) : (
        <Dim style={StyleSheet.absoluteFill as ViewStyle} />
      )}
      <Animated.View
        key={step}
        entering={FadeIn.duration(180)}
        onLayout={(e) => setBalloonH(e.nativeEvent.layout.height)}
        style={[styles.balloon, { width: balloonW, left, top, opacity: balloonH ? 1 : 0 }]}>
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
    </View>
  );
}

/** A piece of the dim layer; it swallows taps so only the lit control and the balloon respond. */
function Dim({ style }: { style: ViewStyle }) {
  return <Pressable style={[styles.dim, style]} onPress={() => undefined} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />;
}

const styles = StyleSheet.create({
  dim: { position: 'absolute', backgroundColor: DIM },
  ring: { position: 'absolute', borderRadius: HOLE_RADIUS, borderWidth: 2, borderColor: colors.surface },
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
