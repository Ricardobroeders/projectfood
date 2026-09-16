-- 0007 account deletion must not be blocked by legacy tables.
alter table public.weekly_advice drop constraint weekly_advice_user_id_fkey,
  add constraint weekly_advice_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.recipe_batches drop constraint recipe_batches_user_id_fkey,
  add constraint recipe_batches_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.plant_submissions drop constraint plant_submissions_reviewed_by_fkey,
  add constraint plant_submissions_reviewed_by_fkey foreign key (reviewed_by) references auth.users(id) on delete set null;
