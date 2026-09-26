import { useRouter } from 'expo-router';
import { Flame, Plus, Snowflake } from 'lucide-react-native';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AnimatedNumber } from '@/components/AnimatedNumber';
import { CategoryImage } from '@/components/CategoryImage';
import { GoalGauge } from '@/components/GoalGauge';
import { MemberAvatar } from '@/components/MemberAvatar';
import { ProgressBar } from '@/components/ProgressBar';
import { Stamp } from '@/components/Stamp';
import { StampArt } from '@/components/StampArt';
import { PrimaryButton, Screen, SectionTitle } from '@/components/ui';
import { motion } from '@/constants/motion';
import { CAT_ORDER, CATS, colors, fonts, radii } from '@/constants/theme';
import { levelLabel } from '@/features/achievements/copy';
import { ACHIEVEMENT_BY_ID, nearestGoals } from '@/features/achievements/definitions';
import { useAchievements } from '@/features/achievements/useAchievements';
import { useHousehold, useSettings, useUpdateSettings } from '@/features/household/queries';
import { dateKey, daysLeftInWeek, distinctPlants, tasteMapFor } from '@/features/logs/model';
import { useStreak, useWeekLogs } from '@/features/logs/queries';
import { useScrollToTopOnTab } from '@/features/navigation/useScrollToTopOnTab';
import { usePlantCatalog } from '@/features/plants/catalog';
import { PlantImage } from '@/features/plants/PlantImage';
import { useSurveyProgress } from '@/features/survey/queries';
import { useUi } from '@/state/ui';
import { useGoldPlants } from '@/features/plants/useGoldPlants';

const GOAL = 30;

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { data: hh } = useHousehold();
  const hid = hh?.household.id;
  const members = hh?.members ?? [];
  const { catalog } = usePlantCatalog();
  const goldPlants = useGoldPlants();
  const { data: logs = [] } = useWeekLogs(hid);
  const { data: streak } = useStreak(hid);
  const { progress, levels, ready } = useAchievements();
  const openAchievement = useUi((s) => s.openAchievement);
  const survey = useSurveyProgress();
  const settings = useSettings();
  const updateSettings = useUpdateSettings();
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTopOnTab(scrollRef);

  const today = dateKey();
  const tastesToday = useMemo(() => tasteMapFor(logs, today), [logs, today]);
  const weekPlantIds = useMemo(() => distinctPlants(logs), [logs]);
  const weekCount = weekPlantIds.length;
  const todayPlants = Object.keys(tastesToday).map((id) => catalog.byId[id]).filter(Boolean);
  const perMember = members.map((m) => ({ m, n: new Set(logs.filter((r) => r.member_id === m.id).map((r) => r.plant_id)).size }));
  const goals = ready ? nearestGoals(progress, levels, 3) : [];
  const byCat = CAT_ORDER.map((c) => ({ c, plants: weekPlantIds.map((id) => catalog.byId[id]).filter((p) => p && p.category === c) })).filter((x) => x.plants.length > 0);
  const toGo = Math.max(0, GOAL - weekCount);
  const daysLeft = daysLeftInWeek();
  const showSurvey = survey.pending && !!settings.data;
  // The gauge fills the hero's inner width, capped so the segments keep their spacing on tablets.
  const gaugeSize = Math.min(280, width - 40 - 48);

  return (
    <Screen>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('home.greeting')}</Text>
          {streak && streak.current_streak > 0 ? (
            <View style={styles.streak}>
              <Flame size={16} color={colors.accentPressed} />
              <Text style={styles.streakText}>{streak.current_streak === 1 ? t('home.streakOne') : t('home.streak', { n: streak.current_streak })}</Text>
              {streak.freeze_used_on ? <Snowflake size={14} color={colors.ink3} /> : null}
            </View>
          ) : null}
        </View>

        {/* Grey surface on white, no shadow: the distinction rule from the first device test. */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <Text style={styles.heroLabel}>{t('home.thisWeek')}</Text>
            <Text style={styles.heroMeta}>{daysLeft > 0 ? t('home.daysLeft', { days: daysLeft }) : ''}</Text>
          </View>
          <View style={styles.gaugeWrap}>
            <GoalGauge value={weekCount} max={GOAL} size={gaugeSize}>
              <AnimatedNumber value={weekCount} from={0} timing={motion.fill} style={styles.heroNumber} />
              <Text style={styles.heroDenominator}>{t('home.ofGoal', { n: GOAL })}</Text>
            </GoalGauge>
          </View>
          <View style={styles.heroPill}>
            <Text style={styles.heroSub}>{toGo === 0 ? t('home.goalReached') : t('home.toGo', { n: toGo })}</Text>
          </View>
          {members.length > 1 ? (
            <View style={styles.members}>
              {perMember.map(({ m, n }) => (
                <View key={m.id} style={styles.member}>
                  <MemberAvatar member={m} size={28} />
                  <Text style={styles.memberCount}>{n}</Text>
                </View>
              ))}
            </View>
          ) : null}
          <PrimaryButton label={t('home.cta')} onPress={() => router.push('/log')} icon={<Plus size={18} color={colors.onAccent} />} style={{ marginTop: 16 }} />
        </View>

        {showSurvey ? (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>{t('survey.prompt_banner')}</Text>
            <View style={styles.bannerActions}>
              <Pressable onPress={() => updateSettings.mutate({ survey_dismissed_at: new Date().toISOString() })} style={styles.bannerGhost}>
                <Text style={styles.bannerGhostText}>{t('survey.prompt_dismiss')}</Text>
              </Pressable>
              <Pressable onPress={() => router.push('/account/survey')} style={styles.bannerCta}>
                <Text style={styles.bannerCtaText}>{t('survey.prompt_cta')}</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {goals.length > 0 ? (
          <>
            <SectionTitle>{t('home.nextGoals')}</SectionTitle>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
              {goals.map((g) => {
                const a = ACHIEVEMENT_BY_ID[g.id];
                const member = g.memberId ? members.find((m) => m.id === g.memberId) : null;
                return (
                  <Pressable key={`${g.id}:${g.memberId ?? 'hh'}`} style={({ pressed }) => [styles.goal, pressed && { backgroundColor: colors.hairline }]} onPress={() => openAchievement(g.id, g.memberId)}>
                    <Stamp size={44} color={a.color}>
                      <StampArt achievement={a} size={44} />
                    </Stamp>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={styles.goalTitle} numberOfLines={1}>
                        {t(`stamps.${g.id}.title`)}
                        {g.level > 1 ? ` · ${levelLabel(t, g.level)}` : ''}
                      </Text>
                      <Text style={styles.goalMeta} numberOfLines={1}>
                        {g.remaining === 1 ? t('unlocks.remainingOne') : t('unlocks.remaining', { n: g.remaining })}
                      </Text>
                      <ProgressBar value={g.current} max={g.target} height={4} style={{ marginTop: 4 }} />
                    </View>
                    {member ? <MemberAvatar member={member} size={24} /> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </>
        ) : null}

        {todayPlants.length > 0 ? (
          <>
            <SectionTitle>{t('home.today')}</SectionTitle>
            <View style={styles.chips}>
              {todayPlants.map((p) => (
                <Pressable key={p.id} onPress={() => router.push({ pathname: '/plant/[id]', params: { id: p.id } })} style={({ pressed }) => [styles.chip, { backgroundColor: goldPlants.has(p.id) ? colors.goldSoft : CATS[p.category].bg }, pressed && { opacity: 0.8 }]}>
                  <PlantImage plant={p} size={22} gold={goldPlants.has(p.id)} />
                  <Text style={styles.chipText} numberOfLines={1}>
                    {p.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : null}

        <SectionTitle meta={weekCount ? `${weekCount}` : undefined}>{t('home.thisWeeksCollection')}</SectionTitle>
        {byCat.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>{t('home.logFirstPlant')}</Text>
            <Text style={styles.emptyText}>{t('home.logFirstPlantSub')}</Text>
          </View>
        ) : (
          <View style={styles.cats}>
            {byCat.map(({ c, plants }) => (
              <View key={c} style={[styles.cat, { backgroundColor: CATS[c].bg }]}>
                <View style={styles.catHead}>
                  <CategoryImage category={c} size={36} style={styles.catImage} />
                  <Text style={[styles.catTitle, { color: CATS[c].fg }]}>{t(`categoriesPlural.${c}`)}</Text>
                  <Text style={[styles.catCount, { color: CATS[c].fg }]}>{plants.length}</Text>
                </View>
                <View style={styles.pills}>
                  {plants.map((p) => (
                    <Pressable key={p.id} onPress={() => router.push({ pathname: '/plant/[id]', params: { id: p.id } })} style={({ pressed }) => [styles.pill, pressed && { opacity: 0.8 }]}>
                      <Text style={styles.pillText} numberOfLines={1}>
                        {p.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, gap: 12 },
  title: { fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 32, color: colors.ink, letterSpacing: -0.4 },
  streak: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingHorizontal: 12, borderRadius: radii.sm, backgroundColor: colors.accentSoft },
  streakText: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: colors.ink },
  hero: { margin: 20, backgroundColor: colors.bgSoft, borderRadius: radii.xl, padding: 24, gap: 4 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between' },
  heroLabel: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20, color: colors.ink2 },
  heroMeta: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 20, color: colors.ink3 },
  gaugeWrap: { alignItems: 'center', marginTop: 8 },
  heroNumber: { fontFamily: fonts.extrabold, fontSize: 56, lineHeight: 62, color: colors.ink, letterSpacing: -1.5, textAlign: 'center' },
  heroDenominator: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 20, color: colors.ink2, marginTop: -4 },
  heroPill: { alignSelf: 'center', height: 34, paddingHorizontal: 16, borderRadius: radii.full, backgroundColor: colors.surface, justifyContent: 'center', marginTop: 4 },
  heroSub: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 18, color: colors.ink },
  members: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  member: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingLeft: 4, paddingRight: 12, borderRadius: radii.sm, backgroundColor: colors.surface },
  memberCount: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, color: colors.ink },
  banner: { marginHorizontal: 20, marginTop: -8, marginBottom: 8, padding: 16, borderRadius: radii.lg, backgroundColor: colors.accentSoft, gap: 10 },
  bannerText: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink },
  bannerActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  bannerGhost: { height: 36, paddingHorizontal: 12, justifyContent: 'center' },
  bannerGhostText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink2 },
  bannerCta: { height: 36, paddingHorizontal: 14, borderRadius: radii.sm, backgroundColor: colors.ink, justifyContent: 'center' },
  bannerCtaText: { fontFamily: fonts.semibold, fontSize: 14, color: '#FFFFFF' },
  rail: { paddingHorizontal: 20, gap: 10 },
  goal: { width: 250, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: radii.lg, backgroundColor: colors.bgSoft },
  goalTitle: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink },
  goalMeta: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 36, paddingLeft: 8, paddingRight: 12, borderRadius: radii.sm },
  chipText: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 18, color: colors.ink, maxWidth: 160 },
  empty: { marginHorizontal: 20, padding: 24, borderRadius: radii.lg, backgroundColor: colors.bgSoft, gap: 4 },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22, color: colors.ink },
  emptyText: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, color: colors.ink2 },
  cats: { paddingHorizontal: 20, gap: 10 },
  cat: { borderRadius: radii.lg, padding: 14, gap: 10 },
  catHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catImage: { marginRight: 6, marginVertical: -3 },
  catTitle: { flex: 1, fontFamily: fonts.bold, fontSize: 14, lineHeight: 18 },
  catCount: { fontFamily: fonts.extrabold, fontSize: 18, lineHeight: 22 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: { height: 30, paddingHorizontal: 12, borderRadius: radii.sm, backgroundColor: 'rgba(255,255,255,0.85)', justifyContent: 'center' },
  pillText: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: colors.ink },
});
