import { Stack } from 'expo-router';

import { colors } from '@/constants/theme';

export const unstable_settings = { initialRouteName: 'you' };

/** First run, three steps: you → who else is at the table → dinner time (with the push ask). */
export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="you" />
      <Stack.Screen name="family" />
      <Stack.Screen name="dinner-time" />
    </Stack>
  );
}
