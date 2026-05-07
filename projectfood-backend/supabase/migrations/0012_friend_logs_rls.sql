-- Allow authenticated users to read plant_logs of their accepted friends
CREATE POLICY "plant_logs_select_friends"
  ON plant_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM friendships
      WHERE status = 'accepted'
      AND (
        (requester = auth.uid() AND addressee = plant_logs.user_id)
        OR (addressee = auth.uid() AND requester = plant_logs.user_id)
      )
    )
  );

-- Public profile stats for any logged-in user (security definer bypasses RLS)
CREATE OR REPLACE FUNCTION user_profile(p_username TEXT)
RETURNS TABLE (user_id UUID, username TEXT, total_plants BIGINT, week_count BIGINT, streak BIGINT)
LANGUAGE sql SECURITY DEFINER AS $$
  WITH target AS (
    SELECT us.user_id, us.username
    FROM user_settings us
    WHERE us.username = p_username
    LIMIT 1
  ),
  week_start AS (
    SELECT date_trunc('week', CURRENT_DATE)::date AS ws
  )
  SELECT
    t.user_id,
    t.username,
    COUNT(DISTINCT pl.plant_id) AS total_plants,
    COUNT(DISTINCT pl.plant_id) FILTER (WHERE pl.logged_on >= (SELECT ws FROM week_start)) AS week_count,
    COUNT(DISTINCT pl.logged_on) FILTER (WHERE pl.logged_on >= CURRENT_DATE - 29) AS streak
  FROM target t
  LEFT JOIN plant_logs pl ON pl.user_id = t.user_id
  GROUP BY t.user_id, t.username;
$$;
