---
title: The first minute, a four-step tutorial after onboarding
type: decision
tags: [decision, onboarding, first-minute, closed-test, why-30]
created: 2026-09-30
updated: 2026-09-30
date: 2026-09-30
status: proposed
sources: []
---

# The first minute, a four-step tutorial after onboarding

**Date:** 2026-09-30  **Status:** proposed (Claude's draft on Ricardo's direction; accepted once he
has read the four balloons)

## Context
Two closed-test points on 1.0.2 and 1.0.3 (Play build 7, [[interview-closed-test-2026-09]]): "no
introduction on why 30 plants are important" and "no onboarding". Onboarding today asks for a
name and avatar, the family and the dinner time, then drops the person on Home with a gauge that
says "0 of 30 plants" and never says why 30 or what to do first. Ricardo's reading, 2026-09-30:
the closed-test use case is different from the real one (a parent with a problem finds the app;
a tester was asked to try an app and may never have read the article), but the gap is real either
way. His direction: three or four onboarding markers that guide through the places of the app,
shown after the onboarding steps, the first moment the app is seen as it is, each with a way to
skip. Inspiration: the coach-mark balloons in Avito, Ozon and the like (a white balloon with a
caret at the highlighted element, a step counter, "Next", an X). Brainstorm 21 in
[[strategy-backlog]] and the parking-lot entry "Why 30, and a 3-step tutorial" are answered here.

## Decision
1. **Four coach marks, once per phone, right after onboarding.** They start on the first Home
   render after `onboarded_at` is set, and once on the next launch for the households that were
   onboarded before the update (so every current tester sees it once). A local persisted flag
   (`tutorialSeenAt` in the ui store, like `holdHintSeen`) ends it; a reinstall shows it again,
   which suits testers.
2. **The balloons** (parent register, [[brand-voice]]; the 30 line is [[brand-stats-and-claims]]
   row 7, adults, variety not amounts, never a promise for a child). Each balloon: title, one or
   two sentences, a counter "1/4", "Next" (last one "Done"), an X in the corner that ends the
   tutorial. English draft; nl and it are written natively with the build.
   1. Home, the **Log tab** lit: "Log what the family tasted" / "After dinner, tap Log and tick the
      plants that were on the table. A lick counts." Next opens Log.
   2. Log, the **first plant row** lit: "Tap a plant to log it for today" / "Hold it to say who
      tasted it. Every new plant becomes a card."
   3. Log, the **week chip** lit: "The family counts to 30 a week" / "The 30 plants a week
      guideline comes from the American Gut Project (2018): adults eating more than 30 different
      plants a week had a more varied gut flora. Variety counts, not amounts."
   4. Log, the **Unlocks tab** lit: "Cards and achievements live here" / "Every plant has a card
      that levels up as it is tasted again, and achievements mark what the family did at the
      table." Done ends the tutorial where the person stands, on Log, ready to tap.
3. **Mechanics.** A `tutorial` slice in the ui store (step, start, next, end); the four anchors
   register their window rectangle through a small hook (`useTutorialAnchor('logTab')` in the
   tab bar, on the first `PlantRow`, on `WeekMeter`); one overlay mounted in the tabs layout
   above the tab bar draws four dim rectangles around a rounded hole at the anchor and the
   balloon below or above it with a caret. The hole passes taps to the real control, so tapping
   the lit tab works as well as Next. Next on step 1 navigates to Log itself and waits for the
   row and chip to report their position. Plain views, no native module, so it ships over the air
   on both runtimes. Events: `tutorial` with step and action (next, skip, done).
4. **The hold hint on Log** stays for households with more than one member; balloon 2 says the
   same in passing, and the hint disappears on the first hold as today.

## Rationale
Balloons on the real screens teach the two gestures and the goal where they happen, in under a
minute, and the goal's why sits on the number it explains. A carousel before Home would be read
once and forgotten; a single "Why 30?" sheet from the gauge answers the why but not the what-to-do.
Four steps on two screens is the smallest set that covers logging, who tasted, the weekly goal
and where the reward lives, which is Ricardo's list of 2026-09-30.

## Alternatives considered
- A sentence at onboarding step 1 (drafted 2026-09-29) — answers the why before the person has
  seen a number; kept as a possible addition, not instead.
- A "Why 30?" sheet from the Home gauge (drafted 2026-09-29) — good for anyone who picks up the
  phone later; can follow once the balloons exist, the copy is the same line.
- A full-screen carousel after onboarding — read once, skipped often, teaches nothing in place.

## Consequences
- Every closed tester sees the four balloons once after the update; watch the `tutorial` events
  for where people skip.
- The app finally names the source of the 30 in the product, within the claims rule.
- Follow-ups: nl and it copy with the build; the greeting by time of day (decided separately);
  later a "Why 30?" sheet from the gauge if testers still ask.

## Related pages
- [[interview-closed-test-2026-09]] · [[strategy-backlog]] (brainstorm 21, items 23 and 24)
- [[concept-30-plants-origin]] · [[brand-stats-and-claims]] · [[brand-voice]]
- [[decision-2026-09-16-store-poc-scope]] · [[concept-retention-loop]]
