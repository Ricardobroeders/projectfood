---
title: Family app v1 scope, stack and languages
type: decision
tags: [decision, family-mode, native-app, scope, i18n, design, rive, costs]
created: 2026-09-07
updated: 2026-09-07
date: 2026-09-07
status: accepted   # working scope for the greenfield build; feature priorities re-checked after the five parent conversations
sources: [source-supabase-metrics-2026-09.md, source-family-mode-context.md]
---

# Family app v1 scope, stack and languages

**Date:** 2026-09-07  **Status:** accepted (working scope; re-check after the five parent conversations)

## Context
[[decision-2026-09-06-family-mode-pivot]] set the direction. On 2026-09-07 Ricardo decided the
mobile app is a **greenfield rebuild**, not a port: the PWA's `(app)` routes are legacy and will
be unsupported once the store apps are live; only knowledge and assets carry over (plant
catalog, 3D clay images, advice prompt, translations, lessons learned). The September data pull
([[source-supabase-metrics-2026-09]]) showed why: the PWA had an action but no accumulating
reward, weak triggers and a hidden profile ([[concept-retention-loop]]).

## Decision

### Stack (Flutter reconsidered and not chosen)
| # | Decision | Rationale |
|---|---|---|
| S1 | **Expo (React Native) + TypeScript**, Expo Router, EAS Build and EAS Update | One vendor for cloud builds, over-the-air updates and push; TypeScript is where AI-written code is most reliable and Ricardo can read it; Flutter judged a solid second choice, not a mistake |
| S2 | **Supabase is the only backend**: Postgres, Auth (Apple + Google sign-in), Storage, Edge Functions (OpenAI advice call, push sending via Expo's push API), pg_cron | Removes Vercel from the app's path; Next.js stays as marketing site only |
| S3 | **Launch on Supabase Free**; upgrade to Pro once paying households exist (≈13 annual at €29.99 or ≈9 monthly at €3.99 cover it) | Ricardo wants paid users before fixed costs. Mitigations: a daily DB-touching job, Resend as custom SMTP or social-only sign-in, weekly database dump for backup |
| S4 | **RevenueCat** over Apple IAP and Play Billing; enrol in Apple's Small Business Program before the first sale | Free under $2,500 monthly tracked revenue, then 1%; the 15% store commission applies regardless and is computed after VAT (≈ €21 kept of €29.99/yr, ≈ €2.80 of €3.99/mo) |
| S5 | **Rive** for character, card and celebration animation; Reanimated for UI motion; Skia for particles | Kid-grade animation does not change the framework; Rive files are framework-independent |
| S6 | **Five locales from day one** in the string layer: en, nl, it, de, fr | Cheap to add with AI translation; launch *markets* stay NL and IT (class channel); DE/FR store listings follow later |

### v1 feature set (what the PWA never had)
*Reward that accumulates*
1. **Cards level with tastings**, per kid: first taste unlocks, 5 tastes silver, 10 gold.
   Never resets. Parent-facing metric: plants the kid eats now vs at start.
2. **Albums** by botanical family with kid names ("The Tomato Family" for nightshades), by
   colour (rainbow) and seasonal time-limited sets; completion % per album; ~12 albums to start.
3. **Facts on the card back**: one kid fact and one parent tip per plant, revealed on unlock;
   generated and reviewed through the existing content pipeline in five locales.
4. **Avatar per kid**, built in the first minute, on the home screen; accessories unlock on
   album completion.

*Triggers*
5. Dinner question at the household's real dinner time; asked at onboarding, corrected from logs.
6. Streak keeper only when at risk, positively framed; freeze covers a miss (D7).
7. Card-teaser re-engagement after three missed dinners ("Your pumpkin card is waiting").
8. Cheers between households with a one-tap sticker reply, capped at one a day; a weekly class
   milestone number.
9. Push permission after the first successful log (D9); every push instrumented: sent,
   delivered, opened, logged within 3 h.

*Action*
10. Log at the table in under a minute: "who tasted it?" per kid, household's frequent plants
    first, "same as last time".

*Parent payoff*
11. Sunday shopper advice (D11, the paid feature) and a monthly recap card the parent can
    forward to the class group.

### Explicitly out of v1
Quizzes; class challenges beyond the milestone number; lock-screen widgets; printable cards;
recipe library; calorie or macro tracking; sibling competition; Apple Kids Category; Capacitor;
PWA parity.

### Design library
`design-library/` was briefed for adults ("not gamified for kids") and diverges from the live
PWA (chartreuse + Instrument Serif + 1.5px borders vs yellow + Plus Jakarta Sans + borderless).
Decision: **re-brief for family mode before the Expo scaffold is styled.** Open for Ricardo's
research: an illustration style for characters and avatars that sits next to the existing 3D
clay plant renders and works in Rive. Details: `design-library/README.md` → "Family mode
re-brief (2026-09-07)".
Ricardo's stated preference (2026-09-07): flat elements, little shading, a hint of depth; six
Rive marketplace references and an avatar-builder architecture note are recorded there.

## Rationale
- **Data:** reaching 30 did not retain (7 of 13 hit it, 5 left); streak rescue 46% vs daily
  reminder 8%; 46% of logs at 17:00–21:00; avatars hidden → 5 of 15 used them
  ([[source-supabase-metrics-2026-09]]).
- **Science:** rewarding *tasting*, ~10–15 exposures (Tiny Tastes, Food Dudes). Cards that
  level with tastings encode this directly and need no health claims.
- **Cost:** every item in S3/S4 keeps the monthly bill at €0 at launch; fixed costs are the
  store accounts only (€99/yr Apple, $25 once Google).

## Alternatives considered
- **Flutter** — equal animation capability (Rive/Lottie work in both); needs three vendors
  (Codemagic builds, Shorebird code push, FCM push) to match Expo's one; Dart is not readable
  by the founder. Not chosen; revisit only for a real-time game loop.
- **Supabase Pro from day one** — safer (backups, no pause) but €25/month before revenue.
  Deferred with mitigations.
- **Web checkout to avoid store commission** — EU link-out rate is 10% vs 15% (Apple EU terms
  from 2026-10-01) but adds VAT filing, processor fees, a 12-month commitment and a conversion
  hit. Not worth it below a few thousand euro a month.
- **Port the PWA screens** — rejected 2026-09-06 (no parity rebuild).

## Consequences
- Work is tracked in Linear (team Project Food, project "Family app v1"); this page and
  [[concept-retention-loop]] are the spec the issues link to.
- The family-mode data model (D3) must carry per-member taste counters and album membership
  from the first migration.
- Content: 224 plants × 2 facts × 5 locales, plus `plant_translations` rows for de and fr (448).
- The **business model** (free vs paid boundary, price and period, trial, class tier) is still
  open and shapes the schema; decide before the data model is final.
- Watch: dinners logged per household per week at week 4 and week 8 (D13); notification → log
  within 3 h, by type.

## Related pages
- [[overview]] · [[decision-2026-09-06-family-mode-pivot]] · [[concept-retention-loop]] ·
  [[source-supabase-metrics-2026-09]] · [[persona-household-parent]] ·
  [[concept-stickiness-moat]] · [[seo-app-store-aso]]
