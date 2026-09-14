import { Link } from 'expo-router';
import { ChevronDown, Hand, Star, Users, X } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedNumber } from '@/components/AnimatedNumber';
import { MemberAvatar } from '@/components/MemberAvatar';
import { PlantRow } from '@/components/PlantRow';
import { Tabs, type Tab } from '@/components/Tabs';
import { CAT_ORDER, colors, fonts, iconFor, radii, type Category } from '@/constants/theme';
import { PLANTS, type Plant } from '@/data/plants';
import { useStore } from '@/state/store';

type Filter = 'all' | Category;
const NONE: string[] = [];

export default function LogScreen() {
  const insets = useSafeAreaInsets();
  const { members, defaultIds, tastes, xp, locale, holdHintSeen, t, dispatch } = useStore();
  const [filter, setFilter] = useState<Filter>('all');

  const tabs = useMemo<Tab<Filter>[]>(() => [{ key: 'all', label: t.all }, ...CAT_ORDER.map((c) => ({ key: c, label: t.catsPlural[c] }))], [t]);
  const plants = useMemo(() => (filter === 'all' ? PLANTS : PLANTS.filter((p) => p.category === filter)), [filter]);
  const onTap = useCallback((slug: string) => dispatch({ type: 'tap', slug }), [dispatch]);
  const onHold = useCallback((slug: string) => dispatch({ type: 'openPicker', slug }), [dispatch]);

  const renderItem = useCallback(
    ({ item }: { item: Plant }) => (
      <PlantRow
        plant={item}
        tasters={tastes[item.slug] ?? NONE}
        members={members}
        defaultIds={defaultIds}
        locale={locale}
        catLabel={t.cats[item.category]}
        onTap={onTap}
        onHold={onHold}
      />
    ),
    [tastes, members, defaultIds, locale, t, onTap, onHold],
  );

  const defaults = members.filter((m) => defaultIds.includes(m.id));
  const forLabel = defaults.length === 0 ? t.nobody : defaults.length === members.length ? t.everyone : defaults.map((m) => m.name).join(', ');

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{t.tonight}</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
        </View>
        <View style={styles.xp}>
          <Star size={16} color={colors.gold} />
          <AnimatedNumber value={xp} style={styles.xpNumber} />
          <Text style={styles.xpLabel}>{t.xp}</Text>
        </View>
      </View>

      {members.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Users size={iconFor(72)} color={colors.ink3} />
          </View>
          <Text style={styles.emptyText}>{t.logEmpty}</Text>
          <Link href="/family" asChild>
            <Pressable style={({ pressed }) => [styles.primary, pressed && { backgroundColor: colors.accentPressed }]}>
              <Text style={styles.primaryText}>{t.goFamily}</Text>
            </Pressable>
          </Link>
        </View>
      ) : (
        <>
          {/* Who a plain tap logs for. Tapping opens the same picker as holding a plant. */}
          <Pressable style={styles.forBar} onPress={() => dispatch({ type: 'openPicker', slug: null })} accessibilityRole="button">
            <View style={styles.forAvatars}>
              {members.map((m) => (
                <MemberAvatar key={m.id} member={m} size={32} muted={!defaultIds.includes(m.id)} />
              ))}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.forLabel}>{t.loggingFor}</Text>
              <Text style={styles.forNames} numberOfLines={1}>
                {forLabel}
              </Text>
            </View>
            <ChevronDown size={18} color={colors.ink3} />
          </Pressable>

          {!holdHintSeen && members.length > 1 ? (
            <View style={styles.hint}>
              <Hand size={16} color={colors.ink2} />
              <Text style={styles.hintText} numberOfLines={1}>
                {t.holdHint}
              </Text>
              <Pressable onPress={() => dispatch({ type: 'dismissHoldHint' })} hitSlop={8}>
                <X size={16} color={colors.ink3} />
              </Pressable>
            </View>
          ) : null}

          <View style={styles.tabs}>
            <Tabs tabs={tabs} value={filter} onChange={setFilter} />
          </View>

          <FlatList
            data={plants}
            keyExtractor={(p) => p.slug}
            renderItem={renderItem}
            extraData={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            initialNumToRender={12}
            windowSize={7}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 20, gap: 12 },
  title: { fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 32, color: colors.ink, letterSpacing: -0.4 },
  subtitle: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, color: colors.ink2, marginTop: 2 },
  xp: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.accentSoft, borderRadius: radii.sm, paddingHorizontal: 12, height: 36, marginTop: 2 },
  xpNumber: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink, minWidth: 24, textAlign: 'right' },
  xpLabel: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, color: colors.ink2 },
  forBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 16,
    height: 60,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    backgroundColor: colors.bgSoft,
  },
  forAvatars: { flexDirection: 'row', gap: 6 },
  forLabel: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, color: colors.ink3 },
  forNames: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 20, marginTop: 8, height: 36, paddingHorizontal: 12, borderRadius: radii.sm, backgroundColor: colors.bgSoft },
  hintText: { flex: 1, fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink2 },
  tabs: { marginTop: 8 },
  list: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 32, paddingBottom: 80 },
  emptyIcon: { width: 72, height: 72, borderRadius: radii.lg, backgroundColor: colors.bgSoft, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.ink2, textAlign: 'center' },
  primary: { backgroundColor: colors.accent, borderRadius: radii.md, height: 54, paddingHorizontal: 28, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  primaryText: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 22, color: colors.onAccent },
});
