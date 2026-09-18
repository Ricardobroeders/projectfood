-- 0012: the weekly history also counts logging days, for the Steady weeks stamp (weeks with 4 dinners).
drop function if exists public.household_weekly_history(uuid, int);
create function public.household_weekly_history(
  p_household_id uuid default public.my_household_id(),
  p_weeks int default 12
) returns table(week_start date, variety int, hit_goal boolean, colours int, active_days int)
language sql stable security definer set search_path = public as $$
  with week_starts as (
    select (date_trunc('week', current_date) - (g * interval '1 week'))::date as ws
    from generate_series(0, p_weeks - 1) g
  )
  select ws.ws, count(distinct l.plant_id)::int, count(distinct l.plant_id) >= 30, count(distinct p.color)::int, count(distinct l.logged_on)::int
  from week_starts ws
  left join plant_logs l
    on l.household_id = p_household_id
   and l.logged_on between ws.ws and ws.ws + 6
  left join plants p on p.id = l.plant_id
  where is_household_member(p_household_id)
  group by ws.ws
  order by ws.ws desc;
$$;
revoke execute on function public.household_weekly_history(uuid, int) from anon;
