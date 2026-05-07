-- Border cosmetics on user_settings
ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS unlocked_borders TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS active_border TEXT DEFAULT 'default';

-- Achievement stats for the logged-in user (used on Account page)
CREATE OR REPLACE FUNCTION user_achievements_stats(p_user_id UUID DEFAULT auth.uid())
RETURNS TABLE (total_plants BIGINT, current_streak_days INT, longest_streak_days INT)
LANGUAGE sql SECURITY DEFINER AS $$
  WITH user_days AS (
    SELECT DISTINCT logged_on
    FROM plant_logs
    WHERE user_id = p_user_id
  ),
  numbered AS (
    SELECT logged_on,
           logged_on - (ROW_NUMBER() OVER (ORDER BY logged_on))::int AS grp
    FROM user_days
  ),
  islands AS (
    SELECT COUNT(*)::int AS streak_len
    FROM numbered
    GROUP BY grp
  )
  SELECT
    (SELECT COUNT(DISTINCT plant_id) FROM plant_logs WHERE user_id = p_user_id),
    current_streak(p_user_id),
    (SELECT COALESCE(MAX(streak_len), 0) FROM islands);
$$;

-- Extend user_profile to include longest_streak_days and active_border
-- Drop first because return type changes
DROP FUNCTION IF EXISTS user_profile(TEXT);
CREATE FUNCTION user_profile(p_username TEXT)
RETURNS TABLE (user_id UUID, username TEXT, total_plants BIGINT, week_count BIGINT, streak BIGINT, longest_streak_days INT, active_border TEXT)
LANGUAGE sql SECURITY DEFINER AS $$
  WITH target AS (
    SELECT us.user_id, us.username, us.active_border
    FROM user_settings us
    WHERE us.username = p_username
    LIMIT 1
  ),
  week_start AS (
    SELECT date_trunc('week', CURRENT_DATE)::date AS ws
  ),
  user_days AS (
    SELECT DISTINCT pl.logged_on
    FROM plant_logs pl
    WHERE pl.user_id = (SELECT user_id FROM target)
  ),
  numbered AS (
    SELECT logged_on,
           logged_on - (ROW_NUMBER() OVER (ORDER BY logged_on))::int AS grp
    FROM user_days
  ),
  islands AS (
    SELECT COUNT(*)::int AS streak_len
    FROM numbered
    GROUP BY grp
  )
  SELECT
    t.user_id,
    t.username,
    COUNT(DISTINCT pl.plant_id) AS total_plants,
    COUNT(DISTINCT pl.plant_id) FILTER (WHERE pl.logged_on >= (SELECT ws FROM week_start)) AS week_count,
    COUNT(DISTINCT pl.logged_on) FILTER (WHERE pl.logged_on >= CURRENT_DATE - 29) AS streak,
    (SELECT COALESCE(MAX(streak_len), 0) FROM islands) AS longest_streak_days,
    t.active_border
  FROM target t
  LEFT JOIN plant_logs pl ON pl.user_id = t.user_id
  GROUP BY t.user_id, t.username, t.active_border;
$$;
