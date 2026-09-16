-- 0010 tighten grants flagged by the security advisor: trigger functions are not RPCs, and the
-- household RPCs have nothing to say to anonymous callers.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.plant_logs_fill_member() from public, anon, authenticated;
revoke execute on function public.sync_user_avatar_url() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.is_household_member(uuid) from anon;
revoke execute on function public.my_household_id() from anon;
revoke execute on function public.mark_notification_opened(uuid) from anon;
revoke execute on function public.household_weekly_variety(uuid, date) from anon;
revoke execute on function public.household_week_plants(uuid, date) from anon;
revoke execute on function public.member_taste_counts(uuid) from anon;
revoke execute on function public.household_daily_activity(uuid, int) from anon;
revoke execute on function public.household_weekly_history(uuid, int) from anon;
revoke execute on function public.household_streak(uuid) from anon;
