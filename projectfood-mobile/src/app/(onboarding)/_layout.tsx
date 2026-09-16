import { Stack } from 'expo-router';

import { colors } from '@/constants/theme';

export const unstable_settings = { initialRouteName: 'family' };

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="family" />
      <Stack.Screen name="dinner-time" />
    </Stack>
  );
}
