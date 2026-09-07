import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { memo, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { CATS, colors, fonts, radii, shadows } from '@/constants/theme';
import type { Plant } from '@/data/plants';
import type { Locale } from '@/i18n';
import { XP_PER_PLANT } from '@/state/store';

type Props = {
  plant: Plant;
  checked: boolean;
  locale: Locale;
  catLabel: string;
  onToggle: (slug: string) => void;
};

function PlantRowInner({ plant, checked, locale, catLabel, onToggle }: Props) {
  const cat = CATS[plant.category];
  const progress = useSharedValue(checked ? 1 : 0);
  const wiggle = useSharedValue(0);
  const bump = useSharedValue(1);
  const press = useSharedValue(1);
  const burst = useSharedValue(0);
  const mounted = useRef(false);

  useEffect(() => {
    progress.value = withSpring(checked ? 1 : 0, { damping: 14, stiffness: 220 });
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (checked) {
      // The clay render gets a little shake and a bump; the animation lives around the raster asset.
      wiggle.value = withSequence(withTiming(-10, { duration: 70 }), withSpring(0, { damping: 5, stiffness: 260 }));
      bump.value = withSequence(
        withTiming(1.18, { duration: 110, easing: Easing.out(Easing.quad) }),
        withSpring(1, { damping: 8, stiffness: 240 }),
      );
      burst.value = 0;
      burst.value = withTiming(1, { duration: 850, easing: Easing.out(Easing.cubic) });
    }
  }, [checked, progress, wiggle, bump, burst]);

  const rowStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.surface, colors.checkedRow]),
    transform: [{ scale: press.value }],
  }));
  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wiggle.value}deg` }, { scale: bump.value }],
  }));
  const circleStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.bgSoft, colors.accent]),
    transform: [{ scale: interpolate(progress.value, [0, 0.5, 1], [1, 1.22, 1]) }],
  }));
  const checkStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.3, 1]) }],
  }));
  const burstStyle = useAnimatedStyle(() => ({
    opacity: burst.value === 0 ? 0 : 1 - burst.value,
    transform: [{ translateY: -34 * burst.value }, { scale: 0.8 + 0.4 * burst.value }],
  }));

  return (
    <Pressable
      onPressIn={() => (press.value = withTiming(0.98, { duration: 80 }))}
      onPressOut={() => (press.value = withSpring(1, { damping: 12, stiffness: 300 }))}
      onPress={() => {
        Haptics.impactAsync(checked ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
        onToggle(plant.slug);
      }}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={plant.name[locale]}>
      <Animated.View style={[styles.row, shadows.md, rowStyle]}>
        <View style={[styles.tile, { backgroundColor: cat.bg }]}>
          <Animated.View style={imageStyle}>
            <Image source={plant.image} style={styles.image} contentFit="contain" transition={120} />
          </Animated.View>
        </View>
        <View style={styles.text}>
          <Text style={styles.name} numberOfLines={1}>
            {plant.name[locale]}
          </Text>
          <Text style={[styles.cat, { color: cat.fg }]} numberOfLines={1}>
            {catLabel}
          </Text>
        </View>
        <View style={styles.checkWrap}>
          <Animated.View style={[styles.burst, burstStyle]} pointerEvents="none">
            <Text style={styles.burstText}>+{XP_PER_PLANT}</Text>
          </Animated.View>
          <Animated.View style={[styles.circle, circleStyle]}>
            <Animated.View style={checkStyle}>
              <Feather name="check" size={22} color={colors.ink} />
            </Animated.View>
          </Animated.View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export const PlantRow = memo(PlantRowInner);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.lg,
    marginBottom: 12,
    height: 84,
  },
  tile: {
    width: 84,
    height: 84,
    borderTopLeftRadius: radii.lg,
    borderBottomLeftRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: 58, height: 58 },
  text: { flex: 1, paddingHorizontal: 16, gap: 2 },
  name: { fontFamily: fonts.semibold, fontSize: 17, color: colors.ink },
  cat: { fontFamily: fonts.medium, fontSize: 13 },
  checkWrap: { width: 64, height: 84, alignItems: 'center', justifyContent: 'center' },
  circle: { width: 40, height: 40, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center' },
  burst: { position: 'absolute', top: 6 },
  burstText: { fontFamily: fonts.bold, fontSize: 15, color: colors.accentPressed },
});
