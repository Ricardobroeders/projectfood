import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';

import { supabase } from '@/features/supabase/client';

import type { SocialResult } from './google';

/** Sign in with Apple (iOS only). Mandatory next to Google on the App Store (guideline 4.8). */
export async function signInWithApple(): Promise<SocialResult> {
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
      nonce: hashedNonce,
    });
    if (!credential.identityToken) throw new Error('Apple returned no identity token');
    const { error } = await supabase.auth.signInWithIdToken({ provider: 'apple', token: credential.identityToken, nonce: rawNonce });
    if (error) throw error;
    // Apple sends the name only on the first sign-in; keep it for the adult member's prefill.
    const given = credential.fullName?.givenName;
    if (given) await supabase.auth.updateUser({ data: { given_name: given, full_name: [given, credential.fullName?.familyName].filter(Boolean).join(' ') } });
    return 'ok';
  } catch (e) {
    if ((e as { code?: string }).code === 'ERR_REQUEST_CANCELED') return 'cancelled';
    throw e;
  }
}
