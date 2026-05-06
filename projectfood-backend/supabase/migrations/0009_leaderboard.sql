-- 0009_leaderboard.sql
-- Public leaderboard functions: unique plants (all-time) and current streaks

-- leaderboard: top N users ranked by all-time unique plants logged
create or replace function leaderboard(p_limit int default 10)
returns table (
  rank          int,
  username      text,
  unique_plants int,
  is_me         boolean
)
language sql
stable
security definer
set search_path = public
as $$
  with ranked as (
    select
      us.username,
      count(distinct l.plant_id)::int                                         as unique_plants,
      rank() over (order by count(distinct l.plant_id) desc)::int             as rank,
      us.user_id = auth.uid()                                                 as is_me
    from plant_logs l
    join user_settings us on us.user_id = l.user_id
    where us.username is not null
    group by us.user_id, us.username
  )
  select rank, username, unique_plants, is_me
  from ranked
  order by rank
  limit p_limit;
$$;

grant execute on function leaderboard(int) to authenticated;


-- leaderboard_streaks: top N users ranked by current daily streak
-- Uses the island/gap method on distinct logged_on dates.
-- "Active" means the streak's last day is today or yesterday (UTC).
create or replace function leaderboard_streaks(p_limit int default 10)
returns table (
  rank     int,
  username text,
  streak   int,
  is_me    boolean
)
language sql
stable
security definer
set search_path = public
as $$
  with all_days as (
    -- one row per (user, date), no duplicates
    select distinct user_id, logged_on
    from plant_logs
    where logged_on <= current_date
  ),
  numbered as (
    -- subtract the row number to create an island key for consecutive days
    select
      user_id,
      logged_on,
      logged_on - (row_number() over (partition by user_id order by logged_on))::int as island_key
    from all_days
  ),
  islands as (
    select
      user_id,
      max(logged_on) as last_day,
      count(*)::int  as streak_len
    from numbered
    group by user_id, island_key
  ),
  active_streaks as (
    -- keep only the streak that is still live (last day today or yesterday)
    select user_id, streak_len
    from islands
    where last_day >= current_date - 1
  ),
  ranked as (
    select
      us.username,
      coalesce(s.streak_len, 0)                                               as streak,
      rank() over (order by coalesce(s.streak_len, 0) desc)::int              as rank,
      us.user_id = auth.uid()                                                 as is_me
    from user_settings us
    left join active_streaks s on s.user_id = us.user_id
    where us.username is not null
      and coalesce(s.streak_len, 0) > 0
  )
  select rank, username, streak, is_me
  from ranked
  order by rank
  limit p_limit;
$$;

grant execute on function leaderboard_streaks(int) to authenticated;
