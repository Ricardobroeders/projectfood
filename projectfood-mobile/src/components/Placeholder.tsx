import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, iconFor, radii } from '@/constants/theme';
import { useStore } from '@/state/store';

export function Placeholder({ title, icon: Icon }: { title: string; icon: LucideIcon }) {
  const insets = useSafeAreaInsets();
  const { t } = useStore();
  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.empty}>
        <View style={styles.iconWrap}>
          <Icon size={iconFor(72)} color={colors.ink3} />
        </View>
        <Text style={styles.body}>{t.placeholder}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  title: { fontFamily: fonts.extrabold, fontSize: 26, color: colors.ink, letterSpacing: -0.4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingBottom: 80 },
  iconWrap: { width: 72, height: 72, borderRadius: radii.lg, backgroundColor: colors.bgSoft, alignItems: 'center', justifyContent: 'center' },
  body: { fontFamily: fonts.medium, fontSize: 15, color: colors.ink2 },
});
