import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { QuestionField } from '@/components/QuestionField';
import { BackHeader, ErrorText, Loading, PrimaryButton, Screen, SecondaryButton, TextButton } from '@/components/ui';
import { colors, fonts, radii } from '@/constants/theme';
import { track } from '@/features/events/track';
import { SECTION_ORDER, type SurveyAnswer, type SurveyQuestion, useRemoveAnswers, useSaveAnswer, useSubmitSurvey, useSurveyProgress, useSurveyQuestions, useSurveyResponses } from '@/features/survey/queries';

/** The feedback survey (questions in survey_questions, rewritten for the family app 2026-10-06): consent gate, sectioned form with autosave, submit, thank-you. */
export default function SurveyScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const questions = useSurveyQuestions();
  const responses = useSurveyResponses();
  const save = useSaveAnswer();
  const submit = useSubmitSurvey();
  const remove = useRemoveAnswers();
  const progress = useSurveyProgress();
  const [done, setDone] = useState(false);

  const consentQ = questions.data?.find((q) => q.key === 'consent');
  const consentAnswer = consentQ ? responses.data?.[consentQ.id]?.answer : undefined;
  // Pressing Start opens the form in the same tick; the consent row is saved behind it. A tester
  // tapped, saw nothing for seconds and tapped again (2026-10-06): the save had to round-trip first.
  const [started, setStarted] = useState(false);
  const consented = started || (Array.isArray(consentAnswer) && consentAnswer.includes('agreed'));
  const [consentChecked, setConsentChecked] = useState(false);

  // One flat list: section headings and questions as rows, so the list mounts a screen at a time
  // instead of all 29 fields at once (the other half of that wait).
  const rows = useMemo(() => {
    const qs = (questions.data ?? []).filter((q) => q.section !== 'identity');
    const out: ({ kind: 'heading'; key: string; section: string } | { kind: 'question'; key: string; q: SurveyQuestion })[] = [];
    for (const s of SECTION_ORDER.filter((x) => x !== 'identity')) {
      const inSection = qs.filter((q) => q.section === s);
      if (inSection.length === 0) continue;
      out.push({ kind: 'heading', key: `h-${s}`, section: s });
      for (const q of inSection) out.push({ kind: 'question', key: q.id, q });
    }
    return out;
  }, [questions.data]);

  if (!questions.data || !responses.data) return <Loading />;

  const setAnswer = (questionId: string, answer: SurveyAnswer) => save.mutate({ questionId, answer });

  // Answers save as they are filled in, so the only other action is taking them back (Ricardo, 2026-10-06).
  const onRemove = () => {
    Alert.alert(t('survey.remove_title'), t('survey.remove_body'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.remove'),
        style: 'destructive',
        onPress: () => {
          setStarted(false);
          setConsentChecked(false);
          remove.mutate();
        },
      },
    ]);
  };

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
          <PrimaryButton
            label={t('survey.consent_cta')}
            disabled={!consentChecked}
            onPress={() => {
              setStarted(true);
              setAnswer(consentQ.id, ['agreed']);
            }}
            style={{ marginTop: 16 }}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <BackHeader title={t('survey.title')} right={<Text style={styles.progress}>{`${progress.answered}/${progress.total}`}</Text>} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <FlatList
          data={rows}
          keyExtractor={(r) => r.key}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={8}
          windowSize={7}
          renderItem={({ item }) =>
            item.kind === 'heading' ? (
              <Text style={styles.h2}>{t(`survey.section_${item.section}` as 'survey.section_why')}</Text>
            ) : (
              <View style={styles.question}>
                <Text style={styles.label}>{item.q.label}</Text>
                {item.q.help_text && item.q.type !== 'scale' ? <Text style={styles.help}>{item.q.help_text}</Text> : null}
                <QuestionField q={item.q} value={responses.data?.[item.q.id]?.answer} onChange={(v) => setAnswer(item.q.id, v)} />
              </View>
            )
          }
          ListFooterComponent={
            <View>
              <ErrorText>{submit.error ? t('common.error') : null}</ErrorText>
              <PrimaryButton label={t('survey.submit')} onPress={onSubmit} loading={submit.isPending} style={{ marginTop: 16 }} />
              <View style={{ alignItems: 'center', marginTop: 8 }}>
                <TextButton label={t('survey.remove_answers')} onPress={onRemove} disabled={remove.isPending || progress.answered === 0} />
              </View>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 48 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 32 },
  thanksEmoji: { fontSize: 48, lineHeight: 56 },
  thanksTitle: { fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 32, color: colors.ink, textAlign: 'center' },
  thanksBody: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.ink2, textAlign: 'center' },
  progress: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink3 },
  h2: { fontFamily: fonts.extrabold, fontSize: 22, lineHeight: 28, color: colors.ink, marginTop: 24 },
  p: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.ink2 },
  consentRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radii.md, backgroundColor: colors.bgSoft, marginTop: 8 },
  consentText: { flex: 1, fontFamily: fonts.medium, fontSize: 15, lineHeight: 20, color: colors.ink },
  check: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  question: { gap: 8, marginTop: 16 },
  label: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22, color: colors.ink },
  help: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink3, marginTop: -4 },
});
