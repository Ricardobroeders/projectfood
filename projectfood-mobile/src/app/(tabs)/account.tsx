import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Bell, Clock, FileText, Globe, LogOut, MessageSquare, Shield, Trash2, Users } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { MemberAvatar } from '@/components/MemberAvatar';
import { Screen, ScreenTitle, SectionTitle, SettingsRow } from '@/components/ui';
import { colors, fonts, radii } from '@/constants/theme';
import { signOutEverywhere } from '@/features/auth/signOut';
import { useSession } from '@/features/auth/useSession';
import { useHousehold, useSettings } from '@/features/household/queries';
import { currentLocale } from '@/features/i18n';
import { ENV } from '@/features/supabase/env';
import { useSurveyProgress } from '@/features/survey/queries';

export default function AccountScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { session } = useSession();
  const { data: hh } = useHousehold();
  const { data: settings } = useSettings();
  const survey = useSurveyProgress();
  const locale = currentLocale();

  const legal = (kind: 'privacy' | 'terms') => {
    const l = locale === 'de' || locale === 'fr' ? 'en' : locale;
    void WebBrowser.openBrowserAsync((kind === 'privacy' ? ENV.privacyUrl : ENV.termsUrl).replace('{locale}', l));
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenTitle>{t('account.title')}</ScreenTitle>

        <View style={styles.profile}>
          {hh?.me ? <MemberAvatar member={hh.me} size={56} /> : null}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{hh?.me?.name ?? ''}</Text>
            <Text style={styles.email} numberOfLines={1}>
              {session?.user.email ?? ''}
            </Text>
          </View>
        </View>

        <SectionTitle>{t('account.settings')}</SectionTitle>
        <View style={styles.rows}>
          <SettingsRow icon={Users} label={t('account.family')} value={hh ? t('account.members', { n: hh.members.length }) : undefined} onPress={() => router.push('/account/members')} />
          <SettingsRow icon={Clock} label={t('account.dinnerTime')} value={hh?.household.dinner_time.slice(0, 5)} onPress={() => router.push('/account/household')} />
          <SettingsRow icon={Globe} label={t('account.language')} value={t(`languages.${locale}`)} onPress={() => router.push('/account/language')} />
          <SettingsRow icon={Bell} label={t('account.notifications')} value={settings?.notifications_enabled ? t('common.on') : t('common.off')} onPress={() => router.push('/account/notifications')} />
          <SettingsRow icon={MessageSquare} label={t('account.feedback')} value={survey.total ? t('account.feedbackAnswered', { answered: survey.answered, total: survey.total }) : undefined} onPress={() => router.push('/account/survey')} />
        </View>

        <SectionTitle>{t('account.about')}</SectionTitle>
        <View style={styles.rows}>
          <SettingsRow icon={Shield} label={t('account.privacy')} onPress={() => legal('privacy')} />
          <SettingsRow icon={FileText} label={t('account.terms')} onPress={() => legal('terms')} />
        </View>

        <View style={[styles.rows, { marginTop: 24 }]}>
          <SettingsRow icon={LogOut} label={t('account.signOut')} onPress={() => void signOutEverywhere()} />
          <SettingsRow icon={Trash2} label={t('account.deleteAccount')} destructive onPress={() => router.push('/account/delete')} />
        </View>

        <Text style={styles.version}>{t('account.version', { v: Constants.expoConfig?.version ?? '' })}</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 40 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: 20, marginTop: 16, padding: 16, borderRadius: radii.lg, backgroundColor: colors.bgSoft },
  name: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 24, color: colors.ink },
  email: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink2 },
  rows: { paddingHorizontal: 20, gap: 8 },
  version: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, color: colors.ink3, textAlign: 'center', marginTop: 32 },
});
