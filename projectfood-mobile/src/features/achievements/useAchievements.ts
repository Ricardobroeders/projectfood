import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';

import { useHousehold } from '@/features/household/queries';
import { useDailyActivity, useStreak, useTasteCounts, useWeekLogs, useWeeklyHistory } from '@/features/logs/queries';
import { usePlantCatalog } from '@/features/plants/catalog';
import { supabase } from '@/features/supabase/client';
import type { Tables } from '@/features/supabase/types';

import { ACHIEVEMENTS, type AchievementId, computeProgress, levelKey, type Progress, type ProgressCtx, unlockKey } from './definitions';

export type UnlockRow = Tables<'achievement_unlocks'>;
export const unlocksKey = (hid: string) => ['unlocks', hid] as const;

export function useUnlocks(hid: string | undefined) {
  return useQuery({
    queryKey: unlocksKey(hid ?? ''),
    queryFn: async () => {
      const { data, error } = await supabase.from('achievement_unlocks').select('*').eq('household_id', hid!).order('unlocked_at');
      if (error) throw error;
      return data;
    },
    enabled: !!hid,
    staleTime: 5 * 60_000,
  });
}

/** Highest level held per stamp and owner (levelKey → level). */
export function unlockedLevels(unlocks: UnlockRow[] | undefined): Map<string, number> {
  const m = new Map<string, number>();
  for (const u of unlocks ?? []) {
    const k = levelKey(u.achievement_id as AchievementId, u.member_id);
    m.set(k, Math.max(m.get(k) ?? 0, u.level));
  }
  return m;
}

const EMPTY_PROGRESS: Progress = { household: {} as Progress['household'], byMember: {} };

/** All achievement inputs for the household, the computed progress and the unlock rows. */
export function useAchievements() {
  const { data: hh } = useHousehold();
  const hid = hh?.household.id;
  const members = hh?.members ?? [];
  const { catalog } = usePlantCatalog();
  const tasteCounts = useTasteCounts(hid);
  const weekLogs = useWeekLogs(hid);
  const daily = useDailyActivity(hid);
  const weekly = useWeeklyHistory(hid);
  const streak = useStreak(hid);
  const unlocks = useUnlocks(hid);

  const ready =
    !!hid && catalog.plants.length > 0 && !!tasteCounts.data && !!weekLogs.data && !!daily.data && !!weekly.data && streak.data !== undefined && !!unlocks.data;

  const levels = useMemo(() => unlockedLevels(unlocks.data), [unlocks.data]);

  const ctx = useMemo<ProgressCtx>(
    () => ({
      members,
      tasteCounts: tasteCounts.data ?? [],
      weekLogs: weekLogs.data ?? [],
      daily: daily.data ?? [],
      weekly: weekly.data ?? [],
      streak: streak.data ?? null,
      plantsById: catalog.byId,
      curiousOpened: levels.has(levelKey('curious', null)),
    }),
    [members, tasteCounts.data, weekLogs.data, daily.data, weekly.data, streak.data, catalog.byId, levels],
  );

  const progress = useMemo(() => (ready ? computeProgress(ctx) : EMPTY_PROGRESS), [ctx, ready]);

  return { hid, members, ctx, progress, unlocks: unlocks.data ?? [], levels, ready };
}

/**
 * Inserts an unlock row for every goal that has been reached but not recorded. Runs whenever the
 * inputs change; the unique index makes duplicates harmless. New rows have seen_at null, which is
 * what drives the celebration sheet (fresh or replayed after a late log).
 */
export function useUnlockEngine() {
  const { hid, members, progress, levels, ready } = useAchievements();
  const qc = useQueryClient();
  const inflight = useRef(new Set<string>());

  useEffect(() => {
    if (!ready || !hid) return;
    const rows: { achievement_id: AchievementId; member_id: string | null; level: number }[] = [];
    for (const a of ACHIEVEMENTS) {
      if (a.id === 'curious') continue; // recorded directly when a fact is opened
      const owners: (string | null)[] = a.scope === 'household' ? [null] : members.map((m) => m.id);
      for (const owner of owners) {
        const entry = owner ? progress.byMember[owner]?.[a.id] : progress.household[a.id];
        if (!entry) continue;
        const held = levels.get(levelKey(a.id, owner)) ?? 0;
        // rungs unlock in order: a higher rung waits for the ones below it
        for (let i = held; i < entry.rungs.length; i++) {
          const r = entry.rungs[i];
          if (r.current < r.target) break;
          const k = unlockKey(a.id, owner, i + 1);
          if (inflight.current.has(k)) continue;
          inflight.current.add(k);
          rows.push({ achievement_id: a.id, member_id: owner, level: i + 1 });
        }
      }
    }
    if (rows.length === 0) return;
    (async () => {
      for (const r of rows) {
        const { error } = await supabase.from('achievement_unlocks').insert({ household_id: hid, ...r });
        // 23505 = already unlocked on another device; fine
        if (error && error.code !== '23505' && __DEV__) console.warn('[unlock]', r.achievement_id, r.level, error.message);
        inflight.current.delete(unlockKey(r.achievement_id, r.member_id, r.level));
      }
      await qc.invalidateQueries({ queryKey: unlocksKey(hid) });
    })();
  }, [ready, hid, members, progress, levels, qc]);
}

export function useMarkUnlocksSeen(hid: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      if (!ids.length) return;
      const { error } = await supabase.from('achievement_unlocks').update({ seen_at: new Date().toISOString() }).in('id', ids);
      if (error) throw error;
    },
    onMutate: async (ids) => {
      if (!hid) return;
      const key = unlocksKey(hid);
      await qc.cancelQueries({ queryKey: key });
      const now = new Date().toISOString();
      qc.setQueryData<UnlockRow[]>(key, (prev) => prev?.map((u) => (ids.includes(u.id) ? { ...u, seen_at: now } : u)));
    },
    onSettled: () => hid && qc.invalidateQueries({ queryKey: unlocksKey(hid) }),
  });
}

/** Opening a fact card's back is the Curious stamp (household level). */
export function useUnlockCurious(hid: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!hid) return;
      const { error } = await supabase.from('achievement_unlocks').insert({ household_id: hid, achievement_id: 'curious', member_id: null, level: 1, seen_at: new Date().toISOString() });
      if (error && error.code !== '23505') throw error;
    },
    onSettled: () => hid && qc.invalidateQueries({ queryKey: unlocksKey(hid) }),
  });
}
