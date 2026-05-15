import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// PKCE (default) forces signInWithOtp to send a magic link URL regardless of
// the email template. Implicit flow lets Supabase embed {{ .Token }} (the
// 6-digit code) in the email so users can verify in-app without a redirect.
export function createImplicitClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { flowType: 'implicit' } }
  )
}
