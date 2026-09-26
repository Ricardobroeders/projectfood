import { useLocalSearchParams, useRouter } from 'expo-router';
import { BookOpen, Sparkles, X } from 'lucide-react-native';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Cup } from '@/components/Cup';
import { MemberAvatar } from '@/components/MemberAvatar';
import { SwipeDown } from '@/components/SwipeDown';
import { Loading, PrimaryButton, SecondaryButton, SectionTitle } from '@/components/ui';
import { CATS, colors, fonts, iconFor, radii } from '@/constants/theme';
import { useAchievements } from '@/features/achievements/useAchievements';
import { perfEnd } from '@/features/dev/perf';
import { type CardState, cardStateFor, MORE_TO_KEY, nextCardLevel } from '@/features/plants/cardLevel';
import { usePlantCatalog } from '@/features/plants/catalog';
import { usePlantFact } from '@/features/plants/facts';
import { useLocale } from '@/features/i18n';
import { PlantImage } from '@/features/plants/PlantImage';
import { useUi } from '@/state/ui';

/** Ground per card state; `tasted` is collected with no cup yet. */
const LEVEL_COLORS: Record<CardState, string> = { none: colors.bgSoft, tasted: colors.bgSoft, bronze: '#F1DFC4', silver: '#E9E9EC', gold: colors.goldSoft };

/** The food page: clay render, what it is, the facts, and each member's card level for it. */
export default function PlantDetailScreen() {
  const { t } = useTranslation();
  const locale = useLocale();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { catalog, isLoading } = usePlantCatalog();
  const plant = id ? catalog.byId[id] : undefined;
  const { members, ctx } = useAchievements();
  const { data: fact } = usePlantFact(plant?.id);
  const showFactCard = useUi((s) => s.showFactCard);
  const openPicker = useUi((s) => s.openPicker);
  // The page slides in from the bottom, so it can be swiped back down from anywhere, as long as the
  // content is at the top; the scroll view is a native gesture so the swipe runs alongside it.
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const scrollGesture = useMemo(() => Gesture.Native(), []);
  useEffect(() => {
    if (plant) perfEnd('→plant', plant.slug);
  }, [plant]);

  if (isLoading) return <Loading />;
  if (!plant) return null;
  const cat = CATS[plant.category];
  // The hero turns gold once anyone at the table has taken this card to gold (Ricardo, 2026-09-26).
  const anyGold = ctx.tasteCounts.some((c) => c.plant_id === plant.id && cardStateFor(c.tastes) === 'gold');
  const month = new Date().getMonth() + 1;
  const monthName = (m: number) => new Intl.DateTimeFormat(locale, { month: 'short' }).format(new Date(2026, m - 1, 1));

  return (
    <SwipeDown onDismiss={() => router.back()} scrollY={scrollY} scrollGesture={scrollGesture} style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} style={styles.close} accessibilityRole="button" accessibilityLabel={t('common.close')}>
          <X size={iconFor(40)} color={colors.ink} />
        </Pressable>
      </View>
      <GestureDetector gesture={scrollGesture}>
        <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} overScrollMode="never" contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: anyGold ? colors.goldSoft : cat.bg }]}>
          <Text style={[styles.eyebrow, { color: anyGold ? colors.goldInk : cat.fg }]}>{t(`categories.${plant.category}`).toUpperCase()}</Text>
          <PlantImage plant={plant} size={180} gold={anyGold} />
          <Text style={styles.name}>{plant.name}</Text>
          {plant.superfood ? (
            <View style={styles.superfood}>
              <Sparkles size={14} color={colors.success} />
              <Text style={styles.superfoodText}>{t('plant.superfood')}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.facts}>
          {plant.family ? <Fact label={t('plant.family')} value={plant.family} /> : null}
          {plant.color ? <Fact label={t('plant.colour')} value={t(`colors.${plant.color}`)} /> : null}
          <View style={styles.fact}>
            <Text style={styles.factLabel}>{t('plant.season')}</Text>
            {plant.seasonMonths && plant.seasonMonths.length > 0 ? (
              <View style={styles.months}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                  const inSeason = plant.seasonMonths!.includes(m);
                  return (
                    <View key={m} style={[styles.month, inSeason && { backgroundColor: cat.bg }, m === month && styles.monthNow]}>
                      <Text style={[styles.monthText, inSeason && { color: cat.fg }]}>{monthName(m).slice(0, 1)}</Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Text style={styles.factValue}>{t('plant.allYear')}</Text>
            )}
          </View>
        </View>

        {fact ? (
          <>
            <SectionTitle>{t('plant.didYouKnow')}</SectionTitle>
            <View style={styles.card}>
              <Text style={styles.kidFact}>{fact.kid_fact}</Text>
              <SecondaryButton label={t('plant.tapToFlip')} onPress={() => showFactCard(plant.id)} icon={<BookOpen size={18} color={colors.ink} />} style={{ marginTop: 12 }} />
            </View>
            <SectionTitle>{t('plant.parentTip')}</SectionTitle>
            <View style={styles.card}>
              <Text style={styles.tip}>{fact.parent_tip}</Text>
            </View>
          </>
        ) : null}

        <SectionTitle>{t('plant.tastedBy')}</SectionTitle>
        <View style={styles.members}>
          {members.map((m) => {
            const tc = ctx.tasteCounts.find((c) => c.member_id === m.id && c.plant_id === plant.id);
            const tastes = tc?.tastes ?? 0;
            const level = cardStateFor(tastes);
            const step = nextCardLevel(tastes);
            const next = level === 'none' ? t('plant.locked') : step ? t(MORE_TO_KEY[step.level], { n: step.remaining }) : t('plant.cardGold');
            return (
              <View key={m.id} style={[styles.memberRow, { backgroundColor: LEVEL_COLORS[level] }]}>
                <MemberAvatar member={m} size={40} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.memberName}>{m.name}</Text>
                  <Text style={styles.memberMeta}>{tastes === 0 ? t('plant.neverTasted') : tastes === 1 ? t('unlocks.tastesOne') : t('unlocks.tastes', { n: tastes })}</Text>
                </View>
                <Text style={styles.next} numberOfLines={2}>
                  {next}
                </Text>
                <Cup
                  level={level === 'none' || level === 'tasted' ? 'bronze' : level}
                  size={34}
                  style={level === 'none' ? styles.cupLocked : level === 'tasted' ? styles.cupPending : undefined}
                />
              </View>
            );
          })}
        </View>

        <PrimaryButton label={t('plant.logTonight')} onPress={(e) => openPicker(plant.id, { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY })} style={{ marginHorizontal: 20, marginTop: 24 }} />
        </Animated.ScrollView>
      </GestureDetector>
    </SwipeDown>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  top: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16 },
  close: { width: 40, height: 40, borderRadius: radii.full, backgroundColor: colors.bgSoft, alignItems: 'center', justifyContent: 'center' },
  content: { paddingTop: 4 },
  hero: { marginHorizontal: 20, borderRadius: radii.xl, padding: 24, alignItems: 'center', gap: 10 },
  eyebrow: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 16, letterSpacing: 1.2 },
  name: { fontFamily: fonts.extrabold, fontSize: 30, lineHeight: 36, color: colors.ink, textAlign: 'center' },
  superfood: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 28, paddingHorizontal: 10, borderRadius: radii.sm, backgroundColor: 'rgba(255,255,255,0.85)' },
  superfoodText: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, color: colors.ink },
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, marginTop: 12 },
  fact: { minWidth: '47%', flexGrow: 1, padding: 12, borderRadius: radii.md, backgroundColor: colors.bgSoft, gap: 2 },
  factLabel: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, color: colors.ink3 },
  factValue: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink },
  months: { flexDirection: 'row', gap: 3, marginTop: 4 },
  month: { flex: 1, height: 22, borderRadius: 6, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  monthNow: { borderWidth: 1.5, borderColor: colors.ink },
  monthText: { fontFamily: fonts.semibold, fontSize: 10, color: colors.ink3 },
  card: { marginHorizontal: 20, padding: 16, borderRadius: radii.lg, backgroundColor: colors.bgSoft },
  kidFact: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 26, color: colors.ink },
  tip: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.ink },
  members: { paddingHorizontal: 20, gap: 8 },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 64, paddingHorizontal: 14, paddingVertical: 10, borderRadius: radii.md },
  memberName: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink },
  memberMeta: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink2 },
  next: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, color: colors.ink2, maxWidth: 110, textAlign: 'right' },
  cupLocked: { opacity: 0.3 },
  // collected, still short of bronze: the cup is on its way rather than locked
  cupPending: { opacity: 0.55 },
});
