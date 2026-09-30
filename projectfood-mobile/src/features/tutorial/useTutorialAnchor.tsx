import { type PropsWithChildren, useCallback, useEffect, useRef } from 'react';
import { View, type ViewProps } from 'react-native';

import { type TutorialAnchor, useUi } from '@/state/ui';

/**
 * Reports a control's window rectangle while the tutorial runs, so the overlay can cut its hole
 * there. Measures on layout and again shortly after the tutorial starts or moves a step, because
 * a tab that has just been navigated to lays out a frame later. Idle when no tutorial runs.
 */
export function useTutorialAnchor(name: TutorialAnchor) {
  const ref = useRef<View>(null);
  const step = useUi((s) => s.tutorialStep);
  const setAnchor = useUi((s) => s.setTutorialAnchor);
  const active = step !== null;

  const measure = useCallback(() => {
    if (!active) return;
    ref.current?.measureInWindow((x, y, width, height) => {
      if (width > 0 && height > 0) setAnchor(name, { x, y, width, height });
    });
  }, [active, name, setAnchor]);

  useEffect(() => {
    if (!active) return;
    measure();
    const t = setTimeout(measure, 250);
    return () => clearTimeout(t);
  }, [active, step, measure]);

  return { ref, onLayout: measure };
}

/** A plain wrapper for controls that cannot take the ref themselves (a list row, the week chip). */
export function TutorialAnchorView({ name, children, ...rest }: PropsWithChildren<ViewProps & { name: TutorialAnchor }>) {
  const anchor = useTutorialAnchor(name);
  return (
    <View ref={anchor.ref} onLayout={anchor.onLayout} {...rest}>
      {children}
    </View>
  );
}
