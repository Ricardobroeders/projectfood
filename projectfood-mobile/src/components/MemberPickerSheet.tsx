import * as Haptics from 'expo-haptics';
import { Check } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MemberAvatar } from '@/components/MemberAvatar';
import { Sheet } from '@/components/Sheet';
import { CATS, colors, fonts, radii } from '@/constants/theme';
import { useHousehold } from '@/features/household/queries';
import { dateKey, tasteMapFor } from '@/features/logs/model';
import { useLogMutations, useWeekLogs } from '@/features/logs/queries';
import { usePlantCatalog } from '@/features/plants/catalog';
import { PlantImage } from '@/features/plants/PlantImage';
import { useDefaultIds, useUi } from '@/state/ui';

/**
 * The hold-toggle sheet: who tasted this plant, or who a plain tap logs for. The pick is applied
 * on Done (as a diff of log rows) and becomes the default for the next plants.
 */
export function MemberPickerSheet() {
  const { t } = useTranslation();
  const picker = useUi((s) => s.picker);
  const closePicker = useUi((s) => s.closePicker);
  const setDefaultIds = useUi((s) => s.setDefaultIds);
  const { data: hh } = useHousehold();
  const hid = hh?.household.id;
  const members = hh?.members ?? [];
  const defaultIds = useDefaultIds(hid, members.map((m) => m.id));
  const { catalog } = usePlantCatalog();
  const { data: logs } = useWeekLogs(hid);
  const { logTaste, unlogTaste } = useLogMutations(hid);

  const visible = picker !== null;
  // Keep the last content while the sheet slides out.
  const last = useRef(picker);
  if (picker) last.current = picker;
  const plantId = (picker ?? last.current)?.plantId ?? null;
  const plant = plantId ? catalog.byId[plantId] : null;
  const today = dateKey();
  const tastes = useMemo(() => tasteMapFor(logs ?? [], today), [logs, today]);

  const [sel, setSel] = useState<string[]>([]);
  useEffect(() => {
    if (!visible) return;
    const current = plantId ? (tastes[plantId] ?? []) : [];
    setSel(current.length ? current : defaultIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, plantId]);

  const toggle = (id: string) => {
    Haptics.selectionAsync();
    setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };
  const everyone = members.length > 0 && members.every((m) => sel.includes(m.id));
  const toggleEveryone = () => {
    Haptics.selectionAsync();
    setSel(everyone ? [] : members.map((m) => m.id));
  };
  const done = () => {
    if (hid && plantId) {
      const current = tastes[plantId] ?? [];
      const add = sel.filter((id) => !current.includes(id));
      const remove = current.filter((id) => !sel.includes(id));
      if (add.length) logTaste.mutate({ plantId, memberIds: add, day: today });
      if (remove.length) unlogTaste.mutate({ plantId, memberIds: remove, day: today });
      if (sel.length) setDefaultIds(hid, sel);
    } else if (hid) {
      setDefaultIds(hid, sel);
    }
    closePicker();
  };

  return (
    <Sheet visible={visible} onRequestClose={closePicker}>
      {plant ? (
        <View style={styles.plantHeader}>
          <View style={[styles.plantTile, { backgroundColor: CATS[plant.category].bg }]}>
            <PlantImage plant={plant} size={46} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.plantName}>{plant.name}</Text>
            <Text style={styles.question}>{t('log.whoTasted')}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.title}>{t('log.whoLoggingFor')}</Text>
      )}

      <View style={styles.list}>
        {members.length > 1 ? (
          <Pressable onPress={toggleEveryone} style={[styles.everyone, everyone && { backgroundColor: colors.accentSoft }]}>
            <Text style={styles.everyoneText}>{t('log.everyone')}</Text>
            <View style={[styles.checkSmall, everyone && styles.checkOn]}>{everyone ? <Check size={14} color={colors.onAccent} strokeWidth={3} /> : null}</View>
          </Pressable>
        ) : null}
        {members.map((m) => {
          const on = sel.includes(m.id);
          return (
            <Pressable key={m.id} onPress={() => toggle(m.id)} style={styles.row} accessibilityRole="checkbox" accessibilityState={{ checked: on }}>
              <MemberAvatar member={m} size={44} muted={!on} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, !on && { color: colors.ink2 }]}>{m.name}</Text>
                <Text style={styles.kind}>{m.kind === 'kid' ? t('family.kid') : t('family.adult')}</Text>
              </View>
              <View style={[styles.check, on && styles.checkOn]}>{on ? <Check size={18} color={colors.onAccent} strokeWidth={3} /> : null}</View>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.hint}>{t('log.defaultHint')}</Text>
      <Pressable style={({ pressed }) => [styles.primary, pressed && { backgroundColor: colors.accentPressed }]} onPress={done}>
        <Text style={styles.primaryText}>{t('common.done')}</Text>
      </Pressable>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  plantHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  plantTile: { width: 64, height: 64, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  plantName: { fontFamily: fonts.extrabold, fontSize: 22, lineHeight: 28, color: colors.ink },
  question: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 20, color: colors.ink2 },
  title: { fontFamily: fonts.extrabold, fontSize: 22, lineHeight: 28, color: colors.ink },
  list: { marginTop: 8, gap: 4 },
  everyone: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 8, height: 36, paddingLeft: 14, paddingRight: 8, borderRadius: radii.sm, backgroundColor: colors.bgSoft, marginBottom: 6 },
  everyoneText: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 18, color: colors.ink },
  checkSmall: { width: 22, height: 22, borderRadius: radii.full, borderWidth: 2, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, height: 60 },
  name: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 22, color: colors.ink },
  kind: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink3 },
  check: { width: 30, height: 30, borderRadius: radii.full, borderWidth: 2, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  hint: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink3, marginTop: 4 },
  primary: { alignSelf: 'stretch', backgroundColor: colors.accent, borderRadius: radii.md, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  primaryText: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 22, color: colors.onAccent },
});
