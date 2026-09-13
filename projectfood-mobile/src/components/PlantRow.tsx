import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Check } from 'lucide-react-native';
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

import { AvatarStack } from '@/components/MemberAvatar';
import { motion, REWARD_BUMP_PEAK } from '@/constants/motion';
import { CATS, colors, fonts, radii } from '@/constants/theme';
import type { Plant } from '@/data/plants';
import type { Locale } from '@/i18n';
import { XP_PER_PLANT, type Member } from '@/state/store';

type Props = {
  plant: Plant;
  /** Ids of the members who tasted it tonight. */
  tasters: string[];
  members: Member[];
  defaultIds: string[];
  locale: Locale;
  catLabel: string;
  onTap: (slug: string) => void;
  onHold: (slug: string) => void;
};

function PlantRowInner({ plant, tasters, members, defaultIds, locale, catLabel, onTap, onHold }: Props) {
  const cat = CATS[plant.category];
  const tasted = tasters.length > 0;
  // The check circle fills when the whole default set has tasted it; a partial set shows as avatars.
  const complete = defaultIds.length > 0 && defaultIds.every((id) => tasters.includes(id));
  const who = members.filter((m) => tasters.includes(m.id));

  const progress = useSharedValue(tasted ? 1 : 0);
  const full = useSharedValue(complete ? 1 : 0);
  const wiggle = useSharedValue(0);
  const bump = useSharedValue(1);
  const press = useSharedValue(1);
  const burst = useSharedValue(0);
  const prevCount = useRef(tasters.length);

  useEffect(() => {
    // toggle class: the state itself
    progress.value = withSpring(tasted ? 1 : 0, motion.toggle);
    full.value = withSpring(complete ? 1 : 0, motion.toggle);
    const added = tasters.length - prevCount.current;
    prevCount.current = tasters.length;
    if (added > 0) {
      // reward class: the clay render shakes and bumps, the XP chip floats up
      wiggle.value = withSequence(withTiming(-8, { duration: 70 }), withSpring(0, { damping: 7, stiffness: 260 }));
      bump.value = withSequence(withTiming(REWARD_BUMP_PEAK, { duration: 110, easing: Easing.out(Easing.quad) }), withSpring(1, motion.rewardSoft));
      burst.value = 0;
      burst.value = withTiming(1, { duration: 850, easing: Easing.out(Easing.cubic) });
    }
  }, [tasted, complete, tasters.length, progress, full, wiggle, bump, burst]);

  const rowStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.bgSoft, colors.checkedRow]),
    transform: [{ scale: press.value }],
  }));
  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wiggle.value}deg` }, { scale: bump.value }],
  }));
  const circleStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(full.value, [0, 1], [colors.surface, colors.accent]),
    transform: [{ scale: interpolate(full.value, [0, 0.5, 1], [1, REWARD_BUMP_PEAK, 1]) }],
  }));
  const checkStyle = useAnimatedStyle(() => ({
    opacity: full.value,
    transform: [{ scale: interpolate(full.value, [0, 1], [0.3, 1]) }],
  }));
  const burstStyle = useAnimatedStyle(() => ({
    opacity: burst.value === 0 ? 0 : 1 - burst.value,
    transform: [{ translateY: -34 * burst.value }, { scale: 0.9 + 0.2 * burst.value }],
  }));

  return (
    <Pressable
      onPressIn={() => (press.value = withTiming(0.98, motion.pressIn))}
      onPressOut={() => (press.value = withSpring(1, motion.pressOut))}
      onPress={() => {
        Haptics.impactAsync(complete ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
        onTap(plant.slug);
      }}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        onHold(plant.slug);
      }}
      delayLongPress={320}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: complete ? true : tasted ? 'mixed' : false }}
      accessibilityLabel={plant.name[locale]}>
      <Animated.View style={[styles.row, rowStyle]}>
        <View style={[styles.tile, { backgroundColor: cat.bg }]}>
          <Animated.View style={imageStyle}>
            <Image source={plant.image} style={styles.image} contentFit="contain" transition={120} />
          </Animated.View>
        </View>
        <View style={styles.text}>
          <Text style={styles.name} numberOfLines={1}>
            {plant.name[locale]}
          </Text>
          {who.length > 0 && members.length > 1 ? (
            <AvatarStack members={who} size={22} ring={colors.checkedRow} />
          ) : (
            <Text style={[styles.cat, { color: cat.fg }]} numberOfLines={1}>
              {catLabel}
            </Text>
          )}
        </View>
        <View style={styles.checkWrap}>
          <Animated.View style={[styles.burst, burstStyle]} pointerEvents="none">
            <Text style={styles.burstText}>+{XP_PER_PLANT}</Text>
          </Animated.View>
          <Animated.View style={[styles.circle, circleStyle]}>
            <Animated.View style={checkStyle}>
              <Check size={22} color={colors.onAccent} strokeWidth={2.5} />
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
    marginBottom: 10,
    height: 84,
    overflow: 'hidden',
  },
  tile: { width: 84, height: 84, alignItems: 'center', justifyContent: 'center' },
  image: { width: 58, height: 58 },
  text: { flex: 1, paddingHorizontal: 16, gap: 4, justifyContent: 'center' },
  name: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 22, color: colors.ink },
  cat: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18 },
  checkWrap: { width: 64, height: 84, alignItems: 'center', justifyContent: 'center' },
  circle: { width: 40, height: 40, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center' },
  burst: { position: 'absolute', top: 6 },
  burstText: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, color: colors.accentPressed },
});
