import { supabase } from '@/features/supabase/client';

/** Sends the 8-digit code email (Supabase "Magic link" template must contain {{ .Token }}). */
export async function sendEmailCode(email: string) {
  const { error } = await supabase.auth.signInWithOtp({ email: email.trim().toLowerCase(), options: { shouldCreateUser: true } });
  if (error) throw error;
}

export async function verifyEmailCode(email: string, token: string) {
  const { error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: token.trim(), type: 'email' });
  if (error) throw error;
}
