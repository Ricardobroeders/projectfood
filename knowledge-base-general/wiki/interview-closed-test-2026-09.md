---
title: Closed test feedback (Play, from 2026-09-27)
type: interview
tags: [user-research, closed-test, feedback, play]
created: 2026-09-29
updated: 2026-09-29
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
2026-09-29 (twelve are needed for fourteen continuous days, see [[strategy-backlog]] item 14 and
"The one thing"). This page is the single record for Google's production-access application,
which asks how testers were recruited, what they said and what changed. One entry per point:
date, who (first name or role, never more), the words, what we did.

## Key findings
- **2026-09-29, a tester, via Ricardo: "When opening the app for the first time it's unclear
  why 30 different plants per week. Why is this the goal?"** Checked against the build: the
  number appears on Home ("of 30 plants", "n to go"), in an achievement and in a notification,
  and is never explained; onboarding (you, the table, dinner time) does not mention the goal at
  all. A tester who joins through the test link may never read the store listing, which is where
  the explanation lives today. Options put to Ricardo the same day: one sentence at onboarding
  step 1, a "Why 30?" sheet from the Home gauge, or both (Claude's recommendation: both, the
  sentence answers the first-open moment, the sheet holds the full answer for anyone who picks
  up the phone later). Copy has to stay within [[brand-stats-and-claims]] row 7: the guideline
  and its source, an adult observation, variety not amounts, never a promise for a child.
- **2026-09-29, Ricardo's own observations on the closed-test build:** the Google button shows
  no G yet (the G is in commit 10f1ad3, waiting for the over-the-air update), and the sign-in
  screen never said that every path both signs in and creates the account. Fixed the same day
  with a heading above the buttons ("Sign in or create an account", commit 9f22586).

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
- 2026-09-29: sign-in heading (commit 9f22586), waiting for the over-the-air update.
- "Why 30" explanation: awaiting Ricardo's pick between the options above.

## Feeds into
- [[strategy-backlog]] (item 14, the production-access application; "The one thing" line 3)
- [[concept-30-plants-origin]] · [[brand-stats-and-claims]] · [[concept-retention-loop]]
