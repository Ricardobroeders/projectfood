-- 0026_weekly_advice_update_policy.sql
-- Allow users to update their own weekly_advice rows so enriched advice
-- (with category, meal_context, image_url on suggestions) can overwrite
-- old rows that were generated with an earlier prompt format.

create policy "users update own weekly_advice"
  on weekly_advice for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
