import { useEffect, useState } from 'react';

import { useHousehold } from '@/features/household/queries';
import { useUi } from '@/state/ui';

/**
 * Starts the tutorial once per household on this phone: on the first tabs render after
 * onboarding, once on the next launch for households onboarded before it existed, and again for
 * a new account on the same phone (the flag is keyed by household, not by phone). Waits for the
 * persisted ui store to hydrate, otherwise every launch would start it for a moment before the
 * stored flags arrive.
 */
export function useTutorialStart() {
  const hid = useHousehold().data?.household.id;
  const step = useUi((s) => s.tutorialStep);
  const seen = useUi((s) => (hid ? s.tutorialSeen[hid] : undefined));
  const start = useUi((s) => s.startTutorial);
  const [hydrated, setHydrated] = useState(useUi.persist.hasHydrated());

  useEffect(() => useUi.persist.onFinishHydration(() => setHydrated(true)), []);

  useEffect(() => {
    if (!hydrated || !hid || seen || step !== null) return;
    // Short: the dim fades in and the hole irises onto the control, which covers the first paint.
    const t = setTimeout(start, 350);
    return () => clearTimeout(t);
  }, [hydrated, hid, seen, step, start]);
}
