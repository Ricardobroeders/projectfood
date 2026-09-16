/** Public runtime configuration. EXPO_PUBLIC_* values are inlined at build time. */
export const ENV = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
  googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '',
  privacyUrl: 'https://projectfood.dev/{locale}/privacy',
  termsUrl: 'https://projectfood.dev/{locale}/terms',
} as const;

if (!ENV.supabaseUrl || !ENV.supabaseAnonKey) {
  console.warn('[env] EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY are not set');
}
