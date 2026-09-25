/**
 * Public runtime configuration. EXPO_PUBLIC_* values are inlined at build time. The Supabase
 * address and publishable key carry a fallback: on 2026-09-24 three over-the-air updates were
 * bundled without them (`eas update --environment` skips .env files) and threw "supabaseUrl is
 * required" while loading, before the first frame, so expo-updates rolled the phone back to the
 * store build. There is one Supabase project; a missing variable must never take the app down.
 */
export const ENV = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://lkmfmdehysmbstnfdbyg.supabase.co',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_gLNvkh2R13WwF4qAl7fQ-g_rP3Ve_rL',
  googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
  googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '',
  /** Store review accounts: these addresses get a password field on the sign-in screen (App access declaration). */
  reviewEmails: (process.env.EXPO_PUBLIC_REVIEW_EMAILS ?? 'review@projectfood.dev')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
  privacyUrl: 'https://projectfood.dev/{locale}/privacy',
  termsUrl: 'https://projectfood.dev/{locale}/terms',
} as const;

if (!ENV.supabaseUrl || !ENV.supabaseAnonKey) {
  console.warn('[env] EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY are not set');
}
