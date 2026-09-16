import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';

import { useHousehold } from '@/features/household/queries';
import { useDailyActivity, useStreak, useTasteCounts, useWeekLogs, useWeeklyHistory } from '@/features/logs/queries';
import { usePlantCatalog } from '@/features/plants/catalog';
import { supabase } from '@/features/supabase/client';
import type { Tables } from '@/features/supabase/types';

import { ACHIEVEMENTS, type AchievementId, computeProgress, type Progress, type ProgressCtx, unlockKey } from './definitions';

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

export function unlockedKeys(unlocks: UnlockRow[] | undefined): Set<string> {
  return new Set((unlocks ?? []).map((u) => unlockKey(u.achievement_id as AchievementId, u.member_id)));
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

  const keys = useMemo(() => unlockedKeys(unlocks.data), [unlocks.data]);

  const ctx = useMemo<ProgressCtx>(
    () => ({
      members,
      tasteCounts: tasteCounts.data ?? [],
      weekLogs: weekLogs.data ?? [],
      daily: daily.data ?? [],
      weekly: weekly.data ?? [],
      streak: streak.data ?? null,
      plantsById: catalog.byId,
      curiousOpened: keys.has(unlockKey('curious', null)),
    }),
    [members, tasteCounts.data, weekLogs.data, daily.data, weekly.data, streak.data, catalog.byId, keys],
  );

  const progress = useMemo(() => (ready ? computeProgress(ctx) : EMPTY_PROGRESS), [ctx, ready]);

  return { hid, members, ctx, progress, unlocks: unlocks.data ?? [], unlockedKeys: keys, ready };
}

/**
 * Inserts an unlock row for every goal that has been reached but not recorded. Runs whenever the
 * inputs change; the unique index makes duplicates harmless. New rows have seen_at null, which is
 * what drives the celebration sheet (fresh or replayed after a late log).
 */
export function useUnlockEngine() {
  const { hid, members, progress, unlockedKeys: keys, ready } = useAchievements();
  const qc = useQueryClient();
  const inflight = useRef(new Set<string>());

  useEffect(() => {
    if (!ready || !hid) return;
    const rows: { achievement_id: AchievementId; member_id: string | null }[] = [];
    for (const a of ACHIEVEMENTS) {
      if (a.id === 'curious') continue; // recorded directly when a fact is opened
      if (a.scope === 'household') {
        const p = progress.household[a.id];
        const k = unlockKey(a.id, null);
        if (p && p.current >= p.target && !keys.has(k) && !inflight.current.has(k)) {
          inflight.current.add(k);
          rows.push({ achievement_id: a.id, member_id: null });
        }
      } else {
        for (const m of members) {
          const p = progress.byMember[m.id]?.[a.id];
          const k = unlockKey(a.id, m.id);
          if (p && p.current >= p.target && !keys.has(k) && !inflight.current.has(k)) {
            inflight.current.add(k);
            rows.push({ achievement_id: a.id, member_id: m.id });
          }
        }
      }
    }
    if (rows.length === 0) return;
    (async () => {
      for (const r of rows) {
        const { error } = await supabase.from('achievement_unlocks').insert({ household_id: hid, ...r });
        // 23505 = already unlocked on another device; fine
        if (error && error.code !== '23505' && __DEV__) console.warn('[unlock]', r.achievement_id, error.message);
        inflight.current.delete(unlockKey(r.achievement_id, r.member_id));
      }
      await qc.invalidateQueries({ queryKey: unlocksKey(hid) });
    })();
  }, [ready, hid, members, progress, keys, qc]);
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
      const { error } = await supabase.from('achievement_unlocks').insert({ household_id: hid, achievement_id: 'curious', member_id: null, seen_at: new Date().toISOString() });
      if (error && error.code !== '23505') throw error;
    },
    onSettled: () => hid && qc.invalidateQueries({ queryKey: unlocksKey(hid) }),
  });
}
