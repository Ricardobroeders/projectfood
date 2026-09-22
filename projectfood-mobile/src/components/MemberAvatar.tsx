import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, MEMBER_COLORS, radii } from '@/constants/theme';
import { AVATAR_IMAGES } from '@/data/avatars';
import type { Member } from '@/features/household/queries';

/** Enough of a member row to draw an avatar; drafts in the editor use it too. */
export type MemberLike = Pick<Member, 'id' | 'name' | 'color_index'> & Partial<Pick<Member, 'avatar_image'>>;

export function memberColor(member: Pick<Member, 'color_index'>) {
  return MEMBER_COLORS[member.color_index % MEMBER_COLORS.length];
}

/**
 * Illustrated head from the PWA avatar set when the member picked one, otherwise the initial, both
 * on the member's one colour (the separate avatar background was retired on 2026-09-22; the
 * `avatar_bg` column stays but is no longer read). `muted` is the grey "not selected" state.
 * Genuinely round, so full radius.
 */
export function MemberAvatar({ member, size, muted = false }: { member: MemberLike; size: number; muted?: boolean }) {
  const c = memberColor(member);
  const image = member.avatar_image ? AVATAR_IMAGES[member.avatar_image] : undefined;
  if (image) {
    return (
      <View style={[styles.disc, { width: size, height: size, backgroundColor: muted ? colors.bgSoft : c.bg }]}>
        <Image source={image} style={{ width: size, height: size, borderRadius: size / 2, opacity: muted ? 0.35 : 1 }} contentFit="cover" />
      </View>
    );
  }
  const initial = (member.name.trim()[0] ?? '?').toUpperCase();
  return (
    <View style={[styles.disc, { width: size, height: size, backgroundColor: muted ? colors.bgSoft : c.bg }]}>
      <Text style={[styles.initial, { fontSize: Math.round(size * 0.44), lineHeight: Math.round(size * 0.56), color: muted ? colors.ink3 : c.fg }]}>{initial}</Text>
    </View>
  );
}

/** Overlapping mini avatars, at most four, then "+n". */
export function AvatarStack({ members, size = 22, ring = colors.surface }: { members: MemberLike[]; size?: number; ring?: string }) {
  const shown = members.slice(0, 4);
  const extra = members.length - shown.length;
  return (
    <View style={styles.stack}>
      {shown.map((m, i) => (
        <View key={m.id} style={[styles.ring, { borderColor: ring, marginLeft: i === 0 ? 0 : -Math.round(size * 0.3) }]}>
          <MemberAvatar member={m} size={size} />
        </View>
      ))}
      {extra > 0 ? <Text style={styles.extra}>+{extra}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  disc: { borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  initial: { fontFamily: fonts.bold, includeFontPadding: false, textAlignVertical: 'center' },
  stack: { flexDirection: 'row', alignItems: 'center' },
  ring: { borderWidth: 2, borderRadius: radii.full },
  extra: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, color: colors.ink2, marginLeft: 4 },
});
