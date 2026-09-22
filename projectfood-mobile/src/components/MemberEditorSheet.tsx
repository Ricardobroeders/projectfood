import * as Haptics from 'expo-haptics';
import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { MemberEditorForm } from '@/components/MemberEditorForm';
import { Sheet } from '@/components/Sheet';
import { ErrorText, PrimaryButton } from '@/components/ui';
import { colors, fonts } from '@/constants/theme';
import { type MemberDraft, useArchiveMember, useSaveMember } from '@/features/household/queries';

type Props = {
  householdId: string;
  /** null = closed; a draft without id = new member. */
  draft: MemberDraft | null;
  sortOrder: number;
  /** The parent's own row cannot be removed. */
  canRemove: boolean;
  onClose: () => void;
};

/** Add or edit one person at the table as a sheet: the form plus save and remove. */
export function MemberEditorSheet({ householdId, draft, sortOrder, canRemove, onClose }: Props) {
  return (
    <Sheet visible={draft !== null} onRequestClose={onClose}>
      {/* Keyed per member so each open starts from the row as it is; no effect needed to copy props into state. */}
      {draft ? <EditorBody key={draft.id ?? 'new'} householdId={householdId} initial={draft} sortOrder={sortOrder} canRemove={canRemove} onClose={onClose} /> : null}
    </Sheet>
  );
}

type BodyProps = Omit<Props, 'draft'> & { initial: MemberDraft };

function EditorBody({ householdId, initial, sortOrder, canRemove, onClose }: BodyProps) {
  const { t } = useTranslation();
  const save = useSaveMember();
  const archive = useArchiveMember();
  const [d, setD] = useState<MemberDraft>(initial);

  const onSave = async () => {
    if (!d.name.trim()) return;
    try {
      await save.mutateAsync({ householdId, draft: d, sortOrder });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    } catch {
      // error shown below
    }
  };
  const onRemove = () => {
    if (!d.id) return;
    Alert.alert(t('common.remove'), t('family.removeConfirm', { name: d.name }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.remove'),
        style: 'destructive',
        onPress: async () => {
          await archive.mutateAsync(d.id!);
          onClose();
        },
      },
    ]);
  };

  return (
    <ScrollView style={{ maxHeight: 560 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <MemberEditorForm draft={d} onChange={setD} autoFocus={!d.id} />
      <ErrorText>{save.error || archive.error ? t('common.error') : null}</ErrorText>
      <PrimaryButton label={t('common.save')} onPress={onSave} disabled={!d.name.trim()} loading={save.isPending} style={{ marginTop: 16 }} />
      {d.id && canRemove ? (
        <Pressable style={styles.removeBtn} onPress={onRemove}>
          <Trash2 size={16} color={colors.ink2} />
          <Text style={styles.removeText}>{t('common.remove')}</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  removeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  removeText: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink2 },
});
