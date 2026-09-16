import { Link, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackHeader, Loading, Screen, SectionTitle } from '@/components/ui';
import { CATS, colors, fonts, radii, type Category } from '@/constants/theme';
import { useAchievements } from '@/features/achievements/useAchievements';
import { usePlantCatalog } from '@/features/plants/catalog';
import { PlantImage } from '@/features/plants/PlantImage';

const LEVEL_BG = { bronze: '#F1DFC4', silver: '#E9E9EC', gold: '#FBEDB5' } as const;

/** All-time list for one category: tried (with taste count and card level) and not yet tried. */
export default function CategoryScreen() {
  const { t } = useTranslation();
  const { category, member } = useLocalSearchParams<{ category: Category; member?: string }>();
  const { catalog, isLoading } = usePlantCatalog();
  const { members, ctx, ready } = useAchievements();
  const memberId = member || members[0]?.id;
  const cat = CATS[category as Category];

  const { tried, untried } = useMemo(() => {
    const counts = new Map(ctx.tasteCounts.filter((c) => c.member_id === memberId).map((c) => [c.plant_id, c.tastes]));
    const all = catalog.plants.filter((p) => p.category === category);
    const tried = all.filter((p) => counts.has(p.id)).map((p) => ({ p, n: counts.get(p.id)! })).sort((a, b) => b.n - a.n || a.p.name.localeCompare(b.p.name));
    const untried = all.filter((p) => !counts.has(p.id));
    return { tried, untried };
  }, [ctx.tasteCounts, catalog.plants, category, memberId]);

  if (isLoading || !ready || !cat) return <Loading />;
  const who = members.find((m) => m.id === memberId);

  return (
    <Screen>
      <BackHeader title={`${t(`categoriesPlural.${category as Category}`)}${who && members.length > 1 ? ` · ${who.name}` : ''}`} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionTitle meta={`${tried.length}`}>{t('unlocks.tried')}</SectionTitle>
        <View style={styles.list}>
          {tried.map(({ p, n }) => {
            const level = n >= 10 ? 'gold' : n >= 5 ? 'silver' : 'bronze';
            return (
              <Link key={p.id} href={{ pathname: '/plant/[id]', params: { id: p.id } }} asChild>
                <Pressable style={({ pressed }) => [styles.row, pressed && { opacity: 0.8 }]}>
                  <View style={[styles.tile, { backgroundColor: cat.bg }]}>
                    <PlantImage plant={p} size={40} />
                  </View>
                  <Text style={styles.name} numberOfLines={1}>
                    {p.name}
                  </Text>
                  <View style={[styles.badge, { backgroundColor: LEVEL_BG[level] }]}>
                    <Text style={styles.badgeText}>{n === 1 ? t('unlocks.tastesOne') : t('unlocks.tastes', { n })}</Text>
                  </View>
                </Pressable>
              </Link>
            );
          })}
        </View>
        <SectionTitle meta={`${untried.length}`}>{t('unlocks.notYetTried')}</SectionTitle>
        <View style={styles.list}>
          {untried.map((p) => (
            <Link key={p.id} href={{ pathname: '/plant/[id]', params: { id: p.id } }} asChild>
              <Pressable style={({ pressed }) => [styles.row, styles.rowMuted, pressed && { opacity: 0.8 }]}>
                <View style={[styles.tile, { backgroundColor: colors.surface }]}>
                  <PlantImage plant={p} size={40} style={{ opacity: 0.55 }} />
                </View>
                <Text style={[styles.name, { color: colors.ink2 }]} numberOfLines={1}>
                  {p.name}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 32 },
  list: { paddingHorizontal: 20, gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 64, paddingRight: 12, borderRadius: radii.md, backgroundColor: colors.bgSoft, overflow: 'hidden' },
  rowMuted: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.hairline },
  tile: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
  name: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink },
  badge: { height: 28, paddingHorizontal: 10, borderRadius: radii.sm, justifyContent: 'center' },
  badgeText: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, color: colors.ink },
});
