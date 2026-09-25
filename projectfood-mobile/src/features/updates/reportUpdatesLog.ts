import * as Updates from 'expo-updates';

import { track } from '@/features/events/track';
import type { Json } from '@/features/supabase/types';

const MAX_AGE = 48 * 3600 * 1000;
const MAX_ENTRIES = 24;

/**
 * Sends expo-updates' own log to `app_events` once per launch (2026-09-24). An update that
 * throws before its first frame is rolled back silently on the phone; without a cable the only
 * trace is this log, which the module keeps on the device across launches. Errors, warnings and
 * every recovery line go up, with what the app is running now.
 */
export async function reportUpdatesLog(householdId?: string) {
  try {
    const entries = await Updates.readLogEntriesAsync(MAX_AGE);
    const kept = entries
      // errors and warnings, plus the recovery pipeline's own lines; not the per-asset progress (which says "failedAssetCount=0")
      .filter((e) => e.level === 'error' || e.level === 'fatal' || e.level === 'warn' || /UpdatesErrorRecovery|ErrorRecovery: remote load|rollback|roll back/i.test(e.message))
      .slice(-MAX_ENTRIES)
      .map<Json>((e) => ({ t: e.timestamp, l: e.level, c: e.code, m: e.message.slice(0, 400), u: e.updateId ? e.updateId.slice(0, 8) : null }));
    track(
      'updates_state',
      {
        running: Updates.updateId ? Updates.updateId.slice(0, 8) : 'embedded',
        embedded: Updates.isEmbeddedLaunch,
        published_at: Updates.createdAt ? Updates.createdAt.toISOString() : null,
        entries: kept,
      },
      householdId,
    );
  } catch (e) {
    track('updates_state', { error: e instanceof Error ? e.message : String(e) }, householdId);
  }
}
