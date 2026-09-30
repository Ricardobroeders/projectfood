---
title: The first minute, a four-step tutorial after onboarding
type: decision
tags: [decision, onboarding, first-minute, closed-test, why-30]
created: 2026-09-30
updated: 2026-09-30
date: 2026-09-30
status: accepted
sources: []
---

# The first minute, a four-step tutorial after onboarding

**Date:** 2026-09-30  **Status:** accepted (Ricardo, 2026-09-30, with two changes to the draft: the
copy speaks to the person holding the phone, not "the family", and the last balloon is about adding
family members and logging for everyone, so nobody using the app alone feels excluded). Built and
over the air the same day as 1.0.7 (commit 92a8253; Android group eb5a3aec on d8da0646, iOS group
42c3a8da on acf2e071). Ricardo's first run on the OnePlus led to 1.0.8 an hour later (commit
21893b6; Android group 52b0bc3d, iOS group 35c3a31a): **three balloons**, the family one dropped
because onboarding step 2 already adds the family and the who-logs bar cannot add anyone; the
first balloon had never shown; the hole got the control's corner radius and a lighter dim.

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
1. **Three coach marks (four until 1.0.8), once per household on this phone, right after
   onboarding.** They start on the first Home render after `onboarded_at` is set, and once on the
   next launch for the households that were onboarded before the update (so every current tester
   sees it once). A local persisted flag keyed by household id (`tutorialSeen` in the ui store)
   ends it: a reinstall shows it again, which suits testers, and so does a new account on the
   same phone (1.0.9; until then the flag was phone-wide and Ricardo's deleted-and-recreated
   account got no tutorial).
2. **The balloons** (parent register, [[brand-voice]], second person to the one holding the
   phone; the 30 line is [[brand-stats-and-claims]] row 7, adults, variety not amounts, never a
   promise for a child). Each balloon: title, one or two sentences, a counter "1/4", "Next" (last
   one "Done"), an X in the corner that ends the tutorial. Shipped copy, en / nl / it:
   1. Home, the **Log tab** lit: "Log what you tasted" / "After you've eaten, tap Log and tick
      the plants you tasted." · "Log wat je hebt geproefd" / "Tik na het eten op Loggen en vink
      de planten aan die je hebt geproefd." · "Registra cosa hai assaggiato" / "Dopo aver
      mangiato, tocca Registra e segna le piante che hai assaggiato." (1.0.10, Ricardo: any meal
      counts, not only dinner, and "A lick counts" dropped.) Next opens Log; tapping the lit tab
      counts too.
   2. Log, the **first plant row** lit: "Tap a plant to log it for today" / "Every new plant
      becomes a card in Unlocks, and it levels up as you taste it again." · "Tik op een plant om
      hem voor vandaag te loggen" / "Elke nieuwe plant wordt een kaart bij Behaald, en die gaat
      een level omhoog als je hem vaker proeft." · "Tocca una pianta per registrarla per oggi" /
      "Ogni pianta nuova diventa una carta nella Collezione e sale di livello quando la assaggi
      di nuovo."
   3. Log, the **week chip** lit: "30 different plants a week" / "The guideline comes from the
      American Gut Project (2018): adults eating more than 30 different plants a week had a more
      varied gut flora. Variety counts, not amounts." · "30 verschillende planten per week" / "De
      richtlijn komt uit het American Gut Project (2018): volwassenen die meer dan 30 verschillende
      planten per week aten, hadden een gevarieerdere darmflora. Variatie telt, niet de
      hoeveelheid." · "30 piante diverse a settimana" / "La linea guida viene dall'American Gut
      Project (2018): gli adulti che mangiavano più di 30 piante diverse a settimana avevano una
      flora intestinale più varia. Conta la varietà, non la quantità." Under the body a text link
      "Read the article" / "Lees het artikel" / "Leggi l'articolo" opens
      https://projectfood.dev/{locale}/learn/plant-diversity in the in-app browser (en for de and
      fr), 1.0.10.
   Done on balloon 3 ends the tutorial on Log, ready to tap. A fourth balloon on the who-logs bar
   ("Log for the whole family" / "Add family members here and choose who a tap logs for. Hold a
   plant to say who tasted it.") shipped in 1.0.7 and was dropped in 1.0.8 the same day (Ricardo:
   onboarding step 2 already adds the family, and the bar cannot add anyone; the copy is kept
   here in case a later "add someone" balloon is wanted from the member menu).
   Buttons: Next / Volgende / Avanti, Done / Klaar / Fatto; the X is "Skip the tutorial" /
   "Uitleg overslaan" / "Salta la spiegazione" for screen readers. The Unlocks tab balloon of the
   draft was dropped too: balloon 2 names the cards and where they live.
3. **Mechanics** (as built): `tutorialStep`, `tutorialSeenAt` (persisted) and `tutorialAnchors`
   in the ui store (`src/state/ui.ts`); `useTutorialAnchor` / `TutorialAnchorView`
   (`src/features/tutorial/`) report a control's window rectangle while a tutorial runs, on
   layout and again 250 ms after a step change; the steps in `steps.ts`; `useTutorialStart` waits
   for the persisted store to hydrate and starts 700 ms after the tabs mount when `tutorialSeenAt`
   is null. `TutorialOverlay` sits in the tabs layout in the same box as the tabs and the tab bar
   (so window coordinates are its coordinates). Since 1.0.8 the dim is one SVG rectangle with a
   mask that cuts a hole with the control's own corner radius (16 tab, 30 row, 18 chip, set per
   step) and a white ring, at 0.45 opacity (0.55 was heavy); four transparent pressables around
   the hole swallow taps so the control stays live. The balloon goes under the hole when there is
   about 260 px of room, else above it anchored by its bottom edge, so its height is never
   measured (1.0.7 gated its opacity on a measured height and the entering animation froze the
   first balloon at 0: it never showed). Step 1 advances when the path becomes `/log`, however
   the person got there. Events: `tutorial` with `step` and `action` (next, done, skip).
   react-native-svg was already a dependency (the gauge), so still no native change. An anchor
   can carry an inset for edges that are not the control (the plant row's 10 px bottom margin,
   1.0.10), so the hole's air is the same above and below the card. `tutorial` events also carry
   `link` when the article is opened, and `lost` when a control never reported its position and
   the tutorial ended itself after 2.5 s rather than hold the screen.
5. **Motion, the `guide` class** (1.0.11; Ricardo: "everything shows instantly", asked for the
   open and close and the step change as motions). One dim layer stays for the whole tutorial.
   The hole starts as the whole screen (no dim visible) and irises onto the first control in
   460 ms ease-out; on Next the balloon fades out (`swap`, 200 ms) while the hole glides to the
   next control in 380 ms ease-in-out, across the tab switch if there is one, and the next balloon
   rises in (`modal` spring: fade, a 10 px rise, a 3 % scale) as the hole lands; on Done or X the
   hole opens back out in 300 ms ease-in and the dim fades after it. The hole is an animated SVG
   mask rectangle driven on the UI thread (Reanimated `useAnimatedProps` on react-native-svg).
   Never a bounce: a light being moved, not a reward. The wait after onboarding dropped from 700
   to 350 ms; the iris covers the first paint.
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
- Follow-ups: the greeting by the hour shipped in the same update (Ricardo's pick, 2026-09-30);
  later a "Why 30?" sheet from the gauge if testers still ask. Ricardo's first run on the OnePlus
  (1.0.7) found the holes placed right on Android; iOS still unseen.

## Related pages
- [[interview-closed-test-2026-09]] · [[strategy-backlog]] (brainstorm 21, items 23 and 24)
- [[concept-30-plants-origin]] · [[brand-stats-and-claims]] · [[brand-voice]]
- [[decision-2026-09-16-store-poc-scope]] · [[concept-retention-loop]]
