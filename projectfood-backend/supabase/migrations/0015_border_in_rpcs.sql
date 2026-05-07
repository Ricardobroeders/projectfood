-- Add active_border to all user-returning RPCs so friends' borders show everywhere
-- Also migrate 'green' → 'silver' border rename

-- Data migration: rename 'green' → 'silver'
UPDATE user_settings
SET unlocked_borders = array_replace(unlocked_borders, 'green', 'silver')
WHERE 'green' = ANY(unlocked_borders);

UPDATE user_settings
SET active_border = 'silver'
WHERE active_border = 'green';

-- leaderboard (global plants)
DROP FUNCTION IF EXISTS leaderboard(int);
CREATE FUNCTION leaderboard(p_limit int DEFAULT 10)
RETURNS TABLE (rank int, username text, unique_plants int, is_me boolean, avatar_url text, active_border text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH ranked AS (
    SELECT
      us.username,
      us.avatar_url,
      us.active_border,
      COUNT(DISTINCT l.plant_id)::int AS unique_plants,
      RANK() OVER (ORDER BY COUNT(DISTINCT l.plant_id) DESC)::int AS rank,
      us.user_id = auth.uid() AS is_me
    FROM plant_logs l
    JOIN user_settings us ON us.user_id = l.user_id
    WHERE us.username IS NOT NULL
    GROUP BY us.user_id, us.username, us.avatar_url, us.active_border
  )
  SELECT rank, username, unique_plants, is_me, avatar_url, active_border
  FROM ranked ORDER BY rank LIMIT p_limit;
$$;
GRANT EXECUTE ON FUNCTION leaderboard(int) TO authenticated;

-- leaderboard_streaks (global streaks)
DROP FUNCTION IF EXISTS leaderboard_streaks(int);
CREATE FUNCTION leaderboard_streaks(p_limit int DEFAULT 10)
RETURNS TABLE (rank int, username text, streak int, is_me boolean, avatar_url text, active_border text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH all_days AS (
    SELECT DISTINCT user_id, logged_on FROM plant_logs WHERE logged_on <= CURRENT_DATE
  ),
  numbered AS (
    SELECT user_id, logged_on,
           logged_on - ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY logged_on)::int AS island_key
    FROM all_days
  ),
  islands AS (
    SELECT user_id, MAX(logged_on) AS last_day, COUNT(*)::int AS streak_len
    FROM numbered GROUP BY user_id, island_key
  ),
  active_streaks AS (
    SELECT user_id, streak_len FROM islands WHERE last_day >= CURRENT_DATE - 1
  ),
  ranked AS (
    SELECT
      us.username,
      us.avatar_url,
      us.active_border,
      COALESCE(s.streak_len, 0) AS streak,
      RANK() OVER (ORDER BY COALESCE(s.streak_len, 0) DESC)::int AS rank,
      us.user_id = auth.uid() AS is_me
    FROM user_settings us
    LEFT JOIN active_streaks s ON s.user_id = us.user_id
    WHERE us.username IS NOT NULL AND COALESCE(s.streak_len, 0) > 0
  )
  SELECT rank, username, streak, is_me, avatar_url, active_border
  FROM ranked ORDER BY rank LIMIT p_limit;
$$;
GRANT EXECUTE ON FUNCTION leaderboard_streaks(int) TO authenticated;

-- leaderboard_friends (friends plants)
DROP FUNCTION IF EXISTS leaderboard_friends(int);
CREATE FUNCTION leaderboard_friends(p_limit INT DEFAULT 15)
RETURNS TABLE (rank BIGINT, user_id UUID, username TEXT, unique_plants BIGINT, is_me BOOLEAN, avatar_url TEXT, active_border TEXT)
LANGUAGE sql SECURITY DEFINER AS $$
  WITH friends AS (
    SELECT addressee AS fid FROM friendships WHERE requester = auth.uid() AND status = 'accepted'
    UNION SELECT requester FROM friendships WHERE addressee = auth.uid() AND status = 'accepted'
    UNION SELECT auth.uid()
  )
  SELECT
    RANK() OVER (ORDER BY COUNT(DISTINCT pl.plant_id) DESC),
    us.user_id, us.username,
    COUNT(DISTINCT pl.plant_id) AS unique_plants,
    us.user_id = auth.uid() AS is_me,
    us.avatar_url,
    us.active_border
  FROM user_settings us
  JOIN friends f ON us.user_id = f.fid
  LEFT JOIN plant_logs pl ON pl.user_id = us.user_id
  WHERE us.username IS NOT NULL
  GROUP BY us.user_id, us.username, us.avatar_url, us.active_border
  ORDER BY unique_plants DESC LIMIT p_limit;
$$;
GRANT EXECUTE ON FUNCTION leaderboard_friends(int) TO authenticated;

-- leaderboard_friends_streaks (friends streaks)
DROP FUNCTION IF EXISTS leaderboard_friends_streaks(int);
CREATE FUNCTION leaderboard_friends_streaks(p_limit INT DEFAULT 15)
RETURNS TABLE (rank BIGINT, user_id UUID, username TEXT, streak BIGINT, is_me BOOLEAN, avatar_url TEXT, active_border TEXT)
LANGUAGE sql SECURITY DEFINER AS $$
  WITH friends AS (
    SELECT addressee AS fid FROM friendships WHERE requester = auth.uid() AND status = 'accepted'
    UNION SELECT requester FROM friendships WHERE addressee = auth.uid() AND status = 'accepted'
    UNION SELECT auth.uid()
  ),
  streaks AS (
    SELECT pl.user_id,
           COUNT(DISTINCT pl.logged_on) FILTER (WHERE pl.logged_on >= CURRENT_DATE - 29) AS streak
    FROM plant_logs pl JOIN friends f ON pl.user_id = f.fid GROUP BY pl.user_id
  )
  SELECT
    RANK() OVER (ORDER BY COALESCE(s.streak, 0) DESC),
    us.user_id, us.username,
    COALESCE(s.streak, 0) AS streak,
    us.user_id = auth.uid() AS is_me,
    us.avatar_url,
    us.active_border
  FROM user_settings us
  JOIN friends f ON us.user_id = f.fid
  LEFT JOIN streaks s ON s.user_id = us.user_id
  WHERE us.username IS NOT NULL
  ORDER BY streak DESC LIMIT p_limit;
$$;
GRANT EXECUTE ON FUNCTION leaderboard_friends_streaks(int) TO authenticated;

-- social_friends
DROP FUNCTION IF EXISTS social_friends();
CREATE FUNCTION social_friends()
RETURNS TABLE (user_id UUID, username TEXT, week_count BIGINT, day_streak BIGINT, avatar_url TEXT, active_border TEXT)
LANGUAGE sql SECURITY DEFINER AS $$
  WITH friend_ids AS (
    SELECT addressee AS fid FROM friendships WHERE requester = auth.uid() AND status = 'accepted'
    UNION SELECT requester AS fid FROM friendships WHERE addressee = auth.uid() AND status = 'accepted'
  ),
  week_start AS (SELECT date_trunc('week', CURRENT_DATE)::date AS ws),
  day_streaks AS (
    SELECT pl.user_id,
           COUNT(DISTINCT pl.logged_on) FILTER (WHERE pl.logged_on >= CURRENT_DATE - 6) AS day_streak
    FROM plant_logs pl JOIN friend_ids fi ON pl.user_id = fi.fid GROUP BY pl.user_id
  )
  SELECT
    us.user_id, us.username,
    COUNT(DISTINCT pl.plant_id) FILTER (WHERE pl.logged_on >= (SELECT ws FROM week_start)) AS week_count,
    COALESCE(ds.day_streak, 0) AS day_streak,
    us.avatar_url,
    us.active_border
  FROM user_settings us
  JOIN friend_ids fi ON us.user_id = fi.fid
  LEFT JOIN plant_logs pl ON pl.user_id = us.user_id
  LEFT JOIN day_streaks ds ON ds.user_id = us.user_id
  WHERE us.username IS NOT NULL
  GROUP BY us.user_id, us.username, us.avatar_url, us.active_border, ds.day_streak
  ORDER BY week_count DESC;
$$;
GRANT EXECUTE ON FUNCTION social_friends() TO authenticated;

-- pending_requests
DROP FUNCTION IF EXISTS pending_requests();
CREATE FUNCTION pending_requests()
RETURNS TABLE (id UUID, type TEXT, other_user_id UUID, username TEXT, avatar_url TEXT, active_border TEXT)
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT f.id, 'incoming'::TEXT, f.requester, us.username, us.avatar_url, us.active_border
  FROM friendships f JOIN user_settings us ON us.user_id = f.requester
  WHERE f.addressee = auth.uid() AND f.status = 'pending'
  UNION ALL
  SELECT f.id, 'outgoing'::TEXT, f.addressee, us.username, us.avatar_url, us.active_border
  FROM friendships f JOIN user_settings us ON us.user_id = f.addressee
  WHERE f.requester = auth.uid() AND f.status = 'pending';
$$;
GRANT EXECUTE ON FUNCTION pending_requests() TO authenticated;
