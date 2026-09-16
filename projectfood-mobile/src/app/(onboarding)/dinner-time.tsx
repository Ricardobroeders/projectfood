import { getCalendars } from 'expo-localization';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { DinnerTimePicker } from '@/components/DinnerTimePicker';
import { BackHeader, ErrorText, PrimaryButton, Screen } from '@/components/ui';
import { colors, fonts } from '@/constants/theme';
import { track } from '@/features/events/track';
import { useHousehold, useUpdateHousehold } from '@/features/household/queries';
import { currentLocale } from '@/features/i18n';

/** Localised default: NL/EN eat around 18:00, IT around 20:00 (KB habit loop). */
function defaultDinner(): string {
  return currentLocale() === 'it' ? '20:00' : '18:00';
}

export default function DinnerTimeScreen() {
  const { t } = useTranslation();
  const { data: hh } = useHousehold();
  const update = useUpdateHousehold();
  const [time, setTime] = useState(hh?.household.onboarded_at ? hh.household.dinner_time.slice(0, 5) : defaultDinner());

  const finish = async () => {
    if (!hh) return;
    const tz = getCalendars()[0]?.timeZone ?? hh.household.timezone;
    await update.mutateAsync({ id: hh.household.id, patch: { dinner_time: time, timezone: tz, onboarded_at: new Date().toISOString() } });
    track('onboarding_completed', { members: hh.members.length, dinner_time: time }, hh.household.id);
    // the route guard moves to the tabs once the household refetches
  };

  return (
    <Screen>
      <BackHeader />
      <View style={styles.body}>
        <Text style={styles.title}>{t('onboarding.dinnerTitle')}</Text>
        <Text style={styles.sub}>{t('onboarding.dinnerSub')}</Text>
        <DinnerTimePicker value={time} onChange={setTime} />
        <ErrorText>{update.error ? t('common.error') : null}</ErrorText>
        <PrimaryButton label={t('onboarding.finish')} onPress={finish} loading={update.isPending} style={{ marginTop: 24 }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 20, paddingTop: 16, gap: 12 },
  title: { fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 32, color: colors.ink, letterSpacing: -0.4 },
  sub: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.ink2, marginBottom: 12 },
});
