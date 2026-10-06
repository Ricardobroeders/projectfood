import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

type Props = {
  /** Centre of the burst, in the parent's coordinates. */
  cx: number;
  cy: number;
  /** Radius the rays reach; the square they are drawn in is twice this, so it stays covered while turning. */
  radius: number;
  color?: string;
  opacity?: number;
  /** Turning while true; one full turn takes `period` ms. */
  play: boolean;
  period?: number;
};

const RAYS = 12;
const HALF_WIDTH = 6; // degrees; 12° of every 30° is a ray

const toXY = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${r + r * Math.cos(a)} ${r + r * Math.sin(a)}`;
};

// One path for the whole burst: a wedge from the centre to the edge, every 360/RAYS degrees.
const burst = (r: number) =>
  Array.from({ length: RAYS }, (_, i) => {
    const mid = (i * 360) / RAYS;
    return `M${r} ${r} L${toXY(r, mid - HALF_WIDTH)} L${toXY(r, mid + HALF_WIDTH)} Z`;
  }).join(' ');

/**
 * The sunburst behind a gold reward (Ricardo's Figma, 2026-10-06): white rays at half opacity on
 * the gold gradient, turning slowly so the sheet feels alive without anything bouncing. Linear
 * and endless, so the turn has no visible start or end. The parent clips it.
 */
export function SunRays({ cx, cy, radius, color = '#FFFFFF', opacity = 0.5, play, period = 48000 }: Props) {
  const spin = useSharedValue(0);
  useEffect(() => {
    if (play) {
      spin.value = 0;
      spin.value = withRepeat(withTiming(360, { duration: period, easing: Easing.linear }), -1, false);
    } else {
      cancelAnimation(spin);
    }
    return () => cancelAnimation(spin);
  }, [play, period, spin]);

  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value}deg` }] }));
  const size = radius * 2;
  const path = burst(radius);
  return (
    <Animated.View pointerEvents="none" style={[styles.box, { width: size, height: size, left: cx - radius, top: cy - radius }, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Path d={path} fill={color} fillOpacity={opacity} />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: { position: 'absolute' },
});
