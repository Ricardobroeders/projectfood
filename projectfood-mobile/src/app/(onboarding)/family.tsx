import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { MemberEditorSheet } from '@/components/MemberEditorSheet';
import { MemberList } from '@/components/MemberList';
import { Loading, PrimaryButton, Screen, ScreenTitle } from '@/components/ui';
import { colors, fonts, MEMBER_COLORS } from '@/constants/theme';
import { type Member, type MemberDraft, useHousehold } from '@/features/household/queries';

/** First screen after sign-in: who is at the table. The parent's row is prefilled by the signup trigger. */
export default function OnboardingFamilyScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: hh } = useHousehold();
  const [draft, setDraft] = useState<MemberDraft | null>(null);
  if (!hh) return <Loading />;
  const members = hh.members;

  const edit = (m: Member) => setDraft({ id: m.id, name: m.name, kind: m.kind as 'kid' | 'adult', color_index: m.color_index, avatar_image: m.avatar_image, avatar_bg: m.avatar_bg });
  const add = (kind: 'kid' | 'adult') => setDraft({ name: '', kind, color_index: members.length % MEMBER_COLORS.length, avatar_image: null, avatar_bg: null });

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenTitle>{t('onboarding.familyTitle')}</ScreenTitle>
        <Text style={styles.sub}>{t('onboarding.familySub')}</Text>
        <MemberList members={members} meId={hh.me?.id ?? null} onEdit={edit} onAdd={add} />
        <PrimaryButton label={t('common.continue')} onPress={() => router.push('/dinner-time')} style={{ marginTop: 24 }} disabled={members.length === 0} />
      </ScrollView>
      <MemberEditorSheet householdId={hh.household.id} draft={draft} sortOrder={members.length} canRemove={draft?.id !== hh.me?.id} onClose={() => setDraft(null)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 40 },
  sub: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.ink2, paddingHorizontal: 20, marginTop: 6, marginBottom: 20 },
});
