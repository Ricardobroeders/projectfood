import type { Tables } from '@/features/supabase/types';

export type LogRow = Tables<'plant_logs'>;

/** Local calendar date as YYYY-MM-DD. Client-computed on purpose (the PWA's timezone lesson). */
export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(key: string, n: number): string {
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(y, m - 1, d + n);
  return dateKey(dt);
}

/** Monday of the week that contains `d`, as YYYY-MM-DD. Matches Postgres date_trunc('week'). */
export function weekStartOf(d: Date = new Date()): string {
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;
  return dateKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff));
}

export function daysLeftInWeek(d: Date = new Date()): number {
  const day = d.getDay();
  return day === 0 ? 0 : 7 - day;
}

/** plantId -> ids of the members who tasted it on `day`. Key order = first-logged order. */
export type TasteMap = Record<string, string[]>;

export function tasteMapFor(rows: LogRow[], day: string): TasteMap {
  const out: TasteMap = {};
  const sorted = rows.filter((r) => r.logged_on === day).sort((a, b) => a.logged_at.localeCompare(b.logged_at));
  for (const r of sorted) {
    (out[r.plant_id] ??= []).push(r.member_id);
  }
  return out;
}

/** Distinct plant ids in a set of rows. */
export function distinctPlants(rows: LogRow[]): string[] {
  return [...new Set(rows.map((r) => r.plant_id))];
}
