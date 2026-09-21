-- 0016: analytics views run as the caller (Supabase security advisor, 2026-09-21). The five
-- analytics_* views aggregate plant_logs across every household. Three already carried
-- security_invoker=on; analytics_churn_rate and analytics_weekly_active_users lost it when they
-- were rebuilt on 2026-05-30, so PostgREST served all-user WAU and churn figures to anyone holding
-- the anon key, evaluated as the view owner (postgres). With security_invoker the querying role's
-- RLS on plant_logs applies: anon sees nothing, a signed-in parent sees only their own household,
-- and roles with bypassrls (postgres, service_role) still see everything, so the dashboards that
-- read these views over a direct connection are unaffected.
alter view public.analytics_churn_rate set (security_invoker = on);
alter view public.analytics_weekly_active_users set (security_invoker = on);
