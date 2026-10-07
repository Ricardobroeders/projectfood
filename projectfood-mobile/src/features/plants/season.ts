import type { Plant } from '@/features/plants/catalog';

/** In season this month, Europe table (plants.season_months). A plant without months is "all year" and never flagged. */
export function inSeason(plant: Pick<Plant, 'seasonMonths'>, month: number): boolean {
  return !!plant.seasonMonths && plant.seasonMonths.length > 0 && plant.seasonMonths.includes(month);
}
