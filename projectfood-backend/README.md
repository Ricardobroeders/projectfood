# Project Food — Backend (Phase 1)

Supabase backend for **Project Food**, a mobile app for tracking 30 different plants per week.

---

## Contents

- [Setup](#setup)
- [Local development](#local-development)
- [Deploying to remote](#deploying-to-remote)
- [Auth providers](#auth-providers)
- [Reviewing plant submissions](#reviewing-plant-submissions)
- [Common queries](#common-queries)
- [Schema diagram](#schema-diagram)
- [Decisions](#decisions)

---

## Setup

### 1. Install Supabase CLI

```bash
brew install supabase/tap/supabase
```

Or via npm: `npm install -g supabase`

### 2. Copy env vars

```bash
cp .env.example .env
```

Fill in `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` from your project dashboard (Settings → API).

### 3. Link to your remote project (optional for local dev)

```bash
supabase login
supabase link --project-ref <your-project-ref>
```

Your project ref is in the URL: `https://supabase.com/dashboard/project/<ref>`.

---

## Local development

### Start the local stack

```bash
supabase start
```

This starts Postgres, Auth, Storage, and Studio. Studio runs at http://127.0.0.1:54323.

### Apply migrations + seed

```bash
supabase db reset
```

`db reset` drops and recreates the local DB, runs all migrations in order, then runs `seed.sql`. Run this any time you want a clean state.

### Run tests

```bash
supabase test db
```

Runs the pgTAP suite in `supabase/tests/`.

### Stop

```bash
supabase stop
```

---

## Deploying to remote

### Push migrations

```bash
supabase db push
```

This applies any new migration files that haven't been applied to your remote project yet.

### Apply seed (first time only)

Set `SUPABASE_DB_URL` to your project's Postgres connection string (Dashboard → Settings → Database → URI), then:

```bash
./scripts/apply.sh
```

Or apply seed manually:

```bash
psql "$SUPABASE_DB_URL" -f supabase/seed.sql
```

The seed is idempotent — each insert uses a unique `slug` and will fail on duplicates, so wrap it in a transaction if you want to safely re-run:

```sql
begin;
-- paste seed.sql contents
commit;
```

---

## Auth providers

Auth is configured in the Supabase dashboard, not in code. Enable providers once per project.

### Apple Sign In

1. Dashboard → **Authentication** → **Providers** → **Apple** → Enable
2. You need an Apple Developer account. Create a **Services ID** (not an App ID).
3. Fill in:
   - **Client ID**: your Services ID (e.g. `com.yourcompany.thirty.auth`)
   - **Secret**: a JWT you generate using your Apple private key. [Apple's guide](https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens) and the [Supabase Apple guide](https://supabase.com/docs/guides/auth/social-login/auth-apple) both cover this.
4. In your app, use `supabase.auth.signInWithIdToken({ provider: 'apple', token })`.

### Google Sign In

1. Dashboard → **Authentication** → **Providers** → **Google** → Enable
2. Create OAuth credentials at [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → Create OAuth Client ID.
3. Fill in **Client ID** and **Client Secret** from Google.
4. Add your Supabase callback URL (`https://<ref>.supabase.co/auth/v1/callback`) to the authorized redirect URIs in Google Cloud.
5. In your app, use `supabase.auth.signInWithOAuth({ provider: 'google' })`.

---

## Reviewing plant submissions

There is no admin UI in v1. Use the Supabase SQL editor or psql.

### List pending submissions

```sql
select
  ps.id,
  ps.proposed_name,
  ps.proposed_category,
  ps.notes,
  ps.created_at,
  u.email as submitted_by_email
from plant_submissions ps
join auth.users u on u.id = ps.submitted_by
where ps.status = 'pending'
order by ps.created_at;
```

### Approve a submission

```sql
-- 1. Insert the new plant
insert into plants (slug, name, category, emoji)
values ('new-plant-slug', 'New Plant Name', 'vegetable', '🌿')
returning id;

-- 2. Mark submission approved (use the plant id from step 1)
update plant_submissions
set
  status          = 'approved',
  reviewed_at     = now(),
  reviewed_by     = auth.uid(),   -- or your admin user id
  linked_plant_id = '<plant-id-from-step-1>'
where id = '<submission-id>';
```

### Reject a submission

```sql
update plant_submissions
set
  status      = 'rejected',
  reviewed_at = now(),
  reviewed_by = '<your-admin-user-id>'
where id = '<submission-id>';
```

### Mark as duplicate

```sql
update plant_submissions
set
  status          = 'duplicate',
  reviewed_at     = now(),
  reviewed_by     = '<your-admin-user-id>',
  linked_plant_id = '<existing-plant-id>'  -- the plant it duplicates
where id = '<submission-id>';
```

---

## Common queries

All functions use `auth.uid()` as default, so they work out of the box from authenticated client calls.

### Weekly variety (count of distinct plants this week)

```sql
-- From SQL editor (substitute user id):
select weekly_variety('user-uuid-here', date_trunc('week', current_date)::date);

-- From a JS client (Supabase JS):
const { data } = await supabase.rpc('weekly_variety', {
  p_week_start: startOfWeek  // ISO date string, e.g. '2025-01-06'
})
```

### Plants logged this week (for home screen grid)

```sql
select current_week_plants(p_week_start := '2025-01-06');
```

### Current streak

```sql
select current_streak();
```

### Fill rate (last 30 days)

```sql
select fill_rate();                  -- default 30 days
select fill_rate(p_window_days := 7); -- last 7 days
```

### Weekly history (last 4 weeks)

```sql
select * from weekly_history();
-- Returns: week_start, variety, hit_goal
```

### All-time category breakdown

```sql
select * from category_breakdown();
-- Returns: category, unique_count, total_in_category
```

### Log a plant

```sql
insert into plant_logs (user_id, plant_id, logged_on)
values (auth.uid(), '<plant-id>', '<local-date>');  -- local-date: client-computed
```

### Remove a log (correct a mistake)

```sql
delete from plant_logs
where user_id = auth.uid()
  and plant_id = '<plant-id>'
  and logged_on = '<local-date>';
```

---

## Schema diagram

```
auth.users (Supabase managed)
    │
    ├──< user_settings (1:1, auto-created on signup)
    │       user_id pk fk
    │       timezone, weekly_variety_goal, week_start_day
    │
    ├──< plant_logs (append-only)
    │       user_id fk, plant_id fk, logged_on date
    │       unique(user_id, plant_id, logged_on)
    │
    └──< plant_submissions
            submitted_by fk, status, reviewed_by fk, linked_plant_id fk
            └── links to → plants.id (on approval)

plants (catalog, admin-managed)
    id, slug, name, emoji, category, subcategory
    color, botanical_family, search_aliases[]
    is_active, is_seasonal, season_months[]
```

---

## Decisions

**`logged_on` is a client-computed date, not server-derived from `logged_at`.**
If the server derived the date from `logged_at` using the user's timezone, a log submitted at 23:59 local time might land on the next UTC day. Instead, the client computes `new Date().toLocaleDateString('sv')` (or equivalent) and sends it. The server stores it as-is. This is the simplest correct solution to the timezone-bucket problem.

**`plant_logs` has no UPDATE.**
Logs are append-only by design. Incorrect entries are fixed by delete + re-insert. This keeps the audit trail clean and the RLS policies simple.

**`user_settings` is auto-created with `timezone = 'UTC'` on signup.**
The mobile client updates it on first launch using the device locale (`Intl.DateTimeFormat().resolvedOptions().timeZone`). This avoids a chicken-and-egg problem where streak functions need a timezone before the client has set one.

**Week starts Monday by default (`week_start_day = 1`).**
ISO 8601 standard. The client can override this per user if needed.

**`plant_submissions` has no admin RLS policy.**
Admins review via the service role key (bypasses RLS). A dedicated admin role and policy can be added in Phase 5 when the admin UI is built.

**`week_start_day` in `user_settings` is not yet used by `weekly_history`.**
The current implementation uses `date_trunc('week', ...)` which always starts on Monday. If users need custom week start days, `weekly_history` and `weekly_variety` will need updating. Deferred — the default Monday start covers the majority case.

**pgTAP tests use direct `auth.users` inserts.**
In production, users are created through GoTrue. In the local test environment, we insert directly into `auth.users`. The `handle_new_user` trigger fires either way, so the behavior is identical.
