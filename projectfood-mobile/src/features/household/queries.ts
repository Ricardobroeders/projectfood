import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/features/auth/useSession';
import { supabase } from '@/features/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/features/supabase/types';

export type Member = Tables<'household_members'>;
export type Household = Tables<'households'>;
export type Settings = Tables<'user_settings'>;
export type MemberKind = 'kid' | 'adult';

export type HouseholdData = {
  household: Household;
  /** Active members in display order. */
  members: Member[];
  /** The member row that is the signed-in parent, if any. */
  me: Member | null;
};

export const householdKey = ['household'] as const;
export const settingsKey = ['settings'] as const;

async function fetchHousehold(userId: string): Promise<HouseholdData | null> {
  const { data: household, error } = await supabase.from('households').select('*').order('created_at').limit(1).maybeSingle();
  if (error) throw error;
  if (!household) return null;
  const { data: members, error: mErr } = await supabase
    .from('household_members')
    .select('*')
    .eq('household_id', household.id)
    .is('archived_at', null)
    .order('sort_order')
    .order('created_at');
  if (mErr) throw mErr;
  return { household, members: members ?? [], me: (members ?? []).find((m) => m.user_id === userId) ?? null };
}

export function useHousehold() {
  const { session } = useSession();
  const userId = session?.user.id;
  return useQuery({
    queryKey: householdKey,
    queryFn: () => fetchHousehold(userId!),
    enabled: !!userId,
    staleTime: 5 * 60_000,
  });
}

export function useSettings() {
  const { session } = useSession();
  return useQuery({
    queryKey: settingsKey,
    queryFn: async () => {
      const { data, error } = await supabase.from('user_settings').select('*').eq('user_id', session!.user.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!session,
    staleTime: 5 * 60_000,
  });
}

export function useUpdateHousehold() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: TablesUpdate<'households'> }) => {
      const { error } = await supabase.from('households').update(patch).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: householdKey }),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  const { session } = useSession();
  return useMutation({
    mutationFn: async (patch: TablesUpdate<'user_settings'>) => {
      const { error } = await supabase.from('user_settings').update(patch).eq('user_id', session!.user.id);
      if (error) throw error;
    },
    onMutate: async (patch) => {
      await qc.cancelQueries({ queryKey: settingsKey });
      const prev = qc.getQueryData<Settings>(settingsKey);
      if (prev) qc.setQueryData<Settings>(settingsKey, { ...prev, ...patch });
      return { prev };
    },
    onError: (_e, _p, ctx) => {
      if (ctx?.prev) qc.setQueryData(settingsKey, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: settingsKey }),
  });
}

export type MemberDraft = {
  id?: string;
  name: string;
  kind: MemberKind;
  color_index: number;
  avatar_image: string | null;
  avatar_bg: string | null;
};

export function useSaveMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ householdId, draft, sortOrder }: { householdId: string; draft: MemberDraft; sortOrder: number }) => {
      const name = draft.name.trim();
      if (draft.id) {
        const patch: TablesUpdate<'household_members'> = {
          name,
          kind: draft.kind,
          color_index: draft.color_index,
          avatar_image: draft.avatar_image,
          avatar_bg: draft.avatar_bg,
        };
        const { error } = await supabase.from('household_members').update(patch).eq('id', draft.id);
        if (error) throw error;
        return draft.id;
      }
      const row: TablesInsert<'household_members'> = {
        household_id: householdId,
        name,
        kind: draft.kind,
        color_index: draft.color_index,
        avatar_image: draft.avatar_image,
        avatar_bg: draft.avatar_bg,
        sort_order: sortOrder,
      };
      const { data, error } = await supabase.from('household_members').insert(row).select('id').single();
      if (error) throw error;
      return data.id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: householdKey }),
  });
}

/** Soft remove: the member disappears from pickers, their tastes stay in the collection. */
export function useArchiveMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('household_members').update({ archived_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: householdKey }),
  });
}
