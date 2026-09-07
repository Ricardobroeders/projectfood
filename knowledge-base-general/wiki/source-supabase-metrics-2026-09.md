---
title: Supabase metrics snapshot (2026-09-07)
type: source
tags: [data, metrics, supabase, retention]
created: 2026-09-07
updated: 2026-09-07
origin: Supabase project ProjectFood (lkmfmdehysmbstnfdbyg, eu-west-1), SQL pull 2026-09-07
date_published: 2026-09-07
ingested: 2026-09-07
---

# Supabase metrics snapshot (2026-09-07)

**What it is:** Second point-in-time pull of aggregate, anonymised usage data from the live PWA
database, 19 weeks after launch. Supersedes [[source-supabase-metrics]] (2026-05-30) as the
current picture. No PII; per-user figures are listed without identities.
**Origin:** SQL via the Supabase MCP on 2026-09-07, using the `analytics_*` views plus ad-hoc
queries on `plant_logs`, `notification_log`, `user_settings`, `friendships`, `plants`,
`weekly_advice`.
**Raw file:** none (live query; the numbers are reproduced below). Ricardo's WAU/MAU chart from
the same views prompted the pull.

## Coverage & caveats (read before citing)
- **Window:** 2026-04-26 → 2026-09-07 (19 full weeks). 15 registered users, 13 with logs,
  3,544 plant logs.
- **Cohort:** friends-and-family adults; the founder is one of the 13 and the heaviest user.
  Every per-user figure is dominated by two power users.
- **Blind spot:** `notification_log.delivered` and `clicked_at` were never populated (0 of 294),
  so open rate is unmeasured. "Logged within 3 h of send" is the proxy used here.
- Week of 2026-09-07 is partial.

## Retention (all cohorts pooled, `analytics_weekly_retention`)
| Weeks since join | Retained | Cohort | % |
|---|---|---|---|
| 0 | 13 | 13 | 100 |
| 1 | 9 | 12 | 75 |
| 2 | 8 | 12 | 67 |
| 3 | 7 | 12 | 58 |
| 4 | 7 | 12 | 58 |
| 5 | 5 | 12 | 42 |
| 7 | 5 | 12 | 42 |
| 9 | 4 | 12 | 33 |
| 13 | 3 | 9 | 33 |
| 14–18 | 2 | 4 | 50 |

Two cliffs: week 0→1 (a quarter gone) and week 4→5 (58% → 42%). From week 14 the retained set
is two people: the founder and one other user, each with 100+ active days. Non-founder
retention at three months is effectively zero.

## Per-user lifecycle (13 users)
- **Active days:** 110, 103, then 26, 24, 23, 17, 8, 7, 4, 3, 2, 1, 1.
- **Lifespan (first to last log):** 134 and 128 days for the two power users; median 21 days
  for the other eleven.
- **Ever reached 30 distinct plants in a week:** 7 of 13. Of those seven, five have since left,
  four of them within seven weeks of joining; one logged a 63-plant week and last logged two
  weeks later. **Reaching the goal did not retain.**
- **Weeks hitting 30:** 20 and 18 for the power users; 4, 4, 2, 2, 1 for the other five who
  ever hit it.

## Activity (`analytics_weekly_active_users`, from Ricardo's chart)
WAU peaked at 10 (week of 2026-05-11) and rolling 28-day MAU at 12 (ISO weeks 20–23). Both then
decayed: WAU 5 by week 25, 3 by week 27, 2 from week 33, 1 in the partial week 37. Goal
completion among *remaining* active users reads 100% from week 29 only because just the power
users remained.

## When people log (local time)
| Hour | Logs |
|---|---|
| 12–13 | 447 |
| 17 | 210 |
| 18 | 327 |
| 19 | 583 |
| 20 | 502 |
| 21 | 150 |

- **46% of all logs fall between 17:00 and 21:00; peak 19:00–20:00.** Secondary lunch bump
  12:00–14:00.
- Day of week is flat (Monday highest at 604 logs, Friday lowest at 438).
- **Session depth:** mean 11.1, median 10 plants per session (max 63) across 125 active days.
  Logging is end-of-day recall in batches, not per meal.

## Notifications (294 sent to 5 users; 4 push subscriptions)
| Type | Sent | Logged within 3 h | Rate |
|---|---|---|---|
| daily_reminder | 242 | 19 | 8% |
| streak_rescue | 50 | 23 | 46% |
| weekly_nudge | 1 | 1 | — |
| inactivity_reminder | 1 | 0 | — |

The specific, loss-framed streak rescue was about **six times** as effective as the generic
daily reminder. Only 5 of 15 users had notifications enabled at all.

## Social & profile
- 12 accepted friendships among 15 users (every request was accepted).
- 5 of 15 set a custom avatar; 8 of 15 unlocked a border. Borders sat under Account → Avatar
  and were used only after Ricardo explained them in person.
- Nobody changed the default weekly goal of 30.

## Catalog & content
- 224 active plants, **all with images** (3D clay renders); 220 carry `botanical_family`
  (62 families), 66 subcategories, 8 colours, 39 seasonal, 44 superfood.
- 191 of 224 plants have ever been logged.
- **Log mix:** vegetable 39%, fruit 23%, nut/seed 15%, herb 10%, ferment 5%, legume 4%,
  whole grain 3%. Legumes (17 of 21 ever logged) and whole grains (13 of 17) are the least
  explored categories.
- Largest botanical families: Fabaceae 26, Poaceae 19, Solanaceae 18, Brassicaceae 18,
  Rosaceae 13, Apiaceae 10, Cucurbitaceae 10.
- Weekly advice: 10 of 13 users generated it at least once; 61 advices; max 20 for one user.
- `plant_translations`: 672 rows = 224 plants × 3 locales (en, nl, it). No per-plant facts exist.

## Implications for Project Food
- The weekly count resets and so never accumulates value; the only users who stayed are the two
  for whom logging itself became the habit. The family app needs a reward that grows:
  [[concept-retention-loop]].
- Dinner is the anchor even for adults; the family-mode notification (D10) should default to
  the household's dinner time and learn from logs.
- Specific, at-risk nudges work; generic reminders do not. Record delivery and opens from day
  one (0 of 294 did).
- Friends were used; the profile was not found. Make the profile the home screen, not a setting.
- The catalog already has the metadata for albums (family, colour, season) and the images for
  cards. The content gap is per-plant facts.

## Related pages
- [[source-supabase-metrics]] (May 2026 baseline, superseded) · [[concept-retention-loop]] ·
  [[decision-2026-09-07-app-v1-scope]] · [[concept-engagement-snapshot]] ·
  [[concept-engagement-drivers]] · [[concept-logging-behaviour]] · [[overview]]
