import { useNavigation } from 'expo-router';
import { useEffect, type RefObject } from 'react';

/** What a ScrollView or a FlatList offers for going back to the top. */
type Scrollable = {
  scrollTo?: (opts: { y: number; animated: boolean }) => void;
  scrollToOffset?: (opts: { offset: number; animated: boolean }) => void;
};

/**
 * A tab opens at the top (Ricardo, 2026-09-24: "the information I need is most likely back on
 * the top of the page"). Listens for the tab bar press rather than focus, so coming back from a
 * pushed page (a plant, a category) keeps the position; only choosing the tab resets it. Without
 * animation: the list is already in place when the tab shows.
 */
export function useScrollToTopOnTab(ref: RefObject<Scrollable | null>) {
  const navigation = useNavigation();
  useEffect(
    () =>
      navigation.addListener('tabPress' as never, () => {
        const s = ref.current;
        if (!s) return;
        if (s.scrollToOffset) s.scrollToOffset({ offset: 0, animated: false });
        else s.scrollTo?.({ y: 0, animated: false });
      }),
    [navigation, ref],
  );
}
