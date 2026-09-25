import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BackHeader, Screen } from '@/components/ui';
import { colors, fonts, radii } from '@/constants/theme';
import { FLAGS } from '@/data/flags';
import { useUpdateSettings } from '@/features/household/queries';
import { type Locale, PICKER_LOCALES, setLocale, useLocale } from '@/features/i18n';

/** en/nl/it today; de/fr join the list once their strings exist (the catalog falls back to English). */
export default function LanguageScreen() {
  const { t } = useTranslation();
  const update = useUpdateSettings();
  const current = useLocale();

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
              <View style={styles.flagDisc}>
                <Image source={FLAGS[l]} style={styles.flag} contentFit="cover" />
              </View>
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, height: 56, paddingHorizontal: 16, borderRadius: radii.md, backgroundColor: colors.bgSoft },
  // The same round flag as the Account row: a white disc with the flag 2 px inside it.
  flagDisc: { width: 36, height: 36, borderRadius: radii.full, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  flag: { width: 32, height: 32, borderRadius: radii.full, overflow: 'hidden' },
  label: { flex: 1, fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22, color: colors.ink },
});
