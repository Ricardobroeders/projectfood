-- The Sunday nudge joins the essential group (Ricardo, 2026-10-06: three notifications and no
-- more; the card teaser and the rung nudge are retired in send-notifications). Essential kinds are
-- on by default, so the flag follows: default true, and true for everyone already here. Whether
-- it fires still hangs on notif_essential, which the Notifications screen keeps as the master switch.
alter table public.user_settings alter column notif_weekly_nudge set default true;
update public.user_settings set notif_weekly_nudge = true where notif_weekly_nudge = false;
