CREATE OR REPLACE FUNCTION public.user_weekly_history(
  p_username TEXT,
  p_weeks    INT DEFAULT 10
)
RETURNS TABLE (week_start DATE, variety INT)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  WITH target AS (
    SELECT user_id FROM user_settings WHERE username = p_username LIMIT 1
  ),
  week_starts AS (
    SELECT (date_trunc('week', CURRENT_DATE) - (gs * interval '1 week'))::date AS ws
    FROM generate_series(0, p_weeks - 1) AS gs
  )
  SELECT
    ws.ws                            AS week_start,
    COUNT(DISTINCT pl.plant_id)::int AS variety
  FROM week_starts ws
  LEFT JOIN plant_logs pl
    ON  pl.user_id   = (SELECT user_id FROM target)
    AND pl.logged_on >= ws.ws
    AND pl.logged_on <= ws.ws + 6
  GROUP BY ws.ws
  ORDER BY ws.ws ASC;
$$;
