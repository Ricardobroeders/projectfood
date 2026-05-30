---
title: Supabase metrics snapshot (2026-05-30)
type: source
tags: [data, metrics, supabase]
created: 2026-05-30
updated: 2026-05-30
origin: Supabase project ProjectFood (lkmfmdehysmbstnfdbyg, eu-west-1)
date_published: 2026-05-30
ingested: 2026-05-30
---

# Supabase metrics snapshot (2026-05-30)

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
