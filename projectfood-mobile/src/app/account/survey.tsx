import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { QuestionField } from '@/components/QuestionField';
import { BackHeader, ErrorText, Loading, PrimaryButton, Screen, SecondaryButton } from '@/components/ui';
import { colors, fonts, radii } from '@/constants/theme';
import { track } from '@/features/events/track';
import { SECTION_ORDER, type SurveyAnswer, useSaveAnswer, useSubmitSurvey, useSurveyProgress, useSurveyQuestions, useSurveyResponses } from '@/features/survey/queries';

/** The PWA feedback survey, ported: consent gate, sectioned form with autosave, submit, thank-you. */
export default function SurveyScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const questions = useSurveyQuestions();
  const responses = useSurveyResponses();
  const save = useSaveAnswer();
  const submit = useSubmitSurvey();
  const progress = useSurveyProgress();
  const [done, setDone] = useState(false);

  const consentQ = questions.data?.find((q) => q.key === 'consent');
  const consentAnswer = consentQ ? responses.data?.[consentQ.id]?.answer : undefined;
  const consented = Array.isArray(consentAnswer) && consentAnswer.includes('agreed');
  const [consentChecked, setConsentChecked] = useState(false);

  const sections = useMemo(() => {
    const qs = (questions.data ?? []).filter((q) => q.section !== 'identity');
    return SECTION_ORDER.filter((s) => s !== 'identity')
      .map((s) => ({ s, qs: qs.filter((q) => q.section === s) }))
      .filter((x) => x.qs.length > 0);
  }, [questions.data]);

  if (!questions.data || !responses.data) return <Loading />;

  const setAnswer = (questionId: string, answer: SurveyAnswer) => save.mutate({ questionId, answer });

  const onSubmit = async () => {
    const answers = questions.data!.filter((q) => progress.isAnswered(responses.data?.[q.id]?.answer)).map((q) => ({ questionId: q.id, answer: responses.data![q.id].answer }));
    await submit.mutateAsync(answers);
    track('survey_submitted', { answered: answers.length });
    setDone(true);
  };

  if (done) {
    return (
      <Screen>
        <BackHeader title={t('survey.title')} />
        <View style={styles.center}>
          <Text style={styles.thanksEmoji}>🎉</Text>
          <Text style={styles.thanksTitle}>{t('survey.submitted_title')}</Text>
          <Text style={styles.thanksBody}>{t('survey.submitted_body')}</Text>
          <SecondaryButton label={t('common.back')} onPress={() => router.back()} style={{ marginTop: 16, minWidth: 200 }} />
        </View>
      </Screen>
    );
  }

  if (consentQ && !consented) {
    return (
      <Screen>
        <BackHeader title={t('survey.title')} />
        <View style={styles.body}>
          <Text style={styles.h2}>{t('survey.consent_heading')}</Text>
          <Text style={styles.p}>{t('survey.consent_body')}</Text>
          <Pressable style={styles.consentRow} onPress={() => setConsentChecked((v) => !v)} accessibilityRole="checkbox" accessibilityState={{ checked: consentChecked }}>
            <View style={[styles.check, consentChecked && styles.checkOn]}>{consentChecked ? <Check size={14} color={colors.onAccent} strokeWidth={3} /> : null}</View>
            <Text style={styles.consentText}>{consentQ.label}</Text>
          </Pressable>
          <PrimaryButton label={t('survey.consent_cta')} disabled={!consentChecked} onPress={() => setAnswer(consentQ.id, ['agreed'])} style={{ marginTop: 16 }} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <BackHeader title={t('survey.title')} right={<Text style={styles.progress}>{`${progress.answered}/${progress.total}`}</Text>} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {sections.map(({ s, qs }) => (
            <View key={s} style={styles.section}>
              <Text style={styles.h2}>{t(`survey.section_${s}` as 'survey.section_why')}</Text>
              {qs.map((q) => (
                <View key={q.id} style={styles.question}>
                  {q.key === 'sus-1' ? <Text style={styles.intro}>{t('survey.sus_intro')}</Text> : null}
                  <Text style={styles.label}>{q.label}</Text>
                  {q.help_text && q.type !== 'scale' ? <Text style={styles.help}>{q.help_text}</Text> : null}
                  <QuestionField q={q} value={responses.data?.[q.id]?.answer} onChange={(v) => setAnswer(q.id, v)} />
                </View>
              ))}
            </View>
          ))}
          <ErrorText>{submit.error ? t('common.error') : null}</ErrorText>
          <PrimaryButton label={t('survey.submit')} onPress={onSubmit} loading={submit.isPending} style={{ marginTop: 16 }} />
          <SecondaryButton label={t('survey.save_go_back')} onPress={() => router.back()} style={{ marginTop: 8 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 48, gap: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 32 },
  thanksEmoji: { fontSize: 48, lineHeight: 56 },
  thanksTitle: { fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 32, color: colors.ink, textAlign: 'center' },
  thanksBody: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.ink2, textAlign: 'center' },
  progress: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink3 },
  h2: { fontFamily: fonts.extrabold, fontSize: 22, lineHeight: 28, color: colors.ink, marginTop: 12 },
  p: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.ink2 },
  consentRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radii.md, backgroundColor: colors.bgSoft, marginTop: 8 },
  consentText: { flex: 1, fontFamily: fonts.medium, fontSize: 15, lineHeight: 20, color: colors.ink },
  check: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  section: { gap: 16 },
  question: { gap: 8 },
  intro: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink2, padding: 12, borderRadius: radii.sm, backgroundColor: colors.bgSoft },
  label: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22, color: colors.ink },
  help: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink3, marginTop: -4 },
});
