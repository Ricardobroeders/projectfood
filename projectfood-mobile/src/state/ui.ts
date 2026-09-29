import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type FactCardHost = 'root' | 'plant';

import type { AchievementId } from '@/features/achievements/definitions';

/** A point in window coordinates (pageX / pageY of a touch). */
export type Point = { x: number; y: number };

/**
 * Local-only UI state. What is persisted is the phone's own convenience (who a plain tap logs for,
 * dismissed hints); everything that matters lives on the server.
 */
type UiState = {
  /** householdId -> member ids a plain tap logs for (the sticky default from the POC). */
  defaultIds: Record<string, string[]>;
  holdHintSeen: boolean;
  pushPromptDeclinedAt: string | null;
  /** Member menu: closed (null), for the default set (plantId null), or for one plant; `at` is where the finger was, the menu grows from there. */
  picker: { plantId: string | null; at: Point } | null;
  achievementSheet: { id: AchievementId; memberId: string | null } | null;
  /** `host` says which FunFactCard instance shows it: the root one in the tabs, or the one inside the plant
   *  screen. On iOS the plant screen is a native modal, and a Modal owned by the tabs cannot present on top
   *  of it (it appeared underneath and the app hung, Ricardo 2026-09-29), so the plant screen hosts its own. */
  factCard: { plantId: string; host: FactCardHost } | null;
  /** A card that just reached gold, waiting for its celebration: the plant and who took it there.
   *  Held until the member menu is out of the way, so the sheet never lands on top of it. */
  goldCard: { plantId: string; memberIds: string[] } | null;
  /** The in-app pre-prompt before the OS push permission dialog. */
  pushPrompt: boolean;

  setDefaultIds: (householdId: string, ids: string[]) => void;
  dismissHoldHint: () => void;
  declinePushPrompt: () => void;
  openPicker: (plantId: string | null, at: Point) => void;
  closePicker: () => void;
  openAchievement: (id: AchievementId, memberId: string | null) => void;
  closeAchievement: () => void;
  showFactCard: (plantId: string, host?: FactCardHost) => void;
  hideFactCard: () => void;
  showGoldCard: (plantId: string, memberIds: string[]) => void;
  hideGoldCard: () => void;
  openPushPrompt: () => void;
  closePushPrompt: () => void;
};

export const useUi = create<UiState>()(
  persist(
    (set) => ({
      defaultIds: {},
      holdHintSeen: false,
      pushPromptDeclinedAt: null,
      picker: null,
      achievementSheet: null,
      factCard: null,
      goldCard: null,
      pushPrompt: false,

      setDefaultIds: (householdId, ids) => set((s) => ({ defaultIds: { ...s.defaultIds, [householdId]: ids } })),
      dismissHoldHint: () => set({ holdHintSeen: true }),
      declinePushPrompt: () => set({ pushPromptDeclinedAt: new Date().toISOString() }),
      openPicker: (plantId, at) => set((s) => ({ picker: { plantId, at }, holdHintSeen: plantId ? true : s.holdHintSeen })),
      closePicker: () => set({ picker: null }),
      openAchievement: (id, memberId) => set({ achievementSheet: { id, memberId } }),
      closeAchievement: () => set({ achievementSheet: null }),
      showFactCard: (plantId, host = 'root') => set({ factCard: { plantId, host } }),
      hideFactCard: () => set({ factCard: null }),
      showGoldCard: (plantId, memberIds) => set({ goldCard: { plantId, memberIds } }),
      hideGoldCard: () => set({ goldCard: null }),
      openPushPrompt: () => set({ pushPrompt: true }),
      closePushPrompt: () => set({ pushPrompt: false }),
    }),
    {
      name: 'pf-ui',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ defaultIds: s.defaultIds, holdHintSeen: s.holdHintSeen, pushPromptDeclinedAt: s.pushPromptDeclinedAt }),
    },
  ),
);

/** The default taster set for a household, pruned to members that still exist. */
export function useDefaultIds(householdId: string | undefined, memberIds: string[]): string[] {
  const all = useUi((s) => s.defaultIds);
  if (!householdId) return [];
  const stored = all[householdId];
  // Until the parent picks, a plain tap logs for everyone at the table.
  if (!stored) return memberIds;
  return stored.filter((id) => memberIds.includes(id));
}
