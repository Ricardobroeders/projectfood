-- 0025_recipe_batches.sql
-- Stores AI-generated recipe batches per user per week.
-- Each batch is generated from a user-selected set of shopping picks.

create table recipe_batches (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users not null,
  week_start      date not null,
  selected_plants text[] not null default '{}',
  recipes         jsonb not null default '[]'::jsonb,
  created_at      timestamptz default now()
);

alter table recipe_batches enable row level security;

create policy "users read own recipe_batches"
  on recipe_batches for select
  using (auth.uid() = user_id);

create policy "users insert own recipe_batches"
  on recipe_batches for insert
  with check (auth.uid() = user_id);
