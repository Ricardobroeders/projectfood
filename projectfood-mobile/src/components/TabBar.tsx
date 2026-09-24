import * as Haptics from 'expo-haptics';
import { Award, Circle, CircleUserRound, Home, type LucideIcon, Plus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { perfStart } from '@/features/dev/perf';
import { colors, fonts } from '@/constants/theme';

/** The slice of React Navigation's BottomTabBarProps this bar uses (the package is nested under expo-router). */
type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    emit: (e: { type: 'tabPress'; target: string; canPreventDefault: true }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
};

/** Lucide, per the Figma design system (fonts frame, 2026-09-10). */
const ICONS: Record<string, LucideIcon> = {
  index: Home,
  log: Plus,
  unlocks: Award,
  account: CircleUserRound,
};

/** Bottom nav ported from the PWA: white, hairline top edge, accent active icon. */
export function TabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const labels: Record<string, string> = { index: t('nav.home'), log: t('nav.log'), unlocks: t('nav.unlocks'), account: t('nav.account') };

  // The labels sat on the Android nav bar (Ricardo, 2026-09-24): air below them on top of the inset.
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) + 8 }]}>
      {state.routes.map((route, i) => {
        const active = state.index === i;
        const Icon = ICONS[route.name] ?? Circle;
        return (
          <Pressable
            key={route.key}
            style={styles.tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => {
              Haptics.selectionAsync();
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!active && !event.defaultPrevented) {
                perfStart(`tab→${route.name}`);
                navigation.navigate(route.name);
              }
            }}>
            <Icon size={22} color={active ? colors.accent : colors.ink3} />
            <Text style={[styles.label, { color: active ? colors.ink : colors.ink3 }]}>{labels[route.name] ?? route.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: colors.surface, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.hairline },
  tab: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 4 },
  label: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 },
});
