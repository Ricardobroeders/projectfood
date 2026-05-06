-- Friendship graph
CREATE TABLE friendships (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  addressee   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status      TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (requester, addressee),
  CHECK (requester <> addressee)
);

ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users see own friendships"
  ON friendships FOR SELECT
  USING (auth.uid() = requester OR auth.uid() = addressee);

CREATE POLICY "users can request friends"
  ON friendships FOR INSERT
  WITH CHECK (auth.uid() = requester);

CREATE POLICY "addressee can update status"
  ON friendships FOR UPDATE
  USING (auth.uid() = addressee AND status = 'pending');

CREATE POLICY "users can delete own requests"
  ON friendships FOR DELETE
  USING (auth.uid() = requester OR auth.uid() = addressee);

-- Search users by username (excludes self + any existing friendship row)
CREATE OR REPLACE FUNCTION search_users(p_query TEXT)
RETURNS TABLE (user_id UUID, username TEXT, total_plants BIGINT)
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT us.user_id, us.username, COUNT(DISTINCT pl.plant_id) AS total_plants
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
  GROUP BY us.user_id, us.username
  ORDER BY us.username
  LIMIT 20;
$$;

-- Pending requests with usernames (incoming + outgoing)
CREATE OR REPLACE FUNCTION pending_requests()
RETURNS TABLE (id UUID, type TEXT, other_user_id UUID, username TEXT)
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT f.id, 'incoming'::TEXT, f.requester, us.username
  FROM friendships f
  JOIN user_settings us ON us.user_id = f.requester
  WHERE f.addressee = auth.uid() AND f.status = 'pending'
  UNION ALL
  SELECT f.id, 'outgoing'::TEXT, f.addressee, us.username
  FROM friendships f
  JOIN user_settings us ON us.user_id = f.addressee
  WHERE f.requester = auth.uid() AND f.status = 'pending';
$$;

-- Friends list with current week plant count + day streak (last 7 days)
CREATE OR REPLACE FUNCTION social_friends()
RETURNS TABLE (user_id UUID, username TEXT, week_count BIGINT, day_streak BIGINT)
LANGUAGE sql SECURITY DEFINER AS $$
  WITH friend_ids AS (
    SELECT addressee AS fid FROM friendships WHERE requester = auth.uid() AND status = 'accepted'
    UNION
    SELECT requester AS fid FROM friendships WHERE addressee = auth.uid() AND status = 'accepted'
  ),
  week_start AS (
    SELECT date_trunc('week', CURRENT_DATE)::date AS ws
  ),
  day_streaks AS (
    SELECT pl.user_id,
      COUNT(DISTINCT pl.logged_on) FILTER (WHERE pl.logged_on >= CURRENT_DATE - 6) AS day_streak
    FROM plant_logs pl
    JOIN friend_ids fi ON pl.user_id = fi.fid
    GROUP BY pl.user_id
  )
  SELECT
    us.user_id,
    us.username,
    COUNT(DISTINCT pl.plant_id) FILTER (WHERE pl.logged_on >= (SELECT ws FROM week_start)) AS week_count,
    COALESCE(ds.day_streak, 0) AS day_streak
  FROM user_settings us
  JOIN friend_ids fi ON us.user_id = fi.fid
  LEFT JOIN plant_logs pl ON pl.user_id = us.user_id
  LEFT JOIN day_streaks ds ON ds.user_id = us.user_id
  WHERE us.username IS NOT NULL
  GROUP BY us.user_id, us.username, ds.day_streak
  ORDER BY week_count DESC;
$$;
