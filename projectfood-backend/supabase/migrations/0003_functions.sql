-- 0003_functions.sql
-- SQL functions powering the home screen and stats

-- weekly_variety: count distinct plants logged in a 7-day window starting p_week_start
create or replace function weekly_variety(
  p_user_id   uuid    default auth.uid(),
  p_week_start date   default date_trunc('week', current_date)::date
)
returns int
language sql
stable
security definer
set search_path = public
as $$
  select count(distinct plant_id)::int
  from plant_logs
  where user_id    = p_user_id
    and logged_on >= p_week_start
    and logged_on <= p_week_start + 6;
$$;

grant execute on function weekly_variety(uuid, date) to authenticated;


-- current_week_plants: full plant rows logged in the given week, deduplicated
create or replace function current_week_plants(
  p_user_id    uuid  default auth.uid(),
  p_week_start date  default date_trunc('week', current_date)::date
)
returns setof plants
language sql
stable
security definer
set search_path = public
as $$
  select distinct on (p.id) p.*
  from plant_logs l
  join plants p on p.id = l.plant_id
  where l.user_id    = p_user_id
    and l.logged_on >= p_week_start
    and l.logged_on <= p_week_start + 6
  order by p.id;
$$;

grant execute on function current_week_plants(uuid, date) to authenticated;


-- current_streak: consecutive days with at least one log, ending today (user's timezone)
-- Decision: if today has no log yet, we start counting from yesterday backward —
-- the streak isn't broken until a full day passes without a log.
-- If yesterday also has no log, streak = 0.
create or replace function current_streak(
  p_user_id uuid default auth.uid()
)
returns int
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_timezone      text;
  v_today         date;
  v_check_date    date;
  v_streak        int := 0;
  v_has_log       bool;
begin
  select coalesce(timezone, 'UTC')
  into   v_timezone
  from   user_settings
  where  user_id = p_user_id;

  -- Fall back to UTC if user has no settings row yet
  if v_timezone is null then
    v_timezone := 'UTC';
  end if;

  v_today := (now() at time zone v_timezone)::date;

  -- If today has a log, start counting from today; otherwise start from yesterday
  select exists (
    select 1 from plant_logs
    where user_id = p_user_id and logged_on = v_today
  ) into v_has_log;

  if v_has_log then
    v_check_date := v_today;
  else
    v_check_date := v_today - 1;
    -- If yesterday also has no log, streak is 0
    select exists (
      select 1 from plant_logs
      where user_id = p_user_id and logged_on = v_check_date
    ) into v_has_log;
    if not v_has_log then
      return 0;
    end if;
  end if;

  -- Walk backwards counting consecutive days
  loop
    select exists (
      select 1 from plant_logs
      where user_id = p_user_id and logged_on = v_check_date
    ) into v_has_log;

    exit when not v_has_log;

    v_streak     := v_streak + 1;
    v_check_date := v_check_date - 1;
  end loop;

  return v_streak;
end;
$$;

grant execute on function current_streak(uuid) to authenticated;


-- fill_rate: percentage of days in the last p_window_days with at least one log
create or replace function fill_rate(
  p_user_id     uuid    default auth.uid(),
  p_window_days int     default 30
)
returns numeric
language sql
stable
security definer
set search_path = public
as $$
  select round(
    count(distinct logged_on)::numeric / p_window_days * 100,
    2
  )
  from plant_logs
  where user_id   = p_user_id
    and logged_on >= current_date - (p_window_days - 1);
$$;

grant execute on function fill_rate(uuid, int) to authenticated;


-- weekly_history: one row per week for the last N weeks
create or replace function weekly_history(
  p_user_id uuid    default auth.uid(),
  p_weeks   int     default 4
)
returns table (
  week_start date,
  variety    int,
  hit_goal   boolean
)
language sql
stable
security definer
set search_path = public
as $$
  with weeks as (
    select generate_series(0, p_weeks - 1) as offset_weeks
  ),
  week_starts as (
    select (date_trunc('week', current_date) - (offset_weeks * interval '1 week'))::date as ws
    from weeks
  ),
  goal as (
    select coalesce(weekly_variety_goal, 30) as g
    from user_settings
    where user_id = p_user_id
  )
  select
    ws.ws                                                              as week_start,
    count(distinct l.plant_id)::int                                   as variety,
    count(distinct l.plant_id) >= (select g from goal)                as hit_goal
  from week_starts ws
  left join plant_logs l
    on l.user_id   = p_user_id
   and l.logged_on >= ws.ws
   and l.logged_on <= ws.ws + 6
  group by ws.ws
  order by ws.ws desc;
$$;

grant execute on function weekly_history(uuid, int) to authenticated;


-- category_breakdown: all-time unique plants logged per category vs. catalog size
create or replace function category_breakdown(
  p_user_id uuid default auth.uid()
)
returns table (
  category         plant_category,
  unique_count     int,
  total_in_category int
)
language sql
stable
security definer
set search_path = public
as $$
  with catalog_totals as (
    select category, count(*)::int as total
    from plants
    where is_active = true
    group by category
  ),
  user_logged as (
    select p.category, count(distinct l.plant_id)::int as unique_count
    from plant_logs l
    join plants p on p.id = l.plant_id
    where l.user_id = p_user_id
    group by p.category
  )
  select
    ct.category,
    coalesce(ul.unique_count, 0) as unique_count,
    ct.total                     as total_in_category
  from catalog_totals ct
  left join user_logged ul using (category)
  order by ct.category;
$$;

grant execute on function category_breakdown(uuid) to authenticated;
