import { useQuery } from '@tanstack/react-query';
import Fuse from 'fuse.js';
import { useMemo } from 'react';

import type { Category } from '@/constants/theme';
import { useLocale } from '@/features/i18n';
import { supabase } from '@/features/supabase/client';
import type { Database } from '@/features/supabase/types';

export type PlantColor = Database['public']['Enums']['plant_color'];

export type Plant = {
  id: string;
  slug: string;
  /** Name in the current locale, English when no translation exists. */
  name: string;
  category: Category;
  color: PlantColor | null;
  family: string | null;
  superfood: boolean;
  seasonMonths: number[] | null;
  aliases: string[];
  /** The name in every locale (English included): Dutch typed into an English app still finds the plant. */
  names: string[];
  imageUrl: string | null;
};

export type Catalog = {
  plants: Plant[];
  byId: Record<string, Plant>;
  bySlug: Record<string, Plant>;
};

// The trailing shape tag retires a persisted catalogue that predates a change (2: `names`, 1.0.15; 3: the Europe season table, 1.0.31).
export const catalogKey = (locale: string) => ['catalog', locale, 3] as const;

async function fetchCatalog(locale: string): Promise<Catalog> {
  const { data, error } = await supabase
    .from('plants')
    .select('id, slug, name, category, color, botanical_family, is_superfood, season_months, search_aliases, image_url, plant_translations(locale, name)')
    .eq('is_active', true);
  if (error) throw error;
  const plants: Plant[] = (data ?? []).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.plant_translations.find((t) => t.locale === locale)?.name ?? p.name,
    category: p.category,
    color: p.color,
    family: p.botanical_family,
    superfood: p.is_superfood,
    seasonMonths: p.season_months,
    aliases: p.search_aliases ?? [],
    names: [p.name, ...p.plant_translations.map((t) => t.name)],
    imageUrl: p.image_url,
  }));
  plants.sort((a, b) => a.name.localeCompare(b.name, locale));
  const byId: Record<string, Plant> = {};
  const bySlug: Record<string, Plant> = {};
  for (const p of plants) {
    byId[p.id] = p;
    bySlug[p.slug] = p;
  }
  return { plants, byId, bySlug };
}

const EMPTY: Catalog = { plants: [], byId: {}, bySlug: {} };

/** The 224-plant catalogue in the UI language. Persisted; refreshed once a day. */
export function usePlantCatalog() {
  const locale = useLocale();
  const q = useQuery({
    queryKey: catalogKey(locale),
    queryFn: () => fetchCatalog(locale),
    staleTime: 24 * 60 * 60_000,
  });
  return { ...q, catalog: q.data ?? EMPTY };
}

/**
 * Fuzzy search over the name in every locale + aliases (threshold as in the PWA). Empty query =
 * every plant. Testers suggested "Spinazie" and "Sperziebonen" while the app was in English
 * (2026-10-06): the search only knew the English name.
 */
export function usePlantSearch(plants: Plant[], query: string): Plant[] {
  const fuse = useMemo(
    () => new Fuse(plants, { keys: ['name', 'names', 'aliases'], threshold: 0.35, ignoreLocation: true }),
    [plants],
  );
  return useMemo(() => {
    const q = query.trim();
    if (!q) return plants;
    return fuse.search(q).map((r) => r.item);
  }, [fuse, plants, query]);
}
