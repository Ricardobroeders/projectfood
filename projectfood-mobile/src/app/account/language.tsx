import * as Haptics from 'expo-haptics';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BackHeader, Screen } from '@/components/ui';
import { colors, fonts, radii } from '@/constants/theme';
import { useUpdateSettings } from '@/features/household/queries';
import { currentLocale, type Locale, PICKER_LOCALES, setLocale } from '@/features/i18n';

/** en/nl/it today; de/fr join the list once their strings exist (the catalog falls back to English). */
export default function LanguageScreen() {
  const { t } = useTranslation();
  const update = useUpdateSettings();
  const current = currentLocale();

  const pick = (l: Locale) => {
    if (l === current) return;
    Haptics.selectionAsync();
    setLocale(l);
    update.mutate({ locale: l });
  };

  return (
    <Screen>
      <BackHeader title={t('account.language')} />
      <View style={styles.list}>
        {PICKER_LOCALES.map((l) => {
          const on = l === current;
          return (
            <Pressable key={l} onPress={() => pick(l)} style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.hairline }]} accessibilityRole="radio" accessibilityState={{ selected: on }}>
              <Text style={styles.label}>{t(`languages.${l}`)}</Text>
              {on ? <Check size={20} color={colors.accent} strokeWidth={3} /> : null}
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: 20, gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 56, paddingHorizontal: 16, borderRadius: radii.md, backgroundColor: colors.bgSoft },
  label: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22, color: colors.ink },
});
