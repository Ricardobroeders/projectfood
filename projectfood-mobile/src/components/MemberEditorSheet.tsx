import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Check, Trash2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { MemberAvatar } from '@/components/MemberAvatar';
import { Sheet } from '@/components/Sheet';
import { Chip, ErrorText, PrimaryButton } from '@/components/ui';
import { CAT_ORDER, CATS, colors, fonts, MEMBER_COLORS, radii } from '@/constants/theme';
import { AVATAR_GROUPS, AVATAR_IMAGES, type AvatarGroup } from '@/data/avatars';
import { type MemberDraft, useArchiveMember, useSaveMember } from '@/features/household/queries';

const BG_OPTIONS = CAT_ORDER.map((c) => CATS[c].bg);

type Props = {
  householdId: string;
  /** null = closed; a draft without id = new member. */
  draft: MemberDraft | null;
  sortOrder: number;
  /** The parent's own row cannot be removed. */
  canRemove: boolean;
  onClose: () => void;
};

/** Name, kid/adult, member colour, optional illustrated avatar from the PWA set with a tinted background. */
export function MemberEditorSheet({ householdId, draft, sortOrder, canRemove, onClose }: Props) {
  const { t } = useTranslation();
  const save = useSaveMember();
  const archive = useArchiveMember();
  const [d, setD] = useState<MemberDraft | null>(draft);
  const [group, setGroup] = useState<AvatarGroup>('female');
  useEffect(() => {
    setD(draft);
    if (draft?.avatar_image) setGroup(draft.avatar_image.split('/')[0] as AvatarGroup);
  }, [draft]);

  const onSave = async () => {
    if (!d || !d.name.trim()) return;
    try {
      await save.mutateAsync({ householdId, draft: d, sortOrder });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    } catch {
      // error shown below
    }
  };
  const onRemove = () => {
    if (!d?.id) return;
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

  const preview = d ? { id: d.id ?? 'draft', name: d.name || '?', color_index: d.color_index, avatar_image: d.avatar_image, avatar_bg: d.avatar_bg } : null;

  return (
    <Sheet visible={draft !== null} onRequestClose={onClose}>
      {d && preview ? (
        <ScrollView style={{ maxHeight: 560 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <MemberAvatar member={preview} size={56} />
            <TextInput
              style={styles.input}
              value={d.name}
              onChangeText={(name) => setD({ ...d, name })}
              placeholder={t('family.namePlaceholder')}
              placeholderTextColor={colors.ink3}
              autoFocus={!d.id}
              autoCapitalize="words"
              returnKeyType="done"
              maxLength={20}
            />
          </View>

          <View style={styles.kinds}>
            {(['kid', 'adult'] as const).map((k) => (
              <Chip key={k} label={k === 'kid' ? t('family.kid') : t('family.adult')} on={d.kind === k} onPress={() => setD({ ...d, kind: k })} />
            ))}
          </View>

          <Text style={styles.label}>{t('family.colour')}</Text>
          <View style={styles.colors}>
            {MEMBER_COLORS.map((c, i) => {
              const on = d.color_index === i;
              return (
                <Pressable key={c.bg} onPress={() => setD({ ...d, color_index: i })} style={[styles.colorRing, on && { borderColor: colors.ink }]}>
                  <View style={[styles.colorDot, { backgroundColor: c.bg }]}>{on ? <Check size={16} color={c.fg} strokeWidth={3} /> : null}</View>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>{t('family.avatar')}</Text>
          <View style={styles.kinds}>
            {(Object.keys(AVATAR_GROUPS) as AvatarGroup[]).map((g) => (
              <Chip key={g} label={t(`family.avatarGroup_${g}`)} on={group === g} onPress={() => setGroup(g)} />
            ))}
          </View>
          <View style={styles.avatars}>
            <Pressable onPress={() => setD({ ...d, avatar_image: null, avatar_bg: null })} style={[styles.avatarCell, !d.avatar_image && styles.avatarOn]}>
              <MemberAvatar member={{ ...preview, avatar_image: null }} size={48} />
            </Pressable>
            {AVATAR_GROUPS[group].map((name) => {
              const key = `${group}/${name}`;
              const on = d.avatar_image === key;
              return (
                <Pressable key={key} onPress={() => setD({ ...d, avatar_image: key, avatar_bg: d.avatar_bg ?? BG_OPTIONS[d.color_index % BG_OPTIONS.length] })} style={[styles.avatarCell, on && styles.avatarOn]}>
                  <View style={[styles.avatarDisc, { backgroundColor: on ? (d.avatar_bg ?? colors.bgSoft) : colors.bgSoft }]}>
                    <Image source={AVATAR_IMAGES[key]} style={styles.avatarImg} contentFit="cover" />
                  </View>
                </Pressable>
              );
            })}
          </View>
          {d.avatar_image ? (
            <>
              <Text style={styles.label}>{t('family.background')}</Text>
              <View style={styles.colors}>
                {BG_OPTIONS.map((bg) => {
                  const on = d.avatar_bg === bg;
                  return (
                    <Pressable key={bg} onPress={() => setD({ ...d, avatar_bg: bg })} style={[styles.colorRing, on && { borderColor: colors.ink }]}>
                      <View style={[styles.colorDot, { backgroundColor: bg }]}>{on ? <Check size={16} color={colors.ink} strokeWidth={3} /> : null}</View>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : null}

          <ErrorText>{save.error || archive.error ? t('common.error') : null}</ErrorText>
          <PrimaryButton label={t('common.save')} onPress={onSave} disabled={!d.name.trim()} loading={save.isPending} style={{ marginTop: 16 }} />
          {d.id && canRemove ? (
            <Pressable style={styles.removeBtn} onPress={onRemove}>
              <Trash2 size={16} color={colors.ink2} />
              <Text style={styles.removeText}>{t('common.remove')}</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  input: { flex: 1, height: 54, borderRadius: radii.md, backgroundColor: colors.bgSoft, paddingHorizontal: 16, fontFamily: fonts.semibold, fontSize: 18, color: colors.ink },
  kinds: { flexDirection: 'row', gap: 8, marginTop: 12 },
  label: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink3, marginTop: 14, marginBottom: 6 },
  colors: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  colorRing: { width: 46, height: 46, borderRadius: radii.full, borderWidth: 2, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  colorDot: { width: 36, height: 36, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center' },
  avatars: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  avatarCell: { width: 56, height: 56, borderRadius: radii.full, borderWidth: 2, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  avatarOn: { borderColor: colors.ink },
  avatarDisc: { width: 48, height: 48, borderRadius: radii.full, overflow: 'hidden' },
  avatarImg: { width: 48, height: 48 },
  removeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  removeText: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink2 },
});
