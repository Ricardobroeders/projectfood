-- 0015: tastes outlive the account (Ricardo, 2026-09-20). The KPI questions (most eaten plants,
-- variety per week, streak lengths) only need plant, day and the ids as bare tokens, so plant_logs no
-- longer cascades from auth.users, households or household_members. After an account is deleted the
-- row's user_id, household_id and member_id point at nothing: random ids with no name, email or
-- household behind them, unreachable through RLS (no household_users row matches), visible only to
-- the service role. The plant link stays. Privacy policy section 8 says so.
alter table public.plant_logs
  drop constraint plant_logs_user_id_fkey,
  drop constraint plant_logs_household_id_fkey,
  drop constraint plant_logs_member_id_fkey;
comment on table public.plant_logs is
  'One plant tasted by one member on one day. Rows outlive the account: after deletion user_id, household_id and member_id are bare tokens (decision 2026-09-20, privacy policy section 8).';
