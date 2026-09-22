/** Public runtime configuration. EXPO_PUBLIC_* values are inlined at build time. */
export const ENV = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
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
