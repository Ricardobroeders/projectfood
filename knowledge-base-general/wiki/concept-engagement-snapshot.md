---
title: Engagement snapshot
type: concept
tags: [metrics, kpi, retention]
created: 2026-05-30
updated: 2026-05-30
sources: [source-supabase-metrics.md]
---

# Engagement snapshot

**In one line:** Where the core KPIs stand as of 2026-05-30 — a small, early cohort (13 active
users, ~5 weeks) that logs actively and is trending up on goal completion. Source:
[[source-supabase-metrics]].

## State of play (as of 2026-05-30)
- **Adoption:** 15 registered, 13 ever logged, 1,385 logs total — _(early tester cohort, not
  market users)_.
- **Activity:** WAU rose 1 → 10 (week of 05-11), then eased to 9 → 7. Weekly log volume grew
  30 → 360 before the current partial week.
- **WAU vs MAU gap:** rolling 28-day MAU is flat at 12 while WAU has fallen to 7 — the once-active
  base is intact but logging less often each week (a frequency problem, not a base-loss problem).
- **Depth:** avg active user has logged 106 times and tried 45 distinct plants; average *best*
  week is 29.2 plants — i.e. the typical engaged user gets right to the edge of 30.
- **Goal completion** (share of weekly-active users hitting 30) trended up: 25% → 40% → 55.6%
  → 57.1% over the last four weeks.
- **The 30 is hard but achievable:** only 6 of 13 have ever hit 30 in a week.
- **Week-over-week churn** (share of last week's active users who didn't return) is rising:
  0% → 25% → 12.5% → 20% → 33.3% (the last week, 2026-05-25, is partial so likely overstated).
  Readable since the `analytics_churn_rate` view was fixed 2026-05-30.

## Why it matters to Project Food
- Goal-completion climbing while volume holds is the healthiest single signal here — people are
  getting better at the core behaviour ([[concept-30-plants-a-week]]).
- WAU softening from its 05-11 peak is the thing to watch; ties directly to the retention thesis
  in [[concept-stickiness-moat]].

## Contradictions / open questions
- Churn is now readable (view fixed 2026-05-30) and rising — but on a tiny cohort each churned
  user is ~10-12 percentage points, so treat the trend as a signal to watch, not a precise rate.
- Is the WAU dip real attrition or just the partial current week + a tiny cohort?
- All numbers are from a friends-and-family cohort; re-baseline once real acquisition starts.

## Related pages
- [[source-supabase-metrics]] · [[concept-logging-behaviour]] · [[concept-engagement-drivers]] ·
  [[concept-stickiness-moat]] · [[overview]]
