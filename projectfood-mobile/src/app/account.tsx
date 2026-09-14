import * as Haptics from 'expo-haptics';
import { ChevronRight, CreditCard, type LucideIcon, RotateCcw, Trash2 } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { accentName, colors, fonts, radii } from '@/constants/theme';
import type { Locale } from '@/i18n';
import { useStore } from '@/state/store';

/**
 * Account tab (Figma nav: Log · Family · Groceries · Account). For now it holds the language switch
 * and the prototype controls that used to sit on the log screen, so the log stays a logging screen.
 */
export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const { locale, card, members, checked, t, dispatch } = useStore();

  const setLocale = (l: Locale) => {
    if (l === locale) return;
    Haptics.selectionAsync();
    dispatch({ type: 'setLocale', locale: l });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{t.account}</Text>

      <Text style={styles.section}>{t.language}</Text>
      <View style={styles.segments}>
        {(['en', 'nl'] as const).map((l) => {
          const on = locale === l;
          return (
            <Pressable key={l} onPress={() => setLocale(l)} style={[styles.segment, on && { backgroundColor: colors.ink }]} accessibilityRole="radio" accessibilityState={{ selected: on }}>
              <Text style={[styles.segmentText, on && { color: '#FFFFFF' }]}>{l === 'en' ? t.english : t.dutch}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.section}>{t.prototype}</Text>
      <Text style={styles.note}>{t.pocNote}</Text>
      <View style={styles.rows}>
        {card ? <Row icon={CreditCard} label={t.myCard} onPress={() => dispatch({ type: 'showCard' })} /> : null}
        <Row icon={RotateCcw} label={t.resetTonight} disabled={checked.length === 0} onPress={() => dispatch({ type: 'reset' })} />
        <Row icon={Trash2} label={t.clearFamily} disabled={members.length === 0} onPress={() => dispatch({ type: 'clearFamily' })} />
      </View>

      <Text style={styles.footnote}>POC · accent {accentName}</Text>
    </ScrollView>
  );
}

function Row({ icon: Icon, label, onPress, disabled }: { icon: LucideIcon; label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.hairline }, disabled && { opacity: 0.4 }]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button">
      <View style={styles.rowIcon}>
        <Icon size={18} color={colors.ink} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <ChevronRight size={18} color={colors.ink3} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  title: { fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 32, color: colors.ink, letterSpacing: -0.4 },
  section: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, color: colors.ink, marginTop: 24, marginBottom: 8 },
  note: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink3, marginTop: -4, marginBottom: 10 },
  segments: { flexDirection: 'row', gap: 8 },
  segment: { height: 40, paddingHorizontal: 18, borderRadius: radii.sm, backgroundColor: colors.bgSoft, justifyContent: 'center' },
  segmentText: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 18, color: colors.ink },
  rows: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 56, paddingLeft: 10, paddingRight: 14, borderRadius: radii.md, backgroundColor: colors.bgSoft },
  rowIcon: { width: 36, height: 36, borderRadius: radii.full, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink },
  footnote: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, color: colors.ink3, textAlign: 'center', marginTop: 32 },
});
