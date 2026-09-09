import { Feather } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedNumber } from '@/components/AnimatedNumber';
import { CelebrationSheet } from '@/components/CelebrationSheet';
import { FunFactCard } from '@/components/FunFactCard';
import { PlantRow } from '@/components/PlantRow';
import { CAT_ORDER, CATS, colors, fonts, radii, type Category } from '@/constants/theme';
import { PLANTS, type Plant } from '@/data/plants';
import { useStore } from '@/state/store';

type Filter = 'all' | Category;

export default function LogScreen() {
  const insets = useSafeAreaInsets();
  const { checked, xp, locale, card, t, dispatch } = useStore();
  const [filter, setFilter] = useState<Filter>('all');

  const plants = useMemo(() => (filter === 'all' ? PLANTS : PLANTS.filter((p) => p.category === filter)), [filter]);
  const onToggle = useCallback((slug: string) => dispatch({ type: 'toggle', slug }), [dispatch]);

  const renderItem = useCallback(
    ({ item }: { item: Plant }) => (
      <PlantRow plant={item} checked={checked.includes(item.slug)} locale={locale} catLabel={t.cats[item.category]} onToggle={onToggle} />
    ),
    [checked, locale, t, onToggle],
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{t.tonight}</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
        </View>
        <View style={styles.xp}>
          <Feather name="star" size={16} color={colors.gold} />
          <AnimatedNumber value={xp} style={styles.xpNumber} />
          <Text style={styles.xpLabel}>{t.xp}</Text>
        </View>
      </View>

      <View style={styles.toolbar}>
        <Pressable style={styles.chip} onPress={() => dispatch({ type: 'setLocale', locale: locale === 'en' ? 'nl' : 'en' })}>
          <Text style={styles.chipText}>{locale.toUpperCase()}</Text>
        </Pressable>
        {card ? (
          <Pressable style={[styles.chip, { backgroundColor: colors.accentSoft }]} onPress={() => dispatch({ type: 'showCard' })}>
            <Feather name="credit-card" size={14} color={colors.ink} />
            <Text style={styles.chipText}>{t.myCard}</Text>
          </Pressable>
        ) : null}
        <View style={{ flex: 1 }} />
        <Pressable style={styles.chip} onPress={() => dispatch({ type: 'reset' })}>
          <Feather name="rotate-ccw" size={14} color={colors.ink2} />
          <Text style={[styles.chipText, { color: colors.ink2 }]}>{t.reset}</Text>
        </Pressable>
      </View>

      {/* Fixed height so Android never collapses the horizontal bar and clips the chips. */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filters}>
        <FilterChip label={t.all} active={filter === 'all'} onPress={() => setFilter('all')} />
        {CAT_ORDER.map((c) => (
          <FilterChip key={c} label={t.cats[c]} active={filter === c} color={CATS[c]} onPress={() => setFilter(c)} />
        ))}
      </ScrollView>

      <FlatList
        data={plants}
        keyExtractor={(p) => p.slug}
        renderItem={renderItem}
        extraData={checked}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <CelebrationSheet />
      <FunFactCard />
    </View>
  );
}

function FilterChip({ label, active, color, onPress }: { label: string; active: boolean; color?: { fg: string; bg: string }; onPress: () => void }) {
  const bg = active ? (color ? color.fg : colors.ink) : color ? color.bg : colors.bgSoft;
  const fg = active ? '#FFFFFF' : color ? color.fg : colors.ink2;
  return (
    <Pressable onPress={onPress} style={[styles.filter, { backgroundColor: bg }]}>
      <Text style={[styles.filterText, { color: fg }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 20, gap: 12 },
  title: { fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 32, color: colors.ink, letterSpacing: -0.4 },
  subtitle: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, color: colors.ink2, marginTop: 2 },
  xp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accentSoft,
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    height: 36,
    marginTop: 2,
  },
  xpNumber: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink, minWidth: 24, textAlign: 'right' },
  xpLabel: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, color: colors.ink2 },
  toolbar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, marginTop: 14 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.bgSoft,
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    height: 36,
  },
  chipText: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: colors.ink },
  filtersScroll: { height: 40, flexGrow: 0, marginTop: 16 },
  filters: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  filter: { height: 36, borderRadius: radii.sm, paddingHorizontal: 14, justifyContent: 'center' },
  filterText: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 18 },
  list: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 },
});
