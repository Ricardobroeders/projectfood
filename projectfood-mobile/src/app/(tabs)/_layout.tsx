import { Tabs } from 'expo-router';

import { AchievementSheet } from '@/components/AchievementSheet';
import { CelebrationSheet } from '@/components/CelebrationSheet';
import { FunFactCard } from '@/components/FunFactCard';
import { MemberPickerSheet } from '@/components/MemberPickerSheet';
import { PushPromptSheet } from '@/components/PushPromptSheet';
import { TabBar } from '@/components/TabBar';
import { colors } from '@/constants/theme';
import { useUnlockEngine } from '@/features/achievements/useAchievements';
import { useNotificationResponses } from '@/features/notifications/useNotificationResponses';

export default function TabsLayout() {
  useUnlockEngine();
  useNotificationResponses();
  return (
    <>
      <Tabs screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }} tabBar={(props) => <TabBar {...props} />}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="log" />
        <Tabs.Screen name="unlocks" />
        <Tabs.Screen name="account" />
      </Tabs>
      {/* Sheets and cards mount once here so no tab renders a second copy of the same modal. */}
      <MemberPickerSheet />
      <CelebrationSheet />
      <FunFactCard />
      <AchievementSheet />
      <PushPromptSheet />
    </>
  );
}
