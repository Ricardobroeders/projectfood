---
title: The four laws of habit, applied to the table
type: concept
tags: [retention, habit, gamification, family-mode, rewards]
created: 2026-10-07
updated: 2026-10-07
sources: [source-supabase-metrics.md, source-family-mode-context.md, interview-closed-test-2026-09.md]
---

# The four laws of habit, applied to the table

**In one line:** James Clear's four laws (make it obvious, attractive, easy, satisfying) held
against the family app, twice over: once for the parent who holds the phone and owns the habit,
once for the kid at the table who supplies the reward. Three laws are built; the fourth is thin,
and that is the "little reward, preventive work" problem Ricardo keeps naming.

## Explanation

_Atomic Habits_ (Clear, 2018) describes a habit as a four-step loop, cue → craving → response →
reward, and gives one law per step. [[concept-retention-loop]] already uses the near-identical
Hook model (trigger, action, reward, investment); this page does not replace it. Clear adds
four ideas that the Hook model lacks and that fit our problem exactly:

1. **The valley of disappointment.** Outcomes lag behind effort; the early weeks of any habit
   feel like nothing is happening, and most people quit there. Eating varied is the extreme
   case: the outcome is preventive, so it never shows. Clear's answer is to make the *process*
   the thing that is tracked and rewarded, not the outcome. The card, the streak and the count
   are all process rewards; the question is whether they arrive fast enough and often enough.
2. **Identity over outcome.** "The goal is not to read a book, the goal is to become a reader."
   Every log is a vote for "we are a family that tastes things". The app has never said this
   sentence anywhere.
3. **Never miss twice.** Missing once is an accident; missing twice is the start of a new
   habit. The freeze absorbs the first miss. Nothing in the app notices the second.
4. **The Goldilocks rule.** A habit stays interesting when the task sits just above the current
   ability: not too easy, not too hard, with fast feedback. The weekly 30 is one fixed bar for
   everyone; the achievement ladders move in months. Nothing in between adapts to the household.

The four laws, each read for both people at the table:

### Law 1: make it obvious (cue)

| | Parent | Kid |
|---|---|---|
| Have | The dinner question at the household's own time (`dinner_question`, only if nothing was logged yet); the streak keeper only when at risk; three ignored in a row → a week of quiet. The ping is set on the dinner-time step of onboarding. | Nothing. The kid never sees a cue; the parent's phone is the cue. |
| Data | Logging is 100% same-day and comes in sittings of about 8 plants, so the cue is "after dinner", not "as you eat" ([[concept-logging-behaviour]]). Notifications on vs off: 4.08 vs 0.93 weeks hitting 30 (n=12 vs 15, correlational, [[concept-engagement-drivers]]). | The kid-facing cues in the family-mode brief (the printable on the fridge, the card on the table) are not built. |
| Gap | The app owns the phone cue. It does not own the table cue. Clear's **habit stacking** ("after we sit down, before the first bite, we tap") needs an anchor the family already has; the dinner time typed at onboarding is that anchor, and the copy never says the stacking sentence. | A physical cue the kid can see without the phone: the printable, a card on the fridge, the kid asking "did you log it?". The kid as the cue is the cheapest cue there is. |

### Law 2: make it attractive (craving)

| | Parent | Kid |
|---|---|---|
| Have | The why-30 balloon in the first minute; the stats page with the typical-household lines (1.0.31); the achievements ladder. | The card on first taste; bronze, silver, gold at 3, 8, 15 tastes ([[decision-2026-09-26-card-levels]]); the gold plant sheet with its turning rays (1.0.22); the celebration sheet; the avatar in one colour. |
| Data | "Why 30?" was the first tester question (2026-09-29, [[interview-closed-test-2026-09]]). The craving was not there until the why was. | The POC's "first bites" on day one worked; gold renders exist for 144 of 230 plants, so the most attractive reward is still missing for a third of the catalogue. |
| Gap | **Temptation bundling** (pair the habit with something you want): the kid's reaction *is* the bundle, so the parent must log with the kid present. The app does not say "log at the table, together", and after-bedtime logging makes it a chore ([[concept-retention-loop]] design rule 1). | **Join a culture where the behaviour is normal**: the friend and class layer (row 17), deferred. Until then the only culture is the household itself, which is why the household streak matters more than the kid's. |

### Law 3: make it easy (response)

| | Parent | Kid |
|---|---|---|
| Have | One tap per plant; repeat last dinner; hold-to-pick the people under the finger; the two-minute rule is met (a log takes under a minute). "Log it now, name it later" for unknown plants is parked. The for-bar hides for solo households (1.0.28). | The kid can tap on the parent's phone. |
| Data | Testers asked for a faster first open and a faster survey (fixed 1.0.29); the Log search was the main friction reported. | Unknown. The survey (1.0.29) asks who taps, when, and what stops it. |
| Gap | Friction we cannot see from the data: finding the plant, the second phone in the household (one account, two parents), a dinner outside the home. **Environment design**: the app icon's place, the widget, the lock-screen shortcut are all untested. | A kid-mode screen where the kid taps alone was in the family-mode brief and is out of scope until the leading age band is decided (row 3). |

### Law 4: make it satisfying (reward)

This is the thin law. Clear's cardinal rule: what is rewarded is repeated, what is punished is
avoided; and the reward has to be **immediate**, because the outcome never is.

| | Parent | Kid |
|---|---|---|
| Have | The week chip filling to 30; the streak chip; the stats page (typical-household lines, 4 tiles, the mix); achievements with levels; the Sunday nudge at 25 to 29. | The card flip; the cup levels; the gold plant; the achievement sheet; the kid fact on the card back. |
| Data | In the PWA, 7 of 13 hit 30 at least once and 5 of them still left: a reward that resets on Monday does not accumulate ([[concept-retention-loop]]). The family app's rewards accumulate, but most arrive at the first taste and then at the 15th, weeks later. | The 3 / 8 / 15 placements were chosen for the churn moments; whether a kid feels the gap between 3 and 8 is untested. |
| Gap | **A habit tracker that never breaks.** The streak with one freeze is a tracker; the second miss ends it, and the app says nothing. "Never miss twice" wants a quiet nudge on the second day only, framed as keeping, never losing (the resolution already in [[concept-retention-loop]]). **The Goldilocks rule**: nothing adapts to the household's level. A rotating weekly quest ("3 legumes this week", "1 plant you never tasted", "2 in season") is the missing middle between the weekly number and the ladders; it is built from data we hold (categories, the season table, taste counts) and pays out on Sunday. | **Immediate satisfaction at the table**: the celebration should happen while the kid is looking. Everything we add on this side must be visible in the same minute as the log. The garden (parking lot) is a slow, cumulative version of this and belongs after the quests, not before. |

## Why it matters to Project Food

- It names the problem precisely. "There is little reward and we work on something
  preventative" is the valley of disappointment. The fix Clear prescribes is the one the
  retention loop already states: reward the process, immediately, cumulatively. The app does
  this at the first taste and at the long end; the middle is empty. That middle is the quests
  brainstorm.
- It splits the two people. The parent builds the habit (cue, response); the kid supplies the
  craving and the reward. Anything that rewards the parent alone (a number, a chart) is weaker
  than anything the kid can see. The typical-household lines are a parent reward; a quest the
  kid can name at the table is a kid reward.
- It gives pillar 4 its mechanism. "Joy, not guilt" is Clear's cardinal rule said in our voice:
  punishment makes the behaviour avoided, so the app never scolds, and the second-miss nudge is
  framed as keeping something, not losing it.
- It argues against coins. A parallel currency rewards logging, not tasting; Clear's reward has
  to be tied to the behaviour we want, which is the taste. The garden, if ever, grows from the
  plants tasted, as the parking-lot entry already says.

## What this hands to the quests brainstorm (item 26)

- A quest is a Goldilocks device: just above this household's current week, with fast feedback.
  The benchmark file (the typical household) and the household's own last four weeks give the
  level; the quest text is chosen from it.
- Three quest families match the three structural gaps in the data: legumes, whole grains and
  ferments are under 9% of logs ([[concept-logging-behaviour]]); never-tasted plants (42 of the
  catalogue were never logged in the PWA); and the season table from 1.0.31.
- Payout on Sunday makes "meaningful by Sunday" (pillar 3) literal, and gives the Sunday nudge
  something to say other than 25 to 29.
- The kid should be able to say the quest: "we need two beans this week". If the parent has to
  explain it, it is a parent reward again.
- Identity line, once: a place where the app says what the family is becoming. Candidate: the
  monthly recap (row 4), not the Home screen.

## Evidence & examples

- Streak rescue 46% vs daily reminder 8% logged within 3 h _(as of 2026-09-07,
  [[source-supabase-metrics-2026-09]])_: the at-risk cue outperforms the generic cue.
- Same-day logging 100% in local time; median 8 plants per active day _(as of 2026-09-28,
  [[source-supabase-metrics]])_: the response is one sitting after the meal.
- Notifications on vs off: 4.08 vs 0.93 weeks hitting 30, n=12 vs 15, correlational _(as of
  2026-10-06, [[concept-engagement-drivers]])_.
- 7 of 13 PWA users hit 30 at least once, 5 of them left _(as of 2026-09-07,
  [[source-supabase-metrics-2026-09]])_: a resetting reward does not hold.
- Legume, whole grain and ferment under 9% of logs together _(as of 2026-05-30,
  [[concept-logging-behaviour]])_: the natural quest material.
- Duolingo: daily quests, monthly badges, a streak with freezes, friend streaks _(public product
  knowledge, undated)_.

## Contradictions / open questions

- Clear writes for an adult changing an adult's habit. Here one person performs the habit and
  another receives the reward. The page assumes the parent owns the habit; a kid-mode screen
  would move the response to the kid and change laws 1 and 3. Decided only once the leading
  age band is (row 3).
- "Never miss twice" wants a second-day nudge; the notification policy caps essential pings and
  goes quiet after three ignored. The nudge must fit inside that budget, not add to it.
- A quest is a goal with a deadline; pillar 4 forbids guilt at the deadline. The quest ends with
  what the family did ("two of three, the beans were the hard one"), never with what it missed.
  Whether that reads as satisfying or as a miss is a test, not a decision.
- The identity sentence ("a family that tastes things") risks the "for kids" gate and the
  no-health-claim gate if written carelessly; it goes through `pf-voice`.
- All numbers above are from adults, n small, one of them the founder. The closed-test survey
  (who logs, when, what stops) is the first family-side evidence.

## Ricardo's three calls (open, 2026-10-07)

1. Whose habit: the parent's logging, with the kid as the reward (Claude's position, argued
   above), or the kid's tasting with a kid-mode screen.
2. Never miss twice: should the app notice the second missed day, and say what, inside the
   current ping budget. Claude's position: yes, once, as keeping ("one plant tonight keeps the
   family at 12"), never after that.
3. Identity: name it once in the monthly recap, or keep it implicit. Claude's position: once,
   in the recap, never on Home.

## Related pages

- [[overview]] · [[concept-retention-loop]] · [[concept-achievement-system]] ·
  [[concept-brand-pillars]] · [[concept-logging-behaviour]] · [[concept-engagement-drivers]] ·
  [[decision-2026-09-26-card-levels]] · [[decision-2026-10-07-stats-typical-household]] ·
  [[interview-closed-test-2026-09]] · [[strategy-backlog]] (parking lot: quests, the garden)
