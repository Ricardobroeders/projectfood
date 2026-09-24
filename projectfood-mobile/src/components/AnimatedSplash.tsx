import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { ShapeMorph } from '@/components/ShapeMorph';
import { useAppReady } from '@/features/auth/useAppReady';

/** The native splash draws the icon at this width (app.config.ts, expo-splash-screen imageWidth). */
const ICON = 120;
const SPLASH_BG = '#FFFFFF';
const icon = require('../../assets/images/splash-icon.png');

/**
 * The splash, continued in JS (2026-09-24). The native splash is a still image; this overlay
 * draws the same icon at the same place, takes over as soon as it has been laid out, and spends
 * the loading time morphing a window over it. Fades away once fonts, session and household are in.
 */
export function AnimatedSplash({ fontsLoaded }: { fontsLoaded: boolean }) {
  const ready = useAppReady(fontsLoaded);
  const [mounted, setMounted] = useState(true);
  const opacity = useSharedValue(1);

  // First paint: the overlay now covers the native splash pixel for pixel, so let that one go.
  const onLayout = useCallback(() => {
    void SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (!ready) return;
    opacity.value = withTiming(0, { duration: 260 }, (finished) => {
      if (finished) scheduleOnRN(setMounted, false);
    });
  }, [ready, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  if (!mounted) return null;
  return (
    <Animated.View style={[styles.root, style]} onLayout={onLayout} pointerEvents="none">
      <ShapeMorph size={ICON} source={icon} bg={SPLASH_BG} delay={400} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: SPLASH_BG, alignItems: 'center', justifyContent: 'center' },
});
