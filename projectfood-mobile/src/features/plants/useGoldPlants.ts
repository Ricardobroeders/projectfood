import { useMemo } from 'react';

import { useHousehold } from '@/features/household/queries';
import { useTasteCounts } from '@/features/logs/queries';
import { CARD_LEVELS } from '@/features/plants/cardLevel';

/**
 * Plants anyone at the table has taken to gold. Their ground turns gold wherever the plant is shown
 * and the gold clay render replaces the normal one, so the gold spreads across the screens as the
 * family keeps eating (Ricardo, 2026-09-26).
 *
 * Household scope, not per member: the Log shelf, the Home chips and the menu that grows from the
 * finger are all shared surfaces. The per-member card tiles under Unlocks use that member's own
 * level instead. Counts are per member, so `tastes` is never summed across the table: two members at
 * eight tastes each is not a gold card.
 */
export function useGoldPlants(): Set<string> {
  const { data: hh } = useHousehold();
  const { data: counts } = useTasteCounts(hh?.household.id);
  return useMemo(
    () => new Set((counts ?? []).filter((c) => c.tastes >= CARD_LEVELS.gold).map((c) => c.plant_id)),
    [counts],
  );
}
