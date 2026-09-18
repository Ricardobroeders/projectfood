import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { CategoryImage } from '@/components/CategoryImage';
import { Cup } from '@/components/Cup';
import { SkeletonRows } from '@/components/Skeleton';
import { BackHeader, Screen, SectionTitle } from '@/components/ui';
import { revealFor } from '@/constants/motion';
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

  // The push transition plays over a skeleton; the rows mount once it has ended (450 ms at most).
  const navigation = useNavigation();
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const nav = navigation as unknown as { addListener: (event: string, cb: () => void) => () => void };
    const unsub = nav.addListener('transitionEnd', () => setSettled(true));
    const id = setTimeout(() => setSettled(true), 450);
    return () => {
      unsub();
      clearTimeout(id);
    };
  }, [navigation]);
  const showRows = settled && ready && !isLoading;

  const measured = useRef(false);
  useEffect(() => {
    if (showRows && !measured.current) {
      measured.current = true;
      perfEnd('→category', `${rows.length} rows`);
    }
  }, [showRows, rows.length]);

  const tally = useMemo(() => {
    const tried = rows.filter((r) => r.kind === 'tried').length;
    return { tried, total: tried + rows.filter((r) => r.kind === 'untried').length };
  }, [rows]);
  const hero = (
    <View style={[styles.hero, { backgroundColor: cat?.bg }]}>
      <CategoryImage category={category as Category} size={128} style={styles.heroImage} />
      <View style={styles.heroText}>
        <Text style={[styles.heroTitle, { color: cat?.fg }]}>{t(`categoriesPlural.${category as Category}`)}</Text>
        <Text style={[styles.heroMeta, { color: cat?.fg }]}>{`${tally.tried} ${t('unlocks.ofTotal', { total: tally.total })}`}</Text>
      </View>
    </View>
  );

  const open = useCallback(
    (id: string) => {
      perfStart('→plant');
      router.push({ pathname: '/plant/[id]', params: { id } });
    },
    [router],
  );
  const renderItem = useCallback(
    ({ item, index }: { item: Row; index: number }) => {
      const entering = revealFor(index);
      if (item.kind === 'head') {
        return (
          <Animated.View entering={entering}>
            <SectionTitle meta={item.meta}>{item.title}</SectionTitle>
          </Animated.View>
        );
      }
      return (
        <Animated.View entering={entering}>
          {item.kind === 'tried' ? <TriedRow plant={item.p} n={item.n} label={item.label} bg={cat?.bg ?? colors.bgSoft} onPress={open} /> : <UntriedRow plant={item.p} onPress={open} />}
        </Animated.View>
      );
    },
    [cat, open],
  );

  if (!cat) return null;
  const who = members.find((m) => m.id === memberId);

  return (
    <Screen>
      <BackHeader title={`${t(`categoriesPlural.${category as Category}`)}${who && members.length > 1 ? ` · ${who.name}` : ''}`} />
      {showRows ? (
        <FlatList
          data={rows}
          keyExtractor={(r) => r.key}
          renderItem={renderItem}
          ListHeaderComponent={hero}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={40}
          windowSize={5}
        />
      ) : (
        <SkeletonRows count={8} height={64} tile={64} header style={styles.skeleton} />
      )}
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
        <Cup level={level} size={20} />
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
  hero: { flexDirection: 'row', alignItems: 'center', gap: 16, marginHorizontal: 20, marginTop: 4, padding: 16, borderRadius: radii.lg },
  heroImage: { marginVertical: -20, marginLeft: -6 },
  heroText: { flex: 1, gap: 2 },
  heroTitle: { fontFamily: fonts.extrabold, fontSize: 22, lineHeight: 28 },
  heroMeta: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20, opacity: 0.85 },
  skeleton: { paddingHorizontal: 20 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 64, marginHorizontal: 20, marginBottom: 8, paddingRight: 12, borderRadius: radii.md, backgroundColor: colors.bgSoft, overflow: 'hidden' },
  rowMuted: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.hairline },
  tile: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
  muted: { opacity: 0.55 },
  name: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 28, paddingLeft: 6, paddingRight: 10, borderRadius: radii.sm },
  badgeText: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, color: colors.ink },
});
