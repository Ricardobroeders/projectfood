import * as AppleAuthentication from 'expo-apple-authentication';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { KeyRound, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorText, PrimaryButton, SecondaryButton } from '@/components/ui';
import { colors, fonts, radii } from '@/constants/theme';
import { signInWithApple } from '@/features/auth/apple';
import { signInWithGoogle } from '@/features/auth/google';
import { sendEmailCode } from '@/features/auth/otp';
import { isReviewEmail, signInWithPassword } from '@/features/auth/password';
import { currentLocale } from '@/features/i18n';
import { ENV } from '@/features/supabase/env';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState<'google' | 'apple' | 'email' | 'password' | null>(null);
  const [error, setError] = useState<string | null>(null);
  // The store review account: the same email field, but a password instead of the code (App access declaration).
  const review = isReviewEmail(email);

  const run = async (kind: NonNullable<typeof busy>, fn: () => Promise<unknown>) => {
    setBusy(kind);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'));
    } finally {
      setBusy(null);
    }
  };

  const sendCode = () =>
    run('email', async () => {
      await sendEmailCode(email);
      router.push({ pathname: '/verify', params: { email: email.trim().toLowerCase() } });
    });

  const signInReview = () =>
    run('password', async () => {
      try {
        await signInWithPassword(email, password);
      } catch {
        throw new Error(t('auth.errorInvalidPassword'));
      }
    });

  const canSubmit = EMAIL_RE.test(email) && busy === null && (!review || password.length > 0);
  const submit = () => canSubmit && (review ? signInReview() : sendCode());

  const openLegal = (kind: 'privacy' | 'terms') => {
    const url = (kind === 'privacy' ? ENV.privacyUrl : ENV.termsUrl).replace('{locale}', currentLocale() === 'de' || currentLocale() === 'fr' ? 'en' : currentLocale());
    void WebBrowser.openBrowserAsync(url);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.screen, { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.brand}>
        <Text style={styles.wordmark}>Project Food</Text>
        <Text style={styles.tagline}>{t('auth.tagline')}</Text>
      </View>

      <View style={styles.form}>
        <SecondaryButton label={t('auth.continueWithGoogle')} onPress={() => run('google', signInWithGoogle)} loading={busy === 'google'} disabled={busy !== null} />
        {Platform.OS === 'ios' ? (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={radii.md}
            style={styles.apple}
            onPress={() => run('apple', signInWithApple)}
          />
        ) : null}

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.or}>{t('auth.or')}</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.inputWrap}>
          <Mail size={18} color={colors.ink3} />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder={t('auth.emailPlaceholder')}
            placeholderTextColor={colors.ink3}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            returnKeyType={review ? 'next' : 'send'}
            onSubmitEditing={() => !review && submit()}
          />
        </View>
        {review ? (
          <View style={styles.inputWrap}>
            <KeyRound size={18} color={colors.ink3} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder={t('auth.passwordPlaceholder')}
              placeholderTextColor={colors.ink3}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
              returnKeyType="go"
              onSubmitEditing={submit}
            />
          </View>
        ) : null}
        <PrimaryButton label={review ? t('auth.signIn') : t('auth.sendCode')} onPress={submit} disabled={!canSubmit} loading={busy === 'email' || busy === 'password'} />
        <ErrorText>{error}</ErrorText>
      </View>

      <Text style={styles.legal}>
        {t('auth.legal', { terms: '__T__', privacy: '__P__' })
          .split(/(__T__|__P__)/)
          .map((part, i) =>
            part === '__T__' ? (
              <Text key={i} style={styles.link} onPress={() => openLegal('terms')}>
                {t('auth.terms')}
              </Text>
            ) : part === '__P__' ? (
              <Text key={i} style={styles.link} onPress={() => openLegal('privacy')}>
                {t('auth.privacy')}
              </Text>
            ) : (
              <Text key={i}>{part}</Text>
            ),
          )}
      </Text>
      <Pressable style={{ height: 0 }} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24, justifyContent: 'space-between' },
  brand: { gap: 8 },
  wordmark: { fontFamily: fonts.extrabold, fontSize: 34, lineHeight: 40, color: colors.ink, letterSpacing: -0.8 },
  tagline: { fontFamily: fonts.medium, fontSize: 17, lineHeight: 24, color: colors.ink2 },
  form: { gap: 12 },
  apple: { height: 54, alignSelf: 'stretch' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 4 },
  line: { flex: 1, height: 1, backgroundColor: colors.hairline },
  or: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink3 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 54, borderRadius: radii.md, backgroundColor: colors.bgSoft, paddingHorizontal: 16 },
  input: { flex: 1, fontFamily: fonts.semibold, fontSize: 16, color: colors.ink, height: 54 },
  legal: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 18, color: colors.ink3, textAlign: 'center' },
  link: { color: colors.ink2, textDecorationLine: 'underline' },
});
