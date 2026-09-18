import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MemberAvatar } from '@/components/MemberAvatar';
import { ProgressBar } from '@/components/ProgressBar';
import { Sheet } from '@/components/Sheet';
import { Stamp } from '@/components/Stamp';
import { StampArt } from '@/components/StampArt';
import { colors, fonts, radii } from '@/constants/theme';
import { ACHIEVEMENT_BY_ID, progressFor, unlockKey } from '@/features/achievements/definitions';
import { useAchievements } from '@/features/achievements/useAchievements';
import { useUi } from '@/state/ui';

const STAMP_SIZE = 96;

/** Tapping a stamp opens this: what the goal is and how far the family (or the kid) is. */
export function AchievementSheet() {
  const { t } = useTranslation();
  const open = useUi((s) => s.achievementSheet);
  const close = useUi((s) => s.closeAchievement);
  const { members, progress, unlockedKeys } = useAchievements();
  // Keep the last content while the sheet slides out.
  const last = useRef(open);
  if (open) last.current = open;
  const target = open ?? last.current;
  if (!target) return null;

  const a = ACHIEVEMENT_BY_ID[target.id];
  const memberId = a.scope === 'member' ? target.memberId : null;
  const p = progressFor(progress, memberId)[target.id] ?? { current: 0, target: 1 };
  const done = unlockedKeys.has(unlockKey(target.id, memberId));
  const member = memberId ? members.find((m) => m.id === memberId) : null;
  const shown = Math.min(p.current, p.target);
  const remaining = Math.max(0, p.target - p.current);

  return (
    <Sheet visible={open !== null} onRequestClose={close}>
      <View style={styles.head}>
        <Stamp size={STAMP_SIZE} color={a.color} locked={!done}>
          <StampArt achievement={a} size={STAMP_SIZE} unlocked={done} />
        </Stamp>
        <Text style={styles.title}>{t(`stamps.${target.id}.title`)}</Text>
        <Text style={styles.body}>{t(`stamps.${target.id}.body`, { n: p.target })}</Text>
        {member ? (
          <View style={styles.who}>
            <MemberAvatar member={member} size={24} />
            <Text style={styles.whoText}>{member.name}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.progressRow}>
        <Text style={[styles.progressLabel, done && { color: colors.success }]}>
          {done ? t('unlocks.unlocked') : remaining === 1 ? t('unlocks.remainingOne') : t('unlocks.remaining', { n: remaining })}
        </Text>
        <Text style={styles.progressNumber}>
          {shown}/{p.target}
        </Text>
      </View>
      <ProgressBar value={p.current} max={p.target} height={8} />

      <Pressable style={({ pressed }) => [styles.primary, pressed && { backgroundColor: colors.accentPressed }]} onPress={close}>
        <Text style={styles.primaryText}>{t('common.close')}</Text>
      </Pressable>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  head: { alignItems: 'center', gap: 8, paddingTop: 4 },
  title: { fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 32, color: colors.ink, textAlign: 'center', marginTop: 6 },
  body: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 22, color: colors.ink2, textAlign: 'center', maxWidth: 300 },
  who: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 32, paddingLeft: 4, paddingRight: 12, borderRadius: radii.sm, backgroundColor: colors.bgSoft },
  whoText: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: colors.ink },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16 },
  progressLabel: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: colors.ink2 },
  progressNumber: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, color: colors.ink },
  primary: { alignSelf: 'stretch', backgroundColor: colors.accent, borderRadius: radii.md, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  primaryText: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 22, color: colors.onAccent },
});
