import { Check, Lock } from 'lucide-react-native';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LevelPips } from '@/components/LevelPips';
import { MemberAvatar } from '@/components/MemberAvatar';
import { ProgressBar } from '@/components/ProgressBar';
import { Sheet } from '@/components/Sheet';
import { Stamp } from '@/components/Stamp';
import { StampArt } from '@/components/StampArt';
import { colors, fonts, radii } from '@/constants/theme';
import { levelLabel, rungBody } from '@/features/achievements/copy';
import { ACHIEVEMENT_BY_ID, levelKey, progressFor, stampView } from '@/features/achievements/definitions';
import { useAchievements } from '@/features/achievements/useAchievements';
import { useUi } from '@/state/ui';

const STAMP_SIZE = 96;

/** Tapping a stamp opens this: the level held, the way to the next rung, and the whole ladder. */
export function AchievementSheet() {
  const { t } = useTranslation();
  const open = useUi((s) => s.achievementSheet);
  const close = useUi((s) => s.closeAchievement);
  const { members, progress, levels } = useAchievements();
  // Keep the last content while the sheet slides out.
  const last = useRef(open);
  if (open) last.current = open;
  const target = open ?? last.current;
  if (!target) return null;

  const a = ACHIEVEMENT_BY_ID[target.id];
  const memberId = a.scope === 'member' ? target.memberId : null;
  const entry = progressFor(progress, memberId)[target.id];
  const level = levels.get(levelKey(target.id, memberId)) ?? 0;
  const v = stampView(entry, level);
  const member = memberId ? members.find((m) => m.id === memberId) : null;
  const rungs = entry?.rungs ?? [];

  return (
    <Sheet visible={open !== null} onRequestClose={close}>
      <View style={styles.head}>
        <Stamp size={STAMP_SIZE} color={a.color} locked={level === 0}>
          <StampArt achievement={a} size={STAMP_SIZE} unlocked={level > 0} />
        </Stamp>
        <LevelPips level={level} max={v.maxLevel} size={7} />
        <Text style={styles.title}>{t(`stamps.${target.id}.title`)}</Text>
        {v.maxLevel > 1 ? (
          <Text style={styles.levelLine}>{level > 0 ? `${t('unlocks.levelOf', { n: level, m: v.maxLevel })} · ${levelLabel(t, level)}` : t('unlocks.levelOf', { n: 0, m: v.maxLevel })}</Text>
        ) : null}
        <Text style={styles.body}>{v.maxed ? t('unlocks.complete') : rungBody(t, a, level + 1, v.target)}</Text>
        {member ? (
          <View style={styles.who}>
            <MemberAvatar member={member} size={24} />
            <Text style={styles.whoText}>{member.name}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.progressRow}>
        <Text style={[styles.progressLabel, v.maxed && { color: colors.success }]}>
          {v.maxed ? t('unlocks.complete') : v.remaining === 1 ? t('unlocks.remainingOne') : t('unlocks.remaining', { n: v.remaining })}
        </Text>
        <Text style={styles.progressNumber}>
          {v.current}/{v.target}
        </Text>
      </View>
      <ProgressBar value={v.current} max={v.target} height={8} />

      {rungs.length > 1 ? (
        <View style={styles.ladder}>
          {rungs.map((r, i) => {
            const reached = i < level;
            const next = i === level;
            const shown = Math.min(r.current, r.target);
            return (
              <View key={i} style={[styles.rung, next && styles.rungNext]}>
                <View style={[styles.rungNo, reached && styles.rungNoDone, next && styles.rungNoNext]}>
                  {reached ? <Check size={14} color="#FFFFFF" strokeWidth={3} /> : <Text style={[styles.rungNoText, next && { color: colors.accent }]}>{i + 1}</Text>}
                </View>
                <View style={styles.rungText}>
                  <Text style={[styles.rungBody, !reached && !next && { color: colors.ink3 }]} numberOfLines={2}>
                    {rungBody(t, a, i + 1, r.target)}
                  </Text>
                  <Text style={styles.rungLevel}>{next ? `${t('unlocks.next')} · ${levelLabel(t, i + 1)}` : levelLabel(t, i + 1)}</Text>
                </View>
                {reached ? (
                  <Text style={styles.rungDone}>{t('unlocks.done')}</Text>
                ) : next ? (
                  <Text style={styles.rungCount}>
                    {shown}/{r.target}
                  </Text>
                ) : (
                  <Lock size={16} color={colors.ink3} />
                )}
              </View>
            );
          })}
        </View>
      ) : null}

      <Pressable style={({ pressed }) => [styles.primary, pressed && { backgroundColor: colors.accentPressed }]} onPress={close}>
        <Text style={styles.primaryText}>{t('common.close')}</Text>
      </Pressable>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  head: { alignItems: 'center', gap: 8, paddingTop: 4 },
  title: { fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 32, color: colors.ink, textAlign: 'center', marginTop: 2 },
  levelLine: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: colors.ink2, marginTop: -4 },
  body: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 22, color: colors.ink2, textAlign: 'center', maxWidth: 300 },
  who: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 32, paddingLeft: 4, paddingRight: 12, borderRadius: radii.sm, backgroundColor: colors.bgSoft },
  whoText: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: colors.ink },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16 },
  progressLabel: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: colors.ink2 },
  progressNumber: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, color: colors.ink },
  ladder: { marginTop: 16, gap: 6 },
  rung: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radii.sm },
  rungNext: { backgroundColor: colors.bgSoft },
  rungNo: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' },
  rungNoDone: { backgroundColor: colors.ink, borderColor: colors.ink },
  rungNoNext: { borderColor: colors.accent, borderWidth: 2 },
  rungNoText: { fontFamily: fonts.bold, fontSize: 13, lineHeight: 16, color: colors.ink3 },
  rungText: { flex: 1, gap: 1 },
  rungBody: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 18, color: colors.ink },
  rungLevel: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 14, color: colors.ink3 },
  rungDone: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, color: colors.success },
  rungCount: { fontFamily: fonts.bold, fontSize: 13, lineHeight: 16, color: colors.ink },
  primary: { alignSelf: 'stretch', backgroundColor: colors.accent, borderRadius: radii.md, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  primaryText: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 22, color: colors.onAccent },
});
