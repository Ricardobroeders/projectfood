import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react-native';
import type { PropsWithChildren, ReactNode } from 'react';
import { ActivityIndicator, type GestureResponderEvent, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { ShapeMorph } from '@/components/ShapeMorph';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, radii } from '@/constants/theme';

/** Small shared primitives so screens stay declarative. Radius by height, grey surfaces, no shadows. */

type ButtonProps = { label: string; onPress: (e: GestureResponderEvent) => void; disabled?: boolean; loading?: boolean; icon?: ReactNode; style?: StyleProp<ViewStyle> };

export function PrimaryButton({ label, onPress, disabled, loading, icon, style }: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.primary, style, pressed && { backgroundColor: colors.accentPressed }, (disabled || loading) && { opacity: 0.45 }]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button">
      {loading ? <ActivityIndicator color={colors.onAccent} /> : icon}
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress, disabled, loading, icon, style }: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.secondary, style, pressed && { backgroundColor: colors.hairline }, (disabled || loading) && { opacity: 0.45 }]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button">
      {loading ? <ActivityIndicator color={colors.ink} /> : icon}
      <Text style={styles.secondaryText}>{label}</Text>
    </Pressable>
  );
}

export function TextButton({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable style={styles.textBtn} onPress={onPress} disabled={disabled} accessibilityRole="button">
      <Text style={[styles.textBtnLabel, disabled && { opacity: 0.45 }]}>{label}</Text>
    </Pressable>
  );
}

/** Screen container that respects the notch; `scroll` content should be wrapped by the caller. */
export function Screen({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  const insets = useSafeAreaInsets();
  return <View style={[styles.screen, { paddingTop: insets.top + 8 }, style]}>{children}</View>;
}

export function ScreenTitle({ children, meta }: { children: string; meta?: string }) {
  return (
    <View style={styles.titleRow}>
      <Text style={styles.title}>{children}</Text>
      {meta ? <Text style={styles.titleMeta}>{meta}</Text> : null}
    </View>
  );
}

/** Back chevron + title for pushed screens (the stack header is hidden app-wide). */
export function BackHeader({ title, right }: { title?: string; right?: ReactNode }) {
  const router = useRouter();
  return (
    <View style={styles.backHeader}>
      <Pressable onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" hitSlop={8}>
        <ChevronLeft size={22} color={colors.ink} />
      </Pressable>
      <Text style={styles.backTitle} numberOfLines={1}>
        {title ?? ''}
      </Text>
      <View style={styles.backRight}>{right}</View>
    </View>
  );
}

export function SectionTitle({ children, meta }: { children: string; meta?: string }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.section}>{children}</Text>
      {meta ? <Text style={styles.sectionMeta}>{meta}</Text> : null}
    </View>
  );
}

type RowProps = { icon?: LucideIcon; label: string; value?: string; onPress?: () => void; destructive?: boolean; right?: ReactNode; disabled?: boolean };

/** Settings row: icon disc, label, optional value, chevron. */
export function SettingsRow({ icon: Icon, label, value, onPress, destructive, right, disabled }: RowProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && onPress && { backgroundColor: colors.hairline }, disabled && { opacity: 0.45 }]}
      onPress={onPress}
      disabled={!onPress || disabled}
      accessibilityRole={onPress ? 'button' : undefined}>
      {Icon ? (
        <View style={styles.rowIcon}>
          <Icon size={18} color={destructive ? '#C2533D' : colors.ink} />
        </View>
      ) : null}
      <Text style={[styles.rowLabel, destructive && { color: '#C2533D' }]} numberOfLines={1}>
        {label}
      </Text>
      {value ? (
        <Text style={styles.rowValue} numberOfLines={1}>
          {value}
        </Text>
      ) : null}
      {right ?? (onPress ? <ChevronRight size={18} color={colors.ink3} /> : null)}
    </Pressable>
  );
}

export function Chip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, on && { backgroundColor: colors.ink }]} accessibilityRole="radio" accessibilityState={{ selected: on }}>
      <Text style={[styles.chipText, on && { color: '#FFFFFF' }]}>{label}</Text>
    </Pressable>
  );
}

export function ErrorText({ children }: { children: string | null | undefined }) {
  if (!children) return null;
  return <Text style={styles.error}>{children}</Text>;
}

/** The app's spinner: the same morphing shape as the splash, small and in the muted ink. */
export function Loading() {
  return (
    <View style={styles.loading}>
      <ShapeMorph size={28} color={colors.ink3} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  primary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, alignSelf: 'stretch', backgroundColor: colors.accent, borderRadius: radii.md, height: 54, paddingHorizontal: 24 },
  primaryText: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 22, color: colors.onAccent },
  secondary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, alignSelf: 'stretch', backgroundColor: colors.bgSoft, borderRadius: radii.md, height: 54, paddingHorizontal: 24 },
  secondaryText: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22, color: colors.ink },
  textBtn: { paddingVertical: 12, alignItems: 'center' },
  textBtnLabel: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink2 },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 20 },
  title: { fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 32, color: colors.ink, letterSpacing: -0.4 },
  titleMeta: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink3 },
  backHeader: { flexDirection: 'row', alignItems: 'center', height: 44, paddingHorizontal: 12 },
  backBtn: { width: 40, height: 40, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bgSoft },
  backTitle: { flex: 1, textAlign: 'center', fontFamily: fonts.bold, fontSize: 16, lineHeight: 22, color: colors.ink },
  backRight: { width: 40, alignItems: 'flex-end' },
  sectionRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 24, marginBottom: 8 },
  section: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, color: colors.ink },
  sectionMeta: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink3 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 56, paddingLeft: 10, paddingRight: 14, borderRadius: radii.md, backgroundColor: colors.bgSoft },
  rowIcon: { width: 36, height: 36, borderRadius: radii.full, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink },
  rowValue: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 18, color: colors.ink3, maxWidth: 140 },
  chip: { height: 36, paddingHorizontal: 16, borderRadius: radii.sm, backgroundColor: colors.bgSoft, justifyContent: 'center' },
  chipText: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 18, color: colors.ink },
  error: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: '#C2533D', marginTop: 8 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
});
