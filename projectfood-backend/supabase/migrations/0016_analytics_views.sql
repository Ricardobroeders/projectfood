-- Analytics schema with pre-aggregated KPI views for Looker Studio.
-- Connect Looker Studio using the Supabase direct Postgres connection (postgres role).
-- All views query public.* directly — no RLS applies to the postgres/service role.

CREATE SCHEMA IF NOT EXISTS analytics;

-- ─── Daily / Weekly / Monthly Active Users ────────────────────────────────────

CREATE OR REPLACE VIEW analytics.dau AS
SELECT
  logged_on                    AS date,
  COUNT(DISTINCT user_id)      AS active_users,
  COUNT(*)                     AS total_entries,
  ROUND(COUNT(*)::numeric / NULLIF(COUNT(DISTINCT user_id), 0), 1) AS avg_plants_per_active_user
FROM public.plant_logs
GROUP BY logged_on
ORDER BY logged_on;

CREATE OR REPLACE VIEW analytics.wau AS
SELECT
  date_trunc('week', logged_on)::date   AS week_start,
  COUNT(DISTINCT user_id)               AS active_users,
  COUNT(DISTINCT plant_id)              AS unique_plants_logged
FROM public.plant_logs
GROUP BY 1
ORDER BY 1;

CREATE OR REPLACE VIEW analytics.mau AS
SELECT
  date_trunc('month', logged_on)::date  AS month_start,
  COUNT(DISTINCT user_id)               AS active_users,
  COUNT(DISTINCT plant_id)              AS unique_plants_logged
FROM public.plant_logs
GROUP BY 1
ORDER BY 1;

-- ─── Plants per session (per user per day) ────────────────────────────────────

CREATE OR REPLACE VIEW analytics.session_depth AS
SELECT
  logged_on                                                                 AS date,
  ROUND(AVG(plants_logged), 1)                                              AS avg_plants_per_session,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY plants_logged)               AS median_plants_per_session,
  MAX(plants_logged)                                                        AS max_plants_per_session
FROM (
  SELECT user_id, logged_on, COUNT(*) AS plants_logged
  FROM public.plant_logs
  GROUP BY user_id, logged_on
) daily
GROUP BY logged_on
ORDER BY logged_on;

-- ─── Per-user lifetime stats ──────────────────────────────────────────────────

CREATE OR REPLACE VIEW analytics.user_stats AS
SELECT
  us.user_id,
  us.username,
  us.created_at                                                             AS registered_at,
  us.active_border,
  array_length(us.unlocked_borders, 1)                                      AS unlocked_border_count,
  COUNT(DISTINCT pl.plant_id)                                               AS total_unique_plants,
  COUNT(pl.id)                                                              AS total_log_entries,
  COUNT(DISTINCT pl.logged_on)                                              AS days_with_logs,
  MIN(pl.logged_on)                                                         AS first_log_date,
  MAX(pl.logged_on)                                                         AS last_log_date,
  CURRENT_DATE - MAX(pl.logged_on)                                          AS days_since_last_log,
  (
    SELECT COUNT(*)
    FROM public.friendships f
    WHERE (f.requester = us.user_id OR f.addressee = us.user_id)
      AND f.status = 'accepted'
  )                                                                         AS friend_count,
  (
    SELECT COUNT(*)
    FROM public.friendships f
    WHERE (f.requester = us.user_id OR f.addressee = us.user_id)
  )                                                                         AS total_friend_requests
FROM public.user_settings us
LEFT JOIN public.plant_logs pl ON pl.user_id = us.user_id
GROUP BY us.user_id, us.username, us.created_at, us.active_border, us.unlocked_borders;

-- ─── Feature adoption snapshot ────────────────────────────────────────────────

CREATE OR REPLACE VIEW analytics.feature_adoption AS
WITH
  total AS (
    SELECT COUNT(*) AS n FROM public.user_settings WHERE username IS NOT NULL
  ),
  ever_logged AS (
    SELECT COUNT(DISTINCT user_id) AS n FROM public.plant_logs
  ),
  with_friends AS (
    SELECT COUNT(DISTINCT user_id) AS n FROM (
      SELECT requester AS user_id FROM public.friendships WHERE status = 'accepted'
      UNION
      SELECT addressee FROM public.friendships WHERE status = 'accepted'
    ) f
  ),
  border_unlocked AS (
    SELECT COUNT(*) AS n FROM public.user_settings
    WHERE array_length(unlocked_borders, 1) > 0
  ),
  border_active AS (
    SELECT COUNT(*) AS n FROM public.user_settings
    WHERE active_border IS NOT NULL AND active_border <> 'default'
  )
SELECT
  (SELECT n FROM total)             AS total_users_with_username,
  (SELECT n FROM ever_logged)       AS ever_logged_a_plant,
  ROUND(100.0 * (SELECT n FROM ever_logged)    / NULLIF((SELECT n FROM total), 0), 1) AS pct_ever_logged,
  (SELECT n FROM with_friends)      AS users_with_friends,
  ROUND(100.0 * (SELECT n FROM with_friends)   / NULLIF((SELECT n FROM total), 0), 1) AS pct_with_friends,
  (SELECT n FROM border_unlocked)   AS users_unlocked_a_border,
  ROUND(100.0 * (SELECT n FROM border_unlocked)/ NULLIF((SELECT n FROM total), 0), 1) AS pct_unlocked_border,
  (SELECT n FROM border_active)     AS users_using_custom_border,
  ROUND(100.0 * (SELECT n FROM border_active)  / NULLIF((SELECT n FROM total), 0), 1) AS pct_using_custom_border;

-- ─── Popular plants ───────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW analytics.popular_plants AS
SELECT
  p.name,
  p.emoji,
  p.category,
  COUNT(pl.id)              AS total_log_entries,
  COUNT(DISTINCT pl.user_id) AS unique_loggers
FROM public.plant_logs pl
JOIN public.plants p ON p.id = pl.plant_id
GROUP BY p.id, p.name, p.emoji, p.category
ORDER BY total_log_entries DESC;

-- ─── Weekly variety scores ────────────────────────────────────────────────────

CREATE OR REPLACE VIEW analytics.weekly_variety AS
SELECT
  week_start,
  COUNT(DISTINCT user_id)                                                           AS active_users,
  ROUND(AVG(weekly_plants), 1)                                                      AS avg_weekly_plants,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY weekly_plants)                        AS median_weekly_plants,
  COUNT(*) FILTER (WHERE weekly_plants >= 30)                                       AS users_hit_30_goal,
  ROUND(100.0 * COUNT(*) FILTER (WHERE weekly_plants >= 30) / COUNT(*), 1)         AS pct_hit_30_goal
FROM (
  SELECT
    user_id,
    date_trunc('week', logged_on)::date AS week_start,
    COUNT(DISTINCT plant_id)            AS weekly_plants
  FROM public.plant_logs
  GROUP BY user_id, week_start
) w
GROUP BY week_start
ORDER BY week_start;

-- ─── Retention cohorts (first-log week) ───────────────────────────────────────

CREATE OR REPLACE VIEW analytics.retention_cohorts AS
WITH cohorts AS (
  SELECT user_id, date_trunc('week', MIN(logged_on))::date AS cohort_week
  FROM public.plant_logs
  GROUP BY user_id
),
activity AS (
  SELECT
    pl.user_id,
    c.cohort_week,
    (date_trunc('week', pl.logged_on)::date - c.cohort_week) / 7 AS weeks_after
  FROM public.plant_logs pl
  JOIN cohorts c ON c.user_id = pl.user_id
)
SELECT
  cohort_week,
  COUNT(DISTINCT user_id)                                              AS cohort_size,
  COUNT(DISTINCT user_id) FILTER (WHERE weeks_after = 0)              AS week_0,
  COUNT(DISTINCT user_id) FILTER (WHERE weeks_after = 1)              AS week_1,
  COUNT(DISTINCT user_id) FILTER (WHERE weeks_after = 2)              AS week_2,
  COUNT(DISTINCT user_id) FILTER (WHERE weeks_after = 4)              AS week_4,
  ROUND(100.0 * COUNT(DISTINCT user_id) FILTER (WHERE weeks_after = 1) / NULLIF(COUNT(DISTINCT user_id) FILTER (WHERE weeks_after = 0), 0), 1) AS w1_retention_pct,
  ROUND(100.0 * COUNT(DISTINCT user_id) FILTER (WHERE weeks_after = 4) / NULLIF(COUNT(DISTINCT user_id) FILTER (WHERE weeks_after = 0), 0), 1) AS w4_retention_pct
FROM activity
GROUP BY cohort_week
ORDER BY cohort_week;

-- ─── Logging frequency (how many days per week users log) ────────────────────

CREATE OR REPLACE VIEW analytics.logging_frequency AS
SELECT
  days_logged_per_week,
  COUNT(*) AS users
FROM (
  SELECT
    user_id,
    date_trunc('week', logged_on)::date AS week_start,
    COUNT(DISTINCT logged_on)           AS days_logged_per_week
  FROM public.plant_logs
  GROUP BY user_id, week_start
) w
GROUP BY days_logged_per_week
ORDER BY days_logged_per_week;
