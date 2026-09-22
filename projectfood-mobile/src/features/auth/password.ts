import { supabase } from '@/features/supabase/client';
import { ENV } from '@/features/supabase/env';

/**
 * Store reviewers cannot receive our email code, so the addresses in `ENV.reviewEmails` get a
 * password field on the sign-in screen instead (the Play and Apple "App access" declaration).
 * Nothing else in the app uses passwords; parents sign in with the code or Google.
 */
export function isReviewEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  return e.length > 0 && ENV.reviewEmails.includes(e);
}

export async function signInWithPassword(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
  if (error) throw error;
}
