import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedNumber } from '@/components/AnimatedNumber';
import { StampShelf } from '@/components/StampShelf';
import { CATS, colors, fonts, radii, shadows } from '@/constants/theme';
import { PLANT_BY_SLUG } from '@/data/plants';
import { useStore } from '@/state/store';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { checked, xp, locale, t } = useStore();
  const recent = checked.slice(-4).reverse().map((s) => PLANT_BY_SLUG[s]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.homeTitle}</Text>
        <View style={styles.xp}>
          <Feather name="star" size={16} color={colors.accentPressed} />
          <AnimatedNumber value={xp} style={styles.xpNumber} />
          <Text style={styles.xpLabel}>{t.xp}</Text>
        </View>
      </View>

      <View style={[styles.hero, shadows.md]}>
        <Text style={styles.heroNumber}>
          {checked.length}
          <Text style={styles.heroDenominator}> / 30</Text>
        </Text>
        <Text style={styles.heroLabel}>{t.homeProgress}</Text>
        <View style={styles.recent}>
          {recent.map((p) => (
            <View key={p.slug} style={[styles.recentTile, { backgroundColor: CATS[p.category].bg }]}>
              <Image source={p.image} style={styles.recentImage} contentFit="contain" />
            </View>
          ))}
        </View>
        <Link href="/log" asChild>
          <Pressable style={({ pressed }) => [styles.cta, pressed && { backgroundColor: colors.accentPressed }]}>
            <Feather name="plus" size={18} color={colors.ink} />
            <Text style={styles.ctaText}>{t.homeCta}</Text>
          </Pressable>
        </Link>
      </View>

      <Text style={styles.section}>{t.achievements}</Text>
      <StampShelf />
      <Text style={styles.footnote}>{locale === 'nl' ? 'POC · Project Food' : 'POC · Project Food'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  title: { fontFamily: fonts.extrabold, fontSize: 26, color: colors.ink, letterSpacing: -0.4 },
  xp: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.accentSoft, borderRadius: radii.full, paddingHorizontal: 12, paddingVertical: 8 },
  xpNumber: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink, minWidth: 24, textAlign: 'right' },
  xpLabel: { fontFamily: fonts.semibold, fontSize: 12, color: colors.ink2 },
  hero: { margin: 20, backgroundColor: colors.surface, borderRadius: radii.xl, padding: 24, gap: 6 },
  heroNumber: { fontFamily: fonts.extrabold, fontSize: 56, color: colors.ink, letterSpacing: -1.5 },
  heroDenominator: { fontFamily: fonts.semibold, fontSize: 22, color: colors.ink3, letterSpacing: 0 },
  heroLabel: { fontFamily: fonts.medium, fontSize: 15, color: colors.ink2 },
  recent: { flexDirection: 'row', gap: 8, marginTop: 12, minHeight: 52 },
  recentTile: { width: 52, height: 52, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center' },
  recentImage: { width: 36, height: 36 },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.accent, borderRadius: radii.md, paddingVertical: 16, marginTop: 16 },
  ctaText: { fontFamily: fonts.bold, fontSize: 17, color: colors.ink },
  section: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink, paddingHorizontal: 20, marginBottom: 8 },
  footnote: { fontFamily: fonts.medium, fontSize: 12, color: colors.ink3, textAlign: 'center', marginTop: 'auto', marginBottom: 12 },
});
