import * as Haptics from 'expo-haptics';
import { Circle, Home, Layers, type LucideIcon, Plus, Users } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts } from '@/constants/theme';
import { useStore } from '@/state/store';

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
  cards: Layers,
  family: Users,
};

/** Bottom nav ported from the PWA: white, hairline top edge, yellow active state. JS-only so it runs in Expo Go. */
export function TabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const { t } = useStore();
  const labels: Record<string, string> = { index: t.home, log: t.log, cards: t.cards, family: t.family };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
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
              if (!active && !event.defaultPrevented) navigation.navigate(route.name);
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
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  tab: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 4 },
  label: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 },
});
