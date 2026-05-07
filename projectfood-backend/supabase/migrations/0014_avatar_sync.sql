-- Store avatar URL in user_settings so it's queryable from any RPC
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Trigger: keep avatar_url in sync whenever Google re-issues the picture
CREATE OR REPLACE FUNCTION public.sync_user_avatar_url()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  UPDATE public.user_settings
  SET avatar_url = NEW.raw_user_meta_data->>'avatar_url'
  WHERE user_id = NEW.id
    AND NEW.raw_user_meta_data->>'avatar_url' IS NOT NULL;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_avatar_sync ON auth.users;
CREATE TRIGGER on_auth_user_avatar_sync
  AFTER INSERT OR UPDATE OF raw_user_meta_data ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_avatar_url();

-- Backfill existing users
UPDATE public.user_settings us
SET avatar_url = au.raw_user_meta_data->>'avatar_url'
FROM auth.users au
WHERE au.id = us.user_id
  AND au.raw_user_meta_data->>'avatar_url' IS NOT NULL
  AND us.avatar_url IS NULL;

-- ============================================================
-- Recreate all RPCs that return username to also return avatar_url
-- ============================================================

-- leaderboard (global plants)
DROP FUNCTION IF EXISTS leaderboard(int);
CREATE FUNCTION leaderboard(p_limit int DEFAULT 10)
RETURNS TABLE (rank int, username text, unique_plants int, is_me boolean, avatar_url text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH ranked AS (
    SELECT
      us.username,
      us.avatar_url,
      COUNT(DISTINCT l.plant_id)::int AS unique_plants,
      RANK() OVER (ORDER BY COUNT(DISTINCT l.plant_id) DESC)::int AS rank,
      us.user_id = auth.uid() AS is_me
    FROM plant_logs l
    JOIN user_settings us ON us.user_id = l.user_id
    WHERE us.username IS NOT NULL
    GROUP BY us.user_id, us.username, us.avatar_url
  )
  SELECT rank, username, unique_plants, is_me, avatar_url
  FROM ranked ORDER BY rank LIMIT p_limit;
$$;
GRANT EXECUTE ON FUNCTION leaderboard(int) TO authenticated;

-- leaderboard_streaks (global streaks)
DROP FUNCTION IF EXISTS leaderboard_streaks(int);
CREATE FUNCTION leaderboard_streaks(p_limit int DEFAULT 10)
RETURNS TABLE (rank int, username text, streak int, is_me boolean, avatar_url text)
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
      COALESCE(s.streak_len, 0) AS streak,
      RANK() OVER (ORDER BY COALESCE(s.streak_len, 0) DESC)::int AS rank,
      us.user_id = auth.uid() AS is_me
    FROM user_settings us
    LEFT JOIN active_streaks s ON s.user_id = us.user_id
    WHERE us.username IS NOT NULL AND COALESCE(s.streak_len, 0) > 0
  )
  SELECT rank, username, streak, is_me, avatar_url
  FROM ranked ORDER BY rank LIMIT p_limit;
$$;
GRANT EXECUTE ON FUNCTION leaderboard_streaks(int) TO authenticated;

-- leaderboard_friends (friends plants)
DROP FUNCTION IF EXISTS leaderboard_friends(int);
CREATE FUNCTION leaderboard_friends(p_limit INT DEFAULT 15)
RETURNS TABLE (rank BIGINT, user_id UUID, username TEXT, unique_plants BIGINT, is_me BOOLEAN, avatar_url TEXT)
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
    us.avatar_url
  FROM user_settings us
  JOIN friends f ON us.user_id = f.fid
  LEFT JOIN plant_logs pl ON pl.user_id = us.user_id
  WHERE us.username IS NOT NULL
  GROUP BY us.user_id, us.username, us.avatar_url
  ORDER BY unique_plants DESC LIMIT p_limit;
$$;

-- leaderboard_friends_streaks (friends streaks)
DROP FUNCTION IF EXISTS leaderboard_friends_streaks(int);
CREATE FUNCTION leaderboard_friends_streaks(p_limit INT DEFAULT 15)
RETURNS TABLE (rank BIGINT, user_id UUID, username TEXT, streak BIGINT, is_me BOOLEAN, avatar_url TEXT)
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
    us.avatar_url
  FROM user_settings us
  JOIN friends f ON us.user_id = f.fid
  LEFT JOIN streaks s ON s.user_id = us.user_id
  WHERE us.username IS NOT NULL
  ORDER BY streak DESC LIMIT p_limit;
$$;

-- social_friends
DROP FUNCTION IF EXISTS social_friends();
CREATE FUNCTION social_friends()
RETURNS TABLE (user_id UUID, username TEXT, week_count BIGINT, day_streak BIGINT, avatar_url TEXT)
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
    us.avatar_url
  FROM user_settings us
  JOIN friend_ids fi ON us.user_id = fi.fid
  LEFT JOIN plant_logs pl ON pl.user_id = us.user_id
  LEFT JOIN day_streaks ds ON ds.user_id = us.user_id
  WHERE us.username IS NOT NULL
  GROUP BY us.user_id, us.username, us.avatar_url, ds.day_streak
  ORDER BY week_count DESC;
$$;

-- pending_requests
DROP FUNCTION IF EXISTS pending_requests();
CREATE FUNCTION pending_requests()
RETURNS TABLE (id UUID, type TEXT, other_user_id UUID, username TEXT, avatar_url TEXT)
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT f.id, 'incoming'::TEXT, f.requester, us.username, us.avatar_url
  FROM friendships f JOIN user_settings us ON us.user_id = f.requester
  WHERE f.addressee = auth.uid() AND f.status = 'pending'
  UNION ALL
  SELECT f.id, 'outgoing'::TEXT, f.addressee, us.username, us.avatar_url
  FROM friendships f JOIN user_settings us ON us.user_id = f.addressee
  WHERE f.requester = auth.uid() AND f.status = 'pending';
$$;

-- search_users
DROP FUNCTION IF EXISTS search_users(TEXT);
CREATE FUNCTION search_users(p_query TEXT)
RETURNS TABLE (user_id UUID, username TEXT, total_plants BIGINT, avatar_url TEXT)
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT us.user_id, us.username, COUNT(DISTINCT pl.plant_id) AS total_plants, us.avatar_url
  FROM user_settings us
  LEFT JOIN plant_logs pl ON pl.user_id = us.user_id
  WHERE us.username ILIKE '%' || p_query || '%'
    AND us.user_id != auth.uid()
    AND us.username IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM friendships f
      WHERE (f.requester = auth.uid() AND f.addressee = us.user_id)
         OR (f.addressee = auth.uid() AND f.requester = us.user_id)
    )
  GROUP BY us.user_id, us.username, us.avatar_url
  ORDER BY us.username LIMIT 20;
$$;

-- user_profile (drop again to add avatar_url to the return type)
DROP FUNCTION IF EXISTS user_profile(TEXT);
CREATE FUNCTION user_profile(p_username TEXT)
RETURNS TABLE (user_id UUID, username TEXT, total_plants BIGINT, week_count BIGINT, streak BIGINT, longest_streak_days INT, active_border TEXT, avatar_url TEXT)
LANGUAGE sql SECURITY DEFINER AS $$
  WITH target AS (
    SELECT us.user_id, us.username, us.active_border, us.avatar_url
    FROM user_settings us WHERE us.username = p_username LIMIT 1
  ),
  week_start AS (SELECT date_trunc('week', CURRENT_DATE)::date AS ws),
  user_days AS (
    SELECT DISTINCT pl.logged_on FROM plant_logs pl
    WHERE pl.user_id = (SELECT user_id FROM target)
  ),
  numbered AS (
    SELECT logged_on, logged_on - ROW_NUMBER() OVER (ORDER BY logged_on)::int AS grp FROM user_days
  ),
  islands AS (SELECT COUNT(*)::int AS streak_len FROM numbered GROUP BY grp)
  SELECT
    t.user_id, t.username,
    COUNT(DISTINCT pl.plant_id) AS total_plants,
    COUNT(DISTINCT pl.plant_id) FILTER (WHERE pl.logged_on >= (SELECT ws FROM week_start)) AS week_count,
    COUNT(DISTINCT pl.logged_on) FILTER (WHERE pl.logged_on >= CURRENT_DATE - 29) AS streak,
    (SELECT COALESCE(MAX(streak_len), 0) FROM islands) AS longest_streak_days,
    t.active_border,
    t.avatar_url
  FROM target t
  LEFT JOIN plant_logs pl ON pl.user_id = t.user_id
  GROUP BY t.user_id, t.username, t.active_border, t.avatar_url;
$$;
