import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';

import { supabase } from '@/features/supabase/client';
import { ENV } from '@/features/supabase/env';

let configured = false;
function configure() {
  if (configured) return;
  GoogleSignin.configure({
    webClientId: ENV.googleWebClientId,
    ...(ENV.googleIosClientId ? { iosClientId: ENV.googleIosClientId } : {}),
  });
  configured = true;
}

export type SocialResult = 'ok' | 'cancelled';

/** Native Google sign-in, then the id token goes to Supabase (no browser round trip). */
export async function signInWithGoogle(): Promise<SocialResult> {
  configure();
  try {
    await GoogleSignin.hasPlayServices();
    const res = await GoogleSignin.signIn();
    if (!isSuccessResponse(res)) return 'cancelled';
    const idToken = res.data.idToken;
    if (!idToken) throw new Error('Google returned no id token; check the web client id');
    const { error } = await supabase.auth.signInWithIdToken({ provider: 'google', token: idToken });
    if (error) throw error;
    return 'ok';
  } catch (e) {
    if (isErrorWithCode(e) && (e.code === statusCodes.SIGN_IN_CANCELLED || e.code === statusCodes.IN_PROGRESS)) return 'cancelled';
    throw e;
  }
}

export async function signOutGoogle() {
  try {
    configure();
    await GoogleSignin.signOut();
  } catch {
    // not signed in with Google; nothing to do
  }
}
