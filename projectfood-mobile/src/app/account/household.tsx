import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { DinnerTimePicker } from '@/components/DinnerTimePicker';
import { BackHeader, ErrorText, Loading, PrimaryButton, Screen } from '@/components/ui';
import { colors, fonts, radii } from '@/constants/theme';
import { useHousehold, useUpdateHousehold } from '@/features/household/queries';

export default function HouseholdScreen() {
  const { t } = useTranslation();
  const { data: hh } = useHousehold();
  const update = useUpdateHousehold();
  const [name, setName] = useState('');
  const [time, setTime] = useState('18:00');
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (hh) {
      setName(hh.household.name);
      setTime(hh.household.dinner_time.slice(0, 5));
    }
  }, [hh]);
  if (!hh) return <Loading />;

  const save = async () => {
    await update.mutateAsync({ id: hh.household.id, patch: { name: name.trim() || hh.household.name, dinner_time: time } });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <Screen>
      <BackHeader title={t('account.household')} />
      <View style={styles.body}>
        <Text style={styles.label}>{t('account.householdName')}</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} maxLength={40} placeholderTextColor={colors.ink3} />
        <Text style={styles.label}>{t('account.dinnerTime')}</Text>
        <Text style={styles.sub}>{t('onboarding.dinnerSub')}</Text>
        <DinnerTimePicker value={time} onChange={setTime} />
        <ErrorText>{update.error ? t('common.error') : null}</ErrorText>
        <PrimaryButton label={saved ? t('common.saved') : t('common.save')} onPress={save} loading={update.isPending} style={{ marginTop: 24 }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 20, paddingTop: 12, gap: 8 },
  label: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, color: colors.ink, marginTop: 16 },
  sub: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink2, marginBottom: 4 },
  input: { height: 54, borderRadius: radii.md, backgroundColor: colors.bgSoft, paddingHorizontal: 16, fontFamily: fonts.semibold, fontSize: 17, color: colors.ink },
});
