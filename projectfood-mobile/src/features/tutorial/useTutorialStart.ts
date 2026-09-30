import { useEffect, useState } from 'react';

import { useUi } from '@/state/ui';

/**
 * Starts the tutorial once per phone, on the first tabs render after onboarding, and once on the
 * next launch for households onboarded before it existed. Waits for the persisted ui store to
 * hydrate, otherwise every launch would start it for a moment before `tutorialSeenAt` arrives.
 */
export function useTutorialStart() {
  const step = useUi((s) => s.tutorialStep);
  const seenAt = useUi((s) => s.tutorialSeenAt);
  const start = useUi((s) => s.startTutorial);
  const [hydrated, setHydrated] = useState(useUi.persist.hasHydrated());

  useEffect(() => useUi.persist.onFinishHydration(() => setHydrated(true)), []);

  useEffect(() => {
    if (!hydrated || seenAt || step !== null) return;
    const t = setTimeout(start, 700);
    return () => clearTimeout(t);
  }, [hydrated, seenAt, step, start]);
}
