---
title: Family Mode — strategic context (2026-09-06)
type: source
tags: [strategy, family-mode, pivot, native-app, growth, decision]
created: 2026-09-06
updated: 2026-09-06
origin: raw/FAMILY_MODE_CONTEXT.md — Ricardo's synthesis of a Claude Chat strategy session
date_published: 2026-09-06
ingested: 2026-09-06
---

# Family Mode — strategic context (2026-09-06)

**What it is:** Ricardo's direction document for the pivot from an adult gut-health tracker to
a **family app** with native iOS/Android clients. Status: *direction agreed, not yet validated,
pre-build.* It instructs any agent to read it before touching product scope, data model,
notifications or growth work.
**Origin:** `raw/FAMILY_MODE_CONTEXT.md`, written 2026-09-06 after a Claude Chat session.
**Raw file:** `raw/FAMILY_MODE_CONTEXT.md`

## Key takeaways
- **The observation.** At a nephew's birthday, kids who saw the app on a parent's phone treated
  it as a game and went hunting for fruit and vegetables instead of chips. Nobody preached.
  One data point, but consistent with what the pillars were designed to produce.
- **The repositioning.** Parents are the payer and the logger; kids are the motivation engine;
  dinner is the habit anchor; groceries are the planning moment; the AI weekly advice is
  rewritten for the household shopper.
- **Native, not PWA.** iOS + Android via Expo / React Native (EAS builds, expo-notifications).
  The PWA validated the concept but fails at "add to home screen before push works" for
  parents; the App Store link is what gets shared in a class WhatsApp group. Next.js marketing
  site, Supabase, plant catalog, images, advice prompt and the n8n image pipeline all stay. No
  Capacitor wrapper; no rebuild to PWA parity — family mode only.
- **Family app, not kids app.** Parent's account, one collection per household member, parent
  holds the phone, kid does the tapping. Rated 4+, not enrolled in Apple's Kids Category
  (avoids COPPA / GDPR-K constraints and the need for a child's own device).
- **Data model.** `household → members (adult/kid) → per-member logs and collections`.
  Cooperative goal inside the household (everyone's plants count toward 30); asynchronous
  comparison *between* households (cousins, class), never head-to-head; collective group
  milestones ("our class ate 100 different plants"); family streak with a built-in freeze.
- **Plant cards.** The 3D clay renders become a collectable card mechanic: taste a plant → unlock
  its card. Intrinsic reward, the most shareable artefact.
- **Retention metric.** Dinners logged per household per week, checked at week 4 and week 8.
  Not individual DAU.
- **Habit loop.** Daily: notification ~30 min after the household's *real* dinner time (asked
  at onboarding, corrected from log timestamps; NL ≈ 18:00, IT ≈ 20:00), phrased as the
  dinner-table question ("What did the kids eat today?") that opens straight into logging;
  kid taps; instant card unlock. Weekly: Sunday advice for the shopper. Push permission only
  after the first successful log. Three ignored notifications → it moves or goes quiet.
- **Launch channel = the school class**, via the parents' WhatsApp group. Not the school (sales
  cycle), not SEO. SEO stays as a 12-month compounding background asset; parent search intent
  is real and non-medical ("kind lust geen groente" and Italian equivalents), volumes still to
  be pulled via DataForSEO before content investment.
- **Timing hook.** EU school fruit scheme: NL roughly Nov–Apr, IT *Frutta e verdura nelle
  scuole*. Every class in it already has a "what did you eat at school today?" moment.
- **Sequence.** Now → five families (sister first) to confirm the dinner habit past week 4;
  November → one class as the playbook; a second class the founder did not seed → it is a
  channel. Cousins and class bootstrap; neighbourhood does not.
- **Science base (behavioural, public).** Food Dudes (peer modelling + small rewards) and Lucy
  Cooke's Tiny Tastes (UCL): rewarding *tasting*, not clean plates, increases what kids will
  eat; food neophobia breaks after roughly 10–15 exposures. "Different beats more" with a
  research base and no health claims.
- **Validation before redesign.** Do not wait on the survey (2–3 responses, wrong audience).
  Behavioural data first (who logs past week 4, hour of day, plants reached, drop-off) decides
  what to *keep*; five 15-minute parent conversations decide what to *build*.
- **What stays true** (not to be relitigated): the brand promise; the four pillars; daily
  logging over weekly recall; no health claims in marketing; proprietary user-derived data as
  the moat; less is more (eco/seasonal/local is texture inside advice, never a message);
  concept validation over financial targets, measured on active households.
- **Fourteen decisions D1–D14** are recorded in [[decision-2026-09-06-family-mode-pivot]].
- **Things not to do:** sibling-vs-sibling competition; punishing a missed dinner without a
  freeze; push permission at onboarding; eco/seasonal as brand message; calorie/macro tracking;
  a recipe library; wrapping the PWA in Capacitor; Apple's Kids Category; gating the redesign
  on survey responses.

## Notable quotes
> Parents are the payer and the logger. Kids are the motivation engine. Dinner is the habit
> anchor. Groceries are the planning moment.

> Do not rebuild to parity with the PWA. Build family mode only.

> SEO is not the launch channel.

> It is easier to keep a habit for the household than for yourself. Accountability to the
> family beats willpower. This is the honest retention model.

> Family mode is the purest expression of "Joy, not guilt."

## Implications for Project Food
- **Target user changes.** [[persona-household-parent]] becomes the primary persona;
  [[persona-believer]] is the legacy adult-tracker persona.
- **`STRATEGY.md` (May 2026) is out of date** on target user (broad adult wellness), platform
  (PWA) and distribution (word of mouth among adult friends). Its pillars, non-goals and
  decision heuristics still hold and are reaffirmed here.
- **Growth model refines [[concept-word-of-mouth]]:** the talkable moments become card unlocks
  and collective class milestones; the unit of spread is the class, not the individual friend.
- **Retention refines [[concept-stickiness-moat]]:** the "Sunday gets harder" void is now the
  household shopper's advice; the daily void is the dinner-table question.
- **Competitive set shifts** from 30-plants trackers to picky-eater/family apps; ZOE cannot
  follow (adult testing, medical framing). See [[seo-serp-landscape]] and
  [[compare-projectfood-vs-competitors]].
- **SEO folder rewritten** around parent search intent and the App Store as front door:
  [[seo-overview]].
- **[[research-survey-plan]] deprioritised.**
- **Open questions (file §8):** family mode as *the* wedge or one segment; household pricing
  (assumption ~€29.99/yr annual-only via Lemon Squeezy, revisit); class-challenge mechanics
  (formation, visibility, shareable artefact); school-lunch logging NL vs IT mensa; keyword
  volumes for the parent cluster.

## Related pages
- [[overview]] · [[decision-2026-09-06-family-mode-pivot]] · [[persona-household-parent]] ·
  [[persona-believer]] · [[concept-brand-pillars]] · [[concept-word-of-mouth]] ·
  [[concept-stickiness-moat]] · [[concept-30-plants-a-week]] · [[seo-overview]] ·
  [[research-survey-plan]]
