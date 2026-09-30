import { Tabs } from 'expo-router';
import { View } from 'react-native';

import { AchievementSheet } from '@/components/AchievementSheet';
import { CelebrationSheet } from '@/components/CelebrationSheet';
import { FunFactCard } from '@/components/FunFactCard';
import { GoldCardSheet } from '@/components/GoldCardSheet';
import { MemberMenu } from '@/components/MemberMenu';
import { PushPromptSheet } from '@/components/PushPromptSheet';
import { TabBar } from '@/components/TabBar';
import { TutorialOverlay } from '@/components/TutorialOverlay';
import { colors } from '@/constants/theme';
import { useUnlockEngine } from '@/features/achievements/useAchievements';
import { useNotificationResponses } from '@/features/notifications/useNotificationResponses';
import { useTutorialStart } from '@/features/tutorial/useTutorialStart';

export default function TabsLayout() {
  useUnlockEngine();
  useNotificationResponses();
  useTutorialStart();
  return (
    <>
      {/* The tutorial overlay shares this box with the tabs and the tab bar, so the rectangles the
          anchors measure in the window are the coordinates it draws in. */}
      <View style={{ flex: 1 }}>
        <Tabs screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }} tabBar={(props) => <TabBar {...props} />}>
          <Tabs.Screen name="index" />
          <Tabs.Screen name="log" />
          <Tabs.Screen name="unlocks" />
          <Tabs.Screen name="account" />
        </Tabs>
        <TutorialOverlay />
      </View>
      {/* Sheets and cards mount once here so no tab renders a second copy of the same modal. */}
      <MemberMenu />
      <GoldCardSheet />
      <CelebrationSheet />
      <FunFactCard />
      <AchievementSheet />
      <PushPromptSheet />
    </>
  );
}
