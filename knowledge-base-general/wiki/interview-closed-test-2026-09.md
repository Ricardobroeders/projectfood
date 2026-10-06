---
title: Closed test feedback (Play, from 2026-09-27)
type: interview
tags: [user-research, closed-test, feedback, play]
created: 2026-09-29
updated: 2026-10-06
date: 2026-09-27
participant: the closed-test group (friends and family on Android, 13 invited)
sources: []
---

# Closed test feedback (Play, from 2026-09-27)

**Date:** running log from 2026-09-27  **Segment/persona:** [[persona-household-parent]]
**Raw file:** none; the points arrive through Ricardo (WhatsApp, in person) and are written here
the same day.

## Context
The Play closed test went live on 2026-09-27 with versionCode 7 / 1.0.2 (runtime `d8da0646`).
Testers are friends and family recruited by Ricardo over WhatsApp; 13 invited, 6 opted in by
2026-09-29 according to Google, **12 on the morning of 2026-09-30**, which started the fourteen days
(apply for production from 2026-10-14); Supabase the same evening showed 12 accounts (Ricardo's included) that
had signed in on the Play build since 2026-09-27, 9 of them logging plants, two invitees not yet
installed, and two people signed in with a different Google address than the one on the list (twelve are needed for fourteen continuous days, see [[strategy-backlog]] item 14 and
"The one thing"). This page is the single record for Google's production-access application,
which asks how testers were recruited, what they said and what changed. One entry per point:
date, **the version the tester ran** (Ricardo, 2026-09-30: log feedback with the app version;
Play build 7 carries the over-the-air labels 1.0.2, 1.0.3, 1.0.4, 1.0.5, 1.0.6 and the Account
screen shows which one), who (first name or role, never more), the words, what we did.

## Key findings
- **2026-09-29, 1.0.2 (Play 7), a tester, via Ricardo: "When opening the app for the first time it's unclear
  why 30 different plants per week. Why is this the goal?"** Checked against the build: the
  number appears on Home ("of 30 plants", "n to go"), in an achievement and in a notification,
  and is never explained; onboarding (you, the table, dinner time) does not mention the goal at
  all. A tester who joins through the test link may never read the store listing, which is where
  the explanation lives today. Options put to Ricardo the same day: one sentence at onboarding
  step 1, a "Why 30?" sheet from the Home gauge, or both (Claude's recommendation: both, the
  sentence answers the first-open moment, the sheet holds the full answer for anyone who picks
  up the phone later). Copy has to stay within [[brand-stats-and-claims]] row 7: the guideline
  and its source, an adult observation, variety not amounts, never a promise for a child.
- **2026-09-29, 1.0.2 (Play 7), Ricardo's own observations on the closed-test build:** the Google button shows
  no G yet (the G is in commit 10f1ad3, waiting for the over-the-air update), and the sign-in
  screen never said that every path both signs in and creates the account. Fixed the same day
  with a heading above the buttons ("Sign in or create an account", commit 9f22586).

- **2026-09-30, PWA era (no app version), Ricardo relaying earlier testers:** people who used the app for
  longer built up a history and missed a place to see it, the PWA's "Weekly history" (a bar per
  day for the last 30 days, the last weeks against 30). Built the same day as a stats screen per
  household behind the streak chip on Home, see "Changes shipped".

- **2026-09-30, 1.0.2 to 1.0.3 (Play 7), several testers via Ricardo: the app says "Good
  evening" while everyone logs in the morning.** The greeting is a fixed string from the
  once-a-day-at-dinner idea; people open the app through the day. Options put to Ricardo the same
  day: a greeting by the hour (good morning until 12, good afternoon until 18, good evening
  after) or a flat "Good day". Claude's recommendation: by the hour, it is right at 9:00 and at
  19:00 and costs nothing.
- **2026-09-30, 1.0.2 to 1.0.3 (Play 7), testers via Ricardo: "No introduction on why 30 plants
  are important" and "No onboarding".** The same gap as the 2026-09-29 point, now from more than
  one person. Ricardo's direction the same day: three or four onboarding markers after the
  onboarding steps (log, tap a plant and the 1/30 chip, the Unlocks tab, achievements and per-plant
  progress), coach-mark balloons like Avito's and Ozon's, always with a skip. Decided and shipped
  the same day, [[decision-2026-09-30-first-minute-tutorial]] (four balloons, the copy to the
  person holding the phone, the last one on logging for the whole family), 1.0.7.

- **2026-09-30, 1.0.7 (Play 7), Ricardo's run of the tutorial on the OnePlus:** the holes sat
  exactly on the tab, the row and the chip; the first balloon never showed; the hole wanted the
  control's corner radius and a slightly lighter dim; the family balloon was redundant with
  onboarding step 2 and pointed at a bar that cannot add anyone; on onboarding step 3 the label
  "Step 3" ran off the screen next to the long title. All in 1.0.8 the same hour.
- **2026-09-30, 1.0.2 to 1.0.7 (Play 7), Bram: a plant that is not in the list cannot be
  suggested,** because the "Missing from our list?" block only appears with zero results and the
  fuzzy search nearly always returns something, just the wrong plant. 1.0.8: the block also sits
  under the results whenever there is a search term.

- **2026-09-30, 1.0.8 (Play 7), Ricardo:** onboarding's "Step 3" fixed; but after deleting his
  account and signing up again on the same phone, no tutorial at all. Cause: the seen flag was
  per phone, and his 1.0.7 run had set it. 1.0.9 keys the flag by household, so a new account on
  the same phone starts fresh; every tester who saw the 1.0.7 version sees the fixed one once.

- **2026-09-30, 1.0.9 (Play 7), Ricardo's read of the balloons:** "dinner" too narrow (any meal
  counts) and "A lick counts" unnecessary; the hole around the plant row a little too tall; the
  30 balloon should link to the plant-diversity article. 1.0.10 the same hour.

- **2026-09-30, 1.0.10 (Play 7), Ricardo: "Great content now", but everything shows instantly:**
  a second's wait after onboarding, then the overlay pops; Next switches the tab and then the
  overlay pops again. Asked for the open, close and step change as motions. 1.0.11: the `guide`
  motion class (iris in, glide between controls, release out; balloon swap).

- **2026-09-30, 1.0.2 to 1.0.11 (Play 7), Ricardo from the data: several testers opened the
  survey on their first open,** from the yellow banner on Home, before they had used the app.
  1.0.12 removes the banner; the survey stays under Account, and the moment to ask comes later
  ([[research-survey-plan]]).

- **2026-10-02 and 2026-10-06, 1.0.12 (Play 7), Ricardo: the sign-in code should be copiable from
  the email notification and visible in its first words,** so you never leave the app to sign in
  (GitHub's sudo email as the reference). 2026-10-06: the code leads the email subject, no app
  change. Layers 2 and 3 (clipboard fill, an app link in the email) in the parking lot.

- **2026-10-06, 1.0.2 (TestFlight 1), Ricardo while recording the Apple video: the Account row
  "Notifications: On / Off" changed when he switched the language en → nl → en,** so he asked
  whether the setting is per language or per phone. It is per account; the row read a cached
  account flag that the push-token registration set on the server but never refreshed, and the
  language switch was the first thing to refetch it. 1.0.13: the row follows the phone's
  permission plus the account's groups, and the registration refreshes the cache.

- **2026-10-06, 1.0.13 (Play 7), Ricardo testing the new subject: the code shows in the shade, but
  Gmail's notification has no Copy action** (he wanted Windows Phone Link's "Copy 920806" chip),
  and eight digits are too many to remember. Gmail allows no sender-added actions; its own Copy
  chip sits in the inbox list. Supabase's floor is 6 digits: Ricardo sets the length to 6 in the
  dashboard, the app already accepts 6 to 8. Also: the code field's caret sat at the right of the
  centred, letter-spaced placeholder on Android; 1.0.14 left-aligns it.

- **2026-10-06, 1.0.12 or 1.0.14 (Play), a tester after a week of use ("I already noticed that I
  try to eat more healthy with it"), three points.** (1) **A week that starts mid-week is
  shorter**: they expected seven days from the first log, or a smaller goal. Ricardo's call,
  2026-10-06: weeks stay Monday to Sunday, so events and promotions can run on one shared
  period; no change. (2) **The "Curious achievement unlocked" badge covers the fun fact and
  never goes away** (screenshot: the green bean fact's last lines under the badge). Cause: the
  badge was drawn on every card back once the achievement existed. 1.0.15: it appears on the
  flip that unlocks it, once per household, with room reserved under the fact; long facts shrink
  to fit. (3) **After submitting a plant suggestion they could not log anything until they
  restarted the app.** Cause found in the events: "Suggestion sent" stayed until the search text
  was edited, and with the search still live every tab showed the note instead of plants; a
  restart cleared it. 1.0.15: the note stays two seconds, then the search clears and the list
  comes back; the X on the search clears it too.
  The suggestions themselves (10 since 2026-09-27; all reviewed by Ricardo in another session on 2026-10-06: Matcha and Wasabi approved, 5 duplicates linked to their plant, Falafel, Straw and Romesco rejected) show two more causes behind
  "the plant is not there": Spinazie, Sperziebonen, Straw, Falafel, Bimi and Groene kool were all
  in the catalogue; the search only knew the name in the app's language (Dutch typed into an
  English app found nothing), and under a found result the filled "Submit suggestion" button
  read as "add this" (Straw was sent with Strawberry on screen). 1.0.15 searches the name in
  every language and makes the under-results suggestion a text link. Matcha (twice) and Wasabi
  were genuinely missing and Ricardo added them on 2026-10-06; those three testers were not told.
  The process question (notify when the plant lands, let the taste count straight away) is in the
  parking lot of [[strategy-backlog]] as "Log it now, name it later".

- **2026-10-06, 1.0.12 (Play 8), a tester: "I didn't receive a notification every day."** True for
  everyone, not one phone. The sender refused a second essential push within 26 hours of the last
  one; the dinner question goes out at the same clock time every evening, so every second day was
  inside that window: sent, skipped, sent, skipped (33 dinner questions to 11 testers in 10 days,
  about half of what was due). Fixed server-side the same day: "already sent today" is now the
  household's calendar day. Found alongside: a tapped notification was never recorded as opened
  (the app's `mark_notification_opened` call was a query builder that was never awaited, 17 taps
  tracked, 0 marked); fixed in 1.0.17 and the 17 backfilled from the event log. The three testers in
  a week of quiet had genuinely ignored four pushes each (no tap, no log), so that rule held.
  Delivery itself was clean: every ticket accepted, every receipt ok.

## Notable quotes
> "It's unclear why 30 different plants per week. Why is this the goal?" (tester, 2026-09-29,
> relayed by Ricardo)

## Implications
- The first minute has to carry the why, not only the what. The store listing is not a
  reliable first touch during a closed test, and later not for a partner who opens the app on a
  shared phone.
- Every fix during the window is JavaScript-only where possible, so it ships over the air on the
  same runtime and the count of testers is never disturbed by a new binary.

## Changes shipped in response
- 2026-09-29, 1.0.3 over the air on both runtimes (commits 9f22586 and fab9ac3): the sign-in heading, the Google G, and six iOS points from Ricardo's own recording run on Alissa's iPhone (iOS 26): the Log search placeholder letter-spaced (now drawn by our own Text), the week chip's "0" below the "/30" (AnimatedNumber is a plain Text again), text sitting low in every input (inputs are text-high inside their boxes), the add-a-person sheet pushed under the status bar by the keyboard (sheets keep the top inset and shrink), the flip card opening behind the plant screen and hanging the app (the plant screen hosts its own card). Not a bug: no iOS permission dialog on a second account on the same phone, iOS asks once per install; delete and reinstall from TestFlight to see it again.
- "Why 30" explanation: parked by Ricardo on 2026-09-29 ("let's wait a bit longer before solving this problem"), then taken up on 2026-09-30 as balloon 3 of the tutorial in [[decision-2026-09-30-first-minute-tutorial]] (proposed); the two drafted options of 2026-09-29 are its alternatives.

- 2026-09-30, 1.0.4 over the air on both runtimes (commit 6bad6d1; Android group 136895c6, iOS group ee8ae253): the stats screen ("Your
  stats", reached from the streak chip on Home, which now shows in both states so the page is
  always one tap away): dinners in a row, longest run, weeks at 30, best week, plants per week as
  bars against the 30 line, plants per day for the last four weeks, one sentence under each
  chart. Copy read and approved by Ricardo before the publish ([[strategy-backlog]] item 22).
- 2026-09-30, 1.0.5 over the air (commit 6c1a215; Android group e2dea66f, iOS group 52fe7e63),
  from Ricardo's first look on the OnePlus: an icon per record tile, "Longest run" renamed "Most
  dinners in a row" (it was unclear), the day chart ends today so the bars fill the card.
- 2026-09-30, 1.0.6 over the air (commit 8dd876c; Android group 7e3346f6, iOS group f16d2b6c),
  Ricardo's next look at Home: the goal gauge's half-lit wedge (a partly earned wedge at 45%
  opacity) read as a bug; wedges are now full colour or grey, lit once half their span is earned.
- 2026-09-30, 1.0.7 over the air (commit 92a8253; Android group eb5a3aec, iOS group 42c3a8da):
  the first-minute tutorial, four balloons once per phone (every tester sees it once on the next
  launch), and the greeting by the hour. Answers "no onboarding", "why 30" and "Good evening in
  the morning" above.
- 2026-09-30, 1.0.8 over the air (commit 21893b6; Android group 52b0bc3d, iOS group 35c3a31a):
  tutorial down to three balloons, the first one visible, a rounded hole and a lighter dim;
  onboarding titles wrap so "Step 3" stays on screen; the suggest-a-plant block under the search
  results too (Bram); "Suggestion sent" without its exclamation mark.
- 2026-09-30, 1.0.9 over the air (commit 11a6847; Android group 26e3b2e4, iOS group 329bdd9b):
  the tutorial's seen flag keyed by household on the phone instead of phone-wide.
- 2026-09-30, 1.0.10 over the air (commit 5138598; Android group 41704aaa, iOS group 432d0005):
  balloon 1 "After you've eaten, tap Log and tick the plants you tasted.", balloon 3 with a
  "Read the article" link to /learn/plant-diversity in the reader's language, the row hole
  without the row's bottom margin.
- 2026-09-30, 1.0.11 over the air (commit 4e07d2f; Android group 094a0a5d, iOS group b2c067ea):
  the tutorial in motion, see the decision page's "Motion" item; the start wait halved.
- 2026-09-30, 1.0.12 over the air (commit 0485896; Android group 7b73bf4a, iOS group d94dd0c3):
  no survey banner on Home.
- 2026-10-06, 1.0.13 over the air (Android group 9b864af4, iOS group 357abfea): the Account
  notifications row reads the phone's permission; the sign-in email subject starts with the code.
- 2026-10-06, 1.0.14 over the air (runtimes unchanged): the code field left-aligned, letter
  spacing only on typed digits.
- 2026-10-06, 1.0.15 over the air (Android group 2d245d6a, iOS group 663f36ce, runtimes
  unchanged): the Curious badge only on the unlocking flip, long facts fit the card; a sent
  suggestion clears the search after two seconds; the search matches the plant's name in every
  language; the under-results suggestion is a text link. Catalogue: "falafel" and "hummus" added
  as aliases of Chickpeas (cabbage and broccoli already carried "groene kool" and "bimi").
- 2026-10-06, 1.0.16 over the air (Android group fdcc87a9, iOS group 77d5ac97): the sent note
  says what happens, "We check it by hand. New plants arrive with an app update, so it can take a
  few weeks." (nl, it alike), shown 5 seconds before the search clears.
- 2026-10-06, `send-notifications` v3 deployed from Claude's shell (Supabase MCP, no CLI login):
  the per-day rule, and the 2026-09-26 card levels (8 / 15) for the Regulars ladder, which had
  never reached the server. 1.0.17 over the air (Android 9ad4e15e, iOS ec761c1c): opens recorded.
  Still at the old 5 / 10 levels: the card teaser's "one taste from the next level" test (4 or 9
  tastes); marketing pushes are off for every tester, so nothing fires from it yet.
- 2026-10-06, three notifications and no more (Ricardo: "I don't want to spam people"):
  `send-notifications` v4 retires the card teaser and the rung nudge (code kept) and moves the
  Sunday nudge into the essential group (on by default, migration `sunday_nudge_essential`); 1.0.18
  over the air (Android eee47a10, iOS f9a9383a) drops the "Tips & news" group from the Notifications
  screen, the Sunday nudge sits under Essential. One essential push a day still holds, so a Sunday at
  25 to 29 gets the nudge instead of the dinner question.
- 2026-10-06, 1.0.19 over the air (Android 7f14929e, iOS 66d9c36c): the Log rows show every plant
  in its category colour with the normal render again; with many gold cards the rows had all gone
  the same yellow and were hard to tell apart (Ricardo). Gold stays on the Unlocks page.
- 2026-10-06, 1.0.20 over the air (Android dab3a49a, iOS dccf3277): three secret achievements,
  [[decision-2026-10-06-secret-achievements]].
- 2026-10-06, 1.0.21 over the air: the three secret renders; locked achievements in greyscale; the
  secret's name shows on the shelf, the how stays hidden until achieved.
- 2026-10-06, 1.0.22 over the air (Android e88b5555, iOS 25aeab9b): the gold card sheet staged
  after Ricardo's Figma (node 201-297): gold-to-white gradient, a slow-turning white sunburst
  behind the 240 px gold render, the words and button on the white end. Copy unchanged.
- 2026-10-06, 1.0.23 over the air (Android ec906fd6, iOS 90fb170a): gradient drawn at the sheet's
  measured width (a strip on the right stayed white on Android); the sheet says "Gold plant" and
  "The plant is gold from now on", not card (Ricardo: it is the plant that turns gold, not a card).
- 2026-10-06, 1.0.24 over the air (Android 7c6c9ec3, iOS 0bde08fb): eight gold renders that sat
  in the bucket under the slug name (pickle.png, chickpea.png, black-bean, kidney-bean,
  lambs-lettuce, sweetcorn, mustard-seed, nectarine) while the script looked for the normal file
  name (gherkin.png, chickpeas.png, ...). The script now tries both; 114 of 230 plants have gold.
- 2026-10-06, 1.0.25 over the air (Android 17ca09e0, iOS ae5afa21): the Unlocks page split into
  two tabs, Achievements and Plants tried (cups row plus the categories); the title's count
  follows the tab (levels held, plants tried). Ricardo: the two read as one list before.
- 2026-10-06, 1.0.26 over the air (Android 6ec8215a, iOS 967eaeb3): the "Logging for" bar on the
  Log page only shows with 2 or more members; a family of one always logs for that one and the
  list gets the 74 px back.

## Feeds into
- [[strategy-backlog]] (item 14, the production-access application; "The one thing" line 3)
- [[concept-30-plants-origin]] · [[brand-stats-and-claims]] · [[concept-retention-loop]]
