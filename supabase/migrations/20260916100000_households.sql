-- 0001 households: household -> users -> members (family-mode data model, KB decision D3).
-- One auth user (the parent) owns a household; members are the people who taste (kid/adult).

create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'My family' check (char_length(name) between 1 and 40),
  created_by uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'family')),
  dinner_time time not null default '18:00',
  timezone text not null default 'Europe/Amsterdam',
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_households_updated_at before update on public.households
  for each row execute function public.set_updated_at();

create table public.household_users (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'parent')),
  joined_at timestamptz not null default now(),
  primary key (household_id, user_id),
  -- one household per user in this release; drop for multi-household later
  unique (user_id)
);

create table public.household_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  -- the adult who *is* an account; legacy PWA writes land on this member
  user_id uuid unique references auth.users(id) on delete set null,
  name text not null check (char_length(name) between 1 and 20),
  kind text not null check (kind in ('kid', 'adult')),
  color_index int not null default 0 check (color_index between 0 and 7),
  avatar_image text,
  avatar_bg text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  -- soft remove: logs keep pointing here
  archived_at timestamptz
);
create index idx_household_members_active on public.household_members (household_id) where archived_at is null;

-- RLS helpers -------------------------------------------------------------
create or replace function public.is_household_member(hid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from household_users where household_id = hid and user_id = auth.uid());
$$;

create or replace function public.my_household_id() returns uuid
language sql stable security definer set search_path = public as $$
  select household_id from household_users where user_id = auth.uid() order by joined_at limit 1;
$$;

alter table public.households enable row level security;
alter table public.household_users enable row level security;
alter table public.household_members enable row level security;

create policy hh_select on public.households for select to authenticated
  using (public.is_household_member(id));
create policy hh_update on public.households for update to authenticated
  using (public.is_household_member(id)) with check (public.is_household_member(id));

create policy hu_select on public.household_users for select to authenticated
  using (user_id = auth.uid() or public.is_household_member(household_id));

create policy hm_select on public.household_members for select to authenticated
  using (public.is_household_member(household_id));
create policy hm_insert on public.household_members for insert to authenticated
  with check (public.is_household_member(household_id) and (user_id is null or user_id = auth.uid()));
create policy hm_update on public.household_members for update to authenticated
  using (public.is_household_member(household_id))
  with check (public.is_household_member(household_id) and (user_id is null or user_id = auth.uid()));
-- no client insert on households/household_users and no deletes anywhere: trigger + Edge Function only
