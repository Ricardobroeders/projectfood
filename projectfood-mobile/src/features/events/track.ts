import { supabase } from '@/features/supabase/client';
import type { Json } from '@/features/supabase/types';

/** Fire-and-forget instrumentation (KB: instrument from day one). Never throws into UI code. */
export function track(name: string, props: Record<string, Json | undefined> = {}, householdId?: string) {
  const clean: Record<string, Json> = {};
  for (const [k, v] of Object.entries(props)) if (v !== undefined) clean[k] = v;
  void supabase
    .from('app_events')
    .insert({ name, props: clean, household_id: householdId ?? null, client_ts: new Date().toISOString() })
    .then(({ error }) => {
      if (error && __DEV__) console.warn('[track]', name, error.message);
    });
}
