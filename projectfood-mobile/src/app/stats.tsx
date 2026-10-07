import { useRouter } from 'expo-router';
import { Flame, type LucideIcon, Plus, Star, Target, Trophy } from 'lucide-react-native';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { type Bar, BarChart } from '@/components/BarChart';
import { CategoryMix, type MixRow } from '@/components/CategoryMix';
import { bandColor } from '@/components/GoalGauge';
import { LineChart, type LinePoint } from '@/components/LineChart';
import { BackHeader, Loading, PrimaryButton, Screen } from '@/components/ui';
import { CAT_ORDER, type Category, colors, fonts, radii } from '@/constants/theme';
import BENCHMARKS from '@/data/benchmarks.json';
import { STAT_IMAGES, type StatKey } from '@/data/statImages.generated';
import { track } from '@/features/events/track';
import { useHousehold } from '@/features/household/queries';
import { useLocale } from '@/features/i18n';
import { addDays, dateKey, weekStartOf } from '@/features/logs/model';
import { useDailyActivity, useStreak, useTasteCounts, useWeeklyHistory } from '@/features/logs/queries';
import { usePlantCatalog } from '@/features/plants/catalog';

const GOAL = 30;
const WEEKS_SHOWN = 12;
/** Four weeks of days ending today; the Mondays are labelled wherever they fall (Ricardo, 2026-09-30:
 *  the earlier Monday-to-Sunday rows left the days still to come as a gap at the right). */
const DAYS_SHOWN = 28;

/**
 * The PWA's "Weekly history", per household (Ricardo, 2026-09-30: testers who used the app for a
 * while missed it). Reached from the streak chip on Home. Both charts read the queries the
 * achievements already keep warm, so the screen opens on cached data and needs no migration.
 */
export default function StatsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = useLocale();
  const { data: hh } = useHousehold();
  const hid = hh?.household.id;
  const { data: streak } = useStreak(hid);
  const weekly = useWeeklyHistory(hid);
  const daily = useDailyActivity(hid);
  const tasteCounts = useTasteCounts(hid);
  const { catalog } = usePlantCatalog();

  useEffect(() => {
    if (hid) track('stats_open', {}, hid);
  }, [hid]);

  const fmt = useMemo(() => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }), [locale]);
  const fmtKey = (key: string) => {
    const [y, m, d] = key.split('-').map(Number);
    return fmt.format(new Date(y, m - 1, d));
  };
  const isMonday = (key: string) => {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d).getDay() === 1;
  };

  const today = dateKey();
  const thisWeek = weekStartOf();
  const allWeeks = weekly.data ?? [];

  // Newest first from the database; the chart reads left to right.
  const weekBars: Bar[] = useMemo(() => {
    const weeks = [...allWeeks].slice(0, WEEKS_SHOWN).reverse();
    const last = weeks.length - 1;
    const mid = Math.floor(last / 2);
    return weeks.map((w, i) => ({
      key: w.week_start,
      value: w.variety,
      color: bandColor(w.variety, GOAL),
      muted: w.week_start === thisWeek,
      label: i === 0 || i === mid || i === last ? fmtKey(w.week_start) : undefined,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allWeeks, thisWeek, locale]);

  // The rows with no member are the household's distinct plants per day.
  const dayPoints: LinePoint[] = useMemo(() => {
    const byDay: Record<string, number> = {};
    for (const r of daily.data ?? []) if (r.member_id === null) byDay[r.day] = r.distinct_plants;
    const start = addDays(today, -(DAYS_SHOWN - 1));
    return Array.from({ length: DAYS_SHOWN }, (_, i) => {
      const day = addDays(start, i);
      return { key: day, value: byDay[day] ?? 0, label: isMonday(day) ? fmtKey(day) : undefined };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daily.data, today, locale]);

  // Your mix: every taste logged, by category, against the typical household's share (bundled
  // benchmark, refreshed with each update; never a live query across households).
  const mix: MixRow[] = useMemo(() => {
    const byCat: Record<string, number> = {};
    let total = 0;
    for (const c of tasteCounts.data ?? []) {
      const cat = catalog.byId[c.plant_id]?.category;
      if (!cat) continue;
      byCat[cat] = (byCat[cat] ?? 0) + c.tastes;
      total += c.tastes;
    }
    const share = (cat: Category) => (total ? (100 * (byCat[cat] ?? 0)) / total : 0);
    return [...CAT_ORDER]
      .map((cat) => ({ category: cat, label: t(`categoriesPlural.${cat}`), share: share(cat), typical: BENCHMARKS.categoryShare[cat] ?? 0 }))
      .sort((a, b) => b.share - a.share);
  }, [tasteCounts.data, catalog.byId, t]);

  const hasHistory = allWeeks.some((w) => w.variety > 0);
  const weeksAtGoal = allWeeks.filter((w) => w.hit_goal).length;
  const bestWeek = allWeeks.reduce((m, w) => Math.max(m, w.variety), 0);

  return (
    <Screen>
      <BackHeader title={t('stats.title')} />
      {!weekly.data && weekly.isLoading ? (
        <Loading />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.tileRow}>
            <Tile image="streak" icon={Flame} tint={colors.accentSoft} label={t('stats.dinnersInARow')} desc={t('stats.dinnersInARowDesc')} value={streak?.current_streak ?? 0} />
            <Tile image="longestStreak" icon={Trophy} tint={colors.goldSoft} label={t('stats.mostInARow')} desc={t('stats.mostInARowDesc')} value={streak?.longest_streak ?? 0} />
          </View>
          <View style={styles.tileRow}>
            <Tile image="weeksAtGoal" icon={Target} tint={colors.successSoft} label={t('stats.weeksAtGoal', { n: GOAL })} desc={t('stats.weeksAtGoalDesc', { n: GOAL })} value={weeksAtGoal} />
            <Tile image="bestWeek" icon={Star} tint="#DCE8FC" label={t('stats.bestWeek')} desc={t('stats.bestWeekDesc')} value={bestWeek} />
          </View>

          {hasHistory ? (
            <>
              <Text style={styles.h2}>{t('stats.mixTitle')}</Text>
              <View style={styles.card}>
                <CategoryMix rows={mix} />
                <Text style={styles.body}>{t('stats.mixBody')}</Text>
                <Legend items={[{ kind: 'bar', label: t('stats.legendYou') }, { kind: 'mark', label: t('stats.legendTypical') }]} />
              </View>

              <Text style={styles.h2}>{t('stats.perWeekTitle')}</Text>
              <View style={styles.card}>
                <BarChart bars={weekBars} goal={GOAL} typical={BENCHMARKS.weekTypical} height={160} showValues />
                <Text style={styles.body}>{t('stats.perWeekBody')}</Text>
                <Legend items={[{ kind: 'line', label: t('stats.legendGoal', { n: GOAL }) }, { kind: 'typical', label: t('stats.legendTypical') }]} />
              </View>

              <Text style={styles.h2}>{t('stats.perDayTitle')}</Text>
              <View style={styles.card}>
                <LineChart points={dayPoints} typical={BENCHMARKS.dayTypical} height={160} />
                <Text style={styles.body}>{t('stats.perDayBody')}</Text>
                <Legend items={[{ kind: 'typical', label: t('stats.legendTypical') }]} />
              </View>

              <Text style={styles.footnote}>{t('stats.typicalNote')}</Text>
            </>
          ) : (
            <View style={[styles.card, { marginTop: 8 }]}>
              <Text style={styles.body}>{t('stats.empty')}</Text>
              <PrimaryButton label={t('home.cta')} onPress={() => router.push('/log')} icon={<Plus size={18} color={colors.onAccent} />} />
            </View>
          )}
        </ScrollView>
      )}
    </Screen>
  );
}

/** The household's records. Ricardo's render per tile on its own tint (2026-10-07; the icon in a disc
 *  stays as the fallback), and a line that says what is counted, since the four read alike. */
function Tile({ image, icon: Icon, tint, label, desc, value }: { image: StatKey; icon: LucideIcon; tint: string; label: string; desc: string; value: number }) {
  const source = STAT_IMAGES[image];
  return (
    <View style={[styles.tile, { backgroundColor: tint }]}>
      {/* Render and number side by side, the words under them (Ricardo, 2026-10-07: four stacked elements wasted the tile). */}
      <View style={styles.tileTop}>
        {source ? (
          <Image source={source} style={styles.tileImage} contentFit="contain" />
        ) : (
          <View style={styles.tileDisc}>
            <Icon size={16} color={colors.ink} />
          </View>
        )}
        <Text style={styles.tileValue}>{value}</Text>
      </View>
      <Text style={styles.tileLabel} numberOfLines={2}>
        {label}
      </Text>
      <Text style={styles.tileDesc} numberOfLines={3}>
        {desc}
      </Text>
    </View>
  );
}

/** What the marks in a chart mean, in the app's own text under it. */
function Legend({ items }: { items: { kind: 'bar' | 'mark' | 'line' | 'typical'; label: string }[] }) {
  return (
    <View style={styles.legend}>
      {items.map((it) => (
        <View key={it.label} style={styles.legendItem}>
          {it.kind === 'bar' ? <View style={styles.legendBar} /> : it.kind === 'mark' ? <View style={styles.legendMark} /> : it.kind === 'line' ? <View style={styles.legendLine} /> : <View style={styles.legendTypical} />}
          <Text style={styles.legendText}>{it.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8, paddingBottom: 72, gap: 10 },
  // Larger than the shared section title and closer to its card (Ricardo, 2026-10-07).
  h2: { fontFamily: fonts.extrabold, fontSize: 22, lineHeight: 28, color: colors.ink, marginHorizontal: 20, marginTop: 14, marginBottom: -2 },
  tileRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20 },
  tile: { flex: 1, padding: 14, borderRadius: radii.lg, backgroundColor: colors.bgSoft },
  tileTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  tileDisc: { width: 32, height: 32, borderRadius: radii.full, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  tileImage: { width: 52, height: 52, marginLeft: -6 },
  // Two lines so "Most dinners in a row" fits a half-width tile; the height is fixed so the descriptions line up.
  tileLabel: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 18, color: colors.ink },
  tileDesc: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, color: colors.ink2, marginTop: 1 },
  tileValue: { fontFamily: fonts.extrabold, fontSize: 30, lineHeight: 36, color: colors.ink, letterSpacing: -0.6 },
  card: { marginHorizontal: 20, padding: 16, borderRadius: radii.lg, backgroundColor: colors.bgSoft, gap: 12 },
  body: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink2 },
  footnote: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, color: colors.ink3, marginHorizontal: 20 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: -2 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendText: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, color: colors.ink2 },
  legendBar: { width: 14, height: 8, borderRadius: 4, backgroundColor: colors.ink2 },
  legendMark: { width: 2, height: 12, borderRadius: 1, backgroundColor: colors.typical },
  legendLine: { width: 14, height: 1, backgroundColor: colors.ink2 },
  legendTypical: { width: 14, height: 2, backgroundColor: colors.typical },
});
