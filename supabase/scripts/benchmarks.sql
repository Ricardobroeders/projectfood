-- The stats screen's "typical household" benchmark (brainstorm 25, 2026-10-07). Run in the SQL editor,
-- paste the JSON into projectfood-mobile/src/data/benchmarks.json, ship with the next update.
-- Family-app era only (logs since 2026-09-07); medians, so a bulk day moves nothing.
with l as (select pl.household_id, pl.plant_id, pl.logged_on, p.category from plant_logs pl join plants p on p.id = pl.plant_id where pl.logged_on >= '2026-09-07'),
cat as (select category, count(*) n from l group by 1), tot as (select sum(n) t from cat),
wk as (select household_id, date_trunc('week', logged_on)::date w, count(distinct plant_id) n from l group by 1,2),
wk_full as (select * from wk where w < date_trunc('week', current_date)::date and w >= '2026-09-07'),
dy as (select household_id, logged_on, count(distinct plant_id) n from l group by 1,2),
first_wk as (select household_id, count(distinct plant_id) n from l l2 where logged_on < (select min(logged_on) from l l3 where l3.household_id = l2.household_id) + 7 group by 1)
select json_build_object(
 'generatedOn', current_date,
 'households', (select count(distinct household_id) from l),
 'householdWeeks', (select count(*) from wk_full),
 'categoryShare', (select json_object_agg(category, round(100.0*n/t,1)) from cat, tot),
 'weekTypical', (select percentile_cont(0.5) within group (order by n) from wk_full),
 'dayTypical', (select percentile_cont(0.5) within group (order by n) from dy),
 'firstWeekTypical', (select percentile_cont(0.5) within group (order by n) from first_wk)
) as benchmarks;
