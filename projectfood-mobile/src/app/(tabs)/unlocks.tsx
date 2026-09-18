import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Cup } from '@/components/Cup';
import { MemberAvatar } from '@/components/MemberAvatar';
import { ProgressBar } from '@/components/ProgressBar';
import { StampGrid } from '@/components/StampShelf';
import { Loading, Screen, ScreenTitle, SectionTitle } from '@/components/ui';
import { CAT_ORDER, CATS, colors, fonts, radii } from '@/constants/theme';
import { ACHIEVEMENT_BY_ID, ACHIEVEMENTS, type AchievementId, progressFor, unlockKey } from '@/features/achievements/definitions';
import { useAchievements } from '@/features/achievements/useAchievements';
import { perfStart } from '@/features/dev/perf';
import { usePlantCatalog } from '@/features/plants/catalog';
import { useUi } from '@/state/ui';

/** Stats, reborn as Unlocks: stamps, card levels and the foods tried, per kid (never ranked) with the family's shared stamps. */
export default function UnlocksScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { members, progress, unlockedKeys, ready, ctx } = useAchievements();
  const { catalog } = usePlantCatalog();
  const openAchievement = useUi((s) => s.openAchievement);
  const [view, setView] = useState<string | null>(null);
  const memberId = view ?? members[0]?.id ?? null;

  const entries = useMemo(() => progressFor(progress, memberId), [progress, memberId]);
  const unlocked = (id: AchievementId) => unlockedKeys.has(unlockKey(id, ACHIEVEMENT_BY_ID[id].scope === 'member' ? memberId : null));
  const unlockedCount = ACHIEVEMENTS.filter((a) => unlocked(a.id)).length;

  const counts = useMemo(() => ctx.tasteCounts.filter((c) => c.member_id === memberId), [ctx.tasteCounts, memberId]);
  const cards = { unlocked: counts.length, silver: counts.filter((c) => c.tastes >= 5).length, gold: counts.filter((c) => c.tastes >= 10).length };
  const triedIds = useMemo(() => new Set(counts.map((c) => c.plant_id)), [counts]);
  const perCat = CAT_ORDER.map((c) => {
    const all = catalog.plants.filter((p) => p.category === c);
    return { c, tried: all.filter((p) => triedIds.has(p.id)).length, total: all.length };
  });
  const triedTotal = perCat.reduce((a, x) => a + x.tried, 0);

  if (!ready) return <Loading />;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenTitle meta={t('unlocks.ofUnlocked', { n: unlockedCount, m: ACHIEVEMENTS.length })}>{t('unlocks.title')}</ScreenTitle>

        {members.length > 1 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.switcher}>
            {members.map((m) => {
              const on = m.id === memberId;
              return (
                <Pressable key={m.id} onPress={() => setView(m.id)} style={[styles.memberChip, on && { backgroundColor: colors.ink }]} accessibilityRole="radio" accessibilityState={{ selected: on }}>
                  <MemberAvatar member={m} size={24} />
                  <Text style={[styles.memberChipText, on && { color: '#FFFFFF' }]}>{m.name}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : null}

        <SectionTitle>{t('unlocks.stamps')}</SectionTitle>
        <StampGrid entries={entries} unlocked={unlocked} onPress={(id) => openAchievement(id, ACHIEVEMENT_BY_ID[id].scope === 'member' ? memberId : null)} />

        <SectionTitle meta={t('unlocks.cardsUnlocked', { n: cards.unlocked })}>{t('unlocks.cards')}</SectionTitle>
        <View style={styles.cardsRow}>
          <View style={[styles.cardStat, { backgroundColor: '#F1DFC4' }]}>
            <Cup level="bronze" size={36} />
            <View style={styles.cardText}>
              <Text style={styles.cardNumber}>{cards.unlocked}</Text>
              <Text style={styles.cardLabel} numberOfLines={1}>
                {t('unlocks.unlocked')}
              </Text>
            </View>
          </View>
          <View style={[styles.cardStat, { backgroundColor: '#E9E9EC' }]}>
            <Cup level="silver" size={36} />
            <View style={styles.cardText}>
              <Text style={styles.cardNumber}>{cards.silver}</Text>
              <Text style={styles.cardLabel} numberOfLines={1}>
                {t('unlocks.silver')}
              </Text>
            </View>
          </View>
          <View style={[styles.cardStat, { backgroundColor: '#FBEDB5' }]}>
            <Cup level="gold" size={36} />
            <View style={styles.cardText}>
              <Text style={styles.cardNumber}>{cards.gold}</Text>
              <Text style={styles.cardLabel} numberOfLines={1}>
                {t('unlocks.gold')}
              </Text>
            </View>
          </View>
        </View>

        <SectionTitle meta={`${triedTotal} ${t('unlocks.ofTotal', { total: catalog.plants.length })}`}>{t('unlocks.foodsTried')}</SectionTitle>
        <View style={styles.cats}>
          {perCat.map(({ c, tried, total }) => (
            <Pressable
              key={c}
              onPress={() => {
                perfStart('→category');
                router.push({ pathname: '/unlocks/[category]', params: { category: c, member: memberId ?? '' } });
              }}
              style={({ pressed }) => [styles.catRow, { backgroundColor: CATS[c].bg }, pressed && { opacity: 0.8 }]}>
              <View style={{ flex: 1, gap: 6 }}>
                <View style={styles.catHead}>
                  <Text style={[styles.catTitle, { color: CATS[c].fg }]}>{t(`categoriesPlural.${c}`)}</Text>
                  <Text style={[styles.catCount, { color: CATS[c].fg }]}>
                    {tried}/{total}
                  </Text>
                </View>
                <ProgressBar value={tried} max={total} height={4} color={CATS[c].fg} />
              </View>
              <ChevronRight size={18} color={CATS[c].fg} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 32 },
  switcher: { paddingHorizontal: 20, gap: 8, marginTop: 14 },
  memberChip: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 36, paddingLeft: 6, paddingRight: 14, borderRadius: radii.sm, backgroundColor: colors.bgSoft },
  memberChipText: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 18, color: colors.ink },
  cardsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20 },
  cardStat: { flex: 1, height: 76, borderRadius: radii.lg, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardText: { flex: 1, gap: 2 },
  cardNumber: { fontFamily: fonts.extrabold, fontSize: 24, lineHeight: 28, color: colors.ink },
  cardLabel: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, color: colors.ink2 },
  cats: { paddingHorizontal: 20, gap: 8 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 64, paddingHorizontal: 16, paddingVertical: 12, borderRadius: radii.md },
  catHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  catTitle: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20 },
  catCount: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18 },
});
