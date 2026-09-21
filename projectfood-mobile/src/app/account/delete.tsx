import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, BackHandler, StyleSheet, Text, View } from 'react-native';

import { BackHeader, ErrorText, PrimaryButton, Screen } from '@/components/ui';
import { colors, fonts } from '@/constants/theme';
import { signOutEverywhere } from '@/features/auth/signOut';
import { supabase } from '@/features/supabase/client';

/**
 * In-app account deletion (App Store 5.1.1(v), Play user-data policy). Calls the delete-account Edge
 * Function, then shows a receipt before signing out: after the sign-out there is no account left to
 * show anything on, and without the receipt the deletion looks like a crash.
 */
export default function DeleteAccountScreen() {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
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
    setBusy(false);
    if (fnError) {
      setError(t('common.error'));
      return;
    }
    setDone(true);
  };

  const finish = useCallback(async () => {
    setBusy(true);
    await signOutEverywhere();
  }, []);

  // once deleted the only way out is the sign-out; the Android back button takes it too
  useEffect(() => {
    if (!done) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      void finish();
      return true;
    });
    return () => sub.remove();
  }, [done, finish]);

  if (done) {
    return (
      <Screen>
        <Stack.Screen options={{ gestureEnabled: false }} />
        <View style={[styles.body, styles.receipt]}>
          <Text style={styles.title}>{t('account.deletedTitle')}</Text>
          <Text style={styles.text}>{t('account.deletedBody')}</Text>
          <PrimaryButton label={t('account.deletedCta')} onPress={() => void finish()} loading={busy} style={{ marginTop: 24 }} />
        </View>
      </Screen>
    );
  }

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
  receipt: { paddingTop: 56 },
  title: { fontFamily: fonts.extrabold, fontSize: 24, lineHeight: 30, color: colors.ink },
  text: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.ink2 },
});
