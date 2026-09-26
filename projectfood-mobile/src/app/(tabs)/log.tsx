import { useFocusEffect } from 'expo-router';
import { ChevronDown, Hand, Search, X } from 'lucide-react-native';
import { useCallback, useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { MemberAvatar } from '@/components/MemberAvatar';
import { PlantRow } from '@/components/PlantRow';
import { SkeletonRows } from '@/components/Skeleton';
import { Tabs, type Tab } from '@/components/Tabs';
import { WeekMeter } from '@/components/WeekMeter';
import { Loading, PrimaryButton, Screen } from '@/components/ui';
import { revealFor } from '@/constants/motion';
import { CAT_ORDER, colors, fonts, radii, type Category } from '@/constants/theme';
import { useSession } from '@/features/auth/useSession';
import { perfEnd, perfStart } from '@/features/dev/perf';
import { track } from '@/features/events/track';
import { useHousehold, useSettings } from '@/features/household/queries';
import { dateKey, distinctPlants, tasteMapFor } from '@/features/logs/model';
import { useLogMutations, useTasteCounts, useWeekLogs } from '@/features/logs/queries';
import { useScrollToTopOnTab } from '@/features/navigation/useScrollToTopOnTab';
import { getPermissionState } from '@/features/notifications/push';
import { type Plant, usePlantCatalog, usePlantSearch } from '@/features/plants/catalog';
import { supabase } from '@/features/supabase/client';
import { type Point, useDefaultIds, useUi } from '@/state/ui';
import { useGoldPlants } from '@/features/plants/useGoldPlants';

type Filter = 'all' | Category;
const NONE: string[] = [];
const NO_PLANTS: Plant[] = [];
/** PlantRow height plus its bottom margin; the list top padding sits in front of row 0. */
const ROW_H = 94;
const LIST_TOP = 12;
/** Distinct plants in a week, the same goal the Home gauge counts to. */
const GOAL = 30;

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}

export default function LogScreen() {
  const { t } = useTranslation();
  const { session } = useSession();
  const { data: hh } = useHousehold();
  const hid = hh?.household.id;
  const members = hh?.members ?? [];
  const memberIds = useMemo(() => members.map((m) => m.id), [members]);
  const defaultIds = useDefaultIds(hid, memberIds);
  const { catalog, isLoading } = usePlantCatalog();
  const { data: logs = [] } = useWeekLogs(hid);
  const { data: tasteCounts } = useTasteCounts(hid);
  const { logTaste, unlogTaste } = useLogMutations(hid);
  const openPicker = useUi((s) => s.openPicker);
  const holdHintSeen = useUi((s) => s.holdHintSeen);
  const dismissHoldHint = useUi((s) => s.dismissHoldHint);
  const openPushPrompt = useUi((s) => s.openPushPrompt);
  const pushDeclinedAt = useUi((s) => s.pushPromptDeclinedAt);
  const settings = useSettings();

  const [filter, setFilter] = useState<Filter>('all');
  // The tab indicator moves at once; the list follows in a deferred render so the tap never waits on it.
  const listFilter = useDeferredValue(filter);
  // First paint is the skeleton; the rows come one frame later so the tab switch never freezes.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const pending = !mounted || filter !== listFilter;
  const [query, setQuery] = useState('');
  const debounced = useDebounced(query, 300);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const today = dateKey();
  const tastes = useMemo(() => tasteMapFor(logs, today), [logs, today]);
  const weekCount = useMemo(() => distinctPlants(logs).length, [logs]);

  const goldIds = useGoldPlants();

  // The household's frequent plants first, then the alphabet (KB: log in under a minute).
  const live = useMemo(() => {
    const f: Record<string, number> = {};
    for (const tc of tasteCounts ?? []) f[tc.plant_id] = (f[tc.plant_id] ?? 0) + tc.tastes;
    return f;
  }, [tasteCounts]);
  // The order is fixed per visit: taken once the counts are in, refreshed only while the tab is
  // away. A plant logged tonight stays where the thumb found it (Ricardo, 2026-09-24: moving it to
  // the top was "unexpected behaviour"); the shelf reshuffles on the way back.
  const liveRef = useRef(live);
  const loadedRef = useRef(false);
  useEffect(() => {
    liveRef.current = live;
    loadedRef.current = !!tasteCounts;
  }, [live, tasteCounts]);
  const [order, setOrder] = useState<Record<string, number> | null>(null);
  if (order === null && tasteCounts) setOrder(live);
  useFocusEffect(
    useCallback(
      () => () => {
        if (loadedRef.current) setOrder(liveRef.current);
      },
      [],
    ),
  );
  const ordered = useMemo(() => {
    const f = order ?? live;
    return [...catalog.plants].sort((a, b) => (f[b.id] ?? 0) - (f[a.id] ?? 0) || a.name.localeCompare(b.name));
  }, [catalog.plants, order, live]);
  const searched = usePlantSearch(ordered, debounced);
  const plants = useMemo(() => (listFilter === 'all' ? searched : searched.filter((p) => p.category === listFilter)), [searched, listFilter]);

  // A new list starts at the top and fills in where the skeleton stood (reveal class); nothing travels.
  const listRef = useRef<FlatList<Plant>>(null);
  useScrollToTopOnTab(listRef);
  const prevFilter = useRef<Filter>(listFilter);
  useLayoutEffect(() => {
    if (prevFilter.current === listFilter) return;
    perfEnd('log filter', `${plants.length} plants`);
    prevFilter.current = listFilter;
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [listFilter, plants.length]);
  useEffect(() => {
    if (mounted) perfEnd('tab→log', `${plants.length} plants`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const tabs = useMemo<Tab<Filter>[]>(() => [{ key: 'all', label: t('log.all') }, ...CAT_ORDER.map((c) => ({ key: c, label: t(`categoriesPlural.${c}`) }))], [t]);

  const maybePromptPush = useCallback(async () => {
    const s = settings.data;
    if (!s || s.push_prompt_at) return;
    if (pushDeclinedAt && Date.now() - Date.parse(pushDeclinedAt) < 30 * 864e5) return;
    if ((await getPermissionState()) !== 'undetermined') return;
    setTimeout(openPushPrompt, 900);
  }, [settings.data, pushDeclinedAt, openPushPrompt]);

  const onTap = useCallback(
    (plantId: string, at: Point) => {
      if (!defaultIds.length) {
        openPicker(plantId, at);
        return;
      }
      const cur = tastes[plantId] ?? NONE;
      const complete = defaultIds.every((id) => cur.includes(id));
      if (complete) {
        unlogTaste.mutate({ plantId, memberIds: defaultIds, day: today });
      } else {
        const add = defaultIds.filter((id) => !cur.includes(id));
        logTaste.mutate({ plantId, memberIds: add, day: today }, { onSuccess: () => void maybePromptPush() });
        track('plant_logged', { plant_id: plantId, members: add.length, via: 'tap' }, hid);
      }
    },
    [defaultIds, tastes, today, logTaste, unlogTaste, openPicker, maybePromptPush, hid],
  );
  const onHold = useCallback((plantId: string, at: Point) => openPicker(plantId, at), [openPicker]);

  const renderItem = useCallback(
    ({ item, index }: { item: Plant; index: number }) => (
      <Animated.View entering={revealFor(index)}>
        <PlantRow plant={item} tasters={tastes[item.id] ?? NONE} members={members} defaultIds={defaultIds} catLabel={t(`categories.${item.category}`)} gold={goldIds.has(item.id)} onTap={onTap} onHold={onHold} />
      </Animated.View>
    ),
    [tastes, members, defaultIds, t, onTap, onHold],
  );

  const submitMissing = async () => {
    if (!session || !debounced.trim()) return;
    setSending(true);
    const { error } = await supabase.from('plant_submissions').insert({ submitted_by: session.user.id, proposed_name: debounced.trim() });
    setSending(false);
    if (!error) {
      setSubmitted(debounced.trim());
      track('plant_suggested', { name: debounced.trim() }, hid);
    }
  };

  const defaults = members.filter((m) => defaultIds.includes(m.id));
  const forLabel = defaults.length === 0 ? t('log.nobody') : defaults.length === members.length ? t('log.everyone') : defaults.map((m) => m.name).join(', ');

  if (!hh || isLoading) return <Loading />;

  return (
    <Screen>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{t('log.title')}</Text>
          <Text style={styles.subtitle}>{t('log.subtitle')}</Text>
        </View>
        {/* The week's count where the taps happen; Home's gauge is one screen away. */}
        <WeekMeter value={weekCount} max={GOAL} label={t('home.thisWeek')} />
      </View>

      {/* Who a plain tap logs for. Tapping opens the same member menu as holding a plant, from the finger. */}
      <Pressable style={styles.forBar} onPress={(e) => openPicker(null, { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY })} accessibilityRole="button">
        <View style={styles.forAvatars}>
          {members.slice(0, 5).map((m) => (
            <MemberAvatar key={m.id} member={m} size={32} muted={!defaultIds.includes(m.id)} />
          ))}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.forLabel}>{t('log.loggingFor')}</Text>
          <Text style={styles.forNames} numberOfLines={1}>
            {forLabel}
          </Text>
        </View>
        <ChevronDown size={18} color={colors.ink3} />
      </Pressable>

      <View style={styles.searchWrap}>
        <Search size={18} color={colors.ink3} />
        <TextInput
          style={styles.search}
          value={query}
          onChangeText={(v) => {
            setQuery(v);
            setSubmitted(null);
            if (v && filter !== 'all') setFilter('all');
          }}
          placeholder={t('log.searchPlaceholder')}
          placeholderTextColor={colors.ink3}
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="never"
        />
        {query ? (
          <Pressable onPress={() => setQuery('')} hitSlop={8} accessibilityRole="button">
            <X size={18} color={colors.ink3} />
          </Pressable>
        ) : null}
      </View>

      {!holdHintSeen && members.length > 1 ? (
        <View style={styles.hint}>
          <Hand size={16} color={colors.ink2} />
          <Text style={styles.hintText} numberOfLines={1}>
            {t('log.holdHint')}
          </Text>
          <Pressable onPress={dismissHoldHint} hitSlop={8}>
            <X size={16} color={colors.ink3} />
          </Pressable>
        </View>
      ) : null}

      <View style={styles.tabs}>
        <Tabs
          tabs={tabs}
          value={filter}
          onChange={(k) => {
            perfStart('log filter');
            setFilter(k);
          }}
        />
      </View>

      <View style={styles.listWrap}>
        <FlatList
          ref={listRef}
          data={mounted ? plants : NO_PLANTS}
          keyExtractor={(p) => p.id}
          renderItem={renderItem}
          extraData={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, index) => ({ length: ROW_H, offset: LIST_TOP + ROW_H * index, index })}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={40}
          windowSize={5}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            !mounted ? null : debounced.trim() ? (
              <View style={styles.missing}>
                <Text style={styles.missingTitle}>{submitted ? t('log.suggestionSent') : t('log.missingTitle')}</Text>
                <Text style={styles.missingBody}>{submitted ? t('log.suggestionSentSub') : t('log.missingBody', { query: debounced.trim() })}</Text>
                {!submitted ? <PrimaryButton label={sending ? t('log.sending') : t('log.submitSuggestion')} onPress={submitMissing} loading={sending} style={{ marginTop: 8 }} /> : null}
              </View>
            ) : (
              <Text style={styles.prompt}>{t('log.searchPrompt')}</Text>
            )
          }
        />
        {pending ? <SkeletonRows count={8} height={84} tile={84} gap={10} style={styles.skeletonOverlay} /> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20 },
  title: { fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 32, color: colors.ink, letterSpacing: -0.4 },
  subtitle: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, color: colors.ink2, marginTop: 2 },
  forBar: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 20, marginTop: 14, height: 60, paddingHorizontal: 14, borderRadius: radii.md, backgroundColor: colors.bgSoft },
  forAvatars: { flexDirection: 'row', gap: 6 },
  forLabel: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, color: colors.ink3 },
  forNames: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, marginTop: 10, height: 48, paddingHorizontal: 14, borderRadius: radii.md, backgroundColor: colors.bgSoft },
  search: { flex: 1, height: 48, fontFamily: fonts.semibold, fontSize: 16, color: colors.ink },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 20, marginTop: 8, height: 36, paddingHorizontal: 12, borderRadius: radii.sm, backgroundColor: colors.bgSoft },
  hintText: { flex: 1, fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink2 },
  tabs: { marginTop: 8 },
  listWrap: { flex: 1 },
  skeletonOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: LIST_TOP },
  list: { paddingHorizontal: 20, paddingTop: LIST_TOP, paddingBottom: 24, flexGrow: 1 },
  missing: { marginTop: 24, padding: 20, borderRadius: radii.lg, backgroundColor: colors.bgSoft, gap: 6 },
  missingTitle: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22, color: colors.ink },
  missingBody: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, color: colors.ink2 },
  prompt: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, color: colors.ink3, textAlign: 'center', marginTop: 40 },
});
