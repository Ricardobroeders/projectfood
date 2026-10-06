import { supabase } from '@/features/supabase/client';

/** Sends the code email (6 digits since 2026-10-06, a dashboard setting; the app accepts 6 to 8; the Supabase "Magic link" template must contain {{ .Token }}). */
export async function sendEmailCode(email: string) {
  const { error } = await supabase.auth.signInWithOtp({ email: email.trim().toLowerCase(), options: { shouldCreateUser: true } });
  if (error) throw error;
}

export async function verifyEmailCode(email: string, token: string) {
  const { error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: token.trim(), type: 'email' });
  if (error) throw error;
}
