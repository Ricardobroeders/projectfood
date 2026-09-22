import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';

import { supabase } from '@/features/supabase/client';

export type PermissionState = 'granted' | 'denied' | 'undetermined' | 'unavailable';

/** Remote push needs a real device and a development/store build (not Expo Go). */
export function pushAvailable(): boolean {
  return Device.isDevice && Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;
}

// Foreground notifications: banner + list, quiet. The dinner question is a question, not an alarm.
Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
});

export async function ensureChannels() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('dinner', { name: 'Dinner', importance: Notifications.AndroidImportance.DEFAULT });
  await Notifications.setNotificationChannelAsync('marketing', { name: 'Tips & news', importance: Notifications.AndroidImportance.LOW });
}

export async function getPermissionState(): Promise<PermissionState> {
  if (!pushAvailable()) return 'unavailable';
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}

/** The OS prompt. Only ever behind an in-app yes: the ping row at onboarding, the sheet after the first log, or Account → Notifications. */
export async function requestPermission(): Promise<boolean> {
  if (!pushAvailable()) return false;
  await ensureChannels();
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export function openSystemSettings() {
  void Linking.openSettings();
}

/** Stores this phone's Expo push token for the signed-in user. Safe to call on every cold start. */
export async function registerPushToken(userId: string): Promise<void> {
  if (!pushAvailable()) return;
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') return;
  await ensureChannels();
  const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;
  const { data: token } = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
  const row = {
    user_id: userId,
    expo_push_token: token,
    platform: Platform.OS === 'ios' ? 'ios' : 'android',
    device_name: Device.modelName ?? null,
    app_version: Constants.expoConfig?.version ?? null,
    last_seen_at: new Date().toISOString(),
    failure_count: 0,
  };
  const { error } = await supabase.from('push_tokens').upsert(row, { onConflict: 'expo_push_token' });
  if (error && __DEV__) console.warn('[push] token upsert', error.message);
  await supabase.from('user_settings').update({ notifications_enabled: true }).eq('user_id', userId);
}
