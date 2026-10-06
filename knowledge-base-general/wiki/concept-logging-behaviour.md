---
title: Logging behaviour
type: concept
tags: [metrics, product, behaviour]
created: 2026-05-30
updated: 2026-10-06
sources: [source-supabase-metrics.md]
---

# Logging behaviour

**In one line:** How and what people actually log — strong same-day logging, a staple-heavy
diet, and clear under-logged categories. Source: [[source-supabase-metrics]].

## What the data shows (as of 2026-05-30)
- **Same-day logging is the norm:** 98.5% of logs are recorded on the day they occurred (21 of
  1,385 backfilled). This is direct evidence for Pillar 3 of [[concept-brand-pillars]]
  ("effortless in the moment") — people tap as they eat, they don't reconstruct the week.
- **But logging is session-based, not trickle:** a typical active day is a median of **8**
  distinct plants (avg 10.6, max 51). So users tend to capture a day's plants in a sitting
  rather than one tap per plant through the day. Worth confirming whether the "tap as you eat"
  ideal matches reality, or whether people log once at end of day.
- **Diet skews to staples.** Category mix of logs: vegetable 42% · fruit 24% · nut/seed 14% ·
  herb 11% · legume 3.5% · ferment 2.6% · whole_grain 2.0%. Top plants are everyday items
  (strawberry, carrot, cucumber, cherry tomato, onion, potato).
- **Long tail is under-used:** 42 of 206 catalog plants have never been logged; superfoods are
  23.5% of logs.

## Why it matters to Project Food
- **Legumes, whole grains, and ferments are the structural gap** — together <9% of logs despite
  being where easy variety wins live. This is exactly what the advice engine and the weekly
  grocery list ([[concept-stickiness-moat]]) should target: surface the missing categories, not
  more of the staples (Pillar 2, "different beats more").
- The 42 never-logged plants are candidates for the "plant they'd never heard of" discovery
  moment in [[concept-word-of-mouth]].

## Contradictions / open questions
- Session-based logging (8/day) sits in mild tension with the "tap as you eat" framing — needs a
  product/qualitative check.
- Are never-logged plants genuinely unpopular, hard to find in search, or just niche? Cross-check
  with the in-app search/catalog before acting.

## Update (2026-09-28, weekly refresh in [[source-supabase-metrics]])
- **Same-day logging is 100% in local time** (0 of 4,021 logs on a different Europe/Amsterdam
  day than `logged_at`). The 98.5% of 2026-05-30 was very likely a UTC artefact: in UTC 43 logs
  (1.1%) cross midnight, which evening logging near 00:00 UTC explains. Treat "21 backfilled" as
  withdrawn, not as a real behaviour change.
- **Session depth rose:** median 10 distinct plants per active day (avg 11.0, max 63) over 365
  user-days; was median 8, avg 10.6 over 131 (2026-05-30). Batch logging holds.
- **Category mix (all logs):** vegetable 39.6 · fruit 22.9 · nut/seed 15.8 · herb 9.8 ·
  ferment 5.4 · legume 3.6 · whole grain 3.0. Ferments and whole grains edged up since May
  (2.6 → 5.4, 2.0 → 3.0); legumes stay the smallest-grown gap (3.5 → 3.6).
- **Long tail:** 196 of 224 plants ever logged (28 never), was 191 (2026-09-07).
- Since 2026-09-16 part of these logs come from the family app (adult members only so far).

## Update (2026-10-06, weekly refresh in [[source-supabase-metrics]])
- **Same-day logging holds:** 4 of 4,689 logs (0.1%) on a different local day (was 0 of 4,021,
  2026-09-28).
- **Session depth dipped:** median 9 plants per active day (avg 10.6, max 63) over 439 user-days;
  was median 10, avg 11.0 (2026-09-28). New testers log smaller days.
- **Category mix since 2026-09-28** (671 logs): vegetable 43.4 · fruit 19.7 · nut/seed 14.2 ·
  herb 8.5 · whole grain 5.8 · ferment 4.6 · legume 3.9. Whole grains are up (all-time 3.0 →
  3.4); legumes remain the smallest category (3.6).
- **Long tail:** 200 of 224 plants ever logged (24 never), was 196 (2026-09-28).
- First tastes logged on `kid` members: 21.

## Related pages
- [[source-supabase-metrics]] · [[concept-brand-pillars]] · [[concept-stickiness-moat]] ·
  [[concept-word-of-mouth]] · [[overview]]
