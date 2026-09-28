---
title: Supabase metrics snapshot (2026-05-30)
type: source
tags: [data, metrics, supabase]
created: 2026-05-30
updated: 2026-09-28
origin: Supabase project ProjectFood (lkmfmdehysmbstnfdbyg, eu-west-1)
date_published: 2026-05-30
ingested: 2026-05-30
---

# Supabase metrics snapshot (2026-05-30)

> **Superseded 2026-09-07:** a 19-week pull with retention curve, notification effectiveness and
> hour-of-day data lives at [[source-supabase-metrics-2026-09]]. Keep this page as the May baseline.
> The weekly scheduled refresh writes its latest numbers in the section directly below.

## Weekly refresh (2026-09-28)
*SQL pull via the Supabase MCP on 2026-09-28 (a Monday, so the week of 2026-09-28 is ~1 day old).
Aggregates only. Friends-and-family cohort plus a handful of new-app testers: directional only,
not market users.*

**Read first — the database now holds two apps.** Since 2026-09-16 the Expo family app writes to
the same project (`households`, `household_members`, `achievement_unlocks`, `app_events`). Every
historic `plant_logs` row was backfilled with a `member_id`/`household_id`, so the `analytics_*`
views mix PWA logging and family-app tastes and cannot tell them apart. All 20 active household
members are `kind = adult` (no child member exists yet; 11 members are archived), so nothing
below measures a child tasting.

| Metric | 2026-09-28 | Previous |
|---|---|---|
| Registered users | 20 | 15 (2026-09-07) |
| Users with ≥1 log | 16 | 13 (2026-09-07) |
| Total plant logs | 4,021 | 3,544 (2026-09-07) |
| Avg logs / user with logs | 251.3 | 106.5 (2026-05-30) |
| Avg distinct plants (all-time) / user | 52.1 | 45.2 (2026-05-30) |
| Avg active weeks / user | 6.3 | 3.0 (2026-05-30) |
| Avg best week / user | 27.4 | 29.2 (2026-05-30) |
| Users who ever hit 30 in a week | 7 of 16 | 7 of 13 (2026-09-07) |
| Plants ever logged | 196 of 224 | 191 of 224 (2026-09-07) |
| Households onboarded (family app) | 7 of 20 | — (first reading) |
| Achievement unlocks, week of 2026-09-21 | 72 (135 all-time) | — (first reading) |

New users since 2026-09-07: 5 accounts (2026-09-22, -25, -27, -28, -28); 3 of them have logged
(18 logs). `analytics_new_users_per_week` counts only 3 because it keys on first log.

**Weekly trend since the last pull** (`analytics_*` views; PWA and family app mixed)
| Week (Mon) | New users | WAU | 28-day MAU | Logs | Logs/active user | Goal completion |
|---|---|---|---|---|---|---|
| 2026-08-31 | 0 | 2 | 2 | 107 | 53.5 | 100% (2/2) |
| 2026-09-07 | 0 | 3 | 3 | 138 | 46.0 | 66.7% (2/3) |
| 2026-09-14 | 0 | 2 | 3 | 112 | 56.0 | 50% (1/2) |
| 2026-09-21 | 2 | **7** | 7 | 228 | 32.6 | 28.6% (2/7) |
| 2026-09-28* | 1 | 1 | 8 | 3 | 3.0 | 0% (0/1) |

*~1 day old. WAU 7 (2026-09-21) is the highest since the week of 2026-06-01 (also 7); it was 2
(2026-08-31). Of the 7: the two long-term power users, three dormant PWA users who logged again
(last seen May–June; one of them via the new app), and two brand-new accounts.

**Churn view:** `analytics_churn_rate` (week-over-week definition since 2026-05-30) now reads
non-zero and tracks WAU: 33.3% (2026-09-14), 0% (2026-09-21), 100% (2026-09-28, an artefact of a
one-day-old week). Usable, but on n≤7 each user is 14+ points.

**Category mix, all logs:** vegetable 39.6% · fruit 22.9% · nut/seed 15.8% · herb 9.8% ·
ferment 5.4% · legume 3.6% · whole grain 3.0%. Since 2026-09-07 only (481 logs): vegetable 40.7 ·
fruit 18.7 · nut/seed 18.7 · herb 8.3 · ferment 6.2 · whole grain 4.2 · legume 3.1.

**Locale split (`user_settings`, 20):** en 11 · nl 8 · it 1 (was nl 8 · en 6 · it 1 on
2026-05-30; all five new accounts are en). Among users with logs: nl 8 · en 7 · it 1.

**Logging behaviour:** 100% of logs fall on the same local (Europe/Amsterdam) day as
`logged_at` — 0 of 4,021 backfilled. Measured in UTC, 43 differ (98.9%); the "21 of 1,385
backfilled" of 2026-05-30 was very likely this UTC-midnight artefact, not real backfilling.
Active day: median 10 distinct plants (avg 11.0, max 63) over 365 user-days (was median 8,
avg 10.6, 131 user-days, 2026-05-30).

**Cohort signals (directional, n=16):**
- Has an accepted friend (n=9) vs none (n=7): avg active weeks 9.33 vs 2.29; avg weeks hitting
  30 5.56 vs 0.86 (was 3.56 vs 1.75 and 1.67 vs 0.75 on 2026-05-30). The gap widened because the
  two power users both have friends; with n=9 they carry the average.
- Notifications on (n=4) vs off: avg active weeks 12.25 vs 4.25 (was 5.00 vs 2.11). Still the
  PWA `notifications_enabled` flag; likely reverse causation.

**Instrumentation note:** `notification_log` now holds 3 rows (2026-09-24 → 09-27); the 294 PWA
rows cited on 2026-09-07 are no longer in the table. `app_events` (401 rows since 2026-09-16)
records `notification_opened` (3), which the PWA never captured.

**What it is:** A point-in-time pull of aggregate, anonymized usage metrics from the live
ProjectFood database. No PII (no usernames, emails, or per-user identities) is stored in the
wiki — only aggregates and cohort comparisons.
**Origin:** Supabase project `ProjectFood` (`lkmfmdehysmbstnfdbyg`), pulled via SQL on
2026-05-30. The DB exposes purpose-built `analytics_*` views.

## Coverage & caveats (read before citing)
- **Window:** logs span **2026-04-26 → 2026-05-30** (~5 weeks). The DB was created 2026-04-26.
- **Scale:** **15 registered users, 13 with any logs, 1,385 plant logs.** This is almost
  certainly a founder + friends-and-family / early-tester cohort, **not** representative market
  users. Treat everything as directional, not conclusive.
- **Partial week:** the week of 2026-05-25 was still in progress at pull time — its volume and
  active-user counts are incomplete.
- **Correlations are not causal**, and with n=13 a single user moves a cohort average a lot.
- **Churn fix (2026-05-30):** `analytics_churn_rate` previously used a 28/56-day inactivity
  window and read 0 on this young dataset. It was redefined as week-over-week churn (of last
  week's active users, the share who didn't return). New values: 0% → 25% → 12.5% → 20% → 33.3%
  (last week partial). On n≈10 each churned user ≈ 10-12 pts, so read as a signal, not a precise
  rate.
- **MAU fix (2026-05-30):** `mau_28d` on `analytics_weekly_active_users` was rewritten as a true
  rolling 28-day active count. (An earlier label-only change still left it structurally equal to
  WAU — the view grouped raw logs by their own week, so it could never count prior-week users.)
  It now reads 1, 4, 9, 12, 12, 12 vs WAU 1, 4, 8, 10, 9, 7 — a real WAU&lt;MAU gap is opening in
  recent weeks: ~12 people active in the last 28 days but only 7 in the latest week, i.e. users
  becoming less frequent (consistent with the rising churn).

## Headline aggregates (as of 2026-05-30)
| Metric | Value |
|---|---|
| Registered users | 15 |
| Users with ≥1 log | 13 |
| Total plant logs | 1,385 |
| Avg logs / active user | 106.5 |
| Avg distinct plants tried (all-time) / user | 45.2 |
| Avg active weeks / user (of ~6) | 3.0 |
| Avg best week (peak variety) / user | 29.2 |
| Users who ever hit 30 in a week | 6 of 13 |
| Plant catalog (active) | 206 |
| Plants ever logged | 164 (42 never logged) |
| Superfoods in catalog / share of logs | 44 / 23.5% |

## Weekly trend
| Week (Mon) | New users | WAU | Logs | Logs/active user | Goal completion |
|---|---|---|---|---|---|
| 2026-04-20 | 1 | 1 | 30 | 30.0 | 100% (n=1) |
| 2026-04-27 | 3 | 4 | 117 | 29.3 | 50% |
| 2026-05-04 | 5 | 8 | 271 | 33.9 | 25% |
| 2026-05-11 | 3 | 10 | 349 | 34.9 | 40% |
| 2026-05-18 | 0 | 9 | 360 | 40.0 | 55.6% |
| 2026-05-25* | 1 | 7 | 258 | 36.9 | 57.1% |

*partial week.

## Category mix of logs
vegetable 42.4% · fruit 24.2% · nut_seed 14.1% · herb 11.3% · legume 3.5% · ferment 2.6% ·
whole_grain 2.0%.

## Locale split
nl 8 · en 6 · it 1. (All avatar/border customization to date is among nl users.)

## Logging behaviour
98.5% of logs are recorded on the same calendar day they occurred (only 21 of 1,385
backfilled). Typical active day = median 8 distinct plants (avg 10.6, max 51), across 131
active user-days.

## Cohort signals (directional)
- **Has friends vs none:** avg weeks hit-30 1.67 vs 0.75; avg active weeks 3.56 vs 1.75.
- **Notifications on (n=4) vs off:** avg active weeks 5.00 vs 2.11 (likely reverse causation —
  engaged users enable notifications).

## Derived pages
- [[concept-engagement-snapshot]] · [[concept-logging-behaviour]] ·
  [[concept-engagement-drivers]]

## Related pages
- [[overview]] · [[concept-30-plants-a-week]] · [[concept-brand-pillars]] ·
  [[concept-stickiness-moat]]
