-- supabase/tests/rls_and_functions.test.sql
-- pgTAP test suite for Project Food backend
-- Run with: supabase test db

begin;
select plan(30);

-- ════════════════════════════════════════════════════
-- Helpers
-- ════════════════════════════════════════════════════

-- Create two test users via auth.users directly
-- (In real Supabase these go through GoTrue; in tests we insert directly)
insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
values
  ('00000000-0000-0000-0000-000000000001', 'alice@test.com', 'x', now(), now(), now(), '{}', '{}', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000002', 'bob@test.com',   'x', now(), now(), now(), '{}', '{}', 'authenticated', 'authenticated')
on conflict do nothing;

-- Insert a known plant for testing
insert into plants (id, slug, name, emoji, category, color)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'test-apple', 'Test Apple', '🍎', 'fruit', 'red')
on conflict do nothing;

-- ════════════════════════════════════════════════════
-- 1. New user signup creates a user_settings row
-- ════════════════════════════════════════════════════

select ok(
  exists(select 1 from user_settings where user_id = '00000000-0000-0000-0000-000000000001'),
  'alice has a user_settings row after signup'
);

select ok(
  exists(select 1 from user_settings where user_id = '00000000-0000-0000-0000-000000000002'),
  'bob has a user_settings row after signup'
);

select is(
  (select timezone from user_settings where user_id = '00000000-0000-0000-0000-000000000001'),
  'UTC',
  'default timezone is UTC'
);

-- ════════════════════════════════════════════════════
-- 2. plant_logs unique constraint
-- ════════════════════════════════════════════════════

insert into plant_logs (user_id, plant_id, logged_on)
values ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2025-01-01');

select throws_ok(
  $$insert into plant_logs (user_id, plant_id, logged_on)
    values ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2025-01-01')$$,
  '23505',
  null,
  'cannot log the same plant twice on the same day'
);

-- Different day is allowed
select lives_ok(
  $$insert into plant_logs (user_id, plant_id, logged_on)
    values ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2025-01-02')$$,
  'same plant on different day is allowed'
);

-- ════════════════════════════════════════════════════
-- 3. RLS: users cannot read each other's data
-- ════════════════════════════════════════════════════

-- Switch to alice's role
set local role authenticated;
set local "request.jwt.claims" to '{"sub": "00000000-0000-0000-0000-000000000001", "role": "authenticated"}';

select is(
  (select count(*)::int from plant_logs where user_id = '00000000-0000-0000-0000-000000000002'),
  0,
  'alice cannot read bob''s plant_logs'
);

select is(
  (select count(*)::int from user_settings where user_id = '00000000-0000-0000-0000-000000000002'),
  0,
  'alice cannot read bob''s user_settings'
);

-- RLS: alice can read her own logs
select is(
  (select count(*)::int from plant_logs where user_id = '00000000-0000-0000-0000-000000000001'),
  2,
  'alice can read her own plant_logs'
);

-- Switch back to postgres for further inserts
reset role;
reset "request.jwt.claims";

-- ════════════════════════════════════════════════════
-- 4. weekly_variety
-- ════════════════════════════════════════════════════

-- Clear alice's logs and insert controlled data
delete from plant_logs where user_id = '00000000-0000-0000-0000-000000000001';

-- Insert 3 plants across mon-sun of a known week (2025-01-06 is a Monday)
insert into plants (id, slug, name, category, color)
values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'test-broccoli', 'Test Broccoli', 'vegetable', 'green'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'test-oat',      'Test Oat',      'whole_grain','brown')
on conflict do nothing;

insert into plant_logs (user_id, plant_id, logged_on) values
  ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2025-01-06'),
  ('00000000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2025-01-07'),
  ('00000000-0000-0000-0000-000000000001', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '2025-01-08'),
  -- duplicate plant within same week — should not inflate count
  ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2025-01-09'),
  -- plant logged the following week — should not be counted
  ('00000000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2025-01-13');

select is(
  weekly_variety('00000000-0000-0000-0000-000000000001', '2025-01-06'),
  3,
  'weekly_variety counts distinct plants in the week window'
);

select is(
  weekly_variety('00000000-0000-0000-0000-000000000001', '2025-01-13'),
  1,
  'weekly_variety counts only plants in the specified week'
);

-- ════════════════════════════════════════════════════
-- 5. current_streak
-- ════════════════════════════════════════════════════

-- User who has never logged: streak = 0
select is(
  current_streak('00000000-0000-0000-0000-000000000002'),
  0,
  'streak is 0 for user with no logs'
);

-- Build a 5-day streak ending yesterday for alice
-- (We use fixed past dates so the test doesn't depend on current_date)
-- We mock by inserting into user_settings and using the SQL directly
-- Testing streak logic via controlled data:
delete from plant_logs where user_id = '00000000-0000-0000-0000-000000000001';

-- Insert 5 consecutive days ending today
insert into plant_logs (user_id, plant_id, logged_on) values
  ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date - 4),
  ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date - 3),
  ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date - 2),
  ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date - 1),
  ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date);

select is(
  current_streak('00000000-0000-0000-0000-000000000001'),
  5,
  '5-day consecutive streak ending today'
);

-- Broken streak: gap before today
delete from plant_logs where user_id = '00000000-0000-0000-0000-000000000001';

insert into plant_logs (user_id, plant_id, logged_on) values
  ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date - 5),
  ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date - 4),
  -- gap at current_date - 3
  ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date - 2),
  ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date - 1);
-- no log today

select is(
  current_streak('00000000-0000-0000-0000-000000000001'),
  2,
  'streak counts back from yesterday when today is empty, stops at gap'
);

-- Logged only today
delete from plant_logs where user_id = '00000000-0000-0000-0000-000000000001';

insert into plant_logs (user_id, plant_id, logged_on) values
  ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date);

select is(
  current_streak('00000000-0000-0000-0000-000000000001'),
  1,
  'logged only today = streak of 1'
);

-- ════════════════════════════════════════════════════
-- 6. fill_rate
-- ════════════════════════════════════════════════════

-- 5 days logged in a 10-day window = 50%
delete from plant_logs where user_id = '00000000-0000-0000-0000-000000000001';

insert into plant_logs (user_id, plant_id, logged_on) values
  ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date - 9),
  ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date - 7),
  ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date - 5),
  ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date - 3),
  ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date - 1);

select is(
  fill_rate('00000000-0000-0000-0000-000000000001', 10),
  50.00::numeric,
  'fill_rate: 5 logged days out of 10-day window = 50.00'
);

-- ════════════════════════════════════════════════════
-- 7. RLS: plant_submissions
-- ════════════════════════════════════════════════════

set local role authenticated;
set local "request.jwt.claims" to '{"sub": "00000000-0000-0000-0000-000000000001", "role": "authenticated"}';

insert into plant_submissions (submitted_by, proposed_name, proposed_category, notes)
values ('00000000-0000-0000-0000-000000000001', 'Salsify', 'vegetable', 'Looks like a parsnip');

select is(
  (select count(*)::int from plant_submissions where submitted_by = '00000000-0000-0000-0000-000000000001'),
  1,
  'alice can read her own submission'
);

reset role;
reset "request.jwt.claims";

-- bob cannot see alice's submission
set local role authenticated;
set local "request.jwt.claims" to '{"sub": "00000000-0000-0000-0000-000000000002", "role": "authenticated"}';

select is(
  (select count(*)::int from plant_submissions),
  0,
  'bob cannot read alice''s submissions'
);

reset role;
reset "request.jwt.claims";

-- ════════════════════════════════════════════════════
-- 8. Plants table: authenticated users can read active plants
-- ════════════════════════════════════════════════════

set local role authenticated;
set local "request.jwt.claims" to '{"sub": "00000000-0000-0000-0000-000000000001", "role": "authenticated"}';

select ok(
  (select count(*) from plants where is_active = true) > 0,
  'authenticated user can read active plants'
);

-- Cannot read inactive plants
insert into plants (id, slug, name, category, color, is_active)
values ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'hidden-plant', 'Hidden Plant', 'fruit', 'red', false)
on conflict do nothing;

select is(
  (select count(*)::int from plants where id = 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
  0,
  'inactive plants are hidden from authenticated users via RLS'
);

reset role;
reset "request.jwt.claims";

-- ════════════════════════════════════════════════════
-- 9. category_breakdown returns a row for every category
-- ════════════════════════════════════════════════════

select is(
  (select count(*)::int from category_breakdown('00000000-0000-0000-0000-000000000001')),
  6,
  'category_breakdown returns one row per plant_category enum value'
);

-- ════════════════════════════════════════════════════
-- 10. weekly_history returns correct number of rows
-- ════════════════════════════════════════════════════

select is(
  (select count(*)::int from weekly_history('00000000-0000-0000-0000-000000000001', 4)),
  4,
  'weekly_history returns one row per requested week'
);

select is(
  (select count(*)::int from weekly_history('00000000-0000-0000-0000-000000000001', 8)),
  8,
  'weekly_history respects the p_weeks parameter'
);

select * from finish();
rollback;
