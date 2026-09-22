import { Image } from 'expo-image';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { MemberAvatar } from '@/components/MemberAvatar';
import { Chip } from '@/components/ui';
import { colors, fonts, MEMBER_COLORS, radii } from '@/constants/theme';
import { AVATAR_GROUPS, AVATAR_IMAGES, type AvatarGroup } from '@/data/avatars';
import type { MemberDraft } from '@/features/household/queries';

type Props = {
  draft: MemberDraft;
  onChange: (d: MemberDraft) => void;
  /** The parent's own row is an adult by definition; the onboarding "you" step hides the chips. */
  showKind?: boolean;
  autoFocus?: boolean;
  namePlaceholder?: string;
};

/**
 * One person at the table: name, colour, an illustrated face. One colour per member since
 * 2026-09-22: it fills the initial disc and sits behind the face, so the two pickers the editor
 * used to have (member colour, avatar background) never disagree again.
 */
export function MemberEditorForm({ draft: d, onChange, showKind = true, autoFocus = false, namePlaceholder }: Props) {
  const { t } = useTranslation();
  const [group, setGroup] = useState<AvatarGroup>(() => (d.avatar_image ? (d.avatar_image.split('/')[0] as AvatarGroup) : 'female'));
  const preview = { id: d.id ?? 'draft', name: d.name || '?', color_index: d.color_index, avatar_image: d.avatar_image };
  const own = MEMBER_COLORS[d.color_index % MEMBER_COLORS.length];

  return (
    <View>
      <View style={styles.header}>
        <MemberAvatar member={preview} size={56} />
        <TextInput
          style={styles.input}
          value={d.name}
          onChangeText={(name) => onChange({ ...d, name })}
          placeholder={namePlaceholder ?? t('family.namePlaceholder')}
          placeholderTextColor={colors.ink3}
          autoFocus={autoFocus}
          autoCapitalize="words"
          returnKeyType="done"
          maxLength={20}
        />
      </View>

      {showKind ? (
        <View style={styles.chips}>
          {(['kid', 'adult'] as const).map((k) => (
            <Chip key={k} label={k === 'kid' ? t('family.kid') : t('family.adult')} on={d.kind === k} onPress={() => onChange({ ...d, kind: k })} />
          ))}
        </View>
      ) : null}

      <Text style={styles.label}>{t('family.colour')}</Text>
      <View style={styles.colors}>
        {MEMBER_COLORS.map((c, i) => {
          const on = d.color_index === i;
          return (
            <Pressable key={c.bg} onPress={() => onChange({ ...d, color_index: i })} style={[styles.colorRing, on && { borderColor: colors.ink }]} accessibilityRole="radio" accessibilityState={{ selected: on }}>
              <View style={[styles.colorDot, { backgroundColor: c.bg }]}>{on ? <Check size={16} color={c.fg} strokeWidth={3} /> : null}</View>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>{t('family.avatar')}</Text>
      <View style={styles.chips}>
        {(Object.keys(AVATAR_GROUPS) as AvatarGroup[]).map((g) => (
          <Chip key={g} label={t(`family.avatarGroup_${g}`)} on={group === g} onPress={() => setGroup(g)} />
        ))}
      </View>
      <View style={styles.avatars}>
        <Pressable onPress={() => onChange({ ...d, avatar_image: null })} style={[styles.avatarCell, !d.avatar_image && styles.avatarOn]} accessibilityRole="radio" accessibilityState={{ selected: !d.avatar_image }}>
          <MemberAvatar member={{ ...preview, avatar_image: null }} size={48} />
        </Pressable>
        {AVATAR_GROUPS[group].map((name) => {
          const key = `${group}/${name}`;
          const on = d.avatar_image === key;
          return (
            <Pressable key={key} onPress={() => onChange({ ...d, avatar_image: key })} style={[styles.avatarCell, on && styles.avatarOn]} accessibilityRole="radio" accessibilityState={{ selected: on }}>
              <View style={[styles.avatarDisc, { backgroundColor: on ? own.bg : colors.bgSoft }]}>
                <Image source={AVATAR_IMAGES[key]} style={styles.avatarImg} contentFit="cover" />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  input: { flex: 1, height: 54, borderRadius: radii.md, backgroundColor: colors.bgSoft, paddingHorizontal: 16, fontFamily: fonts.semibold, fontSize: 18, color: colors.ink },
  chips: { flexDirection: 'row', gap: 8, marginTop: 12 },
  label: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink3, marginTop: 14, marginBottom: 6 },
  colors: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  colorRing: { width: 46, height: 46, borderRadius: radii.full, borderWidth: 2, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  colorDot: { width: 36, height: 36, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center' },
  avatars: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  avatarCell: { width: 56, height: 56, borderRadius: radii.full, borderWidth: 2, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  avatarOn: { borderColor: colors.ink },
  avatarDisc: { width: 48, height: 48, borderRadius: radii.full, overflow: 'hidden' },
  avatarImg: { width: 48, height: 48 },
});
