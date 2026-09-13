import * as Haptics from 'expo-haptics';
import { Check, Pencil, Plus, Trash2, Users } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MemberAvatar } from '@/components/MemberAvatar';
import { Sheet } from '@/components/Sheet';
import { colors, fonts, iconFor, MEMBER_COLORS, radii } from '@/constants/theme';
import { useStore, type MemberKind } from '@/state/store';

type Draft = { id?: string; name: string; colorIndex: number; kind: MemberKind };

/** Entry screen of the family app: who is at the table. Also the Family tab afterwards. */
export default function FamilyScreen() {
  const insets = useSafeAreaInsets();
  const { members, tastes, t, dispatch } = useStore();
  const [draft, setDraft] = useState<Draft | null>(null);

  const countFor = (id: string) => Object.values(tastes).filter((ids) => ids.includes(id)).length;
  const nextColor = members.length % MEMBER_COLORS.length;
  const openNew = () => setDraft({ name: '', colorIndex: nextColor, kind: members.length === 0 ? 'adult' : 'kid' });

  const save = () => {
    if (!draft || !draft.name.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (draft.id) dispatch({ type: 'updateMember', id: draft.id, name: draft.name, colorIndex: draft.colorIndex, kind: draft.kind });
    else dispatch({ type: 'addMember', name: draft.name, colorIndex: draft.colorIndex, kind: draft.kind });
    setDraft(null);
  };
  const remove = () => {
    if (!draft?.id) return;
    dispatch({ type: 'removeMember', id: draft.id });
    setDraft(null);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.title}>{t.familyTitle}</Text>

      {members.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Users size={iconFor(72)} color={colors.ink3} />
          </View>
          <Text style={styles.emptyText}>{t.familyEmpty}</Text>
          <Pressable style={({ pressed }) => [styles.primary, pressed && { backgroundColor: colors.accentPressed }]} onPress={openNew}>
            <Plus size={18} color={colors.onAccent} />
            <Text style={styles.primaryText}>{t.addMember}</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {members.map((m) => {
            const n = countFor(m.id);
            return (
              <Pressable key={m.id} style={styles.row} onPress={() => setDraft({ id: m.id, name: m.name, colorIndex: m.colorIndex, kind: m.kind })}>
                <MemberAvatar member={m} size={48} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{m.name}</Text>
                  <Text style={styles.kind}>{m.kind === 'kid' ? t.kid : t.adult}</Text>
                </View>
                {n > 0 ? (
                  <View style={styles.count}>
                    <Text style={styles.countText}>
                      {n} {t.tonightShort}
                    </Text>
                  </View>
                ) : null}
                <View style={styles.edit}>
                  <Pencil size={16} color={colors.ink2} />
                </View>
              </Pressable>
            );
          })}
          <Pressable style={({ pressed }) => [styles.secondary, pressed && { backgroundColor: colors.hairline }]} onPress={openNew}>
            <Plus size={18} color={colors.ink} />
            <Text style={styles.secondaryText}>{t.addMember}</Text>
          </Pressable>
        </ScrollView>
      )}

      <Sheet visible={draft !== null} onRequestClose={() => setDraft(null)}>
        {draft ? (
          <>
            <View style={styles.sheetHeader}>
              <MemberAvatar member={{ id: 'draft', name: draft.name || '?', colorIndex: draft.colorIndex, kind: draft.kind }} size={56} />
              <TextInput
                style={styles.input}
                value={draft.name}
                onChangeText={(name) => setDraft({ ...draft, name })}
                placeholder={t.namePlaceholder}
                placeholderTextColor={colors.ink3}
                autoFocus
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={save}
                maxLength={20}
              />
            </View>

            <Text style={styles.label}>{t.colour}</Text>
            <View style={styles.colors}>
              {MEMBER_COLORS.map((c, i) => {
                const on = draft.colorIndex === i;
                return (
                  <Pressable key={c.bg} onPress={() => setDraft({ ...draft, colorIndex: i })} style={[styles.colorRing, on && { borderColor: colors.ink }]}>
                    <View style={[styles.colorDot, { backgroundColor: c.bg }]}>{on ? <Check size={16} color={c.fg} strokeWidth={3} /> : null}</View>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.kinds}>
              {(['kid', 'adult'] as const).map((k) => {
                const on = draft.kind === k;
                return (
                  <Pressable key={k} onPress={() => setDraft({ ...draft, kind: k })} style={[styles.kindChip, on && { backgroundColor: colors.ink }]}>
                    <Text style={[styles.kindText, on && { color: '#FFFFFF' }]}>{k === 'kid' ? t.kid : t.adult}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={({ pressed }) => [styles.primary, { marginTop: 12 }, !draft.name.trim() && { opacity: 0.4 }, pressed && { backgroundColor: colors.accentPressed }]}
              onPress={save}
              disabled={!draft.name.trim()}>
              <Text style={styles.primaryText}>{t.save}</Text>
            </Pressable>
            {draft.id ? (
              <Pressable style={styles.removeBtn} onPress={remove}>
                <Trash2 size={16} color={colors.ink2} />
                <Text style={styles.removeText}>{t.remove}</Text>
              </Pressable>
            ) : null}
          </>
        ) : null}
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  title: { fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 32, color: colors.ink, letterSpacing: -0.4, paddingHorizontal: 20 },
  emptyCard: { margin: 20, backgroundColor: colors.bgSoft, borderRadius: radii.xl, padding: 24, alignItems: 'center', gap: 14 },
  emptyIcon: { width: 72, height: 72, borderRadius: radii.lg, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.ink2, textAlign: 'center' },
  list: { padding: 20, gap: 10, paddingBottom: 40 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, height: 76, paddingHorizontal: 14, borderRadius: radii.lg, backgroundColor: colors.bgSoft },
  name: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 22, color: colors.ink },
  kind: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink3 },
  count: { height: 28, paddingHorizontal: 10, borderRadius: radii.sm, backgroundColor: colors.accentSoft, justifyContent: 'center' },
  countText: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, color: colors.ink },
  edit: { width: 36, height: 36, borderRadius: radii.full, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  primary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, alignSelf: 'stretch', backgroundColor: colors.accent, borderRadius: radii.md, height: 54, paddingHorizontal: 24 },
  primaryText: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 22, color: colors.onAccent },
  secondary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.bgSoft, borderRadius: radii.md, height: 54, marginTop: 6 },
  secondaryText: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22, color: colors.ink },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  input: { flex: 1, height: 54, borderRadius: radii.md, backgroundColor: colors.bgSoft, paddingHorizontal: 16, fontFamily: fonts.semibold, fontSize: 18, color: colors.ink },
  label: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink3, marginTop: 12 },
  colors: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  colorRing: { width: 46, height: 46, borderRadius: radii.full, borderWidth: 2, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  colorDot: { width: 36, height: 36, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center' },
  kinds: { flexDirection: 'row', gap: 8, marginTop: 12 },
  kindChip: { height: 36, paddingHorizontal: 16, borderRadius: radii.sm, backgroundColor: colors.bgSoft, justifyContent: 'center' },
  kindText: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 18, color: colors.ink },
  removeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  removeText: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink2 },
});
