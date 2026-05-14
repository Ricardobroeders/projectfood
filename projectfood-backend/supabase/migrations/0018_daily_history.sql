CREATE OR REPLACE FUNCTION public.user_daily_history(
  p_username TEXT,
  p_days     INT DEFAULT 30
)
RETURNS TABLE (date DATE, variety INT)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  WITH target AS (
    SELECT user_id FROM user_settings WHERE username = p_username LIMIT 1
  ),
  days AS (
    SELECT (CURRENT_DATE - gs)::date AS d
    FROM generate_series(0, p_days - 1) AS gs
  )
  SELECT
    days.d                           AS date,
    COUNT(DISTINCT pl.plant_id)::int AS variety
  FROM days
  LEFT JOIN plant_logs pl
    ON  pl.user_id   = (SELECT user_id FROM target)
    AND pl.logged_on = days.d
  GROUP BY days.d
  ORDER BY days.d ASC;
$$;

CREATE OR REPLACE FUNCTION public.daily_history(
  p_user_id UUID DEFAULT auth.uid(),
  p_days    INT  DEFAULT 30
)
RETURNS TABLE (date DATE, variety INT)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  WITH days AS (
    SELECT (CURRENT_DATE - gs)::date AS d
    FROM generate_series(0, p_days - 1) AS gs
  )
  SELECT
    days.d                           AS date,
    COUNT(DISTINCT pl.plant_id)::int AS variety
  FROM days
  LEFT JOIN plant_logs pl
    ON  pl.user_id   = p_user_id
    AND pl.logged_on = days.d
  GROUP BY days.d
  ORDER BY days.d ASC;
$$;
