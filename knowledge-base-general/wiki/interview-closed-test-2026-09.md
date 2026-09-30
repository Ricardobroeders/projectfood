---
title: Closed test feedback (Play, from 2026-09-27)
type: interview
tags: [user-research, closed-test, feedback, play]
created: 2026-09-29
updated: 2026-09-30
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
2026-09-29 according to Google; Supabase the same evening showed 12 accounts (Ricardo's included) that
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
  progress), coach-mark balloons like Avito's and Ozon's, always with a skip. Drafted as
  [[decision-2026-09-30-first-minute-tutorial]] (status proposed, four balloons with copy).

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

## Feeds into
- [[strategy-backlog]] (item 14, the production-access application; "The one thing" line 3)
- [[concept-30-plants-origin]] · [[brand-stats-and-claims]] · [[concept-retention-loop]]
