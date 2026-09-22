import { Bell } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { askTimeFor } from '@/components/DinnerTimePicker';
import { Sheet } from '@/components/Sheet';
import { PrimaryButton, TextButton } from '@/components/ui';
import { colors, fonts, iconFor, radii } from '@/constants/theme';
import { useSession } from '@/features/auth/useSession';
import { track } from '@/features/events/track';
import { useHousehold, useUpdateSettings } from '@/features/household/queries';
import { registerPushToken, requestPermission } from '@/features/notifications/push';
import { useUi } from '@/state/ui';

/**
 * The in-app question before the one-shot OS dialog, shown once after the first successful log.
 * Since 2026-09-22 this is the fallback: parents who left the ping on at onboarding never see it.
 */
export function PushPromptSheet() {
  const { t } = useTranslation();
  const open = useUi((s) => s.pushPrompt);
  const close = useUi((s) => s.closePushPrompt);
  const decline = useUi((s) => s.declinePushPrompt);
  const { session } = useSession();
  const { data: hh } = useHousehold();
  const updateSettings = useUpdateSettings();
  const askTime = askTimeFor(hh?.household.dinner_time ?? '18:00');

  const allow = async () => {
    close();
    updateSettings.mutate({ push_prompt_at: new Date().toISOString() });
    const granted = await requestPermission();
    track('push_permission', { granted, via: 'first_log' }, hh?.household.id);
    if (granted && session) await registerPushToken(session.user.id);
  };
  const notNow = () => {
    decline();
    track('push_prompt_declined', { via: 'first_log' }, hh?.household.id);
    close();
  };

  return (
    <Sheet visible={open} onRequestClose={notNow}>
      <View style={styles.head}>
        <View style={styles.icon}>
          <Bell size={iconFor(72)} color={colors.ink} />
        </View>
        <Text style={styles.title}>{t('notifications.permissionPrompt.title')}</Text>
        <Text style={styles.body}>{t('notifications.permissionPrompt.body', { time: askTime })}</Text>
      </View>
      <PrimaryButton label={t('notifications.permissionPrompt.allow')} onPress={allow} style={{ marginTop: 12 }} />
      <TextButton label={t('notifications.permissionPrompt.notNow')} onPress={notNow} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  head: { alignItems: 'center', gap: 10, paddingTop: 8 },
  icon: { width: 72, height: 72, borderRadius: radii.lg, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.extrabold, fontSize: 24, lineHeight: 30, color: colors.ink, textAlign: 'center' },
  body: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.ink2, textAlign: 'center', maxWidth: 300 },
});
