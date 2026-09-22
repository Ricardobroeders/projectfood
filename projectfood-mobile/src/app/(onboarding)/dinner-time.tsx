import { getCalendars } from 'expo-localization';
import { Bell } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { askTimeFor, DinnerTimePicker } from '@/components/DinnerTimePicker';
import { BackHeader, ErrorText, PrimaryButton, Screen, ScreenTitle } from '@/components/ui';
import { colors, fonts, iconFor, radii } from '@/constants/theme';
import { useSession } from '@/features/auth/useSession';
import { track } from '@/features/events/track';
import { useHousehold, useUpdateHousehold, useUpdateSettings } from '@/features/household/queries';
import { currentLocale } from '@/features/i18n';
import { registerPushToken, requestPermission } from '@/features/notifications/push';

/** Localised default: NL/EN eat around 18:00, IT around 20:00 (KB habit loop). */
function defaultDinner(): string {
  return currentLocale() === 'it' ? '20:00' : '18:00';
}

/**
 * Step 3 of 3: the household's dinner time, and under it the ping. The ping row is the in-app
 * question before the OS permission dialog; the dialog only opens when the parent leaves it on
 * and taps "Start tasting" (decided 2026-09-22, amends D9: the habit loop needs its trigger from
 * the first dinner, so the ask moves from after the first log to here; the after-first-log
 * prompt stays as the fallback for parents who switch it off).
 */
export default function DinnerTimeScreen() {
  const { t } = useTranslation();
  const { session } = useSession();
  const { data: hh } = useHousehold();
  const update = useUpdateHousehold();
  const updateSettings = useUpdateSettings();
  const [time, setTime] = useState(hh?.household.onboarded_at ? hh.household.dinner_time.slice(0, 5) : defaultDinner());
  const [ping, setPing] = useState(true);
  const [busy, setBusy] = useState(false);

  const finish = async () => {
    if (!hh || busy) return;
    setBusy(true);
    const hid = hh.household.id;
    try {
      // The OS dialog first, over this screen, and only when the ping is on.
      if (ping) {
        updateSettings.mutate({ push_prompt_at: new Date().toISOString() });
        const granted = await requestPermission();
        track('push_permission', { granted, via: 'onboarding' }, hid);
        if (granted && session) await registerPushToken(session.user.id);
      } else {
        track('push_prompt_declined', { via: 'onboarding' }, hid);
      }
      const tz = getCalendars()[0]?.timeZone ?? hh.household.timezone;
      await update.mutateAsync({ id: hid, patch: { dinner_time: time, timezone: tz, onboarded_at: new Date().toISOString() } });
      track('onboarding_completed', { members: hh.members.length, dinner_time: time, ping }, hid);
      // the route guard moves to the tabs once the household refetches
    } catch {
      // error shown below
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <BackHeader />
      <ScreenTitle meta={t('onboarding.step', { n: 3, m: 3 })}>{t('onboarding.dinnerTitle')}</ScreenTitle>
      <View style={styles.body}>
        <Text style={styles.sub}>{t('onboarding.dinnerSub')}</Text>
        <DinnerTimePicker value={time} onChange={setTime} />

        <View style={styles.ping}>
          <View style={styles.pingIcon}>
            <Bell size={iconFor(40)} color={colors.ink} />
          </View>
          <View style={styles.pingText}>
            <Text style={styles.pingLabel}>{t('onboarding.pingLabel')}</Text>
            <Text style={styles.pingSub}>{t('onboarding.pingSub', { time: askTimeFor(time) })}</Text>
          </View>
          <Switch value={ping} onValueChange={setPing} trackColor={{ true: colors.accent, false: colors.hairline }} thumbColor="#FFFFFF" />
        </View>

        <ErrorText>{update.error ? t('common.error') : null}</ErrorText>
        <PrimaryButton label={t('onboarding.finish')} onPress={finish} loading={busy || update.isPending} style={{ marginTop: 12 }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 20, paddingTop: 6, gap: 12 },
  sub: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.ink2, marginBottom: 8 },
  ping: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radii.lg, backgroundColor: colors.bgSoft, marginTop: 4 },
  pingIcon: { width: 40, height: 40, borderRadius: radii.full, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  pingText: { flex: 1, gap: 2 },
  pingLabel: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink },
  pingSub: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink2 },
});
