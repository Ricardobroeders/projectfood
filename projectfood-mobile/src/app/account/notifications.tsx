import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { BackHeader, Loading, PrimaryButton, Screen, SectionTitle, SecondaryButton } from '@/components/ui';
import { colors, fonts, radii } from '@/constants/theme';
import { useSession } from '@/features/auth/useSession';
import { track } from '@/features/events/track';
import { type Settings, useSettings, useUpdateSettings } from '@/features/household/queries';
import { getPermissionState, openSystemSettings, type PermissionState, registerPushToken, requestPermission } from '@/features/notifications/push';

type Flag = keyof Pick<Settings, 'notif_essential' | 'notif_marketing' | 'notif_daily_reminder' | 'notif_streak_rescue' | 'notif_reengagement' | 'notif_weekly_nudge'>;

/**
 * Essential (the dinner question, the streak keeper) is on by default; Tips & news (card teaser,
 * Sunday nudge) is off by default. The OS permission itself is asked only after the first log.
 */
export default function NotificationsScreen() {
  const { t } = useTranslation();
  const { session } = useSession();
  const { data: s } = useSettings();
  const update = useUpdateSettings();
  const [perm, setPerm] = useState<PermissionState>('undetermined');
  const refresh = useCallback(() => {
    void getPermissionState().then(setPerm);
  }, []);
  useFocusEffect(refresh);

  const enable = async () => {
    const granted = await requestPermission();
    track('push_permission', { granted, via: 'settings' });
    if (granted && session) await registerPushToken(session.user.id);
    refresh();
  };

  if (!s) return <Loading />;
  const toggle = (flag: Flag) => (v: boolean) => update.mutate({ [flag]: v });

  return (
    <Screen>
      <BackHeader title={t('notifications.title')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {perm === 'denied' ? (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>{t('notifications.systemOff')}</Text>
            <SecondaryButton label={t('notifications.openSettings')} onPress={openSystemSettings} />
          </View>
        ) : perm === 'undetermined' ? (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>{t('notifications.permissionPrompt.title')}</Text>
            <PrimaryButton label={t('notifications.permissionPrompt.allow')} onPress={enable} />
          </View>
        ) : null}

        <SectionTitle>{t('notifications.essential')}</SectionTitle>
        <Text style={styles.desc}>{t('notifications.essentialDesc')}</Text>
        <View style={styles.group}>
          <Row label={t('notifications.essential')} value={s.notif_essential} onChange={toggle('notif_essential')} bold />
          <Row label={t('notifications.types.dinnerQuestion.label')} desc={t('notifications.types.dinnerQuestion.description')} value={s.notif_daily_reminder} onChange={toggle('notif_daily_reminder')} disabled={!s.notif_essential} />
          <Row label={t('notifications.types.streakKeeper.label')} desc={t('notifications.types.streakKeeper.description')} value={s.notif_streak_rescue} onChange={toggle('notif_streak_rescue')} disabled={!s.notif_essential} />
        </View>

        <SectionTitle>{t('notifications.marketing')}</SectionTitle>
        <Text style={styles.desc}>{t('notifications.marketingDesc')}</Text>
        <View style={styles.group}>
          <Row label={t('notifications.marketing')} value={s.notif_marketing} onChange={toggle('notif_marketing')} bold />
          <Row label={t('notifications.types.cardTeaser.label')} desc={t('notifications.types.cardTeaser.description')} value={s.notif_reengagement} onChange={toggle('notif_reengagement')} disabled={!s.notif_marketing} />
          <Row label={t('notifications.types.sundayNudge.label')} desc={t('notifications.types.sundayNudge.description')} value={s.notif_weekly_nudge} onChange={toggle('notif_weekly_nudge')} disabled={!s.notif_marketing} />
        </View>
      </ScrollView>
    </Screen>
  );
}

function Row({ label, desc, value, onChange, disabled, bold }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean; bold?: boolean }) {
  return (
    <View style={[styles.row, disabled && { opacity: 0.45 }]}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[styles.rowLabel, bold && { fontFamily: fonts.bold }]}>{label}</Text>
        {desc ? <Text style={styles.rowDesc}>{desc}</Text> : null}
      </View>
      <Switch value={value} onValueChange={onChange} disabled={disabled} trackColor={{ true: colors.accent, false: colors.hairline }} thumbColor="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 40 },
  notice: { marginHorizontal: 20, marginTop: 12, padding: 16, borderRadius: radii.lg, backgroundColor: colors.accentSoft, gap: 12 },
  noticeText: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink },
  desc: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink2, paddingHorizontal: 20, marginTop: -4, marginBottom: 8 },
  group: { marginHorizontal: 20, borderRadius: radii.lg, backgroundColor: colors.bgSoft, paddingHorizontal: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 60, paddingVertical: 10 },
  rowLabel: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink },
  rowDesc: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink2 },
});
