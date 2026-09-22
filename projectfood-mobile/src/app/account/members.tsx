import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { MemberEditorSheet } from '@/components/MemberEditorSheet';
import { MemberList } from '@/components/MemberList';
import { BackHeader, Loading, Screen } from '@/components/ui';
import { colors, fonts, MEMBER_COLORS } from '@/constants/theme';
import { type Member, type MemberDraft, useHousehold } from '@/features/household/queries';
import { dateKey } from '@/features/logs/model';
import { useWeekLogs } from '@/features/logs/queries';

/** Account → Family: add, edit (name, colour, avatar) and remove members. */
export default function MembersScreen() {
  const { t } = useTranslation();
  const { data: hh } = useHousehold();
  const { data: logs = [] } = useWeekLogs(hh?.household.id);
  const [draft, setDraft] = useState<MemberDraft | null>(null);
  const today = dateKey();
  const counts = useMemo(() => {
    const out: Record<string, number> = {};
    const seen = new Set<string>();
    for (const r of logs) {
      if (r.logged_on !== today) continue;
      const k = `${r.member_id}:${r.plant_id}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out[r.member_id] = (out[r.member_id] ?? 0) + 1;
    }
    return out;
  }, [logs, today]);
  if (!hh) return <Loading />;
  const members = hh.members;

  const edit = (m: Member) => setDraft({ id: m.id, name: m.name, kind: m.kind as 'kid' | 'adult', color_index: m.color_index, avatar_image: m.avatar_image });
  // New people start as adults; the editor's Kid/Adult chip flips it. The app is about everyone at the table, not kids.
  const add = () => setDraft({ name: '', kind: 'adult', color_index: members.length % MEMBER_COLORS.length, avatar_image: null });

  return (
    <Screen>
      <BackHeader title={t('family.title')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {members.length === 0 ? <Text style={styles.empty}>{t('family.empty')}</Text> : null}
        <MemberList members={members} meId={hh.me?.id ?? null} counts={counts} onEdit={edit} onAdd={add} />
      </ScrollView>
      <MemberEditorSheet householdId={hh.household.id} draft={draft} sortOrder={members.length} canRemove={draft?.id !== hh.me?.id} onClose={() => setDraft(null)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  empty: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22, color: colors.ink2, marginBottom: 16 },
});
