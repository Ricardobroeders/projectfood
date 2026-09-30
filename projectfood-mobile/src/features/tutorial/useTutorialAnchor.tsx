import { type PropsWithChildren, useCallback, useEffect, useRef } from 'react';
import { View, type ViewProps } from 'react-native';

import { type TutorialAnchor, useUi } from '@/state/ui';

/** Edges of the measured box that are not the control itself (a row's bottom margin). */
export type AnchorInset = { top?: number; bottom?: number; left?: number; right?: number };

/**
 * Reports a control's window rectangle while the tutorial runs, so the overlay can cut its hole
 * there. Measures on layout and again shortly after the tutorial starts or moves a step, because
 * a tab that has just been navigated to lays out a frame later. Idle when no tutorial runs.
 */
export function useTutorialAnchor(name: TutorialAnchor, inset?: AnchorInset) {
  const ref = useRef<View>(null);
  const step = useUi((s) => s.tutorialStep);
  const setAnchor = useUi((s) => s.setTutorialAnchor);
  const active = step !== null;

  const measure = useCallback(() => {
    if (!active) return;
    const { top = 0, bottom = 0, left = 0, right = 0 } = inset ?? {};
    ref.current?.measureInWindow((x, y, width, height) => {
      if (width > 0 && height > 0) setAnchor(name, { x: x + left, y: y + top, width: width - left - right, height: height - top - bottom });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, name, setAnchor, inset?.top, inset?.bottom, inset?.left, inset?.right]);

  useEffect(() => {
    if (!active) return;
    measure();
    const t = setTimeout(measure, 250);
    return () => clearTimeout(t);
  }, [active, step, measure]);

  return { ref, onLayout: measure };
}

/** A plain wrapper for controls that cannot take the ref themselves (a list row, the week chip). */
export function TutorialAnchorView({ name, inset, children, ...rest }: PropsWithChildren<ViewProps & { name: TutorialAnchor; inset?: AnchorInset }>) {
  const anchor = useTutorialAnchor(name, inset);
  return (
    <View ref={anchor.ref} onLayout={anchor.onLayout} {...rest}>
      {children}
    </View>
  );
}
