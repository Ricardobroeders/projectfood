import { createContext, useContext, useMemo, useReducer, type PropsWithChildren } from 'react';

import { STRINGS, type AchievementId, type Locale, type Strings } from '@/i18n';

export const XP_PER_PLANT = 10;
export const XP_ACHIEVEMENT = 50;

export type MemberKind = 'kid' | 'adult';
export type Member = { id: string; name: string; colorIndex: number; kind: MemberKind };

type State = {
  locale: Locale;
  members: Member[];
  /** Members a plain tap logs for. The picker rewrites it; a new member joins it. */
  defaultIds: string[];
  /** slug → ids of the members who tasted it tonight. Key order is log order. */
  tastes: Record<string, string[]>;
  xp: number;
  unlocked: AchievementId[];
  /** Slug of the plant whose fun-fact card was offered after the third distinct plant. */
  card: string | null;
  cardVisible: boolean;
  cardOpened: boolean;
  celebration: 'first_bites' | null;
  /** Member picker sheet: closed (null), for the default set (slug null), or for one plant. */
  picker: { slug: string | null } | null;
  holdHintSeen: boolean;
};

type Action =
  | { type: 'addMember'; name: string; colorIndex: number; kind: MemberKind }
  | { type: 'updateMember'; id: string; name: string; colorIndex: number; kind: MemberKind }
  | { type: 'removeMember'; id: string }
  | { type: 'setDefault'; ids: string[] }
  | { type: 'tap'; slug: string }
  | { type: 'setTasters'; slug: string; ids: string[] }
  | { type: 'openPicker'; slug: string | null }
  | { type: 'closePicker' }
  | { type: 'dismissHoldHint' }
  | { type: 'dismissCelebration' }
  | { type: 'showCard' }
  | { type: 'hideCard' }
  | { type: 'openCard' }
  | { type: 'setLocale'; locale: Locale }
  | { type: 'reset' }
  | { type: 'clearFamily' };

const initial: State = {
  locale: 'en',
  members: [],
  defaultIds: [],
  tastes: {},
  xp: 0,
  unlocked: [],
  card: null,
  cardVisible: false,
  cardOpened: false,
  celebration: null,
  picker: null,
  holdHintSeen: false,
};

/** Write the tasters of one plant; XP moves per person (Ricardo's "gold per person" note). */
function applyTasters(s: State, slug: string, ids: string[]): State {
  const before = s.tastes[slug] ?? [];
  const tastes = { ...s.tastes };
  if (ids.length) tastes[slug] = ids;
  else delete tastes[slug];
  let xp = Math.max(0, s.xp + (ids.length - before.length) * XP_PER_PLANT);
  let unlocked = s.unlocked;
  let card = s.card;
  let celebration = s.celebration;
  const distinct = Object.keys(tastes).length;
  if (ids.length > before.length && distinct >= 3 && !unlocked.includes('first_bites')) {
    unlocked = [...unlocked, 'first_bites' as const];
    xp += XP_ACHIEVEMENT;
    card = slug;
    celebration = 'first_bites';
  }
  return { ...s, tastes, xp, unlocked, card, celebration };
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'addMember': {
      const id = `m${Date.now().toString(36)}`;
      const member: Member = { id, name: a.name.trim(), colorIndex: a.colorIndex, kind: a.kind };
      return { ...s, members: [...s.members, member], defaultIds: [...s.defaultIds, id] };
    }
    case 'updateMember':
      return { ...s, members: s.members.map((m) => (m.id === a.id ? { ...m, name: a.name.trim(), colorIndex: a.colorIndex, kind: a.kind } : m)) };
    case 'removeMember': {
      const tastes: Record<string, string[]> = {};
      for (const [slug, ids] of Object.entries(s.tastes)) {
        const rest = ids.filter((id) => id !== a.id);
        if (rest.length) tastes[slug] = rest;
      }
      return { ...s, members: s.members.filter((m) => m.id !== a.id), defaultIds: s.defaultIds.filter((id) => id !== a.id), tastes };
    }
    case 'setDefault':
      return { ...s, defaultIds: a.ids.filter((id) => s.members.some((m) => m.id === id)) };
    case 'tap': {
      // A plain tap logs for the default set: complete it, or clear it if it is already complete.
      const targets = s.defaultIds.filter((id) => s.members.some((m) => m.id === id));
      if (!targets.length) return s;
      const cur = s.tastes[a.slug] ?? [];
      const complete = targets.every((id) => cur.includes(id));
      const next = complete ? cur.filter((id) => !targets.includes(id)) : [...cur, ...targets.filter((id) => !cur.includes(id))];
      return applyTasters(s, a.slug, next);
    }
    case 'setTasters': {
      // The picked set becomes the default for the next plants (Ricardo's hold-toggle spec).
      const ids = a.ids.filter((id) => s.members.some((m) => m.id === id));
      const next = applyTasters(s, a.slug, ids);
      return ids.length ? { ...next, defaultIds: ids } : next;
    }
    case 'openPicker':
      return { ...s, picker: { slug: a.slug }, holdHintSeen: a.slug ? true : s.holdHintSeen };
    case 'closePicker':
      return { ...s, picker: null };
    case 'dismissHoldHint':
      return { ...s, holdHintSeen: true };
    case 'dismissCelebration':
      return { ...s, celebration: null };
    case 'showCard':
      return { ...s, celebration: null, cardVisible: true };
    case 'hideCard':
      return { ...s, cardVisible: false };
    case 'openCard': {
      if (s.cardOpened) return s;
      const unlocked: AchievementId[] = s.unlocked.includes('curious') ? s.unlocked : [...s.unlocked, 'curious' as const];
      return { ...s, cardOpened: true, unlocked, xp: s.xp + XP_ACHIEVEMENT };
    }
    case 'setLocale':
      return { ...s, locale: a.locale };
    case 'reset':
      return { ...initial, locale: s.locale, members: s.members, defaultIds: s.defaultIds, holdHintSeen: s.holdHintSeen };
    case 'clearFamily':
      return { ...initial, locale: s.locale };
  }
}

type Store = State & {
  t: Strings;
  /** Slugs with at least one taster tonight, in log order. */
  checked: string[];
  dispatch: React.Dispatch<Action>;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initial);
  const value = useMemo<Store>(
    () => ({ ...state, t: STRINGS[state.locale], checked: Object.keys(state.tastes), dispatch }),
    [state],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore outside StoreProvider');
  return v;
}
