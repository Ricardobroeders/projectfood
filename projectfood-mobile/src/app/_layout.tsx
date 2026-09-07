import {
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { TabBar } from '@/components/TabBar';
import { colors } from '@/constants/theme';
import { StoreProvider } from '@/state/store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <StoreProvider>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
        tabBar={(props) => <TabBar {...props} />}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="log" />
        <Tabs.Screen name="cards" />
        <Tabs.Screen name="family" />
      </Tabs>
    </StoreProvider>
  );
}
