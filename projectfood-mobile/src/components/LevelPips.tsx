import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { colors } from '@/constants/theme';

type Props = { level: number; max: number; size?: number; style?: StyleProp<ViewStyle> };

/**
 * One pip per rung: filled when reached, the next one outlined, the rest faint. A one-rung stamp
 * shows its single pip too (Ricardo, 2026-09-26: Curious had none because there was only one), so
 * every tile on the shelf carries the same row and the eye is not asked to spot an absence.
 */
export function LevelPips({ level, max, size = 6, style }: Props) {
  if (max < 1) return null;
  return (
    <View style={[styles.row, style]} accessibilityLabel={`${level} / ${max}`}>
      {Array.from({ length: max }, (_, i) => {
        const reached = i < level;
        const next = i === level;
        return <View key={i} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: reached ? colors.ink : 'transparent', borderWidth: next ? 1.5 : 1, borderColor: reached ? colors.ink : next ? colors.ink2 : colors.hairline }} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: 4 } });
