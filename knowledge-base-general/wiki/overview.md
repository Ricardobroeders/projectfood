---
title: Overview
type: overview
tags: [meta]
created: 2026-05-30
updated: 2026-09-06
sources: [source-family-mode-context.md, source-brand-promise-deck.md, source-app-mockups.md, source-supabase-metrics.md]
---

# Project Food — Overview

The synthesized big-picture entry point for this knowledge base.

> **Mission:** help people enjoy healthy food habits.
> **Brand promise:** *Eat 30 different plants a week. Good gut, good life.*

## Where things stand
*(as of 2026-09-06)* Project Food is **pivoting to a family app**. Parents are the payer and
the logger, kids are the motivation engine, dinner is the daily habit anchor, groceries the
weekly planning moment. The household collects 30 different plants a week *together*; tasting
a plant unlocks its card. Native iOS/Android (Expo) replace the PWA; Next.js marketing site and
Supabase stay. Launch channel: the school class (parents' WhatsApp group), first class targeted
for November 2026. Direction agreed, **not yet validated** (five families, then one class).
Source: [[source-family-mode-context]]; decisions: [[decision-2026-09-06-family-mode-pivot]].

*History (as of 2026-05):* a mobile PWA for adults built around one mechanic — counting
different plants per week, targeting 30. Brand promise, pillars and growth thesis from the
[[source-brand-promise-deck]]; surfaces in [[source-app-mockups]]. EN/NL/IT. That product is
live and its users are the current cohort.

## Business & strategy
- **The direction:** [[decision-2026-09-06-family-mode-pivot]] — family mode, native apps,
  household data model, cooperative goals, plant cards, class launch. Fourteen decisions.
- **The mechanic:** [[concept-30-plants-a-week]] — unchanged: the count is the product; now
  counted per household.
- **Guardrails:** [[concept-brand-pillars]] — Count don't preach · Different beats more ·
  Effortless in the moment, meaningful by Sunday · Joy not guilt. Reaffirmed by the pivot;
  family mode is called "the purest expression of Joy, not guilt". Plus: **no health claims in
  marketing**.
- **Growth:** [[concept-word-of-mouth]] — talkable moments, never nagging; now concretely:
  card unlocks, collective class milestones, the class WhatsApp group as the unit of spread.
  SEO is a background asset, not the launch channel ([[seo-overview]]).
- **Retention/moat:** [[concept-stickiness-moat]] — the dinner-table question (daily) and the
  household shopper's Sunday advice (weekly); measured as dinners logged per household per week.
- **Origin of the mechanic:** [[concept-30-plants-origin]] — public-health guidance, not
  ownable. For families the science base shifts to behaviour (Food Dudes, Tiny Tastes: reward
  tasting, ~10–15 exposures), which needs no health claims.
- **Competitive landscape:** adult side — [[entity-zoe]], [[entity-eating30]],
  [[entity-30plants-ai]], a long tail of solo checklists, and now Clove with social features
  ([[compare-projectfood-vs-competitors]], [[source-competitor-scan]]). Family side —
  picky-eater/family apps (Yummi, EatPal, Food Explorer Club, Teach Your Monster, Food Hopper;
  Spoony in NL) and parenting publishers; ZOE cannot follow ([[seo-serp-landscape]]).
- **Search & stores:** `wiki/seo/` — parent-intent keyword strategy (NL/IT/EN), SERP
  landscape, content formats, App Store/ASO plan, technical audit, gated roadmap.
- **Competitive contrast (from the deck):** [[entity-myfitnesspal]] — the anti-pattern.

## Product & user research
- **Target user:** [[persona-household-parent]] — the dinner-table parent; holds the phone,
  pays, kid taps. *(Provisional; validate with five parent conversations.)*
  Legacy: [[persona-believer]] — the adult tracker, still the current user base.
- **Validation plan:** behavioural data pull (who logs past week 4, hour of day, drop-off),
  then five 15-minute parent conversations. The [[research-survey-plan]] is deprioritised
  (2–3 responses; wrong audience for family questions).
- **Surfaces (PWA, from mockups):** Home ring, Stats, Log (searchable plants), leaderboard,
  Social, Profile. See [[source-app-mockups]]. Family-mode surfaces: not yet designed.

## Metrics (early adult cohort, as of 2026-05-30)
*13 active users, friends-and-family, directional only. Source: [[source-supabase-metrics]].*
- **State:** WAU peaked at 10 then eased to 7; goal completion ~57%; 6 of 13 ever hit 30.
  See [[concept-engagement-snapshot]].
- **Behaviour:** 98.5% same-day logging, session-based (~8 plants/day); legumes/grains/ferments
  under-logged. See [[concept-logging-behaviour]].
- **Drivers:** users with friends ~2× as engaged — the signal the household model builds on.
  See [[concept-engagement-drivers]].
- **Stale:** a fresh pull (week-4 survivors, hour of day) is the first validation step.

## Open questions
- Is family mode *the* wedge or one segment beside the adult tracker? Test, don't decide.
- Does the dinner habit hold past week 4 in the five families? Does a class replicate without
  founder seeding?
- Household pricing (~€29.99/yr assumption); class-challenge mechanics; NL lunchbox vs IT mensa.
- Which age band leads the design: 3–6 (Tiny Tastes evidence) or 6–11 (school class)?
- `STRATEGY.md` (May 2026) is out of date on audience, platform and distribution; rewrite when
  the five conversations are in.
- Clove (adult tracker) now has social features — the old "social moat" question; less
  relevant if the wedge is families, still worth a hands-on look.
- Parent-cluster keyword volumes (DataForSEO) before any content investment.

---
See the full catalog in [[index]].
