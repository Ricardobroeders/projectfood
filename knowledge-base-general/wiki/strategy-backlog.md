---
title: Strategy backlog (undecided core ideas)
type: backlog
tags: [strategy, decisions, backlog]
created: 2026-09-10
updated: 2026-09-10
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
_Maintained by Claude after every session; this is the answer to "what's next?". Updated 2026-09-10._

**Ricardo's decisions**
1. Accent on device: true blue or teal (row 2). Then Claude binds the app theme to Figma variables.
2. Achievements: XP keep or drop, where the collection lives in navigation, a "refused" tap at logging (row 5).
3. Business model: pick the free/paid boundary (option A/B/C) and confirm €3.99 / €39.99 with an introductory year (row 9, [[concept-business-model]]).
4. Accounts: `npx eas-cli login` in `projectfood-mobile`; Apple Developer enrolment (Individual). Google Play done 2026-09-10.
5. Five parent conversations (Linear PF-55).

**Claude's next build steps (after the above)**
6. PF-38 family data model on a Supabase branch, with the household entitlement from row 9.
7. Bind the theme to role-named Figma variables; write `decision-…-visual-identity`.
8. Draft tone of voice (row 8) and the privacy & kids' data page (row 14).
9. Five-family test protocol and the five v1 success numbers (rows 4, 11) before TestFlight.

## Summary
| # | Topic | Status | Next step |
|---|---|---|---|
| 1 | Value proposition | open | Rewrite for the household parent after the five parent conversations (PF-55) |
| 2 | Brand guidelines | drafted | Decide the accent on device (blue vs teal); then bind app theme to Figma variables |
| 3 | Customers / personas | drafted | Five parent conversations → `interview-` pages → decide the leading age band |
| 4 | Customer retention strategy | drafted | Write the five-family test protocol (week 4 / week 8) before TestFlight |
| 5 | Achievements | drafted | Ricardo decides XP, navigation home, "refused" tap; fold into PF-38 |
| 6 | SEO strategy | drafted | Keyword volumes (DataForSEO) before any content spend |
| 7 | Social media strategy | open | Decide "none until five families" vs one channel |
| 8 | Tone of voice | open | Write the family voice (two registers), then package as a writing skill |
| 9 | Business model | drafted | Pick option A/B/C and confirm prices in [[concept-business-model]]; then decision page before PF-38 (PF-54) |
| 10 | Market | drafted | Kids-food competitor teardown + NL/IT household sizing |
| 11 | KPIs / success definition | open | Five numbers that define v1 success, before TestFlight |
| 12 | Go-to-market & acquisition | open | How the first class is recruited; founder-seeded vs organic (added by Claude) |
| 13 | Content & localisation pipeline | open | Generation + review workflow for 224 plants × 2 facts × 5 locales (added by Claude) |
| 14 | Privacy & kids' data | open | One page before onboarding asks for a child's name and age (added by Claude) |
| 15 | Naming & store presence | open | Keep "Project Food"? Decide before the store listing (added by Claude) |
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
- **Have:** [[concept-achievement-system]] (three tiers, eight rules, ten starting stamps, link
  to the paid Sunday advice), POC stamps on device (PF-56).
- **Open:** XP keep or drop (lean: drop); where the collection lives in navigation; a "refused"
  tap at logging for Brave bite; the real album list (12 is a placeholder).
- **Next:** Ricardo decides the three items; requirements fold into the PF-38 data model.
  _(status 2026-09-10)_

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

## Related pages
- [[overview]] · [[index]] · [[concept-retention-loop]] · [[concept-achievement-system]] ·
  [[decision-2026-09-07-app-v1-scope]]
