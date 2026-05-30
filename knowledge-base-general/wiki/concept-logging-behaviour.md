---
title: Logging behaviour
type: concept
tags: [metrics, product, behaviour]
created: 2026-05-30
updated: 2026-05-30
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

## Related pages
- [[source-supabase-metrics]] · [[concept-brand-pillars]] · [[concept-stickiness-moat]] ·
  [[concept-word-of-mouth]] · [[overview]]
