import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useSession } from '@/features/auth/useSession';
import { useSettings } from '@/features/household/queries';
import { supabase } from '@/features/supabase/client';
import type { Json } from '@/features/supabase/types';

export type SurveyOption = { value: string; label: string };
export type SurveyType = 'radio' | 'checkbox' | 'text' | 'number' | 'scale';
export type SurveyQuestion = {
  id: string;
  key: string;
  section: string;
  type: SurveyType;
  options: SurveyOption[] | null;
  display_order: number;
  created_at: string;
  label: string;
  help_text: string | null;
};
/** radio: value | {value:'other', text}; checkbox: string[]; scale/number: number; text: string. */
export type SurveyAnswer = Json;
export type SurveyResponse = { answer: SurveyAnswer; status: 'draft' | 'complete' };

export const SECTION_ORDER = ['identity', 'why', 'ux', 'strategy', 'features', 'pricing', 'wrapup'] as const;

const surveyKey = (locale: string) => ['survey', locale] as const;
const responsesKey = ['surveyResponses'] as const;

function parseOptions(v: Json | null): SurveyOption[] | null {
  if (!Array.isArray(v)) return null;
  return v
    .map((o) => (typeof o === 'string' ? { value: o, label: o } : o && typeof o === 'object' && 'value' in o ? { value: String(o.value), label: String((o as { label?: unknown }).label ?? o.value) } : null))
    .filter((o): o is SurveyOption => o !== null);
}

export function useSurveyQuestions() {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  return useQuery({
    queryKey: surveyKey(locale),
    queryFn: async (): Promise<SurveyQuestion[]> => {
      const { data, error } = await supabase
        .from('survey_questions')
        .select('id, key, section, type, options, display_order, created_at, survey_question_translations(locale, label, help_text, options_override)')
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return (data ?? []).map((q) => {
        const tr = q.survey_question_translations.find((x) => x.locale === locale) ?? q.survey_question_translations.find((x) => x.locale === 'en');
        return {
          id: q.id,
          key: q.key,
          section: q.section,
          type: q.type as SurveyType,
          options: parseOptions(tr?.options_override ?? q.options),
          display_order: q.display_order,
          created_at: q.created_at,
          label: tr?.label ?? q.key,
          help_text: tr?.help_text ?? null,
        };
      });
    },
    staleTime: 60 * 60_000,
  });
}

export function useSurveyResponses() {
  const { session } = useSession();
  return useQuery({
    queryKey: responsesKey,
    queryFn: async () => {
      const { data, error } = await supabase.from('survey_responses').select('question_id, answer, status').eq('user_id', session!.user.id);
      if (error) throw error;
      const out: Record<string, SurveyResponse> = {};
      for (const r of data ?? []) out[r.question_id] = { answer: r.answer, status: r.status as 'draft' | 'complete' };
      return out;
    },
    enabled: !!session,
  });
}

/** Autosave: every change is a draft upsert on (user_id, question_id). */
export function useSaveAnswer() {
  const qc = useQueryClient();
  const { session } = useSession();
  return useMutation({
    mutationFn: async ({ questionId, answer }: { questionId: string; answer: SurveyAnswer }) => {
      const { error } = await supabase
        .from('survey_responses')
        .upsert({ user_id: session!.user.id, question_id: questionId, answer, status: 'draft', updated_at: new Date().toISOString() }, { onConflict: 'user_id,question_id' });
      if (error) throw error;
    },
    onMutate: async ({ questionId, answer }) => {
      await qc.cancelQueries({ queryKey: responsesKey });
      qc.setQueryData<Record<string, SurveyResponse>>(responsesKey, (prev) => ({ ...(prev ?? {}), [questionId]: { answer, status: prev?.[questionId]?.status ?? 'draft' } }));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: responsesKey }),
  });
}

export function useSubmitSurvey() {
  const qc = useQueryClient();
  const { session } = useSession();
  return useMutation({
    mutationFn: async (answers: { questionId: string; answer: SurveyAnswer }[]) => {
      const now = new Date().toISOString();
      const rows = answers.map((a) => ({ user_id: session!.user.id, question_id: a.questionId, answer: a.answer, status: 'complete', answered_at: now, updated_at: now }));
      const { error } = await supabase.from('survey_responses').upsert(rows, { onConflict: 'user_id,question_id' });
      if (error) throw error;
    },
    onSettled: () => qc.invalidateQueries({ queryKey: responsesKey }),
  });
}

function isAnswered(a: SurveyAnswer | undefined): boolean {
  if (a === null || a === undefined) return false;
  if (Array.isArray(a)) return a.length > 0;
  if (typeof a === 'string') return a.trim().length > 0;
  return true;
}

/** Answered/total plus the Home banner rule from the PWA (new questions after a dismissal show again). */
export function useSurveyProgress() {
  const questions = useSurveyQuestions();
  const responses = useSurveyResponses();
  const settings = useSettings();
  const total = questions.data?.length ?? 0;
  const answered = questions.data?.filter((q) => isAnswered(responses.data?.[q.id]?.answer)).length ?? 0;
  const dismissedAt = settings.data?.survey_dismissed_at ?? null;
  const newest = questions.data?.reduce((m, q) => (q.created_at > m ? q.created_at : m), '') ?? '';
  const pending = total > 0 && answered < total && (!dismissedAt || newest > dismissedAt);
  return { total, answered, pending, ready: !!questions.data && !!responses.data, isAnswered };
}
