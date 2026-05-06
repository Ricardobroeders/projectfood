-- 0002_rls.sql
-- Row-Level Security policies for all tables

alter table plants            enable row level security;
alter table user_settings     enable row level security;
alter table plant_logs        enable row level security;
alter table plant_submissions enable row level security;

-- plants: any authenticated user can read active plants; no client writes
create policy "plants_select_active"
  on plants for select
  to authenticated
  using (is_active = true);

-- user_settings: users can read and update only their own row
create policy "user_settings_select_own"
  on user_settings for select
  to authenticated
  using (user_id = auth.uid());

create policy "user_settings_update_own"
  on user_settings for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- plant_logs: users can select, insert, and delete their own rows
-- No UPDATE: logs are immutable; fix mistakes by delete + re-insert
create policy "plant_logs_select_own"
  on plant_logs for select
  to authenticated
  using (user_id = auth.uid());

create policy "plant_logs_insert_own"
  on plant_logs for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "plant_logs_delete_own"
  on plant_logs for delete
  to authenticated
  using (user_id = auth.uid());

-- plant_submissions: users can insert and select their own; admin reviews via service role
create policy "plant_submissions_insert_own"
  on plant_submissions for insert
  to authenticated
  with check (submitted_by = auth.uid());

create policy "plant_submissions_select_own"
  on plant_submissions for select
  to authenticated
  using (submitted_by = auth.uid());
