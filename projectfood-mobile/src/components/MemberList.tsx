import { Pencil, Plus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MemberAvatar } from '@/components/MemberAvatar';
import { SecondaryButton } from '@/components/ui';
import { colors, fonts, radii } from '@/constants/theme';
import type { Member } from '@/features/household/queries';

type Props = {
  members: Member[];
  meId: string | null;
  /** Optional per-member count badge (e.g. plants tonight). */
  counts?: Record<string, number>;
  onEdit: (m: Member) => void;
  onAdd: (kind: 'kid' | 'adult') => void;
};

/** Family rows shared by onboarding and Account → Family. */
export function MemberList({ members, meId, counts, onEdit, onAdd }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.list}>
      {members.map((m) => {
        const n = counts?.[m.id] ?? 0;
        return (
          <Pressable key={m.id} style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.hairline }]} onPress={() => onEdit(m)} accessibilityRole="button">
            <MemberAvatar member={m} size={48} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{m.name}</Text>
              <Text style={styles.kind}>{m.id === meId ? t('family.you') : m.kind === 'kid' ? t('family.kid') : t('family.adult')}</Text>
            </View>
            {n > 0 ? (
              <View style={styles.count}>
                <Text style={styles.countText}>{t('family.tonight', { n })}</Text>
              </View>
            ) : null}
            <View style={styles.edit}>
              <Pencil size={16} color={colors.ink2} />
            </View>
          </Pressable>
        );
      })}
      <View style={styles.addRow}>
        <SecondaryButton label={t('onboarding.addKid')} onPress={() => onAdd('kid')} icon={<Plus size={18} color={colors.ink} />} style={{ flex: 1 }} />
        <SecondaryButton label={t('onboarding.addAdult')} onPress={() => onAdd('adult')} icon={<Plus size={18} color={colors.ink} />} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, height: 76, paddingHorizontal: 14, borderRadius: radii.lg, backgroundColor: colors.bgSoft },
  name: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 22, color: colors.ink },
  kind: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink3 },
  count: { height: 28, paddingHorizontal: 10, borderRadius: radii.sm, backgroundColor: colors.accentSoft, justifyContent: 'center' },
  countText: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, color: colors.ink },
  edit: { width: 36, height: 36, borderRadius: radii.full, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  addRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
});
