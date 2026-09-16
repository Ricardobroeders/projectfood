-- 0004 achievement unlocks (stamps; per member or household-level) and lightweight event instrumentation.

create table public.achievement_unlocks (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  -- null = household-level stamp
  member_id uuid references public.household_members(id) on delete cascade,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  -- null = not yet shown to the family; replayed on the next open
  seen_at timestamptz
);
create unique index achievement_unlocks_uniq on public.achievement_unlocks
  (household_id, coalesce(member_id, '00000000-0000-0000-0000-000000000000'::uuid), achievement_id);
alter table public.achievement_unlocks enable row level security;
create policy au_all on public.achievement_unlocks for all to authenticated
  using (public.is_household_member(household_id)) with check (public.is_household_member(household_id));

create table public.app_events (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  household_id uuid,
  name text not null,
  props jsonb not null default '{}'::jsonb,
  client_ts timestamptz,
  created_at timestamptz not null default now()
);
create index idx_app_events_name on public.app_events (name, created_at desc);
alter table public.app_events enable row level security;
create policy ev_insert on public.app_events for insert to authenticated with check (user_id = auth.uid());
