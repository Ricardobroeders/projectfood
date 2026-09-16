import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { BackHeader, ErrorText, PrimaryButton, Screen } from '@/components/ui';
import { colors, fonts } from '@/constants/theme';
import { signOutEverywhere } from '@/features/auth/signOut';
import { supabase } from '@/features/supabase/client';

/** In-app account deletion (App Store 5.1.1(v), Play user-data policy). Calls the delete-account Edge Function. */
export default function DeleteAccountScreen() {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = () =>
    Alert.alert(t('account.deleteTitle'), t('account.deleteBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('account.deleteCta'), style: 'destructive', onPress: run },
    ]);

  const run = async () => {
    setBusy(true);
    setError(null);
    const { error: fnError } = await supabase.functions.invoke('delete-account', { method: 'POST' });
    if (fnError) {
      setBusy(false);
      setError(t('common.error'));
      return;
    }
    await signOutEverywhere();
  };

  return (
    <Screen>
      <BackHeader title={t('account.deleteAccount')} />
      <View style={styles.body}>
        <Text style={styles.title}>{t('account.deleteTitle')}</Text>
        <Text style={styles.text}>{t('account.deleteBody')}</Text>
        <ErrorText>{error}</ErrorText>
        <PrimaryButton label={t('account.deleteCta')} onPress={confirm} loading={busy} style={{ marginTop: 24, backgroundColor: '#C2533D' }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 20, paddingTop: 16, gap: 8 },
  title: { fontFamily: fonts.extrabold, fontSize: 24, lineHeight: 30, color: colors.ink },
  text: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.ink2 },
});
