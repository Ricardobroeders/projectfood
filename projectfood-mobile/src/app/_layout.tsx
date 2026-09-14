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

import { AchievementSheet } from '@/components/AchievementSheet';
import { CelebrationSheet } from '@/components/CelebrationSheet';
import { FunFactCard } from '@/components/FunFactCard';
import { MemberPickerSheet } from '@/components/MemberPickerSheet';
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
        <Tabs.Screen name="account" />
      </Tabs>
      {/* Sheets and cards mount once here so no tab renders a second copy of the same modal. */}
      <MemberPickerSheet />
      <CelebrationSheet />
      <FunFactCard />
      <AchievementSheet />
    </StoreProvider>
  );
}
