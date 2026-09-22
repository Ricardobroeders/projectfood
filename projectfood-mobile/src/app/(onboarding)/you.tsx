import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { MemberEditorForm } from '@/components/MemberEditorForm';
import { ErrorText, Loading, PrimaryButton, Screen, ScreenTitle } from '@/components/ui';
import { colors, fonts } from '@/constants/theme';
import { type MemberDraft, useHousehold, useSaveMember } from '@/features/household/queries';

/**
 * Step 1 of 3, the welcome after the first sign-in: the parent's own row. The signup trigger
 * already created it with a first name from Google or the email address ("Me" when neither gave
 * one); here they confirm the name and pick a face and a colour before adding the others.
 */
export default function OnboardingYouScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: hh } = useHousehold();
  const save = useSaveMember();
  const [draft, setDraft] = useState<MemberDraft | null>(null);
  if (!hh) return <Loading />;
  const me = hh.me;
  if (!me) return <Redirect href="/family" />;

  const d: MemberDraft = draft ?? { id: me.id, name: me.name === 'Me' ? '' : me.name, kind: 'adult', color_index: me.color_index, avatar_image: me.avatar_image };
  const canContinue = d.name.trim().length > 0;

  const next = async () => {
    if (!canContinue) return;
    try {
      await save.mutateAsync({ householdId: hh.household.id, draft: d, sortOrder: me.sort_order });
      router.push('/family');
    } catch {
      // error shown below
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <ScreenTitle meta={t('onboarding.step', { n: 1, m: 3 })}>{t('onboarding.youTitle')}</ScreenTitle>
          <Text style={styles.sub}>{t('onboarding.youSub')}</Text>
          <View style={styles.form}>
            <MemberEditorForm draft={d} onChange={setDraft} showKind={false} autoFocus={d.name === ''} namePlaceholder={t('onboarding.yourName')} />
            <ErrorText>{save.error ? t('common.error') : null}</ErrorText>
            <PrimaryButton label={t('common.continue')} onPress={next} disabled={!canContinue} loading={save.isPending} style={{ marginTop: 24 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 40 },
  sub: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.ink2, paddingHorizontal: 20, marginTop: 6, marginBottom: 20 },
  form: { paddingHorizontal: 20 },
});
