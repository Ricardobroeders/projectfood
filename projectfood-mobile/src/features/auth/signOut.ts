import { queryClient, queryPersister } from '@/features/supabase/queryClient';
import { supabase } from '@/features/supabase/client';

import { signOutGoogle } from './google';

/** Removes this phone's push tokens, ends the session and drops every cached query. */
export async function signOutEverywhere() {
  const { data } = await supabase.auth.getUser();
  if (data.user) await supabase.from('push_tokens').delete().eq('user_id', data.user.id);
  await signOutGoogle();
  await supabase.auth.signOut();
  queryClient.clear();
  await queryPersister.removeClient();
}
