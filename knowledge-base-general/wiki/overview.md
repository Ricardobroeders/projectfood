---
title: Overview
type: overview
tags: [meta]
created: 2026-05-30
updated: 2026-05-30
sources: [source-brand-promise-deck.md, source-app-mockups.md]
---

# Project Food — Overview

The synthesized big-picture entry point for this knowledge base.

> **Mission:** help people enjoy healthy food habits.
> **Brand promise:** *Eat 30 different plants a week. Good gut, good life.*

## Where things stand
*(as of 2026-05)* Project Food is a mobile PWA built around one mechanic: counting **different
plants eaten per week, targeting 30**. The number 0–30 is the product. Four brand pillars and a
clear growth/retention thesis are documented in the [[source-brand-promise-deck]]; the shipped
product surfaces are corroborated by the [[source-app-mockups]]. Localized in EN/NL/IT.

## Business & strategy
- **The mechanic:** [[concept-30-plants-a-week]] — the brand promise and core product loop.
- **Guardrails:** [[concept-brand-pillars]] — Count don't preach · Different beats more ·
  Effortless in the moment, meaningful by Sunday · Joy not guilt. Each has "we never" rules.
- **Growth:** [[concept-word-of-mouth]] — three talkable moments, never nagging.
- **Retention/moat:** [[concept-stickiness-moat]] — recurring weekly utility ("without us,
  Sunday gets harder"), not the distant health payoff.
- **Origin of the mechanic:** [[concept-30-plants-origin]] — "30 plants" comes from the American
  Gut Project (2018) and [[entity-tim-spector]] / [[entity-zoe]]; it's public-health guidance,
  not an ownable idea.
- **Competitive landscape:** the "30 plants" tracker space is crowded — [[entity-zoe]] (premium),
  [[entity-eating30]] and [[entity-30plants-ai]] (direct), plus a long tail of solo checklists.
  Project Food's wedge is social + gamified + joy + free PWA, not the number. See
  [[compare-projectfood-vs-competitors]] and [[source-competitor-scan]].
- **Competitive contrast (from the deck):** [[entity-myfitnesspal]] — the anti-pattern, though
  it's not the real competitive set.

## Product & user research
- **Target user:** [[persona-believer]] — believes food affects how they feel, wants a simple
  gamified way to act on it. *(Inferred from strategy — not yet validated with interviews.)*
- **Surfaces (from mockups):** Home (ring to 30, friends, weekly collection), Stats (streak,
  plants tried, history), Log (searchable 150+ plants), Top 15 leaderboard, Social, Profile
  (PWA install, avatars, weekly goal). See [[source-app-mockups]].

## Metrics (early cohort, ~5 weeks)
*From the live DB as of 2026-05-30 — 13 active users, friends-and-family cohort, directional
only. Source: [[source-supabase-metrics]].*
- **State:** WAU peaked at 10 then eased to 7; weekly goal completion trending up to ~57%; only
  6 of 13 have ever hit 30 in a week. See [[concept-engagement-snapshot]].
- **Behaviour:** 98.5% same-day logging (supports Pillar 3), but session-based (~8 plants/day);
  diet skews to staples, with legumes/grains/ferments structurally under-logged (<9%). See
  [[concept-logging-behaviour]].
- **Drivers:** users with friends are ~2× as engaged — the most actionable early signal. See
  [[concept-engagement-drivers]].

## Open questions
- Brand deck has no publish date — strategy treated as current as of 2026-05.
- Which "moat"/roadmap features are actually shipped vs. roadmap (restaurant moment; weekly
  grocery list)?
- [[persona-believer]] is unvalidated — real user research would sharpen or split it.
- Strategy gap: the brand deck names only MyFitnessPal, but the real rivals are the "30 plants"
  trackers + ZOE — and Project Food's logging breadth (~150 plants, tap-only) trails some of them.
- Metrics are a tiny friends-and-family cohort; churn now readable (view fixed 2026-05-30) and
  rising W-o-W, but noisy at this scale; does the friends→engagement signal hold up, and is
  logging really "tap as you eat" vs end-of-day?

---
See the full catalog in [[index]].
