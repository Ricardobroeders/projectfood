import { createContext, useContext, useMemo, useReducer, type PropsWithChildren } from 'react';

import { STRINGS, type AchievementId, type Locale, type Strings } from '@/i18n';

export const XP_PER_PLANT = 10;
export const XP_ACHIEVEMENT = 50;

type State = {
  locale: Locale;
  checked: string[];
  xp: number;
  unlocked: AchievementId[];
  /** Slug of the plant whose fun-fact card was offered after the third check. */
  card: string | null;
  cardVisible: boolean;
  cardOpened: boolean;
  /** Which celebration sheet is showing, if any. */
  celebration: 'first_bites' | null;
};

type Action =
  | { type: 'toggle'; slug: string }
  | { type: 'dismissCelebration' }
  | { type: 'showCard' }
  | { type: 'hideCard' }
  | { type: 'openCard' }
  | { type: 'setLocale'; locale: Locale }
  | { type: 'reset' };

const initial: State = {
  locale: 'en',
  checked: [],
  xp: 0,
  unlocked: [],
  card: null,
  cardVisible: false,
  cardOpened: false,
  celebration: null,
};

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'toggle': {
      if (s.checked.includes(a.slug)) {
        return { ...s, checked: s.checked.filter((x) => x !== a.slug), xp: Math.max(0, s.xp - XP_PER_PLANT) };
      }
      const checked = [...s.checked, a.slug];
      let xp = s.xp;
      let unlocked: AchievementId[] = s.unlocked;
      let card = s.card;
      let celebration = s.celebration;
      xp += XP_PER_PLANT;
      if (checked.length >= 3 && !unlocked.includes('first_bites')) {
        unlocked = [...unlocked, 'first_bites' as const];
        xp += XP_ACHIEVEMENT;
        card = a.slug;
        celebration = 'first_bites';
      }
      return { ...s, checked, xp, unlocked, card, celebration };
    }
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
      return { ...initial, locale: s.locale };
  }
}

type Store = State & { t: Strings; dispatch: React.Dispatch<Action> };

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initial);
  const value = useMemo<Store>(() => ({ ...state, t: STRINGS[state.locale], dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore outside StoreProvider');
  return v;
}
