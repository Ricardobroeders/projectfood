---
title: Strategy backlog (undecided core ideas)
type: backlog
tags: [strategy, decisions, backlog]
created: 2026-09-10
updated: 2026-09-24
sources: []
---

# Strategy backlog (undecided core ideas)

**In one line:** The standing register of concept and strategy topics that are not yet decided,
one row each, with what the wiki already holds, the open question, and the next step. "Next to
pick up" below holds execution work; the rows hold thinking that still needs a call from Ricardo.

## How to use this page
- Every strategy conversation ends by updating the relevant row (status, open question, next).
- Statuses: **open** (no proposal yet) · **drafted** (a wiki page or proposal exists, awaiting
  Ricardo's call) · **parked** (deliberately later) · **decided** (a `decision-` page exists; the
  row moves to the Decided table below).
- When a topic is decided, write `decision-YYYY-MM-DD-<slug>.md`, link it here, and move the row.
- Add topics freely; remove none. Date every status change.

## Next to pick up
_Maintained by Claude after every session; this is the answer to "what's next?". This is the one to-do list: decisions for Ricardo, build steps for Claude, and brainstorms to hold. Raw ideas live in the parking lot below until a brainstorm turns them into a decision or a build step. Updated 2026-09-24 (writing kit and article routine)._

**Ricardo's decisions and accounts**
1. Store POC prerequisites (see [[decision-2026-09-16-store-poc-scope]]): custom SMTP was already in place (checked 2026-09-21: Resend, smtp.resend.com:465, sender "Project Food <noreply@projectfood.dev>", key `supabase-oauth-projectfood` from April; email rate limit raised to 100/hour under Authentication → Rate Limits on 2026-09-21); Apple Developer enrolment (Individual) for iOS builds, Apple sign-in and TestFlight: parked by Ricardo on 2026-09-21 until the Android app is ready (Play closed test running); the €99/year starts at enrolment, so no reason to start earlier. Until then the test families are Android-only. Google sign-in is built in the app (native id-token flow, button on the sign-in screen since 2026-09-16) but dead until these accounts exist, in this order (2026-09-21): (a) done 2026-09-21: Firebase added to the existing Cloud project `projectfood-494514` (a first attempt created a stray project `project-food-494fc`, deleted), Android app `dev.projectfood.app` registered without SHA-1s, `google-services.json` in `projectfood-mobile/` (gitignored) and on EAS as the secret file variable `GOOGLE_SERVICES_JSON` for production/preview/development, FCM V1 service account key uploaded to the EAS Android credentials; first build with it is versionCode 4, uploaded to internal testing the same day; push verified end to end on 2026-09-21 (token stored, a test push through Expo's API delivered to the OnePlus, receipt ok); (b) done 2026-09-21 by reusing the PWA's Google Cloud project `projectfood-494514` (org ricardobroeders.nl): consent screen in production, branding verified with the logo, web client `436737851150-1d59…` from 2026-04-26 kept as is; its id is in `eas.json` (base env, commit ba7124e) and `.env.local`; the id was already in Supabase Auth → Providers → Google → "Authorized Client IDs" from the PWA days, so nothing to do there; (c) done 2026-09-21: two Android OAuth clients for `dev.projectfood.app`, Play app signing SHA-1 `6D:64:66:2A:C6:01:37:BB:C9:A1:A2:28:4C:EB:A4:80:13:E1:79:73` and EAS upload key SHA-1 `65:CE:A0:DE:3B:40:34:71:D0:03:9B:53:CA:05:DF:B1:D0:28:F5:20` (read from the signed AAB; Play shows both under App integrity); matched server-side, no rebuild; verified 2026-09-21: Google sign-in works on the Play internal-testing install (versionCode 3); (d) an iOS client, still to create (bundle id `dev.projectfood.app` only, no Apple account needed) (`EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` + `GOOGLE_IOS_URL_SCHEME`). The web client id is inlined at build time; the rebuild happened (versionCode 3, 2026-09-21). Google sign-in is not a Play review requirement (the email code plus a password review account cover that), but it must work before the closed test starts. Store listing assets: the five Play screenshots and the feature graphic in Figma, from the brief in [[seo-app-store-aso]] (written 2026-09-20; make them after the accent decision in item 2, the listing must be complete before closed testing).
2. Accent on device: true blue or teal (row 2). **Now has a cost attached (2026-09-22):** the Play listing went up the same day with screenshots and a feature graphic built on the current `marigold` default (`#F5C518`), so switching the accent to blue or teal means remaking all of them plus the feature graphic. Either marigold is the answer, or blue/teal becomes a later visual refresh with a screenshot redo budgeted in. The icon and splash no longer wait on it (generated 2026-09-20 from the Figma export, `scripts/build-icons.mjs`); the notification tint (`#F5C518` in `app.config.ts`) and the accent in code do.
3. Try the achievement ladder on device (row 5, [[concept-achievement-system]]) and say which targets feel off. All 19 renders, the cups and the category renders are bundled (2026-09-18); bucket tidy-up is cosmetic (two files carry a doubled `achievement-achievement-` prefix).
4. Business model: pick the free/paid boundary (option A/B/C) and confirm €3.99 / €39.99 with an introductory year (row 9, [[concept-business-model]]). Payments stay off in the store POC.
5. Review the generated kid facts and parent tips (row 13): `node scripts/generate-plant-facts.mjs --review` in `projectfood-mobile`.
6. Five parent conversations (row 3).
7. Clean-up after 2026-09-20: the four VAPID/CRON variables are out of Vercel (done 2026-09-20; `.env.local` may still hold them) and the PWA push data is out of the database (migration 0014, copies in schema `backup_20260920`; plant_logs untouched). Read the new privacy page once for the controller wording (it names Project Food, run from the Netherlands). When the Play listing exists, paste https://projectfood.dev/en/delete-account into the Data safety account-deletion field.
8. Two secrets, one session: (a) put the Resend API key into the Supabase Edge Function secrets (Dashboard → Edge Functions → Secrets, `RESEND_API_KEY`) so `delete-account` can send a confirmation email; (b) done 2026-09-21: the dark-mode-safe sign-in code emails from `supabase/templates/` are live (a scoped token could read the auth config but the write returned 403, so the dashboard paste is the reliable route). Dark-mode check on the phone passed 2026-09-21; (b) is closed.
9. SEO groundwork, two accounts (row 6; Ricardo 2026-09-22: the site is "not the main presence but it needs to be on par, this takes time so start early"): (a) authorise the DataForSEO connector in the claude.ai connector settings, then Claude pulls volumes for the 30-term shortlist in [[seo-keyword-strategy]] and re-tiers it; (b) verify projectfood.dev in Google Search Console and Bing Webmaster Tools (a DNS TXT record at Porkbun, or the HTML meta tag Claude adds) so the sitemap can be submitted and the brand-query baseline recorded. No naming decision attached: the name stayed Project Food on 2026-09-21, so the brand search result is won, not renamed. (c) done 2026-09-23: Ricardo decided the website stays en/nl/it until the Dutch numbers prove the model (gate: the April 2027 column of the roadmap KPIs for NL, plus the app speaking de/fr); then de/fr roll out. Still his: the Semrush export of the pillar-1 lists (`wiki/seo/exports/pillar-1/`, three languages, ~150 terms each; Keyword Overview in bulk mode, Strategy Builder as cross-check, steps in [[seo-pillar-alles-leren-eten]]) so the clusters can be ordered by volume and KD; in parallel with Claude's skeleton work in item 14. (d) 2026-09-24: read the writing kit, `wiki/brand/brand-voice.md` section 2 (the four dials, move any mark) and the live NL pillar https://projectfood.dev/nl/leer/alles-leren-eten (published 2026-09-24 at his request); say what to change, edits go through the file `projectfood-app/content/learn/learn-to-eat-everything/nl.md` and `npm run learn:publish`.

**Claude's next build steps**
10. Ricardo lives on the standalone preview APK from 2026-09-18 (gauge, Add a person, 45 MB build) for a while and collects feedback; the next session starts from that list. The dev client over USB stays for live coding (cable was flaky; a keeper loop re-adds `adb reverse`). Still to check on device: two-member logging, plant page, account screens, list performance in the release build, the new icon set, and the rung nudge (needs a push token, Tips & news on, and the 16:30–16:45 window for a 18:00 dinner; a `{probe: household_id}` POST to `send-notifications` shows the ladder without sending). Onboarding rebuilt 2026-09-22 (you → who else is at the table → dinner time with the ping row; one colour per member, the avatar background picker is gone): the three steps and the OS dialog on "Start tasting" with the row on were run through on 2026-09-22 with the review account on versionCode 5 (events confirm it); still to judge: the saturated member colour behind the illustrated faces (swap `MEMBER_COLORS` for pastels if it shouts) and the row-off path (no dialog, first-log sheet later). **Game feel, 2026-09-23/24** (Ricardo: "extend a couple of hidden secret achievements and more animations which can help the user interface feel more gamelike"): the diagnosis was that the micro-motion on a row was already good and the *macro* was missing, the Log screen showed nothing accumulating. Shipped and judged "looks great" on device: (a) the week meter in the Log header (`WeekMeter`, count rolls, bar steps in the gauge's band colour, a +1 floats off a new-for-the-week plant; a repeat tap moves nothing there on purpose); (b) the member menu that grows out of the finger (`MemberMenu`, replaces the hold sheet: one chip per member fans out from the touch point on the new `expressive` spring class, each chip a live toggle of today's log; the same menu serves the "logging for" bar and "Log tonight" on the plant page). Both went to the phone over the air (item in [[project-dev-device-setup]]: `eas update --channel production`, fingerprint `7ed3bca5…` = versionCode 5). Next on this track, waiting on Ricardo's picks under item 16: the secret-achievement scaffolding (`secret` flag, `?` on the grey locked tile, no rung ladder, no migration needed since `achievement_id` is free text) with the five secrets he keeps; then the micro animations he chooses from the five small ones (gauge pulse at 10/20/30, streak flame breathing, the new pip landing last, shelf stagger, the near-miss ring on a row one taste from silver). Parked as not-micro: the row-to-meter flight arc and any burst at 30.
11. Claude's own hands on an emulator (Ricardo, 2026-09-18, via a friend's tip): set up Android Studio with one emulator image on the Mac, install Callstack's open-source `agent-device` CLI and its Claude Code skill (https://oss.callstack.com/agent-device/docs/introduction), install the dev client on the emulator, add test ids on key controls. From then on Claude runs and screenshots flows itself; the OnePlus stays for feel. Does not replace EAS builds (native changes) or Metro (JS changes). About an hour, at the start of the next build session.
12. Deletion confirmation email from `delete-account` (sent before the account goes, en/nl/it, via Resend from info@projectfood.dev, same look as `supabase/templates/`) once item 8a is done. The in-app receipt screen shipped 2026-09-21; the dark-mode templates are written and wait for item 8b.
13. Play internal testing → closed testing (12 testers × 14 days); iOS build + TestFlight after the Play closed test is running (Apple parked 2026-09-21, see item 1). Before the listing goes up: reviewer access for the Play and Apple "App access" declaration, a password sign-in for one review account, because reviewers cannot receive the email code (2026-09-21). Sequence agreed 2026-09-21: Ricardo creates the Play app (done 2026-09-21 in another session: Project Food, `dev.projectfood.app`); Claude built the first production AAB on 2026-09-21 in the other session (`~/Downloads/projectfood-1.0.0-versionCode2.aab`, 1.0.0, versionCode 2, built without the Google web client id, so its Google button fails; fine for an internal test with Ricardo alone); Ricardo uploads it by hand to internal testing (Play requires the first bundle through the console, the `eas submit` service account comes later); that upload surfaces the Play app-signing SHA-1 for the Google OAuth client (item 1), and internal testers can install the store-signed build instead of the sideloaded preview APK. Then item 1 (a)–(c) with that SHA-1, then a second AAB (versionCode 3) with the web client id inlined and the Google button hidden whenever the id is empty; that build is the one closed testers get. The 12-tester closed test only starts after the "Set up your app" tasks, so those get filled in alongside. One session owns this item at a time (two ran in parallel on 2026-09-21). Update later on 2026-09-21: versionCode 2 was uploaded and installed on the OnePlus through the opt-in link (a first release takes a while to propagate: "item not found" until then); versionCode 3 with the web client id is built (`~/Downloads/projectfood-1.0.0-versionCode3.aab`) was uploaded the same day and Google sign-in verified on the OnePlus. **Play go-live checklist (2026-09-22, Android only, iOS parked).** Ricardo in Play Console: store listing (en-GB texts + nl/it translations from [[seo-app-store-aso]], icon 512 exists, feature graphic 1024×500, 2–8 phone screenshots, category Parenting, contact email + website, privacy URL); the "Set up your app" declarations (App access with the review account below, Ads none, content rating questionnaire → PEGI 3, target audience 18+ and not designed for families, Data safety incl. https://projectfood.dev/en/delete-account, health declaration answered as food logging without medical claims, news/government/financial no); countries for the release; a closed testing track with 12 opted-in testers held for 14 continuous days; then the production-access application, Google's review, and the first production release with release notes en/nl/it. Also the accent decision (item 2) before the final AAB and screenshots, and item 8a for the deletion email. Claude: the review sign-in is built (2026-09-22): typing `review@projectfood.dev` in the email field swaps the code button for a password field (`EXPO_PUBLIC_REVIEW_EMAILS` overrides the address list, no rebuild needed for the default); the Supabase user exists since 2026-09-22 (confirmed, password set, household + member + settings rows created by the trigger; the password lives only in Ricardo's password manager and the App access form); versionCode 5 was built the same day from commit e236763 (`~/Downloads/projectfood-1.0.0-versionCode5.aab`, carries the three-step onboarding and the review sign-in): uploaded to internal testing and installed the same day; Ricardo signed in as the review account, ran the three onboarding steps and logged five plants (verified server-side 2026-09-22: onboarded, dinner 18:00, avatar + one colour, push token stored, `push_permission via=onboarding granted=true`, `onboarding_completed ping=true`), so the review household is ready; the member row is renamed to "Anna" and Ricardo signed out (verified 2026-09-22: no push token left on the account, so his phone gets no review-household pushes); **all of App content is complete as of 2026-09-22** (app access, ads, advertising id, content rating, target audience 18+, data safety, health, financial, government, news, privacy URL), answers recorded in [[seo-app-store-aso]] "Play declarations"; what remains before the closed test is the store listing itself (screenshots, feature graphic, the en/nl/it texts, category Parenting per row 15) and twelve testers held fourteen days. **Sequencing found 2026-09-22:** a closed-testing release cannot be rolled out until the main store listing is complete, graphics included, so the listing gates the start of the fourteen-day clock. Cleared the same day: Ricardo built and uploaded the screenshots and the 1024×500 feature graphic and filled the listing in en-GB, nl-NL and it-IT, status "ready to send for review"; the lead screenshot reads "30 Different Plants a week / One goal for you or the whole family", which is the first store surface to address the solo adult from row 3. The assets use the marigold accent, see item 2. Play's minimum is two phone screenshots plus the 1024×500 feature graphic and the 512 icon (which exists); listing edits during the window do not reset the clock, so the cheapest path is a decent minimum listing to start the fourteen days and better screenshots added while it runs. Testers must be Android users with the Google account their phone uses, opted in via the closed-track link and *staying* opted in; recruit fourteen or fifteen for slack, because the count breaking drops the streak. The production-access application afterwards asks how testers were recruited, what feedback came back and what changed, so collect that during the window; the device checks in item 10, the final production AAB with the accent and a versionCode bump, and optionally an `eas submit` service account. **Before the next AAB (2026-09-24):** add `fingerprint.config.js` with `sourceSkips: SourceSkips.ExpoConfigVersions` in `projectfood-mobile`, so that `version` no longer feeds the runtime fingerprint and the patch number can be bumped per over-the-air update (Ricardo wants a recognisable version per update; today a bump changes the fingerprint from `7ed3bca5…` and versionCode 5 would refuse the update, verified 2026-09-24). Until that build, the Account version line names the update by its publish time and id. Critical path: the 14 testing days plus Google's two reviews, so about three weeks from the day 12 testers are in.
14. SEO of projectfood.dev ([[seo-roadmap]] Phase 0, then pillar 1). **The article routine exists since 2026-09-24** (`pf-seo-article` skill; content files in `projectfood-app/content/learn/`; `npm run learn:check` and `learn:publish`; per-locale slugs, visible FAQ, related cards, Person author and hasPart in the pages; migration `learn_locale_slugs` applied). The NL pillar `alles-leren-eten` is **live since 2026-09-24** (Ricardo: publish and iterate; the seven cluster mentions are plain text until each cluster exists, then the pillar is republished with the link). Order now: (1) Ricardo reviews the live page; Claude writes `peuter-wil-niet-eten` and `hoe-vaak-proeven` (NL) and republishes the pillar with their links; (2) the brand query: home page and metadata rewritten to the family app with the Play badge (the hero still says "boosts gut diversity", a health claim), `SoftwareApplication` JSON-LD with `sameAs` to the Play listing, an OG image per locale, `/recipes` removed ([[seo-serp-landscape]] brand section); (3) the printables hub with the proefkaart PDF (format 3 in [[seo-content-types]], the tasting chart is also the EN printable target); (4) the remaining NL clusters in the order on [[seo-pillar-alles-leren-eten]], then IT (four pages), then EN (list page and the 10–15 times page first). Still to supply: `REVALIDATE_SECRET` on Vercel (in `.env.local` since 2026-09-24), the author's `sameAs` links in `lib/seo.ts`. The class kit and the schoolfruit pages wait for the go-to-market call (row 12).
15. Then the deferred v1 features in order: cheers between households, albums, Sunday shopper advice with RevenueCat. Ricardo reopened the friends and social layer on 2026-09-20 and rates it a main success driver (new row 17); it is a brainstorm topic first, not a build step — the social unit and the kids' safeguarding line have to be settled before it can be ordered against these.

**Brainstorms to hold**
16. Achievements economy (row 5, 9). **Secret achievements: half settled on 2026-09-23/24**, see the parking-lot entry for the state. Agreed: one level only, never a ladder; hidden ones show as `?` on the grey locked tile (the existing locked treatment, minus the faded art that would give the answer away); count revealed, names not; never in a push or the paid layer; the cheating one is kept, as "Nice try" (an idiom all five locales have: Leuk geprobeerd · Bel tentativo · Netter Versuch · Bien tenté), fires at 50 distinct plants in one day (224 plants makes "all of them" unreachable; Big dinner L4 celebrates 30; the PWA bulk-loggers hit 51 and 63 and left), no data touched, body copy states the two-day rule. **Still Ricardo's:** cut the six candidates to five (Nice try, Full spectrum, At the table, Night owl, Same again, Everyone different) and confirm 50 and the name. **Golden Sprouts, the gold / XP economy, a fact per card level and the advocacy achievement stay in the parking lot** (Ricardo, 2026-09-23: "not sure yet what to do with this"); they get their own brainstorm against the D7 free freeze and the "rewards are earned, no pay-to-win" rule; outcome = a decision page and build steps here.
17. Friends and social layer (row 17): the social unit (parent account, household or kid) and the kids' safeguarding line; personal streak first, friend streak as a later layer. Outcome = a decision page before any design.

## Parking lot: ideas, not to-dos
Raw ideas dropped for a later brainstorm; each is linked to its row and to the brainstorm item
above that will challenge it. Nothing here is a task until a brainstorm turns it into a decision or
a build step. Source: `raw/ricardo-brainstorm-2026-09-10-plane.md`.

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
- **Daily streak with Golden Sprouts (rows 4, 5, 9).** Duolingo-style: the streak sits large on
  Home and is earned by checking off plants daily; a missed day can be bought back with "Golden
  Sprouts", earned by checking off daily and by unlocking achievements, so regular use banks a
  buffer for a missed day or two. Sprouts replace XP as the earned currency, and the streak
  buy-back is the first and only item in the store; later Sprouts could also be bought for money.
  To work out: how many Sprouts per check-off and per achievement, what a buy-back costs.
  _(Ricardo, 2026-09-19; sits next to the plane "Gold / XP economy" input above, the D7 free
  freeze in [[concept-retention-loop]] (one missed day per rolling week is absorbed without
  paying) and the "no punishment without a freeze" pillar; the paid-Sprouts idea touches the
  "rewards are earned, no pay-to-win" rule in [[concept-achievement-system]])_
- **A "Did you know" per card level (rows 5, 13).** Each plant's bronze / silver / gold card
  level unlocks its own fun fact, saved on the card; you look them back on the plant page from
  Unlocks. The more you eat of a plant, the more you learn about it. _(Ricardo, 2026-09-19; a
  concrete shape for the "Fun facts and borders at 5 / 50 / 100" input above; needs three facts
  per plant per locale instead of one, i.e. the facts script (row 13) grows ×3)_
- **Secret achievements (row 5).** A hidden layer of achievements that are not on the shelf and only
  appear once they fire, so there is something to stumble into after the visible ladder is
  climbed. Ricardo's example: tick off every plant in the list in a single day → unlock
  "That's called cheating", originally with all historical records wiped. Refined the same day:
  ticking everything off in one day should carry *some* consequence, but the achievement itself may
  already be it — a visible shame badge on the shelf, no data touched. _(Ricardo, 2026-09-20; sits
  under the ladder in [[concept-achievement-system]] and touches the "no punishment without a
  freeze" pillar — a shame achievement keeps that pillar intact, a wipe does not)_
  **Brainstormed 2026-09-23/24, state:** no wipe (the `twice` rule already makes a bulk day worthless
  for rungs 2–4, so the copy can say so instead); level 1 only; hidden tiles are `?` on the grey
  locked ground, revealed in colour when found (Ricardo wanted greyed thumbnails; the faded real art
  would spoil the answer); the name is "Nice try" in every locale's own idiom, not "I see what you did
  there"; trigger 50 distinct plants in one day. Six candidates that need no backend work, five to
  keep: Nice try · Full spectrum (every category in one day) · At the table (a dinner logged within
  15 min of the dinner time) · Night owl (after 23:00) · Same again (the identical list three days
  running) · Everyone different (one day, every member tasted something nobody else did). Parked:
  "Long time no see" (a plant tasted again after 90 days) needs a last-tasted date the
  `member_taste_counts` RPC does not return. Technically free: `achievement_unlocks.achievement_id`
  is unconstrained text, so a secret is a definition plus copy in `definitions.ts`, no migration,
  OTA-shippable. Waiting on Ricardo's cut (item 16).
- **Advocacy / community achievement (rows 5, 7, 12).** An achievement for people who talk about
  Project Food online — Ricardo's example is active Reddit contribution — on the reasoning that
  it genuinely helps the product. He notes himself that it is hard to measure. To work out: how
  it is established at all (self-declared with an honour-system tap, a pasted link, a manual
  founder grant while numbers are small), and three problems before any of that — rewarded
  posting is undisclosed promotion under Reddit's self-promotion rules and reads as
  astroturfing if it is not labelled; any self-declared version is trivially gamed, so the achievement
  stops meaning anything; and this is a parent-and-kid app, so an advocacy achievement belongs on the
  parent side only, never in the kid's collection. A founder-granted "thank you" achievement for the
  first families avoids all three and may be the whole idea. _(Ricardo, 2026-09-20; touches
  [[concept-word-of-mouth]], row 7 social media and row 12 go-to-market)_
- **Invite a friend (rows 9, 12).** Referral reward such as a free period of the paid plan.
  _(Ricardo, 2026-09-10)_
- **Admin panel for notifications and plant content (rows 4, 13).** One internal screen instead
  of the Supabase table editor: notification templates and one-off campaigns with their sent /
  delivered / opened / logged rates (the two-layer sketch under row 4), and the plant catalogue
  with its facts, translations and card copy, so a text fix or a new plant needs no SQL and no
  deploy. Expo and Firebase are the pipe, not a place to manage anything. Settled by Ricardo on
  2026-09-22: it lives at **admin.projectfood.dev** as its own project folder in this repo (not a
  route inside the marketing site), behind Supabase auth with an admin flag; **low priority**,
  only once the app is live and running. Still to work out: which content the app reads live and
  which it bundles (only the live part is editable without a release), and review states for
  generated facts. _(Ricardo, 2026-09-22; sits under the push-management sketch in row 4 and the
  content pipeline in row 13; challenged when row 4's entry point is decided after a week on the
  preview APK)_

- **"Moeilijke eter"-test** (2026-09-24, from the Semrush run: "moeilijke eter test" 20/month). A
  five-question self-test on the website ("is mijn kind een moeilijke eter?") that ends in the
  proefkaart and the app; a cheap link magnet. Touches rows 6 and 12. Challenged by brainstorm
  item 14 or a content session after the pillar is live.

## Summary
| # | Topic | Status | Next step |
|---|---|---|---|
| 1 | Value proposition | open | Rewrite for the household parent after the five parent conversations (row 3) |
| 2 | Brand guidelines | drafted | Decide the accent on device (blue vs teal); then bind app theme to Figma variables |
| 3 | Customers / personas | drafted | Five parent conversations → `interview-` pages → decide the leading age band | Open since 2026-09-22 (Ricardo): does the listing also speak to the solo adult, the independent thirty-something who was the PWA audience? He fears Parenting plus family-first copy writes them off. Today the short description is deliberately goal-first and audience-neutral ("30 different plants a week. Tap what you tasted, collect a card for each."), while the full description turns family in its second sentence. Options: leave it, lead the full description with the goal and bring the family in later, or treat the solo adult as a second listing audience after the five parent conversations. Not a category question; settle it with row 1 and the interviews.
| 4 | Customer retention strategy | drafted | Notification policy shipped in the store POC (essential/marketing split, three ignored → a week of quiet, freeze streak); push ask moved to the onboarding dinner step on 2026-09-22 (ping row, in-app first, OS dialog only when left on; first-log sheet as fallback, D9 amended in [[decision-2026-09-07-app-v1-scope]]); push management outside the app sketched 2026-09-18 (templates + campaigns tables, entry point undecided; an admin panel that also covers plant content parked 2026-09-22 at admin.projectfood.dev, own project folder, low priority, see the parking lot); rung nudge shipped 2026-09-20 (90 min before dinner, marketing opt-in, one per household per three days, silent baseline on a household's first run); still to write: the five-family test protocol (week 4 / week 8) before TestFlight |
| 5 | Achievements | drafted | Named achievements since 2026-09-22 (NL prestaties, IT traguardi; "stamps" before). Ladder built 2026-09-18 ([[concept-achievement-system]]): 19 achievements × up to four levels, discovery rungs 2–4 need two tasting days, two consistency achievements (days, steady weeks), pips for levels; targets tunable in code. Rung pushes at 50/75% shipped 2026-09-20 (`achievement_nudges`, the ladder mirrored in `supabase/functions/send-notifications/ladder.ts`; retune both when targets change). Still open: "refused" tap, albums; new inputs 2026-09-19/20 (Golden Sprouts streak buy-back, a fact per card level, an advocacy achievement) wait for a brainstorm; secret achievements half settled 2026-09-23/24 (rules agreed, "Nice try" at 50 a day, six candidates, Ricardo cuts to five; item 16 and the parking lot) |
| 6 | SEO strategy | drafted | Keyword volumes (DataForSEO) before any content spend; Play screenshot brief written 2026-09-20 in [[seo-app-store-aso]], final frames and copy filed 2026-09-22; Play policy rule: audience 18+, listing addressed to the parent. **2026-09-22:** Ricardo wants the website on par and started early. Found: the brand query "projectfood" is lost to namesakes and projectfood.dev is absent; roadmap Phase 0 never started (hero still a health claim, no OG image, Search Console unverified). Order now: brand query → printable cards → NL cornerstone ([[seo-serp-landscape]] brand section). Items 9 and 14 on the list; DataForSEO still unauthorised; 2026-09-23: website languages drafted as shell in five, editorial in market order (item 9c); 2026-09-23 decided: en/nl/it until proven, sitemap + research brief in [[seo-site-architecture]]; pillar-1 keyword map + Semrush export lists 2026-09-23 ([[seo-pillar-alles-leren-eten]]); NL Semrush numbers filed 2026-09-24: head term is "kinderen en groente", new cluster "peuter wil niet eten"; IT and EN (US) numbers 2026-09-24, EN entry via the list page and the 10–15 times page; **2026-09-24, routine built:** the `pf-seo-article` skill plus the site plumbing (per-locale slugs, visible FAQ, related cards, Person author, hasPart, ISR + revalidate, content files + `learn:check` / `learn:publish`); NL pillar live 2026-09-24 at `/nl/leer/alles-leren-eten` (Ricardo: publish and iterate). Next: `peuter-wil-niet-eten` and `hoe-vaak-proeven`, then the pillar republished with their links |
| 7 | Social media strategy | open | Decide "none until five families" vs one channel |
| 8 | Tone of voice | drafted | **2026-09-24:** the writing kit exists as first drafts in `wiki/brand/` ([[brand-voice]] with the four dials for both registers, [[brand-humour]], [[brand-stats-and-claims]]) and is packaged as the `pf-voice` skill; humour decided by Ricardo: dry, one line, intros only. Next: Ricardo reads the four dials and moves any mark; then a `decision-` page and the row moves to Decided. Still open: DE/FR address forms, what a Rive character says |
| 9 | Business model | drafted | Pick option A/B/C and confirm prices in [[concept-business-model]]; `households.plan` (free/family) exists since 2026-09-16, payments off in the store POC; input 2026-09-19: Golden Sprouts as the first store item, later purchasable; 2026-09-21: the app is published free to download, the paid plan is an in-app subscription added later (Play's "free can never become paid" concerns the download price only, no second app) |
| 10 | Market | drafted | Kids-food competitor teardown + NL/IT household sizing |
| 11 | KPIs / success definition | open | Instrumentation live since 2026-09-16 (`app_events`, `notification_log` sent/delivered/opened/logged-within-3h); still to pick the five numbers before TestFlight |
| 12 | Go-to-market & acquisition | open | How the first class is recruited; founder-seeded vs organic (added by Claude) |
| 13 | Content & localisation pipeline | drafted | Facts generated for en/nl/it on 2026-09-16 (`plant_facts`, status generated) by `scripts/generate-plant-facts.mjs`; Ricardo reviews; de/fr facts + 448 plant names when DE/FR listings are scheduled; an admin panel for facts, translations and card copy parked 2026-09-22 (parking lot, with row 4) |
| 14 | Privacy & kids' data | drafted | Privacy page rewritten 2026-09-20 for the family app (kids' profiles, what is stored, processors, notifications, deletion, rights) in en/nl/it at projectfood.dev/{locale}/privacy, plus `/delete-account` with an email-code web flow; tastes outlive the account as anonymous rows ([[decision-2026-09-20-tastes-outlive-the-account]]); Ricardo reads the controller wording once before Play review; de/fr with those listings |
| 15 | Naming & store presence | open | Bundle id `dev.projectfood.app` fixed on 2026-09-16; keep "Project Food"? Icon set generated 2026-09-20 from the Figma export (`scripts/build-icons.mjs`; Play 512 in `assets/brand/store`); still needed: feature graphic 1024×500, screenshots, a drawn monochrome glyph if the auto silhouette disappoints | Play category picked 2026-09-22: **Parenting**, not Health & Fitness. Reasons: Health & Fitness is one of the most competitive categories on Play so a new app cannot chart in it, Parenting is small enough to be visible, the listing copy is family-first, and the launch channel is a link in a class WhatsApp group rather than store browsing. Category is changeable at any time in Store settings with no re-review, so it is a weak, reversible lever; the strong levers are the title, short description and full description, which carry the search terms for any audience.
| 16 | Partnerships (schools, brands) | parked | Revisit after the first class replicates (added by Claude) |
| 17 | Friends & social layer | open | Ricardo wants it back in scope 2026-09-20 (friend list, lookup, other people's profiles, a Duolingo-style friend streak). Personal streak first, friend streak as a later layer (Ricardo, 2026-09-20). Decide the social unit — parent account, household or kid member — and the kids' safeguarding line before anything is designed (added by Ricardo) | Store note (2026-09-22): the Play content rating is answered "no user interaction" today; a username leaderboard keeps that answer, one-tap cheers most likely flip it to yes (adds the "Users interact" descriptor, PEGI 3 unchanged), so re-run the questionnaire before the social build publishes; kids stay off any shared surface so the privacy page stays true.

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
- **Push management outside the app (Ricardo, 2026-09-18, thinking out loud):** the four
  automated pushes live in `send-notifications` with copy hard-coded per locale; there is no
  place to edit text or send a one-off message without a deploy. Sketch: two layers, all free.
  (1) Data-driven pushes (dinner question, streak keeper, later the rung nudges) stay in the
  function but read their copy from a `notification_templates` table (kind × locale), so text
  changes need no deploy. (2) One-off or scheduled messages become rows in a
  `notification_campaigns` table (title/body per locale, audience filter such as locale or
  "no log for N days", `send_at`, status); the same 15-minute cron picks them up, honours the
  marketing opt-in and the backoff, and logs to `notification_log`. Creating a campaign is then
  an insert: from the Supabase table editor today, from an n8n form (Ricardo already runs n8n)
  next, from an admin page on projectfood.dev (Vercel, behind Supabase auth with an admin flag)
  when the volume justifies it; that page would also show sent / delivered / opened / logged
  rates per message from `notification_log`. OneSignal (free to 10k subscribers, dashboard with
  segments and journeys) only if we want those without building; it adds an SDK, a privacy line
  and a second source of truth, and the essential pushes would still need our data.
- **Rung nudge (built 2026-09-20):** a fifth kind in `send-notifications`, `rung_nudge`, on the
  marketing channel under the card-teaser flag: 90–75 minutes before dinner it names the one achievement
  closest to its next level once that rung passed 50% or 75% ("Mia needs 9 more vegetables for
  Green machine gold"), deep link to Unlocks, at most one per household per three days, each mark
  once (`achievement_nudges`). A household's first run only records where it stands, so old
  states never push. Timing and gap are guesses to test with families.
- **Open:** whether one-off campaigns belong in the store POC at all, and which entry point
  (table editor, n8n form, admin page) Ricardo wants first.
- **Next:** write the five-family test protocol as a decision page before TestFlight; decide
  the push entry point after a week on the preview APK (tables + cron pickup ≈ half a day).
  _(status 2026-09-18)_

### 5. Achievements — drafted
- **Store POC (2026-09-16):** 16 achievements on real history in the Unlocks tab, unlock rows in
  `achievement_unlocks`, one celebration sheet per session, XP dropped.
- **Finding (2026-09-18):** every engaged account unlocked all 16 on day one; the shelf has
  nothing left to aim at. Ladder proposal with four levels per achievement, calibrated on the 14
  members' live counts and the retention curve (cliffs at week 0→1 and weeks 5→7), in
  [[concept-achievement-system]] with the prize-image list.
- **Have:** [[concept-achievement-system]] (three tiers, eight rules, the ladder with today's
  standings per level, image topics), achievements on device.
- **Open:** Ricardo confirms or adjusts the level targets; a "refused" tap at logging for Brave
  bite; the real album list (category "all" levels stand in for albums until then).
- **Built (2026-09-18):** `level` column, engine, level copy en/nl/it, rings on the shelf, the ladder in
  the achievement sheet, 17 prize renders and the card-level cups on device.
- **Next:** watch which rungs families sit on after a month; add the 50% / 75% rung pushes to
  `send-notifications`. Parked inputs 2026-09-20: a hidden layer of secret achievements (with a
  consequence for ticking everything off in one day) and an advocacy achievement for people who post
  about us (see the parking lot); nothing to build yet. _(status 2026-09-20)_

### 6. SEO strategy — drafted
- **Have:** [[seo-overview]], [[seo-keyword-strategy]], [[seo-serp-landscape]],
  [[seo-content-types]], [[seo-app-store-aso]], [[seo-roadmap]], [[seo-technical-audit]]
  (all 2026-09-06, family mode); the Play listing texts and frames (2026-09-22); a brand-SERP
  check dated 2026-09-22 in [[seo-serp-landscape]].
- **Open:** keyword numbers before the pillar-1 clusters are ordered (Ricardo's manual research
  sheet, or the DataForSEO connector, item 9); Search Console ownership (item 9b); whether the
  class channel content (class kit, schoolfruit pages) is still wanted, which is row 12's call.
  Decided 2026-09-23: en/nl/it only until proven, de/fr follow the app locale
  ([[seo-site-architecture]]).
- **Next:** NL, IT and EN (US) numbers are in (2026-09-24, [[seo-pillar-alles-leren-eten]]):
  NL ≈ 3,500–4,800/month at KD < 25, IT ≈ 4,800 at KD 6–16, EN ≈ 8,000 at KD 13–58 with the
  way in through "vegetables kids will eat" and the AAP "10–15 times" lookups. Ricardo keeps a
  sheet of the pages (live / pagetype / country / language / slug / keywords / topic). Optional
  seeds left: NL kleuter eten, kleuter groente, peuter fruit; IT capricci a tavola, bambino
  frutta. Claude builds the skeleton and writes NL first, IT and EN one step behind, in the
  order on the pillar page. _(status 2026-09-24)_

### 7. Social media strategy — open
- **Have:** [[concept-word-of-mouth]] (three talkable moments), class WhatsApp group as launch
  channel ([[source-family-mode-context]] §6), the monthly recap card as a forwardable unit
  (v1 feature 11).
- **Open:** any channel beyond class groups before launch? Instagram or TikTok for NL/IT
  parents; founder building in public; the recap card as the only "social" asset.
- **Next:** decide "none until five families" versus one channel. Claude's lean: none; the
  recap card is the social strategy until the app exists. _(status 2026-09-10)_

### 8. Tone of voice — drafted
- **Have:** the writing kit, first drafts of 2026-09-24 in `wiki/brand/`: [[brand-voice]]
  (who speaks to whom; the four NN/g dials with a mark for the parent register and the
  kid-visible register; rules per surface with limits; sentence rules; vocabulary use / avoid in
  en/nl/it; per-locale conventions, Dutch "je", Italian "tu"; examples; the three gates),
  [[brand-humour]] (dry, one line, intros only, decided by Ricardo on 2026-09-24; where never;
  on/off examples), [[brand-stats-and-claims]] (verified numbers and sources, the claims we
  never make, how to cite). Packaged as the `pf-voice` skill (`.claude/skills/pf-voice`), which
  the root `CLAUDE.md` requires before any user-facing copy; the learn-article routine
  `pf-seo-article` loads it first. The adult voice from `design-library/README.md` is carried
  over as the parent register.
- **Open:** Ricardo's reading of the four dials (the marks are Claude's first draft); German
  "du/Sie" and French "tu/vous" at rollout; what a Rive character says, if anything.
- **Next:** Ricardo reads `brand-voice.md` section 2 and moves any mark; that reading becomes
  `decision-2026-…-tone-of-voice` and the row moves to Decided. _(status 2026-09-24)_

### 9. Business model — drafted
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

### 14. Privacy & kids' data — drafted _(added by Claude)_
- **Have:** the privacy policy at projectfood.dev/{en,nl,it}/privacy, rewritten 2026-09-20 for the
  family app (`projectfood-app/messages/*.json`, `marketing.privacy`): parents only sign in, a
  child's profile is a first name or nickname plus kid/adult and an avatar, what is stored and why
  (contract, consent for push and the survey, legitimate interest for security and the few product
  events), the processors (Supabase in Ireland, Vercel, Expo, Google, Apple, Resend), the
  notification rules, deletion in-app and on the web, GDPR rights, cookies, security. Plus
  `/delete-account` (`account-verwijderen`, `elimina-account`) with a self-service flow: email →
  code → confirm → the `delete-account` Edge Function, session in memory only, and a manual
  fallback by email.
- **Open:** the controller wording (the page names Project Food, run from the Netherlands, with
  info@projectfood.dev; no legal entity named); de/fr copies when those listings are scheduled;
  Apple and Google family policies while staying out of the Kids Category.
- **Decided 2026-09-20:** tastes outlive the account as anonymous rows
  ([[decision-2026-09-20-tastes-outlive-the-account]], migration 0015); policy section 8 and both
  deletion screens say so.
- **Next:** Ricardo reads the page once; the URL goes into the Play Data safety form when the
  listing exists. _(status 2026-09-20)_

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

### 17. Friends & social layer — open _(added by Ricardo, 2026-09-20)_
- **Ricardo's ask (2026-09-20):** social is a big part of how this succeeds — healthy stimulus
  from people you know. Concretely: add friends, look people up, see someone else's profile (how
  many plants they have eaten, which achievements they hold), and a Duolingo-style **friend
  streak** that two people keep alive together, with notifications, so they pull each other into
  logging.
- **Have:** the strongest quantitative signal in the wiki — users with at least one accepted
  friend averaged 3.56 active weeks and 1.67 weeks hitting 30, against 1.75 and 0.75 for users
  with none, roughly 2× on both ([[concept-engagement-drivers]],
  [[source-supabase-metrics-2026-09]]; n=13–15, directional, causality unknown — engaged people
  may simply add friends). Friends were the one investment people found unprompted: 12 accepted
  friendships among 15 users, every request accepted, while the profile screen went unfound.
  [[compare-projectfood-vs-competitors]] calls the friends/leaderboard layer our clearest moat
  because most rivals are solo checklists. The PWA's `friendships` table still exists; the store
  POC kept the tables and dropped the screens ([[decision-2026-09-16-store-poc-scope]]). "Cheers
  between households" is already a deferred v1 feature.
- **Open — the social unit comes first.** The PWA's friendships were adult-to-adult; the app is
  now households with kid and adult members. Is a friend a parent account, a household, or a kid?
  Every screen below changes shape depending on the answer, and [[source-family-mode-context]]
  argues the unit of spread is the class, not the individual friend.
- **Open — kids' safeguarding (blocks the lookup screen, row 14).** "Look someone up" plus
  children's first names and eating records is the one part of this that cannot be designed
  casually: user search that can surface a child is a red line for Google Play Families and the
  App Store, and needs a GDPR basis with parental consent. The shape that likely survives review
  is parent-to-parent links only (invite code or contact, not open search), with a kid's counts
  and achievements visible only to households their parent has approved, and nothing about a child
  discoverable by strangers.
- **Streak order settled (Ricardo, 2026-09-20): the personal streak comes first.** He agrees the
  family layer makes a shared streak genuinely more complex than Duolingo's, and rates the
  individual streak the more important of the two. So: build and tune the personal streak (with
  the D7 free freeze in [[concept-retention-loop]] and, if it lands, the Golden Sprouts buy-back
  above), and treat the friend streak as a later layer on top of a mechanic that already works.
  That also defers the pillar problem: a streak two people can break *for each other* is exactly
  the punishment the "never resets / no punishment without a freeze" rule in
  [[concept-achievement-system]] was written to avoid, and it lands harder on a kid than on a
  Duolingo adult. Still to work out when we get there: whose streak it is — the kid's, the
  parent's or the household's.
- **Open — also:** what a profile shows and whether kids are ever ranked against each other (the
  "per kid never ranked" rule); how friend notifications fit the existing three-ignored backoff
  without raising push volume; whether this replaces or sits beside cheers between households;
  and whether the friends layer is free or part of the paid boundary (row 9).
- **Next:** brainstorm with Ricardo — settle the social unit and the safeguarding line, then
  write `concept-social-layer` with the screens and the streak rules before any build.
  _(status 2026-09-20)_

## Decided
| Date | Decision | Page |
|---|---|---|
| 2026-09-06 | Pivot to a family app on native Expo | [[decision-2026-09-06-family-mode-pivot]] |
| 2026-09-07 | v1 scope, stack (S1–S6), eleven features, out-of-scope list | [[decision-2026-09-07-app-v1-scope]] |
| 2026-09-16 | Store POC scope: PWA features + multi-member logging first; social, XP, advice deferred or dropped | [[decision-2026-09-16-store-poc-scope]] |

## Related pages
- [[overview]] · [[index]] · [[concept-retention-loop]] · [[concept-achievement-system]] ·
  [[decision-2026-09-07-app-v1-scope]] · [[decision-2026-09-16-store-poc-scope]]
