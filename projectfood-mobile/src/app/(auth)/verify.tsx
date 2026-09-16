import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackHeader, ErrorText, PrimaryButton, TextButton } from '@/components/ui';
import { colors, fonts, radii } from '@/constants/theme';
import { sendEmailCode, verifyEmailCode } from '@/features/auth/otp';

export default function VerifyScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  const verify = async () => {
    if (!email) return;
    setBusy(true);
    setError(null);
    try {
      await verifyEmailCode(email, code);
      // the session listener flips the route guard
    } catch {
      setError(t('auth.errorInvalidCode'));
    } finally {
      setBusy(false);
    }
  };
  const resend = async () => {
    if (!email) return;
    try {
      await sendEmailCode(email);
      setResent(true);
    } catch {
      setError(t('common.error'));
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.screen, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }]}>
      <BackHeader />
      <View style={styles.body}>
        <Text style={styles.title}>{t('auth.codeSentBody', { email })}</Text>
        <TextInput
          style={styles.code}
          value={code}
          onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 8))}
          placeholder={t('auth.codePlaceholder')}
          placeholderTextColor={colors.ink3}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          autoFocus
          maxLength={8}
          onSubmitEditing={() => code.length >= 6 && verify()}
        />
        <PrimaryButton label={t('auth.verifyCode')} onPress={verify} disabled={code.length < 6} loading={busy} />
        <ErrorText>{error}</ErrorText>
        <TextButton label={resent ? t('common.saved') : t('auth.resendCode')} onPress={resend} disabled={resent} />
        <TextButton label={t('auth.useDifferentEmail')} onPress={() => router.back()} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { paddingHorizontal: 24, paddingTop: 24, gap: 12 },
  title: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 26, color: colors.ink, marginBottom: 8 },
  code: { height: 64, borderRadius: radii.md, backgroundColor: colors.bgSoft, paddingHorizontal: 16, fontFamily: fonts.extrabold, fontSize: 28, letterSpacing: 6, color: colors.ink, textAlign: 'center' },
});
