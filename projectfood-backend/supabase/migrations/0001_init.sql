-- 0001_init.sql
-- Core schema: enums, tables, indexes, constraints

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- Enums
create type plant_category as enum (
  'fruit',
  'vegetable',
  'herb',
  'nut_seed',
  'legume',
  'whole_grain'
);

create type plant_color as enum (
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'white',
  'brown'
);

create type submission_status as enum (
  'pending',
  'approved',
  'rejected',
  'duplicate'
);

-- plants: master catalog, publicly readable by authenticated users
create table plants (
  id               uuid        primary key default gen_random_uuid(),
  slug             text        unique not null,
  name             text        not null,
  emoji            text,
  image_url        text,
  category         plant_category not null,
  subcategory      text,
  color            plant_color,
  botanical_family text,
  is_seasonal      boolean     not null default false,
  season_months    int[],
  search_aliases   text[]      not null default '{}',
  is_active        boolean     not null default true,
  created_at       timestamptz not null default now()
);

create index idx_plants_category on plants (category);
create index idx_plants_active on plants (id) where is_active = true;
create index idx_plants_search_aliases on plants using gin (search_aliases);
create index idx_plants_name_trgm on plants using gin (name gin_trgm_ops);

-- user_settings: one row per user
create table user_settings (
  user_id                uuid        primary key references auth.users (id) on delete cascade,
  timezone               text        not null default 'UTC',
  weekly_variety_goal    int         not null default 30 check (weekly_variety_goal between 5 and 100),
  week_start_day         int         not null default 1 check (week_start_day between 0 and 6),
  notifications_enabled  boolean     not null default true,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- plant_logs: append-only, one row per plant per day per user
-- logged_on is the user's local date (computed client-side to avoid timezone-bucket-bug)
create table plant_logs (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users (id) on delete cascade,
  plant_id   uuid        not null references plants (id) on delete restrict,
  logged_on  date        not null,
  logged_at  timestamptz not null default now(),
  unique (user_id, plant_id, logged_on)
);

create index idx_logs_user_logged_on on plant_logs (user_id, logged_on desc);
create index idx_logs_user_plant on plant_logs (user_id, plant_id);

-- plant_submissions: user-suggested catalog additions
create table plant_submissions (
  id                uuid              primary key default gen_random_uuid(),
  submitted_by      uuid              not null references auth.users (id) on delete cascade,
  proposed_name     text              not null,
  proposed_category plant_category,
  notes             text,
  status            submission_status not null default 'pending',
  reviewed_by       uuid              references auth.users (id),
  reviewed_at       timestamptz,
  linked_plant_id   uuid              references plants (id),
  created_at        timestamptz       not null default now()
);
