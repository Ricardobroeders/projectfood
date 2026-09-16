-- 0005 native push: Expo push tokens, richer notification_log, extensions for scheduling.

create table public.push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  expo_push_token text not null unique,
  platform text not null check (platform in ('ios', 'android')),
  device_name text,
  app_version text,
  last_seen_at timestamptz not null default now(),
  failure_count int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.push_tokens enable row level security;
create policy pt_all on public.push_tokens for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table public.notification_log
  add column household_id uuid references public.households(id) on delete set null,
  add column push_token_id uuid references public.push_tokens(id) on delete set null,
  add column ticket_id text,
  add column delivered_at timestamptz,
  add column opened_at timestamptz,
  add column logged_within_3h boolean;
create index idx_notification_log_pending_receipt on public.notification_log (ticket_id)
  where ticket_id is not null and delivered_at is null;

create or replace function public.mark_notification_opened(p_id uuid) returns void
language sql security definer set search_path = public as $$
  update notification_log set opened_at = coalesce(opened_at, now())
  where id = p_id and user_id = auth.uid();
$$;

-- scheduling infrastructure; the cron job itself is created when the Edge Function exists
create extension if not exists pg_cron with schema pg_catalog;
grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;
create extension if not exists pg_net with schema extensions;
