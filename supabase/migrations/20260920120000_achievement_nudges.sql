-- 0013: rung nudges (KB concept-achievement-system: a level that crosses 50% and 75% is a push moment).
-- One row per household, owner, stamp, level and threshold, so each moment pushes once. `sent` false
-- marks the baseline: on a household's first run the scheduler records every rung already past a
-- threshold without sending, so only later crossings push. Written by the scheduler (service role);
-- households never read this table.
create table public.achievement_nudges (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  -- null = household-level stamp
  member_id uuid references public.household_members(id) on delete cascade,
  achievement_id text not null,
  level int not null check (level between 1 and 4),
  threshold int not null check (threshold in (50, 75)),
  sent boolean not null default true,
  sent_at timestamptz not null default now()
);
create unique index achievement_nudges_uniq on public.achievement_nudges
  (household_id, coalesce(member_id, '00000000-0000-0000-0000-000000000000'::uuid), achievement_id, level, threshold);
create index idx_achievement_nudges_household on public.achievement_nudges (household_id, sent_at desc);
alter table public.achievement_nudges enable row level security;

-- when the baseline was taken; null = the household has not been through a prep window yet
alter table public.households add column nudge_baseline_at timestamptz;
