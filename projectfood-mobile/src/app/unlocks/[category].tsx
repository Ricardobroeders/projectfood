import { useLocalSearchParams, useRouter } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { BackHeader, Loading, Screen, SectionTitle } from '@/components/ui';
import { CATS, colors, fonts, radii, type Category } from '@/constants/theme';
import { useAchievements } from '@/features/achievements/useAchievements';
import { perfEnd, perfStart } from '@/features/dev/perf';
import { type Plant, usePlantCatalog } from '@/features/plants/catalog';
import { PlantImage } from '@/features/plants/PlantImage';

const LEVEL_BG = { bronze: '#F1DFC4', silver: '#E9E9EC', gold: '#FBEDB5' } as const;

type Row =
  | { kind: 'head'; key: string; title: string; meta: string }
  | { kind: 'tried'; key: string; p: Plant; n: number; label: string }
  | { kind: 'untried'; key: string; p: Plant };

/** All-time list for one category: tried (with taste count and card level) and not yet tried. */
export default function CategoryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { category, member } = useLocalSearchParams<{ category: Category; member?: string }>();
  const { catalog, isLoading } = usePlantCatalog();
  const { members, ctx, ready } = useAchievements();
  const memberId = member || members[0]?.id;
  const cat = CATS[category as Category];

  // One flat list with two headers: the 76 vegetables mount a few rows at a time instead of all at once.
  const rows = useMemo<Row[]>(() => {
    const counts = new Map(ctx.tasteCounts.filter((c) => c.member_id === memberId).map((c) => [c.plant_id, c.tastes]));
    const all = catalog.plants.filter((p) => p.category === category);
    const tried = all
      .filter((p) => counts.has(p.id))
      .map((p) => ({ p, n: counts.get(p.id)! }))
      .sort((a, b) => b.n - a.n || a.p.name.localeCompare(b.p.name));
    const untried = all.filter((p) => !counts.has(p.id));
    return [
      { kind: 'head', key: 'h-tried', title: t('unlocks.tried'), meta: `${tried.length}` },
      ...tried.map(({ p, n }) => ({ kind: 'tried' as const, key: p.id, p, n, label: n === 1 ? t('unlocks.tastesOne') : t('unlocks.tastes', { n }) })),
      { kind: 'head', key: 'h-untried', title: t('unlocks.notYetTried'), meta: `${untried.length}` },
      ...untried.map((p) => ({ kind: 'untried' as const, key: `u-${p.id}`, p })),
    ];
  }, [ctx.tasteCounts, catalog.plants, category, memberId, t]);

  const measured = useRef(false);
  useEffect(() => {
    if (ready && !measured.current) {
      measured.current = true;
      perfEnd('→category', `${rows.length} rows`);
    }
  }, [ready, rows.length]);

  const open = useCallback(
    (id: string) => {
      perfStart('→plant');
      router.push({ pathname: '/plant/[id]', params: { id } });
    },
    [router],
  );
  const renderItem = useCallback(
    ({ item }: { item: Row }) => {
      if (item.kind === 'head') return <SectionTitle meta={item.meta}>{item.title}</SectionTitle>;
      if (item.kind === 'tried') return <TriedRow plant={item.p} n={item.n} label={item.label} bg={cat?.bg ?? colors.bgSoft} onPress={open} />;
      return <UntriedRow plant={item.p} onPress={open} />;
    },
    [cat, open],
  );

  if (isLoading || !ready || !cat) return <Loading />;
  const who = members.find((m) => m.id === memberId);

  return (
    <Screen>
      <BackHeader title={`${t(`categoriesPlural.${category as Category}`)}${who && members.length > 1 ? ` · ${who.name}` : ''}`} />
      <FlatList
        data={rows}
        keyExtractor={(r) => r.key}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={40}
        windowSize={5}
      />
    </Screen>
  );
}

const TriedRow = memo(function TriedRow({ plant, n, label, bg, onPress }: { plant: Plant; n: number; label: string; bg: string; onPress: (id: string) => void }) {
  const level = n >= 10 ? 'gold' : n >= 5 ? 'silver' : 'bronze';
  return (
    <Pressable onPress={() => onPress(plant.id)} style={({ pressed }) => [styles.row, pressed && { opacity: 0.8 }]}>
      <View style={[styles.tile, { backgroundColor: bg }]}>
        <PlantImage plant={plant} size={40} />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {plant.name}
      </Text>
      <View style={[styles.badge, { backgroundColor: LEVEL_BG[level] }]}>
        <Text style={styles.badgeText}>{label}</Text>
      </View>
    </Pressable>
  );
});

const UntriedRow = memo(function UntriedRow({ plant, onPress }: { plant: Plant; onPress: (id: string) => void }) {
  return (
    <Pressable onPress={() => onPress(plant.id)} style={({ pressed }) => [styles.row, styles.rowMuted, pressed && { opacity: 0.8 }]}>
      <View style={[styles.tile, { backgroundColor: colors.surface }]}>
        <PlantImage plant={plant} size={40} style={styles.muted} />
      </View>
      <Text style={[styles.name, { color: colors.ink2 }]} numberOfLines={1}>
        {plant.name}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  content: { paddingBottom: 32 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 64, marginHorizontal: 20, marginBottom: 8, paddingRight: 12, borderRadius: radii.md, backgroundColor: colors.bgSoft, overflow: 'hidden' },
  rowMuted: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.hairline },
  tile: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
  muted: { opacity: 0.55 },
  name: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink },
  badge: { height: 28, paddingHorizontal: 10, borderRadius: radii.sm, justifyContent: 'center' },
  badgeText: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, color: colors.ink },
});
