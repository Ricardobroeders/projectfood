-- Asset jobs: the queue behind projectfood-admin/scripts/assets.mjs, which replaced the n8n
-- "Content creation workflow" on 2026-10-09 (plant renders, gold renders, achievement renders,
-- UI images; gpt-image-1 → Supabase Storage). Service role only; no client reads this table.
create table if not exists public.asset_jobs (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null check (kind in ('plant', 'gold', 'achievement', 'ui')),
  key         text not null,                       -- plant slug, achievement id, or UI file name
  inputs      jsonb not null default '{}'::jsonb,  -- what the prompt template reads (name, category, description, ...)
  quality     text not null default 'medium' check (quality in ('low', 'medium', 'high')),
  bucket      text not null,
  path        text not null,                       -- object path inside the bucket
  prompt      text,                                -- resolved at run time, kept for the record
  status      text not null default 'pending' check (status in ('pending', 'running', 'done', 'error')),
  error       text,
  public_url  text,
  created_at  timestamptz not null default now(),
  started_at  timestamptz,
  done_at     timestamptz
);

-- One open job per asset; a finished or failed one can be queued again.
create unique index if not exists asset_jobs_open_unique
  on public.asset_jobs (kind, key) where status in ('pending', 'running');

create index if not exists asset_jobs_status_idx on public.asset_jobs (status, created_at);

alter table public.asset_jobs enable row level security;
-- No policies on purpose: only the service role (the script, later the admin app's server) touches it.
