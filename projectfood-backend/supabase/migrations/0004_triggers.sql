-- 0004_triggers.sql
-- Triggers: updated_at maintenance and new-user bootstrap

-- Generic updated_at setter (reusable)
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger trg_user_settings_updated_at
  before update on user_settings
  for each row execute function set_updated_at();

-- Auto-create user_settings row on signup
-- Decision: default timezone = 'UTC'; the client updates it on first launch
-- using the device locale. Week starts Monday (1) per ISO 8601.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into user_settings (user_id, timezone)
  values (new.id, 'UTC')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
