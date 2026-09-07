---
title: Engagement drivers (correlations)
type: concept
tags: [metrics, retention, correlations]
created: 2026-05-30
updated: 2026-09-07
sources: [source-supabase-metrics.md]
---

# Engagement drivers (correlations)

**In one line:** Early, directional signals on what separates engaged users from the rest —
social connection stands out. **Correlational, n=13, not causal.** Source:
[[source-supabase-metrics]].

## Signals (as of 2026-05-30)
- **Friends → more engagement.** Users with ≥1 accepted friend average **3.56** active weeks
  and **1.67** weeks hitting 30, vs **1.75** and **0.75** for users with no friends — roughly
  2× on both. Consistent with the belonging/esteem layers of the strategy and the social
  surfaces (Friends, Top 15) in [[source-app-mockups]].
- **Notifications-on users are far more active** (5.0 vs 2.1 active weeks), but only 4 users
  have them on and enabling notifications is itself a sign of an already-engaged user — **likely
  reverse causation.** Don't read this as "notifications cause retention" without a test.

## Why it matters to Project Food
- The friends signal is the most actionable: if social connection genuinely drives the 30-plant
  habit, then **getting a new user to add one friend early** could be a high-leverage activation
  goal. This reinforces the word-of-mouth/social design in [[concept-word-of-mouth]] and the
  esteem/belonging layers of [[concept-30-plants-a-week]].
- Suggests an experiment: measure whether prompting friend-adds during onboarding lifts
  week-2+ goal completion.

## Update (2026-09-07, [[source-supabase-metrics-2026-09]])
- **Trigger specificity matters more than trigger volume.** Of 294 pushes, the loss-framed
  `streak_rescue` was followed by a log within 3 h 46% of the time (23 of 50); the generic
  `daily_reminder` 8% (19 of 242). Still only 5 opted-in users, so directional.
- **Hidden investment is no investment.** 5 of 15 customised an avatar, 8 unlocked a border;
  the feature lived under Account → Avatar and was used only after in-person explanation.
  Friends (12 of 15) were the one investment people found on their own.
- Both feed the v1 loop design in [[concept-retention-loop]].

## Contradictions / open questions
- Direction of causality is unknown for both signals (engaged people may simply add friends and
  turn on notifications). A proper test or larger sample is needed.
- n=13 means one or two power users can dominate any average here.

## Related pages
- [[source-supabase-metrics]] · [[concept-engagement-snapshot]] · [[concept-word-of-mouth]] ·
  [[concept-30-plants-a-week]] · [[overview]]
