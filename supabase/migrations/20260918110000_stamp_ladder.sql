-- 0011: the stamp ladder (KB concept-achievement-system, 2026-09-18). Every stamp has up to four
-- levels; unlock rows carry the level; stamp ids lose their numbers; the weekly history also counts
-- colours so the Rainbow ladder can count "weeks with 5 colours".
alter table public.achievement_unlocks add column if not exists level int not null default 1;
alter table public.achievement_unlocks drop constraint if exists achievement_unlocks_level_check;
alter table public.achievement_unlocks add constraint achievement_unlocks_level_check check (level between 1 and 4);

drop index if exists public.achievement_unlocks_uniq;
create unique index achievement_unlocks_uniq on public.achievement_unlocks
  (household_id, coalesce(member_id, '00000000-0000-0000-0000-000000000000'::uuid), achievement_id, level);

update public.achievement_unlocks set achievement_id = case achievement_id
  when 'first_bites' then 'explorer'
  when 'veg_5' then 'green_machine'
  when 'fruit_5' then 'fruit_basket'
  when 'herb_3' then 'herb_garden'
  when 'nut_3' then 'nutcracker'
  when 'legume_3' then 'bean_counter'
  when 'grain_3' then 'grain_train'
  when 'ferment_2' then 'bubbly'
  when 'superfood_5' then 'superfood'
  when 'streak_7' then 'table_talk'
  when 'thirty' then 'family_of_thirty'
  else achievement_id end
where achievement_id in ('first_bites', 'veg_5', 'fruit_5', 'herb_3', 'nut_3', 'legume_3', 'grain_3', 'ferment_2', 'superfood_5', 'streak_7', 'thirty');

drop function if exists public.household_weekly_history(uuid, int);
create function public.household_weekly_history(
  p_household_id uuid default public.my_household_id(),
  p_weeks int default 12
) returns table(week_start date, variety int, hit_goal boolean, colours int)
language sql stable security definer set search_path = public as $$
  with week_starts as (
    select (date_trunc('week', current_date) - (g * interval '1 week'))::date as ws
    from generate_series(0, p_weeks - 1) g
  )
  select ws.ws, count(distinct l.plant_id)::int, count(distinct l.plant_id) >= 30, count(distinct p.color)::int
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
