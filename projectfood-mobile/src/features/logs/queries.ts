import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/features/auth/useSession';
import { supabase } from '@/features/supabase/client';
import type { Database } from '@/features/supabase/types';

import { type LogRow, weekStartOf } from './model';

type Fn = Database['public']['Functions'];
export type TasteCount = Fn['member_taste_counts']['Returns'][number];
export type DailyRow = Fn['household_daily_activity']['Returns'][number];
export type WeekRow = Fn['household_weekly_history']['Returns'][number];
export type Streak = Fn['household_streak']['Returns'][number];

export const logsKey = (hid: string, weekStart: string) => ['logs', hid, weekStart] as const;
export const tasteCountsKey = (hid: string) => ['tasteCounts', hid] as const;
export const dailyKey = (hid: string) => ['dailyActivity', hid] as const;
export const weeklyKey = (hid: string) => ['weeklyHistory', hid] as const;
export const streakKey = (hid: string) => ['streak', hid] as const;

/** This week's log rows for the household (Home and Log share them). */
export function useWeekLogs(hid: string | undefined) {
  const weekStart = weekStartOf();
  return useQuery({
    queryKey: logsKey(hid ?? '', weekStart),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plant_logs')
        .select('*')
        .eq('household_id', hid!)
        .gte('logged_on', weekStart)
        .order('logged_at');
      if (error) throw error;
      return data as LogRow[];
    },
    enabled: !!hid,
    staleTime: 30_000,
  });
}

export function useTasteCounts(hid: string | undefined) {
  return useQuery({
    queryKey: tasteCountsKey(hid ?? ''),
    queryFn: async () => {
      const { data, error } = await supabase.rpc('member_taste_counts', { p_household_id: hid! });
      if (error) throw error;
      return data;
    },
    enabled: !!hid,
    staleTime: 5 * 60_000,
  });
}

export function useDailyActivity(hid: string | undefined, days = 90) {
  return useQuery({
    queryKey: [...dailyKey(hid ?? ''), days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('household_daily_activity', { p_household_id: hid!, p_days: days });
      if (error) throw error;
      return data;
    },
    enabled: !!hid,
    staleTime: 5 * 60_000,
  });
}

export function useWeeklyHistory(hid: string | undefined, weeks = 12) {
  return useQuery({
    queryKey: [...weeklyKey(hid ?? ''), weeks],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('household_weekly_history', { p_household_id: hid!, p_weeks: weeks });
      if (error) throw error;
      return data;
    },
    enabled: !!hid,
    staleTime: 5 * 60_000,
  });
}

export function useStreak(hid: string | undefined) {
  return useQuery({
    queryKey: streakKey(hid ?? ''),
    queryFn: async () => {
      const { data, error } = await supabase.rpc('household_streak', { p_household_id: hid! });
      if (error) throw error;
      return data[0] ?? null;
    },
    enabled: !!hid,
    staleTime: 5 * 60_000,
  });
}

type TasteArgs = { plantId: string; memberIds: string[]; day: string };

/**
 * Logging writes one plant_logs row per (member, plant, day). Optimistic on the week cache so the
 * row and the hero count move instantly at the table; the derived stats refetch when it settles.
 */
export function useLogMutations(hid: string | undefined) {
  const qc = useQueryClient();
  const { session } = useSession();
  const userId = session?.user.id ?? '';
  const weekStart = weekStartOf();
  const key = logsKey(hid ?? '', weekStart);

  const invalidateDerived = () => {
    if (!hid) return;
    void qc.invalidateQueries({ queryKey: key });
    void qc.invalidateQueries({ queryKey: tasteCountsKey(hid) });
    void qc.invalidateQueries({ queryKey: dailyKey(hid) });
    void qc.invalidateQueries({ queryKey: weeklyKey(hid) });
    void qc.invalidateQueries({ queryKey: streakKey(hid) });
  };

  const logTaste = useMutation({
    mutationFn: async ({ plantId, memberIds, day }: TasteArgs) => {
      if (!hid || memberIds.length === 0) return;
      const rows = memberIds.map((member_id) => ({ user_id: userId, household_id: hid, member_id, plant_id: plantId, logged_on: day }));
      const { error } = await supabase.from('plant_logs').upsert(rows, { onConflict: 'member_id,plant_id,logged_on', ignoreDuplicates: true });
      if (error) throw error;
    },
    onMutate: async ({ plantId, memberIds, day }) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<LogRow[]>(key) ?? [];
      const now = new Date().toISOString();
      const existing = new Set(prev.filter((r) => r.plant_id === plantId && r.logged_on === day).map((r) => r.member_id));
      const added: LogRow[] = memberIds
        .filter((m) => !existing.has(m))
        .map((member_id) => ({
          id: `optimistic-${plantId}-${member_id}-${day}`,
          user_id: userId,
          household_id: hid ?? '',
          member_id,
          plant_id: plantId,
          logged_on: day,
          logged_at: now,
        }));
      qc.setQueryData<LogRow[]>(key, [...prev, ...added]);
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx) qc.setQueryData(key, ctx.prev);
    },
    onSettled: invalidateDerived,
  });

  const unlogTaste = useMutation({
    mutationFn: async ({ plantId, memberIds, day }: TasteArgs) => {
      if (!hid || memberIds.length === 0) return;
      const { error } = await supabase.from('plant_logs').delete().eq('household_id', hid).eq('plant_id', plantId).eq('logged_on', day).in('member_id', memberIds);
      if (error) throw error;
    },
    onMutate: async ({ plantId, memberIds, day }) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<LogRow[]>(key) ?? [];
      qc.setQueryData<LogRow[]>(
        key,
        prev.filter((r) => !(r.plant_id === plantId && r.logged_on === day && memberIds.includes(r.member_id))),
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx) qc.setQueryData(key, ctx.prev);
    },
    onSettled: invalidateDerived,
  });

  return { logTaste, unlogTaste };
}
