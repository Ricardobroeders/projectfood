import '@/features/i18n';

import { PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold, useFonts } from '@expo-google-fonts/plus-jakarta-sans';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { getCalendars } from 'expo-localization';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui';
import { colors, fonts } from '@/constants/theme';
import { SessionProvider, useSession } from '@/features/auth/useSession';
import { useHousehold, useSettings, useUpdateHousehold, useUpdateSettings } from '@/features/household/queries';
import { deviceLocale, isLocale, setLocale } from '@/features/i18n';
import { registerPushToken } from '@/features/notifications/push';
import { PERSISTED_QUERY_KEYS, queryClient, queryPersister } from '@/features/supabase/queryClient';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold });
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: queryPersister,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        dehydrateOptions: { shouldDehydrateQuery: (q) => q.state.status === 'success' && PERSISTED_QUERY_KEYS.has(String(q.queryKey[0])) },
      }}>
      <SessionProvider>
        <StatusBar style="dark" />
        <Gate fontsLoaded={fontsLoaded} />
      </SessionProvider>
    </PersistQueryClientProvider>
  );
}

/**
 * Route guards: signed out -> (auth); signed in without a finished onboarding -> (onboarding);
 * otherwise the tabs and the detail routes. Also syncs device timezone and language on cold start.
 */
function Gate({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { t } = useTranslation();
  const { session, loading } = useSession();
  const hh = useHousehold();
  const settings = useSettings();
  const updateHousehold = useUpdateHousehold();
  const updateSettings = useUpdateSettings();

  const signedIn = !!session;
  const householdKnown = !signedIn || hh.data !== undefined || hh.isError;
  const ready = fontsLoaded && !loading && householdKnown;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  // Language: the account setting wins; a fresh account takes the phone's language.
  useEffect(() => {
    const s = settings.data;
    if (!s) return;
    if (isLocale(s.locale) && s.locale !== 'en') setLocale(s.locale);
    else if (s.locale === 'en' && deviceLocale() !== 'en' && !s.username && s.created_at === s.updated_at) {
      const l = deviceLocale();
      setLocale(l);
      updateSettings.mutate({ locale: l });
    } else setLocale(isLocale(s.locale) ? s.locale : 'en');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.data?.locale]);

  // Timezone: the household follows the owner's phone; push timing depends on it.
  useEffect(() => {
    const data = hh.data;
    if (!data || !session) return;
    const tz = getCalendars()[0]?.timeZone;
    if (!tz) return;
    if (data.household.created_by === session.user.id && data.household.timezone !== tz) {
      updateHousehold.mutate({ id: data.household.id, patch: { timezone: tz } });
    }
    if (settings.data && settings.data.timezone !== tz) updateSettings.mutate({ timezone: tz });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hh.data?.household.id, session?.user.id, settings.data?.timezone]);

  // Keep this phone's push token fresh when permission was granted earlier.
  useEffect(() => {
    if (session && hh.data?.household.onboarded_at) void registerPushToken(session.user.id);
  }, [session, hh.data?.household.onboarded_at]);

  if (!ready) return null;

  if (signedIn && hh.isError && !hh.data) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>{t('common.error')}</Text>
        <PrimaryButton label={t('common.retry')} onPress={() => hh.refetch()} style={{ alignSelf: 'center', minWidth: 200 }} />
      </View>
    );
  }

  const onboarded = !!hh.data?.household.onboarded_at;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={signedIn && !onboarded}>
        <Stack.Screen name="(onboarding)" />
      </Stack.Protected>
      <Stack.Protected guard={signedIn && onboarded}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="plant/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="unlocks/[category]" />
        <Stack.Screen name="account/members" />
        <Stack.Screen name="account/household" />
        <Stack.Screen name="account/language" />
        <Stack.Screen name="account/notifications" />
        <Stack.Screen name="account/survey" />
        <Stack.Screen name="account/delete" />
      </Stack.Protected>
    </Stack>
  );
}

const styles = StyleSheet.create({
  error: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 },
  errorText: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.ink2, textAlign: 'center' },
});
