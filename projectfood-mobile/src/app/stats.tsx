import { useRouter } from 'expo-router';
import { Flame, type LucideIcon, Plus, Star, Target, Trophy } from 'lucide-react-native';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { type Bar, BarChart } from '@/components/BarChart';
import { bandColor } from '@/components/GoalGauge';
import { BackHeader, Loading, PrimaryButton, Screen, SectionTitle } from '@/components/ui';
import { colors, fonts, radii } from '@/constants/theme';
import { track } from '@/features/events/track';
import { useHousehold } from '@/features/household/queries';
import { useLocale } from '@/features/i18n';
import { addDays, dateKey, weekStartOf } from '@/features/logs/model';
import { useDailyActivity, useStreak, useWeeklyHistory } from '@/features/logs/queries';

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
  const dayBars: Bar[] = useMemo(() => {
    const byDay: Record<string, number> = {};
    for (const r of daily.data ?? []) if (r.member_id === null) byDay[r.day] = r.distinct_plants;
    const start = addDays(today, -(DAYS_SHOWN - 1));
    return Array.from({ length: DAYS_SHOWN }, (_, i) => {
      const day = addDays(start, i);
      return {
        key: day,
        value: byDay[day] ?? 0,
        color: day === today ? colors.accentPressed : colors.accent,
        label: isMonday(day) ? fmtKey(day) : undefined,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daily.data, today, locale]);

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
            <Tile icon={Flame} label={t('stats.dinnersInARow')} value={streak?.current_streak ?? 0} />
            <Tile icon={Trophy} label={t('stats.mostInARow')} value={streak?.longest_streak ?? 0} />
          </View>
          <View style={styles.tileRow}>
            <Tile icon={Target} label={t('stats.weeksAtGoal', { n: GOAL })} value={weeksAtGoal} />
            <Tile icon={Star} label={t('stats.bestWeek')} value={bestWeek} />
          </View>

          {hasHistory ? (
            <>
              <SectionTitle>{t('stats.perWeekTitle')}</SectionTitle>
              <View style={styles.card}>
                <BarChart bars={weekBars} goal={GOAL} height={150} showValues />
                <Text style={styles.body}>{t('stats.perWeekBody', { n: GOAL })}</Text>
              </View>

              <SectionTitle>{t('stats.perDayTitle')}</SectionTitle>
              <View style={styles.card}>
                <BarChart bars={dayBars} height={110} labelAlign="start" />
                <Text style={styles.body}>{t('stats.perDayBody')}</Text>
              </View>
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

/** The household's records. An icon in a white disc tells the four apart at a glance (Ricardo, 2026-09-30). */
function Tile({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    <View style={styles.tile}>
      <View style={styles.tileDisc}>
        <Icon size={16} color={colors.ink} />
      </View>
      <Text style={styles.tileLabel} numberOfLines={2}>
        {label}
      </Text>
      <Text style={styles.tileValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8, paddingBottom: 32, gap: 10 },
  tileRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20 },
  tile: { flex: 1, padding: 14, borderRadius: radii.lg, backgroundColor: colors.bgSoft, gap: 2 },
  tileDisc: { width: 32, height: 32, borderRadius: radii.full, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  // Two lines so "Most dinners in a row" fits a half-width tile; the height is fixed so the numbers line up.
  tileLabel: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, minHeight: 36, color: colors.ink2 },
  tileValue: { fontFamily: fonts.extrabold, fontSize: 28, lineHeight: 34, color: colors.ink, letterSpacing: -0.6 },
  card: { marginHorizontal: 20, padding: 16, borderRadius: radii.lg, backgroundColor: colors.bgSoft, gap: 12 },
  body: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink2 },
});
