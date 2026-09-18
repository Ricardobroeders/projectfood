---
title: Strategy backlog (undecided core ideas)
type: backlog
tags: [strategy, decisions, backlog]
created: 2026-09-10
updated: 2026-09-16
sources: []
---

# Strategy backlog (undecided core ideas)

**In one line:** The standing register of concept and strategy topics that are not yet decided,
one row each, with what the wiki already holds, the open question, and the next step. Linear
holds execution work; this page holds thinking that still needs a call from Ricardo.

## How to use this page
- Every strategy conversation ends by updating the relevant row (status, open question, next).
- Statuses: **open** (no proposal yet) · **drafted** (a wiki page or proposal exists, awaiting
  Ricardo's call) · **parked** (deliberately later) · **decided** (a `decision-` page exists; the
  row moves to the Decided table below).
- When a topic is decided, write `decision-YYYY-MM-DD-<slug>.md`, link it here, and move the row.
- Add topics freely; remove none. Date every status change.

## Next to pick up
_Maintained by Claude after every session; this is the answer to "what's next?". Updated 2026-09-18._

**Ricardo's decisions and accounts**
1. Store POC prerequisites (see [[decision-2026-09-16-store-poc-scope]]): custom SMTP (Resend) in Supabase Auth for the email code; Google OAuth client ids for Android (EAS keystore SHA-1 + Play App Signing SHA-1) and iOS; a Firebase project for FCM (`google-services.json`); Apple Developer enrolment (Individual) for iOS builds, Apple sign-in and TestFlight.
2. Accent on device: true blue or teal (row 2). The app icon and splash wait on it.
3. Try the stamp ladder on device (row 5, [[concept-achievement-system]]) and say which targets feel off.
4. Business model: pick the free/paid boundary (option A/B/C) and confirm €3.99 / €39.99 with an introductory year (row 9, [[concept-business-model]]). Payments stay off in the store POC.
5. Review the generated kid facts and parent tips (row 13): `node scripts/generate-plant-facts.mjs --review` in `projectfood-mobile`.
6. Five parent conversations (Linear PF-55).

**Claude's next build steps**
7. Device testing continues over USB (`adb reverse`, the tunnel proved unreliable); next: two-member logging with a kid profile, plant page, account screens.
8. Rung pushes at 50% and 75% in `send-notifications` (row 5).
9. Privacy page with kids' data, push and deletion sections plus a web `/delete-account` page on projectfood.dev (row 14); remove the Vercel web-push cron and routes from the PWA.
10. Play internal testing → closed testing (12 testers × 14 days); iOS build + TestFlight once Apple is enrolled.
11. Then the deferred v1 features in order: cheers between households, albums, Sunday shopper advice with RevenueCat.

## Inputs waiting for a brainstorm
Raw ideas Ricardo dropped for a later session; each is linked to its row and will be challenged
when we sit down. Source: `raw/ricardo-brainstorm-2026-09-10-plane.md`.

- **Gold / XP economy (row 5, 9).** Earn gold per person per tasted plant; when several family
  members taste the same plant each earns it; spend gold on avatars and profile borders; social
  comparison as motivation. _(Ricardo, 2026-09-10; touches the "drop XP" lean in
  [[concept-achievement-system]] and the "no pay-to-win, rewards are earned" rule)_
- **Fun facts and borders at 5 / 50 / 100 tastings (row 5).** Tibia-bestiary style: a plant's
  facts and border colour unlock in steps as it is tasted more often, giving purpose beyond
  invisible health benefits. _(Ricardo, 2026-09-10; compare with the 1 / 5 / 10 card levels)_
- **KPI list (row 11).** Install rate from the stores and the website, average check-offs per
  active user, churn rate, most eaten plants, "30 different plants" achievements per user,
  average streak length. _(Ricardo, 2026-09-10; all PWA-era metrics, to be mapped to the
  household model)_
- **Invite a friend (rows 9, 12).** Referral reward such as a free period of the paid plan.
  _(Ricardo, 2026-09-10)_

## Summary
| # | Topic | Status | Next step |
|---|---|---|---|
| 1 | Value proposition | open | Rewrite for the household parent after the five parent conversations (PF-55) |
| 2 | Brand guidelines | drafted | Decide the accent on device (blue vs teal); then bind app theme to Figma variables |
| 3 | Customers / personas | drafted | Five parent conversations → `interview-` pages → decide the leading age band |
| 4 | Customer retention strategy | drafted | Notification policy shipped in the store POC (essential/marketing split, three ignored → a week of quiet, freeze streak); still to write: the five-family test protocol (week 4 / week 8) before TestFlight |
| 5 | Achievements | drafted | Ladder built 2026-09-18 ([[concept-achievement-system]]): 17 stamps × up to four levels with prize renders and level rings; targets tunable in code. Still open: rung pushes at 50/75%, "refused" tap, albums |
| 6 | SEO strategy | drafted | Keyword volumes (DataForSEO) before any content spend |
| 7 | Social media strategy | open | Decide "none until five families" vs one channel |
| 8 | Tone of voice | open | Write the family voice (two registers), then package as a writing skill |
| 9 | Business model | drafted | Pick option A/B/C and confirm prices in [[concept-business-model]]; `households.plan` (free/family) exists since 2026-09-16, payments off in the store POC |
| 10 | Market | drafted | Kids-food competitor teardown + NL/IT household sizing |
| 11 | KPIs / success definition | open | Instrumentation live since 2026-09-16 (`app_events`, `notification_log` sent/delivered/opened/logged-within-3h); still to pick the five numbers before TestFlight |
| 12 | Go-to-market & acquisition | open | How the first class is recruited; founder-seeded vs organic (added by Claude) |
| 13 | Content & localisation pipeline | drafted | Facts generated for en/nl/it on 2026-09-16 (`plant_facts`, status generated) by `scripts/generate-plant-facts.mjs`; Ricardo reviews; de/fr facts + 448 plant names when DE/FR listings are scheduled |
| 14 | Privacy & kids' data | open | Needed before Play review: privacy page covering kids' data (the app stores first name + kid/adult only), push, deletion; web `/delete-account` page |
| 15 | Naming & store presence | open | Bundle id `dev.projectfood.app` fixed on 2026-09-16; keep "Project Food"? Icon needs the accent; listing assets and screenshots before Play closed testing |
| 16 | Partnerships (schools, brands) | parked | Revisit after the first class replicates (added by Claude) |

## Topics

### 1. Value proposition — open
- **Have:** [[concept-30-plants-a-week]] (adult promise, "the number is the product"),
  [[source-brand-promise-deck]], [[decision-2026-09-06-family-mode-pivot]].
- **Open:** one sentence each for the parent (what they buy: the kid eats measurably more plants
  over months) and the kid (the collection). Where the adult tracker sits, if anywhere.
- **Next:** draft after PF-55; file as `decision-…-value-proposition`. _(status 2026-09-10)_

### 2. Brand guidelines — drafted
- **Have:** [[concept-brand-pillars]] (four pillars, "we never" rules); Figma design system
  (colours, fonts, components; file key in Ricardo's Figma); `design-library/README.md`
  (local, gitignored) with the family re-brief; POC rules encoded in the app (motion classes,
  radius by height, icons ≈ 45%); [[decision-2026-09-07-app-v1-scope]] design section.
- **Open:** accent colour (true blue vs teal, both on the device switch); app icon and brand
  mark once the accent is functional; illustration style for Rive (PF-53); role-named Figma
  variables so the app can bind to them.
- **Next:** Ricardo decides the accent on device; Claude binds the theme and writes
  `decision-…-visual-identity`. _(status 2026-09-10)_

### 3. Customers / personas — drafted
- **Have:** [[persona-household-parent]] (family), [[persona-believer]] (adult PWA).
- **Open:** which age band leads the design (3–6 with the Tiny Tastes evidence, or 6–11 with
  the school class); the teacher or class organiser as a second persona; whether the adult
  persona is retired. No `interview-` pages exist yet.
- **Next:** PF-55 five parent conversations → `interview-` pages → update the persona and
  decide the age band. _(status 2026-09-10)_

### 4. Customer retention strategy — drafted (hypothesis)
- **Have:** [[concept-retention-loop]], [[concept-stickiness-moat]],
  [[concept-engagement-drivers]], [[concept-engagement-snapshot]],
  [[source-supabase-metrics-2026-09]].
- **Open:** notification policy in detail (dinner-time question, quiet after three ignored,
  freeze); the week-4 and week-8 test with five families (D13); the class channel's role in
  retention versus acquisition.
- **Next:** write the five-family test protocol as a decision page before TestFlight.
  _(status 2026-09-10)_

### 5. Achievements — drafted
- **Store POC (2026-09-16):** 16 stamps on real history in the Unlocks tab, unlock rows in
  `achievement_unlocks`, one celebration sheet per session, XP dropped.
- **Finding (2026-09-18):** every engaged account unlocked all 16 on day one; the shelf has
  nothing left to aim at. Ladder proposal with four levels per stamp, calibrated on the 14
  members' live counts and the retention curve (cliffs at week 0→1 and weeks 5→7), in
  [[concept-achievement-system]] with the prize-image list.
- **Have:** [[concept-achievement-system]] (three tiers, eight rules, the ladder with today's
  standings per level, image topics), stamps on device.
- **Open:** Ricardo confirms or adjusts the level targets; a "refused" tap at logging for Brave
  bite; the real album list (category "all" levels stand in for albums until then).
- **Built (2026-09-18):** `level` column, engine, level copy en/nl/it, rings on the shelf, the ladder in
  the stamp sheet, 17 prize renders and the card-level cups on device.
- **Next:** watch which rungs families sit on after a month; add the 50% / 75% rung pushes to
  `send-notifications`. _(status 2026-09-18)_

### 6. SEO strategy — drafted
- **Have:** [[seo-overview]], [[seo-keyword-strategy]], [[seo-serp-landscape]],
  [[seo-content-types]], [[seo-app-store-aso]], [[seo-roadmap]], [[seo-technical-audit]]
  (all 2026-09-06, family mode).
- **Open:** parent-cluster keyword volumes before content spend (DataForSEO connector needs
  authorisation); de/fr timing; who writes, which depends on topic 8.
- **Next:** DataForSEO pull, then approve roadmap phase 1. _(status 2026-09-10)_

### 7. Social media strategy — open
- **Have:** [[concept-word-of-mouth]] (three talkable moments), class WhatsApp group as launch
  channel ([[source-family-mode-context]] §6), the monthly recap card as a forwardable unit
  (v1 feature 11).
- **Open:** any channel beyond class groups before launch? Instagram or TikTok for NL/IT
  parents; founder building in public; the recap card as the only "social" asset.
- **Next:** decide "none until five families" versus one channel. Claude's lean: none; the
  recap card is the social strategy until the app exists. _(status 2026-09-10)_

### 8. Tone of voice — open
- **Have:** adult voice rules in `design-library/README.md` (calm, second person, sentence
  case, no exclamation marks; written for adults, local file); five-locale decision (S6).
- **Open:** the family voice has two registers in one app (parent-facing calm, kid-facing
  playful); per-locale conventions (Dutch "je", Italian "tu", German "du/Sie" choice, French
  "tu/vous"); what a Rive mascot says, if anything.
- **Next:** write `concept-tone-of-voice` with the two registers and examples per surface;
  then package it as a Claude skill so SEO and store copy use it (Ricardo's point,
  2026-09-10). _(status 2026-09-10)_

### 9. Business model — drafted (Linear PF-54)
- **Have:** [[decision-2026-09-07-app-v1-scope]] S3/S4 (Supabase Free until paying
  households, RevenueCat, store commission after VAT: ≈ €21 kept of €29.99/yr, ≈ €2.80 of
  €3.99/mo); Sunday shopper advice as the paid feature (feature 11); Ricardo's 2026-09-08
  brainstorm: ship the basic version without payments first.
- **Open:** free/paid boundary; monthly vs annual and price points; trial length; a class or
  teacher tier; when payments switch on.
- **Drafted 2026-09-10:** [[concept-business-model]] (goal ladder, net revenue per price,
  three boundary options with lean A, timing, affiliate facts and illustration, PF-38 needs).
- **Next:** Ricardo picks the boundary option and confirms €3.99 / €39.99 with an introductory
  year; then `decision-…-business-model` before the data model is final. _(status 2026-09-10)_

### 10. Market — drafted for adults, open for families
- **Have:** [[compare-projectfood-vs-competitors]], [[source-competitor-scan]], [[entity-zoe]],
  [[entity-myfitnesspal]], [[entity-eating30]], [[entity-30plants-ai]],
  [[seo-serp-landscape]] (picky-eater app field).
- **Open:** NL and IT households with children 3–11 (sizing); kids-food apps as entity pages
  (Solid Starts, Tiny Tastes and peers); school-channel dynamics NL vs IT; is family mode the
  wedge or one segment ([[overview]] open question).
- **Next:** teardown of three kids-food apps plus a sizing page. _(status 2026-09-10)_

### 11. KPIs / success definition — open
- **Have:** [[concept-engagement-snapshot]] (PWA KPIs), the "watch" list in
  [[decision-2026-09-07-app-v1-scope]] (dinners logged per household per week at week 4 and 8;
  notification → log within 3 h by type), SEO KPIs in [[seo-roadmap]].
- **Open:** what success looks like for v1 in numbers (Ricardo's 2026-09-08 brainstorm, point
  1); a north-star candidate (kid taste count growth, or dinners logged per household per
  week); activation, retention and revenue targets for the five-family test; the
  instrumentation list.
- **Next:** write `decision-…-v1-success-metrics` with five numbers before TestFlight.
  _(status 2026-09-10)_

### 12. Go-to-market & acquisition — open _(added by Claude)_
- **Have:** [[source-family-mode-context]] §6 (class WhatsApp group), [[seo-overview]] (SEO is
  not the launch channel), [[concept-word-of-mouth]].
- **Open:** how the first five families and the first class are recruited; founder-seeded
  versus organic replication; NL lunchbox versus IT mensa timing.
- **Next:** after PF-55. _(status 2026-09-10)_

### 13. Content & localisation pipeline — open _(added by Claude)_
- **Have:** consequence in [[decision-2026-09-07-app-v1-scope]]: 224 plants × 2 facts × 5
  locales, plus de/fr `plant_translations` rows; existing content pipeline from the PWA.
- **Open:** generation and review workflow; who approves de and fr; where reviewed copy lives;
  translation QA.
- **Next:** define once topic 8 exists. _(status 2026-09-10)_

### 14. Privacy & kids' data — open _(added by Claude)_
- **Have:** nothing in the wiki. The app will store a child's name, age band and eating record
  under a parent's account.
- **Open:** GDPR basis and parental consent; data minimisation (age band, not birth date; first
  name or nickname only); retention and deletion; Apple and Google family policies while staying
  out of the Kids Category; a short privacy notice in five locales.
- **Next:** one page before onboarding asks for a child's name and age. _(status 2026-09-10)_

### 15. Naming & store presence — open _(added by Claude)_
- **Have:** "Project Food" is a working name (design-library brief: final naming is the
  founder's call); [[seo-app-store-aso]] for listing structure; Google Play Console account
  approved 2026-09-10; Apple Developer enrolment pending.
- **Open:** keep the name; app subtitle; icon once the accent is decided.
- **Next:** decide before the first store listing. _(status 2026-09-10)_

### 16. Partnerships (schools, brands) — parked _(added by Claude)_
- **Have:** the class channel is a distribution idea, not a partnership yet.
- **Next:** revisit after the first class replicates without founder seeding.
  _(status 2026-09-10)_

## Decided
| Date | Decision | Page |
|---|---|---|
| 2026-09-06 | Pivot to a family app on native Expo | [[decision-2026-09-06-family-mode-pivot]] |
| 2026-09-07 | v1 scope, stack (S1–S6), eleven features, out-of-scope list | [[decision-2026-09-07-app-v1-scope]] |
| 2026-09-16 | Store POC scope: PWA features + multi-member logging first; social, XP, advice deferred or dropped | [[decision-2026-09-16-store-poc-scope]] |

## Related pages
- [[overview]] · [[index]] · [[concept-retention-loop]] · [[concept-achievement-system]] ·
  [[decision-2026-09-07-app-v1-scope]] · [[decision-2026-09-16-store-poc-scope]]
