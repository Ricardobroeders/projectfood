import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { supabase } from '@/features/supabase/client';
import type { Tables } from '@/features/supabase/types';

export type PlantFact = Tables<'plant_facts'>;

/** Kid fact + parent tip in the UI language, English when the locale has none yet, null when none exist. */
export function usePlantFact(plantId: string | undefined) {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  return useQuery({
    queryKey: ['facts', plantId ?? '', locale],
    queryFn: async () => {
      const { data, error } = await supabase.from('plant_facts').select('*').eq('plant_id', plantId!).in('locale', [locale, 'en']);
      if (error) throw error;
      return data.find((f) => f.locale === locale) ?? data.find((f) => f.locale === 'en') ?? null;
    },
    enabled: !!plantId,
    staleTime: 24 * 60 * 60_000,
  });
}
