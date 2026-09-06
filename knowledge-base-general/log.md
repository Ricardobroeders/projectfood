# Log

Append-only chronological record of all wiki operations. Newest at the bottom.
Each entry starts with `## [YYYY-MM-DD] <op> | <title>` where `<op>` is `setup`, `ingest`,
`query`, or `lint`. Quick recent history: `grep "^## \[" log.md | tail -5`.

## [2026-05-30] setup | Knowledge base scaffolded
Initialized the Project Food knowledge base using Karpathy's LLM Wiki pattern. Created
`CLAUDE.md` (schema), `README.md`, `index.md`, `log.md`, `wiki/overview.md`, the `raw/` and
`raw/assets/` source folders, and page templates in `templates/`. Domain focus: business &
strategy, and product & user research. No sources ingested yet.

## [2026-05-30] ingest | Brand Promise deck + App mockups (May 2026)
Ingested `raw/presentations/Brand promise-projectfood.pdf` (11 slides) and `raw/images/mockup-0..4.png`.
Created 2 source pages ([[source-brand-promise-deck]], [[source-app-mockups]]), 4 concept pages
([[concept-30-plants-a-week]], [[concept-brand-pillars]], [[concept-word-of-mouth]],
[[concept-stickiness-moat]]), 1 persona ([[persona-believer]]), and 1 entity
([[entity-myfitnesspal]]). Rewrote [[overview]] and [[index]]. Open questions logged: deck has
no publish date; shipped-vs-roadmap status of moat features unconfirmed; persona unvalidated.

## [2026-05-30] ingest | Supabase metrics snapshot
Pulled aggregate, anonymized usage metrics from the live ProjectFood DB (lkmfmdehysmbstnfdbyg)
via the analytics_* views and custom SQL. Window 2026-04-26→2026-05-30, 13 active users, 1,385
logs. Created [[source-supabase-metrics]] plus 3 analysis pages ([[concept-engagement-snapshot]],
[[concept-logging-behaviour]], [[concept-engagement-drivers]]). Updated [[overview]] and
[[index]]. Key findings: goal completion trending to ~57%; WAU peaked at 10 then eased to 7;
98.5% same-day logging but session-based; legumes/grains/ferments under-logged (<9%); friends
≈ 2× engagement (directional, n=13). Caveats: tiny friends-and-family cohort, ~5 weeks,
analytics_churn_rate view appears broken (reads 0 while WAU falls).

## [2026-05-30] fix | Repaired analytics_churn_rate + mau_28d (via Supabase MCP)
Applied two view fixes via MCP apply_migration (DB is now MCP-only; projectfood-backend repo
deleted). `analytics_churn_rate` redefined as week-over-week churn (was a broken 28/56-day
window reading 0): now 0% → 25% → 12.5% → 20% → 33.3% (last week partial). `mau_28d` on
analytics_weekly_active_users corrected to a true 28-day window. Updated
[[concept-engagement-snapshot]], [[source-supabase-metrics]], [[overview]].

## [2026-05-30] fix | Properly rewrote mau_28d as rolling 28-day count
Earlier mau_28d change was label-only and still equalled WAU (view grouped logs by their own
week). Rewrote as a true trailing-28-day distinct-active count. Now 1,4,9,12,12,12 vs WAU
1,4,8,10,9,7 → real WAU<MAU gap opening (frequency dropping, base intact). Surfaced via the
Looker dashboard cross-check. Note: the Looker churn caption still says "28 days without
logging" but the metric is now week-over-week — caption needs updating in Looker (not in DB).

## [2026-05-30] ingest | Competitor & origin research
Web research on the origin and competitive landscape of "30 plants a week". Created 2 source
pages ([[source-30plants-origin-research]], [[source-competitor-scan]]), 1 concept
([[concept-30-plants-origin]]), 4 entities ([[entity-tim-spector]], [[entity-zoe]],
[[entity-eating30]], [[entity-30plants-ai]]), and 1 comparison
([[compare-projectfood-vs-competitors]]). Updated [[overview]] and [[index]]. Key findings:
"30 plants" originates from the American Gut Project (2018) via Tim Spector/ZOE — public-health
guidance, not ownable; the tracker niche is crowded (ZOE premium; Eating30, 30 PLANTS direct;
long tail of solo checklists). Project Food's wedge = social + gamified + joy + free PWA, not the
number; exposure = logging breadth (~150 plants, tap-only) vs rivals with 500+/barcode/voice/AI.
Open question raised: brand deck names only MyFitnessPal, omitting the real competitive set.

## [2026-05-30] plan | User survey plan drafted
Created [[research-survey-plan]] (type: plan) — a draft survey to send ~end June 2026 to the user
base. Covers UX friendliness, the STRATEGY.md open questions, pricing (Van Westendorp + reaction
to €3.49), business-model feature value/willingness-to-pay, and why users do/don't use it.
Method: identify respondents by account email → join to plant_logs via user_id (with consent) →
analyze by segment (hit-30, social vs solo, active vs lapsed, locale); no PII in the wiki. Added a
"Plans" section to [[index]]. Findings will later validate [[persona-believer]].

## [2026-09-06] research | SEO strategy folder created
Created `wiki/seo/` with six pages: [[seo-overview]], [[seo-keyword-strategy]],
[[seo-serp-landscape]], [[seo-content-types]], [[seo-technical-audit]], [[seo-roadmap]]. Based on
~25 web searches (2026-09-05/06) across EN/NL/IT plus a code audit of `projectfood-app/`
(sitemap, robots, hreflang, JSON-LD, learn hub) and DB facts (224 active plants, 39 seasonal,
2 published learn articles). Key findings: EN head terms are owned by ZOE/UK publishers; NL and
IT SERPs are thin and app-intent queries have no web competition; "what counts as a plant" is the
highest-value question cluster in all three languages; every direct competitor is iOS-only (we
are the only Android/web option); Italian search uses "30 vegetali" more than "30 piante"; MDL
Fonds runs a yearly NL "30 Planten Challenge" (partner target). New competitor flagged: Clove has
social features. Search volumes are unvalidated (DataForSEO connector not authorised). Updated
[[index]] (new SEO section), [[overview]] (growth channel + Clove open question), and CLAUDE.md
(new `seo-` page type in `wiki/seo/`).

## [2026-09-06] ingest | Family mode context (raw/FAMILY_MODE_CONTEXT.md)
Ingested Ricardo's direction document for the pivot to a **family app** with native Expo
clients. Created [[source-family-mode-context]], [[persona-household-parent]] (new primary
persona) and [[decision-2026-09-06-family-mode-pivot]] (D1–D14). Rewrote [[overview]] around
the pivot. Updated [[persona-believer]] (superseded as primary), [[concept-word-of-mouth]]
(class as unit of spread; cards and collective milestones), [[concept-stickiness-moat]]
(dinner-table question; shopper's Sunday; per-household retention), 
[[compare-projectfood-vs-competitors]] (picky-eater app field; ZOE cannot follow), and
[[research-survey-plan]] (deprioritised). **Rewrote all of `wiki/seo/`** (same-day v1 had
targeted adult gut-health searchers): SEO is now a background asset behind the class launch
channel; keyword strategy re-centred on parent intent in NL/IT/EN; new [[seo-app-store-aso]]
page; roadmap gated on dinner-habit and class-replication validation. Research added: ~16 web
searches on parent SERPs, picky-eater apps, Tiny Tastes / Food Dudes evidence, EU-Schoolfruit
(NL deliveries 9 Nov 2026 – 16 Apr 2027) and Frutta e verdura nelle scuole. Flagged:
`STRATEGY.md` (May 2026) is out of date on audience, platform and distribution; hero copy
carries a health claim; keyword volumes still need DataForSEO.
