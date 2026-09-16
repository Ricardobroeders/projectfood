import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import { track } from '@/features/events/track';
import { supabase } from '@/features/supabase/client';

type PushData = { url?: string; log_id?: string; type?: string };

/** A tapped notification opens straight into logging (KB D10) and is recorded as opened. */
export function useNotificationResponses() {
  const router = useRouter();
  const lastResponse = Notifications.useLastNotificationResponse();
  const handled = useRef<string | null>(null);

  useEffect(() => {
    const handle = (response: Notifications.NotificationResponse) => {
      const id = response.notification.request.identifier;
      if (handled.current === id) return;
      handled.current = id;
      const data = (response.notification.request.content.data ?? {}) as PushData;
      if (data.log_id) void supabase.rpc('mark_notification_opened', { p_id: data.log_id });
      track('notification_opened', { type: data.type ?? null, log_id: data.log_id ?? null });
      router.push((data.url as never) ?? '/log');
    };
    if (lastResponse) handle(lastResponse);
    const sub = Notifications.addNotificationResponseReceivedListener(handle);
    return () => sub.remove();
  }, [lastResponse, router]);
}
