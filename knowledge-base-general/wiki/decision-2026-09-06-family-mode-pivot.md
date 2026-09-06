---
title: Family mode pivot + native apps
type: decision
tags: [decision, family-mode, native-app, data-model, growth]
created: 2026-09-06
updated: 2026-09-06
date: 2026-09-06
status: accepted   # direction agreed; validation (five families, one class) still pending
sources: [source-family-mode-context.md]
---

# Family mode pivot + native apps

**Date:** 2026-09-06  **Status:** accepted (agreed direction, pre-validation, pre-build)

## Context
Project Food launched (April 2026) as a PWA for adults tracking 30 different plants a week.
Solo adult users proved hard to retain (see [[concept-engagement-snapshot]]), and one strong
real-world observation — kids at a family birthday turning the app into a plant-hunting game —
pointed at a different owner of the habit: the household. Full reasoning in
[[source-family-mode-context]].

## Decision
Project Food becomes a **family app**: parent's account and phone, kids tap, the household
collects 30 plants a week together, dinner is the daily anchor, groceries the weekly one.
Native iOS + Android replace the PWA as the client. Launch through school classes.

| # | Decision |
|---|---|
| D1 | Native iOS + Android via Expo / React Native, EAS builds, expo-notifications |
| D2 | Next.js stays for marketing site + SEO; Supabase unchanged |
| D3 | Household is the primary unit: `household → members (adult/kid) → per-member logs and collections` |
| D4 | Cooperative goal inside the household (family reaches 30 together) |
| D5 | Social layer is asynchronous and *between* households (cousins, class); never head-to-head |
| D6 | Collective milestones for groups ("our class ate 100 different plants"); no loser; shareable |
| D7 | Family streak has a built-in freeze |
| D8 | Plant images (3D clay renders) become collectable cards: taste a plant → unlock its card |
| D9 | Push permission requested only after the first successful log |
| D10 | Notification copy is the dinner-table question ("What did the kids eat today?") opening straight into logging |
| D11 | AI weekly advice rewritten for the household shopper (gaps, season, how to serve so kids taste it) — the paid feature |
| D12 | Eco / seasonal / local stays as texture inside advice, never a brand theme |
| D13 | Retention metric = dinners logged per household per week, checked at week 4 and week 8 |
| D14 | Paid acquisition stays off until household lifetime value is known |

## Rationale
- Kids respond to the counting mechanic intrinsically; parents keep habits for the household
  more easily than for themselves.
- ZOE and the adult-tracker field cannot follow into families (medical framing, stricter YMYL
  for children); the behavioural science (Food Dudes, Tiny Tastes) is public and needs no
  health claims.
- Parent willingness to pay exists in adjacent categories.
- iOS PWA push needs a home-screen install first; parents will not do it. App Store presence
  is trust and is what gets shared in a class group.

## Alternatives considered
- **Kids app** — COPPA / GDPR-K, Apple Kids Category limits, child needs a device. Rejected.
- **Stay PWA and add family features** — fails at install/push for the audience. Rejected.
- **Wrap the Next.js app in Capacitor** — App Router does not export cleanly; Apple rejects
  thin wrappers. Rejected.
- **Rebuild to PWA parity first** — delays the only thing that needs validating. Rejected.
- **Sibling competition / leaderboards inside the family** — creates a loser at dinner;
  violates pillar 4. Rejected.
- **SEO or paid as launch channel** — too slow / off until LTV known. Background only.

## Consequences
- **Build:** Phase 1 ticket = family data model (household, members, per-member logs and
  collections, cooperative weekly goal, streak freeze); Expo scaffold; advice prompt rewrite;
  habit instrumentation (notification → open rate, time to log, dinners per household per week,
  week-4 cliff); class-challenge playbook for November.
- **Validate first:** behavioural pull from Supabase; five parent conversations; do not gate on
  the survey ([[research-survey-plan]] deprioritised).
- **Docs:** `STRATEGY.md` is out of date on audience, platform, distribution; pillars and
  non-goals reaffirmed. [[persona-household-parent]] is primary. SEO rewritten
  ([[seo-overview]]).
- **Watch:** week-4 dinner retention in the five families; whether a second class replicates
  without founder seeding; household pricing; class-challenge mechanics; NL school lunch vs IT
  mensa.

## Related pages
- [[overview]] · [[source-family-mode-context]] · [[persona-household-parent]] ·
  [[concept-brand-pillars]] · [[concept-word-of-mouth]] · [[concept-stickiness-moat]] ·
  [[compare-projectfood-vs-competitors]] · [[seo-overview]] · [[seo-roadmap]]
