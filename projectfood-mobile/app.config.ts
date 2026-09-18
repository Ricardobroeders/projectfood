/// <reference types="node" />
import type { ConfigContext, ExpoConfig } from 'expo/config';
import { existsSync } from 'node:fs';

/**
 * App config. `APP_VARIANT=development` gives the dev client its own bundle id so it installs
 * next to the store build. Public Supabase values come from EXPO_PUBLIC_* env vars (.env.local
 * locally, eas.json for cloud builds).
 */
const IS_DEV = process.env.APP_VARIANT === 'development';
const APP_ID = IS_DEV ? 'dev.projectfood.app.dev' : 'dev.projectfood.app';
const EAS_PROJECT_ID = 'b7ecbd67-fd95-4fcf-ad4b-7a53fe9cc3ec';
// Firebase config for FCM (Android push). EAS provides it through a file env var; locally it is a
// gitignored file at the project root. Omitted when absent so a build without push still works.
const GOOGLE_SERVICES =
  process.env.GOOGLE_SERVICES_JSON ?? (existsSync('./google-services.json') ? './google-services.json' : undefined);
// Android CPU architectures to build. Phones are 64-bit ARM (plus 32-bit ARM for old devices); the x86
// ABIs only serve emulators and would double the APK. The preview profile sets ANDROID_ARCHS=arm64-v8a.
const ANDROID_ARCHS = (process.env.ANDROID_ARCHS ?? 'arm64-v8a,armeabi-v7a').split(',');
// iOS reversed client id for Google Sign-In; placeholder until the iOS OAuth client exists.
const GOOGLE_IOS_URL_SCHEME = process.env.GOOGLE_IOS_URL_SCHEME ?? 'com.googleusercontent.apps.placeholder';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: IS_DEV ? 'Project Food (dev)' : 'Project Food',
  slug: 'projectfood',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'projectfood',
  userInterfaceStyle: 'light',
  runtimeVersion: { policy: 'fingerprint' },
  updates: { url: `https://u.expo.dev/${EAS_PROJECT_ID}` },
  ios: {
    bundleIdentifier: APP_ID,
    icon: './assets/expo.icon',
    supportsTablet: false,
    usesAppleSignIn: true,
    infoPlist: { ITSAppUsesNonExemptEncryption: false },
  },
  android: {
    package: APP_ID,
    adaptiveIcon: {
      backgroundColor: '#F5C518',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    ...(GOOGLE_SERVICES ? { googleServicesFile: GOOGLE_SERVICES } : {}),
  },
  plugins: [
    'expo-router',
    [
      'expo-build-properties',
      {
        android: {
          buildArchs: ANDROID_ARCHS,
          // R8 code shrinking and resource shrinking in release builds: smaller dex, smaller APK.
          enableMinifyInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
        },
      },
    ],
    ['expo-splash-screen', { backgroundColor: '#FFFFFF', image: './assets/images/splash-icon.png', imageWidth: 76 }],
    ['expo-notifications', { icon: './assets/images/notification-icon.png', color: '#F5C518', defaultChannel: 'dinner' }],
    'expo-secure-store',
    'expo-localization',
    'expo-apple-authentication',
    'expo-dev-client',
    ['@react-native-google-signin/google-signin', { iosUrlScheme: GOOGLE_IOS_URL_SCHEME }],
  ],
  experiments: { typedRoutes: true, reactCompiler: true },
  extra: { eas: { projectId: EAS_PROJECT_ID } },
});
