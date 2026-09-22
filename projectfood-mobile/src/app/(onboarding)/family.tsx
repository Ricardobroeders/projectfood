import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { MemberEditorSheet } from '@/components/MemberEditorSheet';
import { MemberList } from '@/components/MemberList';
import { BackHeader, Loading, PrimaryButton, Screen, ScreenTitle } from '@/components/ui';
import { colors, fonts, MEMBER_COLORS } from '@/constants/theme';
import { type Member, type MemberDraft, useHousehold } from '@/features/household/queries';

/** Step 2 of 3: who else is at the table. The parent's row comes finished from the "you" step. */
export default function OnboardingFamilyScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: hh } = useHousehold();
  const [draft, setDraft] = useState<MemberDraft | null>(null);
  if (!hh) return <Loading />;
  const members = hh.members;

  const edit = (m: Member) => setDraft({ id: m.id, name: m.name, kind: m.kind as 'kid' | 'adult', color_index: m.color_index, avatar_image: m.avatar_image });
  // New people start as adults; the editor's Kid/Adult chip flips it. The app is about everyone at the table, not kids.
  const add = () => setDraft({ name: '', kind: 'adult', color_index: members.length % MEMBER_COLORS.length, avatar_image: null });

  return (
    <Screen>
      <BackHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenTitle meta={t('onboarding.step', { n: 2, m: 3 })}>{t('onboarding.familyTitle')}</ScreenTitle>
        <Text style={styles.sub}>{t('onboarding.familySub')}</Text>
        <View style={styles.list}>
          <MemberList members={members} meId={hh.me?.id ?? null} onEdit={edit} onAdd={add} />
          <PrimaryButton label={t('common.continue')} onPress={() => router.push('/dinner-time')} style={{ marginTop: 24 }} disabled={members.length === 0} />
        </View>
      </ScrollView>
      <MemberEditorSheet householdId={hh.household.id} draft={draft} sortOrder={members.length} canRemove={draft?.id !== hh.me?.id} onClose={() => setDraft(null)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 40 },
  sub: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.ink2, paddingHorizontal: 20, marginTop: 6, marginBottom: 20 },
  list: { paddingHorizontal: 20 },
});
