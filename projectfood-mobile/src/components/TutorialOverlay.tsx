import { usePathname, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Defs, Mask, Rect } from 'react-native-svg';

import { motion } from '@/constants/motion';
import { colors, fonts, radii } from '@/constants/theme';
import { track } from '@/features/events/track';
import { useHousehold } from '@/features/household/queries';
import { currentLocale } from '@/features/i18n';
import { TUTORIAL_STEPS } from '@/features/tutorial/steps';
import { type Rect as Box, useUi } from '@/state/ui';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

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
/** How far past the screen the hole sits when it is "open": the dim is then nowhere. */
const OPEN_R = 48;
/** A control that never reports where it is ends the tutorial rather than holding the screen. */
const LOST_MS = 2500;

/**
 * The tutorial's coach marks, in the guide motion class: one dim layer with a rounded hole (an SVG
 * mask, so the corners follow the control) that irises in from the whole screen onto the first
 * control, glides to the next on Next and opens back out on Done or X; the balloon rises in once
 * the hole has arrived and fades out before it leaves. Four transparent pressables around the hole
 * swallow taps, the control itself stays live. Mounted once in the tabs layout, in the same box as
 * the tabs and the tab bar, so the window rectangles the anchors measure are its coordinates.
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
  // The balloon on screen: its step and the hole it belongs to. Set when the hole starts moving
  // there; the text changes only then, so a fading balloon keeps its own words.
  const [shown, setShown] = useState<{ step: number; rect: Box } | null>(null);
  const [closing, setClosing] = useState(false);
  const opened = useRef(false);

  const hx = useSharedValue(0);
  const hy = useSharedValue(0);
  const hw = useSharedValue(0);
  const hh = useSharedValue(0);
  const hr = useSharedValue(OPEN_R);
  const dim = useSharedValue(0);
  const balloon = useSharedValue(0);

  const total = TUTORIAL_STEPS.length;
  const def = step ? TUTORIAL_STEPS[step - 1] : null;
  const target = def ? anchors[def.anchor] : undefined;
  const W = box.w;
  const H = box.h;

  // Step 1 lights the Log tab; arriving on Log, by Next or by tapping the tab itself, moves on.
  useEffect(() => {
    if (step === 1 && pathname === '/log') setStep(2);
  }, [step, pathname, setStep]);

  // Open: the hole is the whole screen (no dim anywhere) until the first control reports in.
  useEffect(() => {
    if (!step || W === 0 || opened.current) return;
    hx.value = -OPEN_R;
    hy.value = -OPEN_R;
    hw.value = W + 2 * OPEN_R;
    hh.value = H + 2 * OPEN_R;
    hr.value = OPEN_R;
    dim.value = withTiming(1, motion.backdrop);
  }, [step, W, H, hx, hy, hw, hh, hr, dim]);

  // A control reported in: iris onto it the first time, glide to it after; the balloon follows.
  useEffect(() => {
    if (!step || !def || !target || W === 0 || closing) return;
    if (shown?.step === step && shown.rect.x === target.x && shown.rect.y === target.y) return;
    const cfg = opened.current ? motion.guide : motion.guideIn;
    opened.current = true;
    hx.value = withTiming(target.x - HOLE_PAD, cfg);
    hy.value = withTiming(target.y - HOLE_PAD, cfg);
    hw.value = withTiming(target.width + 2 * HOLE_PAD, cfg);
    hh.value = withTiming(target.height + 2 * HOLE_PAD, cfg);
    hr.value = withTiming(def.radius, cfg);
    setShown({ step, rect: target });
    balloon.value = 0;
    balloon.value = withDelay(cfg.duration - 120, withSpring(1, motion.modal));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, target?.x, target?.y, target?.width, target?.height, W, closing]);

  // Fail-safe: a step whose control never reports in would hold the screen behind an invisible layer.
  useEffect(() => {
    if (!step || target || closing) return;
    const timer = setTimeout(() => {
      track('tutorial', { step, action: 'lost' }, hid);
      endTutorial(hid);
    }, LOST_MS);
    return () => clearTimeout(timer);
  }, [step, target, closing, hid, endTutorial]);

  const maskProps = useAnimatedProps(() => ({ x: hx.value, y: hy.value, width: hw.value, height: hh.value, rx: hr.value, ry: hr.value }));
  const ringProps = useAnimatedProps(() => ({ x: hx.value, y: hy.value, width: hw.value, height: hh.value, rx: hr.value, ry: hr.value }));
  const dimProps = useAnimatedProps(() => ({ fillOpacity: dim.value }));
  const balloonStyle = useAnimatedStyle(() => ({
    opacity: balloon.value,
    transform: [{ translateY: (1 - balloon.value) * 10 }, { scale: 0.97 + 0.03 * balloon.value }],
  }));

  if (!step || !def) return null;

  // Done or X: the balloon goes first, the hole opens back out and the dim leaves with it.
  const close = (action: 'done' | 'skip') => {
    if (closing) return;
    track('tutorial', { step, action }, hid);
    setClosing(true);
    balloon.value = withTiming(0, motion.swap);
    hx.value = withTiming(-OPEN_R, motion.guideOut);
    hy.value = withTiming(-OPEN_R, motion.guideOut);
    hw.value = withTiming(W + 2 * OPEN_R, motion.guideOut);
    hh.value = withTiming(H + 2 * OPEN_R, motion.guideOut);
    hr.value = withTiming(OPEN_R, motion.guideOut);
    dim.value = withDelay(120, withTiming(0, motion.backdrop));
    setTimeout(() => endTutorial(hid), motion.guideOut.duration + 40);
  };
  const next = () => {
    if (closing) return;
    if (step === total) {
      close('done');
      return;
    }
    track('tutorial', { step, action: 'next' }, hid);
    balloon.value = withTiming(0, motion.swap);
    const nextDef = TUTORIAL_STEPS[step];
    if (nextDef.tab !== pathname) router.navigate(nextDef.tab);
    setStep(step + 1);
  };
  // The site speaks en, nl and it; de and fr read the English page, as the legal links do.
  const openLink = (url: string) => {
    track('tutorial', { step, action: 'link' }, hid);
    const l = currentLocale();
    void WebBrowser.openBrowserAsync(url.replace('{locale}', l === 'nl' || l === 'it' ? l : 'en'));
  };

  // The balloon belongs to the hole it was set for, under it when there is room, else above it
  // anchored by its bottom edge so its height never has to be known; the caret points at the control.
  const shownDef = shown ? TUTORIAL_STEPS[shown.step - 1] : null;
  const hole = shown ? { x: shown.rect.x - HOLE_PAD, y: shown.rect.y - HOLE_PAD, w: shown.rect.width + 2 * HOLE_PAD, h: shown.rect.height + 2 * HOLE_PAD } : null;
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
    below = spaceBelow >= BALLOON_ROOM || spaceBelow >= hole.y;
    placement = below ? { top: hole.y + hole.h + GAP } : { bottom: H - hole.y + GAP };
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none" onLayout={(e) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
      {W > 0 && H > 0 ? (
        <Svg pointerEvents="none" style={StyleSheet.absoluteFill} width={W} height={H}>
          <Defs>
            <Mask id="tutorial-hole" x={0} y={0} width={W} height={H} maskUnits="userSpaceOnUse">
              <Rect x={0} y={0} width={W} height={H} fill="#FFFFFF" />
              <AnimatedRect animatedProps={maskProps} fill="#000000" />
            </Mask>
          </Defs>
          <AnimatedRect x={0} y={0} width={W} height={H} fill={DIM} animatedProps={dimProps} mask="url(#tutorial-hole)" />
          <AnimatedRect animatedProps={ringProps} fill="none" stroke={colors.surface} strokeWidth={2} />
        </Svg>
      ) : null}
      {hole && !closing ? (
        <>
          <Blocker style={{ top: 0, left: 0, right: 0, height: Math.max(0, hole.y) }} />
          <Blocker style={{ top: hole.y + hole.h, left: 0, right: 0, bottom: 0 }} />
          <Blocker style={{ top: hole.y, height: hole.h, left: 0, width: Math.max(0, hole.x) }} />
          <Blocker style={{ top: hole.y, height: hole.h, left: hole.x + hole.w, right: 0 }} />
        </>
      ) : (
        <Blocker style={StyleSheet.absoluteFill as ViewStyle} />
      )}
      {shownDef && W > 0 ? (
        <Animated.View style={[styles.balloon, { width: balloonW, left }, placement, balloonStyle]} pointerEvents={closing ? 'none' : 'auto'}>
          {hole ? <View style={[styles.caret, below ? { top: -CARET / 2 } : { bottom: -CARET / 2 }, { left: caretX - CARET / 2 }]} /> : null}
          <View style={styles.head}>
            <Text style={styles.title}>{t(`tutorial.steps.${shownDef.key}.title`)}</Text>
            <Pressable onPress={() => close('skip')} hitSlop={10} accessibilityRole="button" accessibilityLabel={t('tutorial.skip')} style={styles.close}>
              <X size={18} color={colors.ink3} />
            </Pressable>
          </View>
          <Text style={styles.body}>{t(`tutorial.steps.${shownDef.key}.body`)}</Text>
          {shownDef.link ? (
            <Pressable onPress={() => openLink(shownDef.link!)} hitSlop={6} accessibilityRole="link" style={{ alignSelf: 'flex-start' }}>
              <Text style={styles.link}>{t('tutorial.readArticle')}</Text>
            </Pressable>
          ) : null}
          <View style={styles.foot}>
            <Text style={styles.counter}>{t('tutorial.counter', { n: shown!.step, total })}</Text>
            <Pressable onPress={next} style={({ pressed }) => [styles.next, pressed && { opacity: 0.85 }]} accessibilityRole="button">
              <Text style={styles.nextText}>{shown!.step === total ? t('tutorial.done') : t('tutorial.next')}</Text>
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
  link: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20, color: colors.ink, textDecorationLine: 'underline' },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  counter: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink3 },
  next: { height: 40, paddingHorizontal: 18, borderRadius: radii.sm, backgroundColor: colors.ink, justifyContent: 'center' },
  nextText: { fontFamily: fonts.semibold, fontSize: 14, color: '#FFFFFF' },
});
