-- Friend leaderboard: most unique plants (includes self)
CREATE OR REPLACE FUNCTION leaderboard_friends(p_limit INT DEFAULT 15)
RETURNS TABLE (rank BIGINT, user_id UUID, username TEXT, unique_plants BIGINT, is_me BOOLEAN)
LANGUAGE sql SECURITY DEFINER AS $$
  WITH friends AS (
    SELECT addressee AS fid FROM friendships WHERE requester = auth.uid() AND status = 'accepted'
    UNION
    SELECT requester AS fid FROM friendships WHERE addressee = auth.uid() AND status = 'accepted'
    UNION
    SELECT auth.uid()
  )
  SELECT
    RANK() OVER (ORDER BY COUNT(DISTINCT pl.plant_id) DESC) AS rank,
    us.user_id,
    us.username,
    COUNT(DISTINCT pl.plant_id) AS unique_plants,
    us.user_id = auth.uid() AS is_me
  FROM user_settings us
  JOIN friends f ON us.user_id = f.fid
  LEFT JOIN plant_logs pl ON pl.user_id = us.user_id
  WHERE us.username IS NOT NULL
  GROUP BY us.user_id, us.username
  ORDER BY unique_plants DESC
  LIMIT p_limit;
$$;

-- Friend leaderboard: current streak (days logged in last 30 days)
CREATE OR REPLACE FUNCTION leaderboard_friends_streaks(p_limit INT DEFAULT 15)
RETURNS TABLE (rank BIGINT, user_id UUID, username TEXT, streak BIGINT, is_me BOOLEAN)
LANGUAGE sql SECURITY DEFINER AS $$
  WITH friends AS (
    SELECT addressee AS fid FROM friendships WHERE requester = auth.uid() AND status = 'accepted'
    UNION
    SELECT requester AS fid FROM friendships WHERE addressee = auth.uid() AND status = 'accepted'
    UNION
    SELECT auth.uid()
  ),
  streaks AS (
    SELECT pl.user_id,
      COUNT(DISTINCT pl.logged_on) FILTER (WHERE pl.logged_on >= CURRENT_DATE - 29) AS streak
    FROM plant_logs pl
    JOIN friends f ON pl.user_id = f.fid
    GROUP BY pl.user_id
  )
  SELECT
    RANK() OVER (ORDER BY COALESCE(s.streak, 0) DESC) AS rank,
    us.user_id,
    us.username,
    COALESCE(s.streak, 0) AS streak,
    us.user_id = auth.uid() AS is_me
  FROM user_settings us
  JOIN friends f ON us.user_id = f.fid
  LEFT JOIN streaks s ON s.user_id = us.user_id
  WHERE us.username IS NOT NULL
  ORDER BY streak DESC
  LIMIT p_limit;
$$;
