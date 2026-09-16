-- 0006 household-scoped read functions. All SECURITY DEFINER and guarded by is_household_member.
-- The old user_id-scoped RPCs stay untouched for the legacy PWA.

create or replace function public.household_weekly_variety(
  p_household_id uuid default public.my_household_id(),
  p_week_start date default (date_trunc('week', current_date))::date
) returns integer
language sql stable security definer set search_path = public as $$
  select count(distinct plant_id)::int
  from plant_logs
  where household_id = p_household_id
    and is_household_member(p_household_id)
    and logged_on between p_week_start and p_week_start + 6;
$$;

create or replace function public.household_week_plants(
  p_household_id uuid default public.my_household_id(),
  p_week_start date default (date_trunc('week', current_date))::date
) returns table(plant_id uuid, member_ids uuid[], first_on date)
language sql stable security definer set search_path = public as $$
  select plant_id, array_agg(distinct member_id), min(logged_on)
  from plant_logs
  where household_id = p_household_id
    and is_household_member(p_household_id)
    and logged_on between p_week_start and p_week_start + 6
  group by plant_id;
$$;

-- cumulative per member: cards (1/5/10), tried/untried, category breakdown and most stamps derive from this
create or replace function public.member_taste_counts(p_household_id uuid default public.my_household_id())
returns table(member_id uuid, plant_id uuid, tastes int, first_on date, last_on date)
language sql stable security definer set search_path = public as $$
  select member_id, plant_id, count(*)::int, min(logged_on), max(logged_on)
  from plant_logs
  where household_id = p_household_id and is_household_member(p_household_id)
  group by member_id, plant_id;
$$;

-- per day: one row per member plus a household row (member_id null) with the union of plants
create or replace function public.household_daily_activity(
  p_household_id uuid default public.my_household_id(),
  p_days int default 90
) returns table(day date, member_id uuid, distinct_plants int)
language sql stable security definer set search_path = public as $$
  select logged_on, member_id, count(distinct plant_id)::int
  from plant_logs
  where household_id = p_household_id and is_household_member(p_household_id)
    and logged_on >= current_date - p_days
  group by logged_on, member_id
  union all
  select logged_on, null::uuid, count(distinct plant_id)::int
  from plant_logs
  where household_id = p_household_id and is_household_member(p_household_id)
    and logged_on >= current_date - p_days
  group by logged_on;
$$;

create or replace function public.household_weekly_history(
  p_household_id uuid default public.my_household_id(),
  p_weeks int default 12
) returns table(week_start date, variety int, hit_goal boolean)
language sql stable security definer set search_path = public as $$
  with week_starts as (
    select (date_trunc('week', current_date) - (g * interval '1 week'))::date as ws
    from generate_series(0, p_weeks - 1) g
  )
  select ws.ws, count(distinct l.plant_id)::int, count(distinct l.plant_id) >= 30
  from week_starts ws
  left join plant_logs l
    on l.household_id = p_household_id
   and l.logged_on between ws.ws and ws.ws + 6
  where is_household_member(p_household_id)
  group by ws.ws
  order by ws.ws desc;
$$;

-- family streak with the built-in freeze (KB D7): one missed day per rolling 7 days is absorbed,
-- today unlogged never breaks the streak, at_risk = nothing logged today and no freeze left.
create or replace function public.household_streak(p_household_id uuid default public.my_household_id())
returns table(current_streak int, longest_streak int, logged_today boolean, freeze_used_on date, at_risk boolean)
language plpgsql stable security definer set search_path = public as $$
declare
  v_tz text;
  v_today date;
  v_start date;
  v_days date[];
  v_logged_today boolean;
  v_d date;
  v_cur int := 0;
  v_first_freeze date;   -- most recent absorbed miss (closest to today)
  v_last_freeze date;    -- oldest absorbed miss met while walking back
  v_longest int := 0;
  v_run int := 0;
  v_run_freeze date;
  v_day date;
  i int;
begin
  if not is_household_member(p_household_id) then
    return query select 0, 0, false, null::date, false;
    return;
  end if;
  select timezone into v_tz from households where id = p_household_id;
  v_today := (now() at time zone coalesce(v_tz, 'Europe/Amsterdam'))::date;
  v_start := v_today - 400;
  select coalesce(array_agg(distinct logged_on), '{}'::date[]) into v_days
  from plant_logs where household_id = p_household_id and logged_on between v_start and v_today;
  v_logged_today := v_today = any(v_days);

  -- current streak: walk back from today (or yesterday when today is still open)
  v_d := case when v_logged_today then v_today else v_today - 1 end;
  loop
    exit when v_d < v_start;
    if v_d = any(v_days) then
      v_cur := v_cur + 1;
    elsif v_last_freeze is null or (v_last_freeze - v_d) > 6 then
      v_last_freeze := v_d;
      v_first_freeze := coalesce(v_first_freeze, v_d);
    else
      exit;
    end if;
    v_d := v_d - 1;
  end loop;
  -- a freeze spent on the day right before the break bought nothing: give it back
  if v_last_freeze is not null and v_last_freeze = v_d + 1 then
    if v_first_freeze = v_last_freeze then v_first_freeze := null; end if;
  end if;
  if v_cur = 0 then v_first_freeze := null; end if;

  -- longest streak: same rule walking forward over the window
  for i in 0..(v_today - v_start) loop
    v_day := v_start + i;
    if v_day = any(v_days) then
      v_run := v_run + 1;
    elsif v_run > 0 and (v_run_freeze is null or (v_day - v_run_freeze) > 6) then
      v_run_freeze := v_day;
    else
      v_run := 0;
      v_run_freeze := null;
    end if;
    v_longest := greatest(v_longest, v_run);
  end loop;

  return query select
    v_cur,
    greatest(v_longest, v_cur),
    v_logged_today,
    v_first_freeze,
    (not v_logged_today and v_cur >= 3 and v_first_freeze is not null and v_first_freeze >= v_today - 6);
end $$;
