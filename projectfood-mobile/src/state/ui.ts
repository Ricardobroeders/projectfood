import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type FactCardHost = 'root' | 'plant';

import type { AchievementId } from '@/features/achievements/definitions';

/** A point in window coordinates (pageX / pageY of a touch). */
export type Point = { x: number; y: number };
/** Where a control sits, in window coordinates: the tutorial cuts its hole here. */
export type Rect = { x: number; y: number; width: number; height: number };
/** The controls the tutorial's four balloons point at. */
export type TutorialAnchor = 'logTab' | 'plantRow' | 'weekChip';

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
  /** The first-minute tutorial: the step on screen (1-based) or none; per household, when it was
   *  finished or skipped on this phone (persisted: a new account on the same phone starts fresh,
   *  Ricardo 2026-09-30, after his deleted-and-recreated account got no tutorial); where its three
   *  controls are while it runs. */
  tutorialStep: number | null;
  tutorialSeen: Record<string, string>;
  tutorialAnchors: Partial<Record<TutorialAnchor, Rect>>;

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
  startTutorial: () => void;
  setTutorialStep: (step: number) => void;
  endTutorial: (householdId: string | undefined) => void;
  setTutorialAnchor: (name: TutorialAnchor, rect: Rect) => void;
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
      tutorialStep: null,
      tutorialSeen: {},
      tutorialAnchors: {},

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
      startTutorial: () => set({ tutorialStep: 1 }),
      setTutorialStep: (step) => set({ tutorialStep: step }),
      endTutorial: (householdId) =>
        set((s) => ({ tutorialStep: null, tutorialAnchors: {}, tutorialSeen: householdId ? { ...s.tutorialSeen, [householdId]: new Date().toISOString() } : s.tutorialSeen })),
      // Same rectangle again is not a change; the anchors re-measure on every layout.
      setTutorialAnchor: (name, rect) =>
        set((s) => {
          const p = s.tutorialAnchors[name];
          if (p && p.x === rect.x && p.y === rect.y && p.width === rect.width && p.height === rect.height) return s;
          return { tutorialAnchors: { ...s.tutorialAnchors, [name]: rect } };
        }),
    }),
    {
      name: 'pf-ui',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ defaultIds: s.defaultIds, holdHintSeen: s.holdHintSeen, pushPromptDeclinedAt: s.pushPromptDeclinedAt, tutorialSeen: s.tutorialSeen }),
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
