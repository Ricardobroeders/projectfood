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

## [2026-09-07] ingest | Supabase metrics (19 weeks) + family app v1 scope
Pulled a second behavioural snapshot from the live DB (retention cohorts, per-user lifecycle,
hour-of-day, notification effectiveness, profile/social usage, catalog metadata) into
[[source-supabase-metrics-2026-09]]; the May page is marked superseded. Key findings: 7 of 13
users ever hit 30 and 5 of them left anyway; only the founder and one other user remain after
week 14; streak-rescue pushes led to a log within 3 h 46% of the time vs 8% for the daily
reminder; 46% of logs fall 17:00–21:00; avatars were customised by 5 of 15 (hidden feature),
friendships by 12 of 15. Synthesised into [[concept-retention-loop]] (trigger, action, reward,
investment) and recorded the session's decisions in [[decision-2026-09-07-app-v1-scope]]:
greenfield Expo + TypeScript (Flutter reconsidered, not chosen), Supabase-only backend on the
Free plan until paying households, RevenueCat, Rive animation, five locales (en/nl/it/de/fr),
eleven v1 features and an out-of-scope list, design-library re-brief. Updated [[overview]]
(metrics section, decisions), [[index]], [[concept-engagement-snapshot]],
[[concept-engagement-drivers]], [[concept-stickiness-moat]], [[persona-household-parent]], and
`design-library/README.md` (new "Family mode re-brief" section). Linear project "Family app v1"
created in team Project Food with the v1 epics linking back here.

## [2026-09-07] query | Design direction resolved + POC defined
Ricardo reviewed the live PWA screens and four reference boards (gamified badge tiers, hexagonal
achievement grid with unlock modal, collectable stamps on white, pastel-tinted timeline cards).
Resolved: keep the PWA UI language, white/near-white background, plants stay 3D clay renders,
everything else animates in Rive, achievement art as stamps and tiered colours, XP as a POC
experiment. Recorded in [[decision-2026-09-07-app-v1-scope]] and `design-library/README.md`
(gitignored, local). Linear PF-56 created: one-screen POC on Android (OnePlus) testing colours,
motion, clay + Rive, and the platform; PF-53 updated with the resolutions.

## [2026-09-10] query | Achievement system as the goal layer
Ricardo proposed achievements as the backbone of the goal-oriented mindset and the churn answer.
Filed [[concept-achievement-system]]: three tiers (cards per plant, albums per group, milestone
stamps per behaviour), eight design rules (never resets, next goal always visible, earned at the
table, one celebration per session, per kid never ranked, achievements drive the triggers), a
starting set of ten stamps, and the link from album completion to the paid Sunday advice. Open:
XP keep/drop, navigation home for the collection, "refused" state for Brave bite. Same session:
Google Play Console account approved; accent exploration continues (true blue on device, teal in
Figma); Figma worksheet reviewed (colours, fonts, components).

## [2026-09-10] setup | Strategy backlog page
Ricardo asked for one place in the knowledge hub for concept/strategy to-dos: the undecided
core ideas (value proposition, brand guidelines, personas, retention, achievements, SEO, social
media, tone of voice, business model, market, KPIs). Created [[strategy-backlog]] with sixteen
rows (his eleven plus go-to-market, content pipeline, privacy and kids' data, naming, partnerships),
each with what the wiki holds, the open question and the next step. Registered the page in
`CLAUDE.md` (standing register rules), [[index]] and [[overview]].

## [2026-09-10] query | Business model brainstorm + "what's next" wiring
Ricardo proposed: break even first, subscription €3.99/month or €39.99/year, later a shopping
cart with a pre-grocery reminder that pushes items to an Albert Heijn list for affiliate revenue.
Filed [[concept-business-model]]: goal ladder (≈30 paying households cover tools; €1,000 net a
month needs ≈400 and therefore a replicating class channel), net revenue per price after VAT and
commission, three free/paid boundary options with lean A (kid loop free for every child, parent
payoff paid), annual-first timing at the week-4 recap, affiliate facts (AH 2–3% on Partnerize;
Bring! has no official API; share-sheet list instead) and an illustration putting affiliate at
20–40% upside on top of subscription at scale. Backlog row 9 → drafted. Added a "Next to pick up"
section to [[strategy-backlog]] and a repo-root `CLAUDE.md` with the "what's next?" protocol so
new sessions find the list.

## [2026-09-10] ingest | Ricardo's plane brainstorm notes
Ricardo sent raw ideas for a later brainstorm (gold/XP economy spent on avatars and borders,
fun facts and borders at 5/50/100 tastings, a KPI list, invite-a-friend reward). Stored verbatim
in `raw/ricardo-brainstorm-2026-09-10-plane.md`; summarised under "Inputs waiting for a
brainstorm" in [[strategy-backlog]] with links to rows 5, 9, 11 and 12; noted in
[[concept-achievement-system]] open questions. No decisions taken.

## [2026-09-14] build | Log tabs, 72-plant catalog, achievements POC with progress
Ricardo's review of the family POC: category pills become the Figma underline tabs, the
prototype chips (language, fun-fact card) leave the log screen for a new Account tab, the
catalog grows from 24 to 72 plants (names from Supabase `plants` + `plant_translations`, kid
facts written here), and achievements become a 16-goal shelf with a green progress bar and
"3/5" under every stamp plus a detail sheet. Backlog row 5 and [[concept-achievement-system]]
note the POC; the XP / navigation / "refused" decisions stay open.

## [2026-09-16] build | Store POC scope decision, family data model live, Expo app rebuilt on Supabase
Ricardo re-scoped the first release: ship the PWA's features plus the POC's multi-member logging
as a store POC and iterate with families ([[decision-2026-09-16-store-poc-scope]]). Same day:
migrations 0001–0009 on the live project (households, members, `plant_logs.member_id`, plant
facts, unlocks, push tokens, household RPCs with the streak freeze, pg_cron schedule), Edge
Functions `delete-account` and `send-notifications`, the Expo app rebuilt with Supabase auth
(email code, Google, Apple), react-query, i18n en/nl/it, Home / Log / Unlocks / Account and the
account sub-screens, 224 plant + 25 avatar assets bundled, kid facts + parent tips generated for
en/nl/it. Backlog rows 4, 5, 9, 11, 13, 14, 15 and "Next to pick up" updated.

## [2026-09-18] query | Achievement ladder calibrated on live data
Ricardo found the 16 stamps too easy: every engaged account unlocked all of them on day one in
the store POC. Queried the live `plant_logs` for the 14 members (distinct plants, per-category
counts, card levels, streaks, weeks of 30, biggest day) and the retention curve (64% in week 1,
43% in week 4, 21% from week 7). Proposal filed in [[concept-achievement-system]]: keep the 16
stamps, give each four levels at one week / month / season / year, targets set where the users
actually stand, the rungs that are half done at the week 5→7 cliff named by the pushes, and a
17-item prize-image list. Backlog row 5 and "Next to pick up" updated; Ricardo to confirm the
targets before the build.

## [2026-09-18] build | Stamp ladder, prize renders and cups on device
Ricardo generated the 17 stamp renders and three card-level cups (n8n, buckets `achievements` and
`images/app-ui-images`); they are bundled through `scripts/build-assets.mjs`. The ladder from
[[concept-achievement-system]] was built the same day with the proposed targets: migration 0011
(`achievement_unlocks.level`, ids renamed, `household_weekly_history` with colours), the engine
unlocking rungs in order, level rings and the ladder in the stamp sheet, "Level up!" celebrations,
copy in en/nl/it. Also today: the dev client moved to USB (`adb reverse`), skeleton rows with an
in-place fade for the lists, flags in the language picker and a reactive locale hook. Backlog row 5
and "Next to pick up" updated.
Same evening: device feedback turned the level rings into pips, redesigned the ladder rows, made
discovery rungs 2–4 count only plants tasted on two days, and added Regular table and Steady weeks
(migration 0012). Two renders pending.

## [2026-09-20] query | Secret achievements noted as a brainstorm input
Ricardo dropped an idea to park, explicitly not to build: secret achievements — a hidden layer of
stamps that are absent from the shelf and only appear once they fire. His example: tick off every
plant in the list in a single day → all historical records are wiped → unlock "That's called
cheating". Filed as a bullet under "Inputs waiting for a brainstorm" in [[strategy-backlog]] with
the open questions (joke or real penalty and whether it is reversible, how many secrets and of what
kind, five-locale copy, how to hint at a hidden stamp), and row 5 (Achievements) updated to list it
alongside the 2026-09-19 inputs. No page in [[concept-achievement-system]] yet — it waits for the
brainstorm.

## [2026-09-20] build | Rung nudge, privacy and delete-account pages, PWA web push removed, Linear dropped
Ricardo dropped Linear: "Next to pick up" in [[strategy-backlog]] is the only to-do list (both
`CLAUDE.md` files, the KB schema, [[decision-2026-09-07-app-v1-scope]] and the memory updated).
Built the same session: the rung nudge in `send-notifications` (migration 0013 `achievement_nudges`
+ `households.nudge_baseline_at`; the stamp ladder mirrored server side in `ladder.ts`; copy en/nl/it
in `rung-copy.ts`; 90–75 minutes before dinner, marketing opt-in under the card-teaser flag, one per
household per three days, a silent baseline on a household's first run; a `{probe: household_id}`
POST returns the ladder read-only), recorded in [[concept-achievement-system]] and row 4/5. The
privacy policy rewritten for the family app in en/nl/it (kids' profiles, what is stored, processors,
notifications, deletion, rights, cookies, security) and a `/delete-account` page with an email-code
web flow that calls the `delete-account` Edge Function; row 14 moves to drafted. The PWA's Vercel
cron, `api/push/*`, service worker, web-push settings page and `web-push` dependency removed. App
icons generated from Ricardo's Figma export (`projectfood-mobile/scripts/build-icons.mjs`, master
in `assets/brand/`); row 15 updated. "Next to pick up" renumbered.

## [2026-09-20] build | PWA push data removed from the database
Ricardo could not tell the new app's notifications from the PWA's. Migration 0014 copies the four
`push_subscriptions` rows and the 331 PWA-era `notification_log` rows (push sends: daily_reminder,
streak_rescue, weekly_nudge, inactivity_reminder, May to 19 September 2026) into schema
`backup_20260920`, deletes them from `public`, drops `push_subscriptions`, and sets
`notifications_enabled` back to false for the five accounts that only had a browser subscription
(the flag now means "an Expo push token is registered"). `plant_logs` is untouched: the plant
history stays shared between the PWA and the app. `notification_log` now only ever holds the new
kinds. Item 7 of "Next to pick up" updated.

## [2026-09-20] build | Tastes outlive the account
Ricardo wants the plant history kept for the KPIs after an account is deleted, with nothing else.
Decided and built: [[decision-2026-09-20-tastes-outlive-the-account]]. Migration 0015 drops the
three cascading links on `plant_logs` (user, household, member); after a deletion the row's ids point
at nothing and only the service role can read the rows. The `delete-account` function comment, the
privacy policy (section 8), the web delete page and the in-app warning now say that tastes stay as
anonymous statistics (en/nl/it). Row 14 and the index updated.

## [2026-09-21] ingest | Weekly metrics refresh — blocked, no data pulled
The scheduled weekly metrics refresh ran but could not reach the database: every
`execute_sql` call to Supabase project `ProjectFood` was auto-declined because the run is
unattended and the tool needs per-call approval. No numbers were read, so no page was changed —
[[source-supabase-metrics-2026-09]], [[concept-engagement-snapshot]],
[[concept-logging-behaviour]], [[concept-engagement-drivers]] and the Metrics section of
[[overview]] still hold the 2026-09-07 figures. Nothing here is stale by more than two weeks.
To unblock: allow the Supabase MCP `execute_sql` tool to run without approval in scheduled tasks
(read-only aggregate queries), or run the refresh in an attended session.

## [2026-09-21] build | In-app deletion receipt; confirmation email and dark-mode templates parked
The in-app delete screen now shows "Your account is deleted" with what stays (anonymous tastes)
before it signs out; the Android back button and the iOS swipe lead to the same sign-out. Ricardo
also wants a confirmation email (needs `RESEND_API_KEY` as an Edge Function secret, his item 8) and
noticed the Supabase Auth email templates do not read in dark mode; both on "Next to pick up" (item 11).

## [2026-09-21] build | Dark-mode-safe sign-in code emails, in the repo
The Supabase Auth templates are not reachable from a session without an access token, so they now
live in `supabase/templates/` (magic-link and confirm-signup: `color-scheme: light`, all colours
inline plus dark-mode and Outlook overrides, no images, `{{ .Token }}` only) with `push.mjs`, which
sends only the template fields to the Management API. Ricardo pushes them with a personal access
token (item 8b) or pastes them in the dashboard. English only; per-language emails would need the
locale in user metadata (row 13).

## [2026-09-21] build | Sign-in code emails live
Ricardo put the dark-mode-safe templates live in the dashboard (the scoped-token push read fine but
the write was refused with 403; noted in `supabase/templates/README.md`). Item 8b closed.

## [2026-09-21] plan | Login: nothing to build, accounts to create; Play app exists
Ricardo asked whether Google sign-in still needs work. Answer: the app has email code, native Google
and Apple (iOS) sign-in since 2026-09-16; Google is dead until the Firebase/Google Cloud OAuth
clients and the Supabase provider exist, now written out as item 1 (a)–(d). Not a Play review
requirement, but needed before the closed test. Ricardo created the Play app in another session,
so Claude's next build step is the first production AAB (item 12). Dark-mode email check passed.

## [2026-09-21] fix | analytics_churn_rate + analytics_weekly_active_users run as the caller
Supabase's security advisor flagged both views as "Security Definer View" (ERROR). The other
three `analytics_*` views already had `security_invoker=on`; these two lost it when they were
rebuilt on 2026-05-30, so PostgREST served all-user WAU and churn to anyone holding the anon key.
Migration 0016 (`20260921190000_analytics_views_security_invoker.sql`, applied via MCP) sets
`security_invoker = on` on both. Verified: advisor finding gone; as `postgres` both views still
return 23 weekly rows (max WAU 10); as `anon` they return 0 rows. Direct-connection dashboards
(postgres, bypassrls) and service_role are unaffected. Touches [[source-supabase-metrics]].

## [2026-09-22] build | Onboarding: you → table → dinner time, push ask on the dinner step
Ricardo asked for the first-login flow: add a person (name, face, colour) and then the dinner
time with a "ping me when it's time" line that doubles as the push ask. Built in
`projectfood-mobile`: a new "you" step for the parent's own row (name from the signup trigger,
face, one colour), the family list as step 2, the dinner-time step with a ping row (Switch, on
by default; the OS dialog opens only when it stays on; `push_permission {via: 'onboarding'}`);
the two colour pickers collapsed into one (`avatar_bg` retired, column kept, nulled on edit).
Amends D9 in [[decision-2026-09-07-app-v1-scope]] and the design rules in
[[concept-retention-loop]]; backlog item 9 (device checks) and row 4 updated.

## [2026-09-22] ingest | Play listing: final full descriptions and screenshot copy (Ricardo's rewrite)
Ricardo rewrote the en-GB full description and built four screenshot frames in Figma (Home,
Unlocks, Superfood achievement sheet, Log). Checked against the app: 224 plants (not "250+"), no
per-plant "benefits", no "alternative when you don't like it", no secret achievements, and "satisfy
your gut" dropped as a health claim. NL and IT translations of the description and of the frame
copy filed in [[seo-app-store-aso]], which now records the final frames and marks the 2026-09-20
six-frame brief as superseded. Short descriptions unchanged.

## [2026-09-22] fix | Achievements replace "stamps" as the user-facing word
Ricardo's call while reviewing the store copy: "achievements" is understood at a glance, "stamps"
needed explaining. Renamed in the app strings (EN achievements, NL prestaties, IT traguardi; the
Italian Unlocks tab became "Collezione" because it was already "Traguardi"), in the push-function
comments, in every wiki page ([[concept-achievement-system]], [[strategy-backlog]], the store
decisions, [[concept-business-model]], index) and in both CLAUDE.md files (vocabulary rule). Code
identifiers, i18n keys (`stamps.*`) and `assets/stamps/` keep `stamp` on purpose. Older log entries
above keep the old word.

## [2026-09-22] query | SEO content focus for projectfood.dev; brand SERP lost to namesakes
Ricardo wants the website's SEO "on par" with the app, started early because it compounds. His
screenshot of a Google search for "projectfood" shows the query owned by namesakes (a UK food
charity, an Italian catering-equipment firm whose description fills the AI Overview, an Alkmaar
food-bank Facebook page, a cooking YouTube channel, a Hungarian machinery firm) with projectfood.dev
absent. Checked against the site: roadmap Phase 0 (2026-09-06) never started, the hero still says
"boosts gut diversity", no OG image, no Search Console verification, two adult learn articles of
1,100–2,000 characters, `/recipes` live. Answer: win the brand query first, then the printable plant
cards as the link magnet, then the NL "kind lust geen groente" cornerstone once DataForSEO numbers
exist; class-channel content holds for row 12. Filed as a brand-SERP section in [[seo-serp-landscape]],
a status note in [[seo-roadmap]], row 6 and items 9 (Ricardo) and 14 (Claude) in [[strategy-backlog]].

## [2026-09-23] query | Website languages: shell in five, editorial in market order
Ricardo asked whether the website should focus on en/nl or open de/fr/it at once, citing BXWY where
starting languages early paid off. Facts: the site is already live in en/nl/it (497 strings each, both
learn articles in three languages); the app's de/fr files are three-line stubs and plant names have no
de/fr rows. Drafted position: a small shell in all five languages now (home, about, printables, privacy,
terms, contact, the two learn pages), editorial per market in sequence (NL, IT, then DE/FR once the app
speaks them; EN the default fallback), printables as the first DE/FR asset. Cost driver is maintenance
drift across five copies, not translation. Recorded on row 6 and as item 9c in [[strategy-backlog]].

## [2026-09-23] query | Site architecture: hubs, structured data, research first or not
Ricardo decided the website stays en/nl/it until the Dutch numbers prove the model, then de/fr
(row 6 open question closed). He asked, from a sitemap point of view, whether to build topic
clusters with structured data or to do keyword research first. Answer filed as
[[seo-site-architecture]]: the site already routes pillar → cluster and emits the right schema, so
the skeleton (home as the app page, printables hub) starts now and research runs in parallel to
order the cluster pages; three hubs (learn to eat everything, 30 plants, printables), gated plant
pages, schema per page type with `SoftwareApplication` and `Person` added and no fake ratings, a
manual research sheet with thresholds for a new domain, and the de/fr gate (April 2027 NL KPIs
plus the app locale). Row 6, item 9c and item 14 updated.

## [2026-09-23] research | Pillar 1 "Alles leren eten": nine clusters and the keyword map in NL/EN/IT
Ricardo asked for the SEO research behind pillar 1, the clusters that belong to it and why, and
the keywords per page in three languages, to export into Semrush for volume and KD. Twenty live
searches (NL, EN, IT) fixed the phrasing and the page-1 competitors per cluster. Result:
[[seo-pillar-alles-leren-eten]]: the idiom is "alles leren eten" (slug changed in
[[seo-site-architecture]]), nine clusters (how many tastes, rewards, neophobia, toddler, picky
eater, no dinner battle, hiding vegetables, fruit, the dinner question), each with primary,
secondary and question keywords in NL, EN and IT, page-1 competitors, our angle, and the expected
build order. Export files in `wiki/seo/exports/pillar-1/` (csv + txt per language, ~150 terms
each). Volumes and KD come back from Ricardo's Semrush run and are filed on the page. Row 6 next
step updated.

## [2026-09-24] ingest | Semrush NL run for pillar 1, partial (42 of 100 terms)
Ricardo's first Keyword Overview bulk export, saved as
`raw/semrush-pillar-1-nl-2026-09-24-partial.csv`: exported before the metrics loaded, so KD on
five terms only and 58 terms missing. First readings filed in [[seo-pillar-alles-leren-eten]]:
NL volumes are small (top term "peuter wil niet eten" 170/month, most terms 20–50, 42 terms ≈
700/month) and KD is under 20 everywhere; "peuter" phrasings beat "kind" phrasings; the head term
"kind lust geen groente" is absent from Semrush's database (0), which is a data gap, not zero
demand. Per-page threshold for NL changed to the sum of a page's keyword set. Next: re-export
after KD loads, add the remaining terms, Keyword Magic Tool broad-match on short seeds, Keyword
Planner cross-check.

## [2026-09-24] ingest | Semrush NL seed runs for pillar 1 (six exports, 1,224 terms)
Ricardo dropped six Keyword Magic Tool broad-match exports in `raw/` (seeds kind groente, peuter
groente, peuter eten, moeilijke eter, proeven kind, voedselneofobie). Merged, cleaned (recipes,
norms, illness, pets, crossword clues out) and classified per cluster in
`wiki/seo/exports/pillar-1/nl-NL-semrush-classified-2026-09-24.csv`. Findings on
[[seo-pillar-alles-leren-eten]]: the head term is the plain "groente(n) voor kinderen / kinderen en
groente" family (1,300–2,650/month, KD 14–23), not "kind lust geen groente"; "peuter wil niet
eten" is the biggest cluster (880/month, KD 11, general refusal) and becomes a page; "welke
groente vinden kinderen lekker" (~150/month) becomes a list page with a proprietary-data angle;
rewards, no-strijd, fruit and the dinner question fold into sections. Pillar family ≈
3,500–4,800/month in NL at KD under 25. Sitemap under pillar 1 rewritten in
[[seo-site-architecture]]; "moeilijke eter"-test idea parked; row 6 next step updated.

## [2026-09-24] build | Game feel: week meter on the Log screen, member menu from the finger, secret achievements half settled
Ricardo (2026-09-23) asked for hidden achievements and animations that make the app feel more like a game while the seven-of-twelve testers are gathered. Claude's read: the row micro-motion was already good; the Log screen showed nothing accumulating (the gauge lives on Home). Shipped in `projectfood-mobile` (commits 45a3426, e3dd12c) and to the phone over the air: `WeekMeter` in the Log header, and `MemberMenu`, an M3-expressive spring menu that grows out of the touch point and replaces the hold sheet (new `expressive` motion class, damping ratio 0.65, 40 ms stagger). Judged on device: "animation looks great". Secret achievements: rules agreed, "Nice try" at 50 plants a day, six candidates, Ricardo to cut to five (item 16, parking lot). Golden Sprouts stays parked. Pages: strategy-backlog (items 10, 16, row 5, parking lot), concept-achievement-system (secret achievements section).

## [2026-09-24] ingest | Semrush IT seed runs for pillar 1 (five exports, 3,602 terms)
Ricardo dropped five Italian Keyword Magic Tool exports in `raw/` (seeds bambini verdure, bambino
non mangia, selettività alimentare, assaggiare bambini, neofobia alimentare). Merged, cleaned
(recipes ≈ 2,500/month, weight and illness, infants, autism and ADHD phrasings, adults, courses
out) and classified in `wiki/seo/exports/pillar-1/it-IT-semrush-classified-2026-09-24.csv`.
Findings on [[seo-pillar-alles-leren-eten]]: Italy is behaviour-first, "il bambino non mangia"
≈ 2,000/month (KD 9–16, "psicologia" and "improvvisamente" phrasings), "selettività alimentare"
≈ 1,650 (KD 6–13, semi-clinical, needs the line to the pediatra), the vegetable head term 680,
neofobia 500 (a full page in IT). Four IT pages instead of NL's eight; assaggiare, premi, verdure
nascoste (recipe intent) and quali verdure fold into pillar sections. Row 6 next step updated.

## [2026-09-24] ingest | Semrush UK seed runs for pillar 1: not usable, English moves to the US database
Two UK exports ("kids vegetables", "toddler vegetables", plus a duplicate) in `raw/`: 1,952 terms
but 1,010 searches/month in total, no KD anywhere, head terms at 10–40/month while page 1 is NHS and
BBC Good Food. Judged a thin fallback set from Semrush's UK database, not demand. Recorded on
[[seo-pillar-alles-leren-eten]]; English will be sized on the US database with the seeds listed
there. Row 6 next step updated.
