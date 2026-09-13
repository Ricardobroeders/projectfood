import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Check } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MemberAvatar } from '@/components/MemberAvatar';
import { Sheet } from '@/components/Sheet';
import { CATS, colors, fonts, radii } from '@/constants/theme';
import { PLANT_BY_SLUG } from '@/data/plants';
import { useStore } from '@/state/store';

/**
 * The hold-toggle sheet (Ricardo's Pinterest reference): who tasted this plant, or who a plain
 * tap logs for. The pick is applied on Done and becomes the default for the next plants.
 */
export function MemberPickerSheet() {
  const { picker, members, defaultIds, tastes, locale, t, dispatch } = useStore();
  const visible = picker !== null;
  // Keep the last content while the sheet slides out.
  const last = useRef(picker);
  if (picker) last.current = picker;
  const slug = (picker ?? last.current)?.slug ?? null;
  const plant = slug ? PLANT_BY_SLUG[slug] : null;

  const [sel, setSel] = useState<string[]>([]);
  useEffect(() => {
    if (!visible) return;
    const current = slug ? (tastes[slug] ?? []) : [];
    setSel(current.length ? current : defaultIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, slug]);

  const toggle = (id: string) => {
    Haptics.selectionAsync();
    setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };
  const everyone = members.length > 0 && members.every((m) => sel.includes(m.id));
  const toggleEveryone = () => {
    Haptics.selectionAsync();
    setSel(everyone ? [] : members.map((m) => m.id));
  };
  const cancel = () => dispatch({ type: 'closePicker' });
  const done = () => {
    if (slug) dispatch({ type: 'setTasters', slug, ids: sel });
    else dispatch({ type: 'setDefault', ids: sel });
    dispatch({ type: 'closePicker' });
  };

  return (
    <Sheet visible={visible} onRequestClose={cancel}>
      {plant ? (
        <View style={styles.plantHeader}>
          <View style={[styles.plantTile, { backgroundColor: CATS[plant.category].bg }]}>
            <Image source={plant.image} style={styles.plantImage} contentFit="contain" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.plantName}>{plant.name[locale]}</Text>
            <Text style={styles.question}>{t.whoTasted}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.title}>{t.whoLoggingFor}</Text>
      )}

      <View style={styles.list}>
        {members.length > 1 ? (
          <Pressable onPress={toggleEveryone} style={[styles.everyone, everyone && { backgroundColor: colors.accentSoft }]}>
            <Text style={styles.everyoneText}>{t.everyone}</Text>
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
                <Text style={styles.kind}>{m.kind === 'kid' ? t.kid : t.adult}</Text>
              </View>
              <View style={[styles.check, on && styles.checkOn]}>{on ? <Check size={18} color={colors.onAccent} strokeWidth={3} /> : null}</View>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.hint}>{t.defaultHint}</Text>
      <Pressable style={({ pressed }) => [styles.primary, pressed && { backgroundColor: colors.accentPressed }]} onPress={done}>
        <Text style={styles.primaryText}>{t.done}</Text>
      </Pressable>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  plantHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  plantTile: { width: 64, height: 64, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  plantImage: { width: 46, height: 46 },
  plantName: { fontFamily: fonts.extrabold, fontSize: 22, lineHeight: 28, color: colors.ink },
  question: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 20, color: colors.ink2 },
  title: { fontFamily: fonts.extrabold, fontSize: 22, lineHeight: 28, color: colors.ink },
  list: { marginTop: 8, gap: 4 },
  everyone: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    height: 36,
    paddingLeft: 14,
    paddingRight: 8,
    borderRadius: radii.sm,
    backgroundColor: colors.bgSoft,
    marginBottom: 6,
  },
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
