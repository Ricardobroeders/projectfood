import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, MEMBER_COLORS, radii } from '@/constants/theme';
import type { Member } from '@/state/store';

export function memberColor(member: Member) {
  return MEMBER_COLORS[member.colorIndex % MEMBER_COLORS.length];
}

/** Initial on a coloured disc; `muted` shows the grey "not selected" state. Genuinely round, so full radius. */
export function MemberAvatar({ member, size, muted = false }: { member: Member; size: number; muted?: boolean }) {
  const c = memberColor(member);
  const initial = (member.name.trim()[0] ?? '?').toUpperCase();
  return (
    <View style={[styles.disc, { width: size, height: size, backgroundColor: muted ? colors.bgSoft : c.bg }]}>
      <Text style={[styles.initial, { fontSize: Math.round(size * 0.44), lineHeight: Math.round(size * 0.56), color: muted ? colors.ink3 : c.fg }]}>{initial}</Text>
    </View>
  );
}

/** Overlapping mini avatars, at most four, then "+n". */
export function AvatarStack({ members, size = 22, ring = colors.surface }: { members: Member[]; size?: number; ring?: string }) {
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
  disc: { borderRadius: radii.full, alignItems: 'center', justifyContent: 'center' },
  initial: { fontFamily: fonts.bold, includeFontPadding: false, textAlignVertical: 'center' },
  stack: { flexDirection: 'row', alignItems: 'center' },
  ring: { borderWidth: 2, borderRadius: radii.full },
  extra: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, color: colors.ink2, marginLeft: 4 },
});
