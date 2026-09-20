-- 0014: the PWA's web push is gone (Vercel cron and routes removed 2026-09-20). Its browser
-- subscriptions and its push-send log rows (daily_reminder, streak_rescue, weekly_nudge,
-- inactivity_reminder, 2026-05-18 to 2026-09-19) would otherwise hide what the new app sends.
-- plant_logs is not touched: the plant history is shared by the PWA and the app. Copies go to a
-- dated backup schema first, like the 2026-09-16 migration did.
create schema if not exists backup_20260920;
create table backup_20260920.push_subscriptions as table public.push_subscriptions;
create table backup_20260920.notification_log_pwa as
  select * from public.notification_log
  where type in ('daily_reminder', 'inactivity_reminder', 'streak_rescue', 'weekly_nudge');

delete from public.notification_log
  where type in ('daily_reminder', 'inactivity_reminder', 'streak_rescue', 'weekly_nudge');
drop table public.push_subscriptions;

-- notifications_enabled now means "this phone registered an Expo push token" (set by the app),
-- not "this browser subscribed"; accounts that only had a browser subscription go back to off.
update public.user_settings s
   set notifications_enabled = false
 where s.notifications_enabled
   and not exists (select 1 from public.push_tokens t where t.user_id = s.user_id);
