-- 0007_weekly_advice.sql
-- Stores AI-generated grocery advice per user per week.
-- Generated once when the user logs their 30th unique plant of the week.

create table weekly_advice (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  week_start  date not null,
  advice      jsonb not null,
  created_at  timestamptz default now(),
  unique(user_id, week_start)
);

alter table weekly_advice enable row level security;

create policy "users read own advice"
  on weekly_advice for select
  using (auth.uid() = user_id);

create policy "users insert own advice"
  on weekly_advice for insert
  with check (auth.uid() = user_id);
