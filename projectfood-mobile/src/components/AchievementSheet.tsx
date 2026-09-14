import { Check, Star } from 'lucide-react-native';
import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProgressBar } from '@/components/ProgressBar';
import { Sheet } from '@/components/Sheet';
import { Stamp } from '@/components/Stamp';
import { colors, fonts, iconFor, radii } from '@/constants/theme';
import { ACHIEVEMENT_BY_ID } from '@/data/achievements';
import { fmt } from '@/i18n';
import { useStore } from '@/state/store';

const STAMP_SIZE = 96;

/** Tapping a stamp opens this: what the goal is, how far the family is, what it pays. */
export function AchievementSheet() {
  const { achievement, unlocked, progress, t, dispatch } = useStore();
  // Keep the last content while the sheet slides out.
  const last = useRef(achievement);
  if (achievement) last.current = achievement;
  const id = achievement ?? last.current;
  const close = () => dispatch({ type: 'closeAchievement' });
  if (!id) return null;

  const a = ACHIEVEMENT_BY_ID[id];
  const p = progress[id];
  const done = unlocked.includes(id);
  const strings = t.stamps[id];
  const Icon = a.icon;
  const shown = Math.min(p.current, p.target);

  return (
    <Sheet visible={achievement !== null} onRequestClose={close}>
      <View style={styles.head}>
        <Stamp size={STAMP_SIZE} color={a.color} locked={!done}>
          <Icon size={iconFor(STAMP_SIZE)} color={done ? (a.fg ?? '#FFFFFF') : colors.lockedInk} />
        </Stamp>
        <Text style={styles.title}>{strings.title}</Text>
        <Text style={styles.body}>{fmt(strings.body, { n: p.target })}</Text>
      </View>

      <View style={styles.progressRow}>
        <Text style={[styles.progressLabel, done && { color: colors.success }]}>{done ? t.unlocked : t.progressLabel}</Text>
        <Text style={styles.progressNumber}>
          {shown}/{p.target}
        </Text>
      </View>
      <ProgressBar value={p.current} max={p.target} height={8} />

      <View style={styles.reward}>
        <Star size={16} color={colors.gold} />
        <Text style={styles.rewardText}>{fmt(t.xpReward, { n: a.xp })}</Text>
        {done ? (
          <View style={styles.rewardDone}>
            <Check size={14} color={colors.success} strokeWidth={3} />
          </View>
        ) : null}
      </View>

      <Pressable style={({ pressed }) => [styles.primary, pressed && { backgroundColor: colors.accentPressed }]} onPress={close}>
        <Text style={styles.primaryText}>{t.close}</Text>
      </Pressable>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  head: { alignItems: 'center', gap: 8, paddingTop: 4 },
  title: { fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 32, color: colors.ink, textAlign: 'center', marginTop: 6 },
  body: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 22, color: colors.ink2, textAlign: 'center', maxWidth: 300 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16 },
  progressLabel: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: colors.ink2 },
  progressNumber: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, color: colors.ink },
  reward: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', height: 36, paddingHorizontal: 12, borderRadius: radii.sm, backgroundColor: colors.bgSoft, marginTop: 12 },
  rewardText: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 18, color: colors.ink },
  rewardDone: { width: 22, height: 22, borderRadius: radii.full, backgroundColor: colors.successSoft, alignItems: 'center', justifyContent: 'center' },
  primary: { alignSelf: 'stretch', backgroundColor: colors.accent, borderRadius: radii.md, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  primaryText: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 22, color: colors.onAccent },
});
