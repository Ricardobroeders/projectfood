---
title: Tastes outlive the account — plant logs stay as anonymous rows after deletion
type: decision
tags: [decision, privacy, data, kpis, deletion]
created: 2026-09-20
updated: 2026-09-22
date: 2026-09-20
status: accepted
sources: []
---

# Tastes outlive the account

**In one line:** When a parent deletes their account, everything that identifies the family goes,
but the taste rows (which plant, which day, under ids that no longer point at anyone) stay for the
product numbers. Ricardo, 2026-09-20.

## Context
The KPI list in [[strategy-backlog]] row 11 (most eaten plants, variety per week, streak lengths,
check-offs per active user) needs plant, day and a way to group rows per person and per family.
Until today `plant_logs` cascaded from the account, the household and the member profile, so a
deletion took the history with it and every departed family disappeared from the numbers.

## Decision
- `plant_logs` no longer references `auth.users`, `households` or `household_members`
  (migration 0015 `keep_logs_on_delete`). The `plant_id` link stays.
- After a deletion the row's `user_id`, `household_id` and `member_id` are bare random ids: no
  name, email, household name or profile exists behind them anywhere in the database. Row-level
  security makes them unreachable to any signed-in user; only the service role reads them.
- Nothing else is kept. Achievements, nudges, settings, push tokens, notification log, events and the
  household itself still cascade.
- Why this is allowed: the GDPR does not cover data that can no longer be linked to a person,
  children's data included. The residual link lives only in database backups, which the privacy
  policy already caps at 30 days. Optional belt and braces for later: a nightly job that re-keys
  the ids of orphaned rows once they are older than 30 days.
- The privacy policy (section 8) and both deletion screens (app and web) say so in en/nl/it.

## Consequences
- The analytics views over `plant_logs` (churn, retention, weekly active, goal completion) now
  keep departed users in their cohorts, which is what they should have done all along.
- Inserts into `plant_logs` are no longer checked against the household or member tables; the
  RLS `with check` still binds `household_id` to the caller's household.
- If Ricardo ever wants kid/adult split in the numbers, that flag lives on the member profile and
  is lost at deletion; it would need copying onto the row before the cascade.

## Related pages
- [[strategy-backlog]] (rows 11, 14) · [[decision-2026-09-16-store-poc-scope]] ·
  [[concept-retention-loop]]
