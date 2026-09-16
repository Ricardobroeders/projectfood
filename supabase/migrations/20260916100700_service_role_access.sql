-- 0008 the scheduler (Edge Function with the service role) may read any household through the
-- household RPCs; anon and authenticated callers are unchanged.
create or replace function public.is_household_member(hid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', '') = 'service_role'
      or exists (select 1 from household_users where household_id = hid and user_id = auth.uid());
$$;
