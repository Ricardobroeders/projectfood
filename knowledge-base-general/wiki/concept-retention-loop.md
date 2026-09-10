---
title: Retention loop (trigger, action, reward, investment)
type: concept
tags: [retention, habit, gamification, family-mode]
created: 2026-09-07
updated: 2026-09-10
sources: [source-supabase-metrics-2026-09.md, source-family-mode-context.md]
---

# Retention loop (trigger, action, reward, investment)

**In one line:** The habit loop the family app must close: a trigger at dinner, a one-minute
action, a reward that accumulates and never resets, and an investment that makes the collection
the household's own. The PWA had only the action.

## Explanation
Habit products (Duolingo is the reference) run four steps: an external trigger that becomes
internal over time; an action that takes under a minute; a reward that is visible immediately
and accumulates; and an investment by the user that raises the value of the next loop.

What the PWA had, per [[source-supabase-metrics-2026-09]]:
- **Trigger:** a generic daily reminder (8% led to a log within 3 h) and a streak rescue that
  worked (46%) but reached only the 5 users who had opted in.
- **Action:** logging worked, but as end-of-day recall of ~10 plants, not at the meal.
- **Reward:** a weekly count that reset every Monday. Seven of 13 users hit 30 at least once;
  five of them still left. Nothing accumulated.
- **Investment:** avatars and borders existed but were hidden under Account; 5 of 15 used them.
  Friends were the one investment people made (12 friendships) and correlated with about double
  the engagement ([[concept-engagement-drivers]]).

## Why it matters to Project Food
The MVP's decay (WAU 10 → 2; only the founder and one other user left after week 14) is what
an open loop looks like. Family mode closes it with two rituals that already exist (dinner,
groceries) and a kid who wants to see the reward. Ricardo's framing (2026-09-07): "there is no
to little reward which is measurable over time, besides being healthy which you maybe already
are." The measurable reward becomes the kid's growing collection.

## The loop for the family app (v1 design target)
| Step | Mechanic | Grounding |
|---|---|---|
| Trigger | Dinner question at the household's real dinner time (D10); streak keeper only when at risk, freeze covers pizza night (D7); card teaser after 3 missed dinners; cheer from another household, max one a day | Peak logging 19:00–20:00; streak rescue 46% vs daily reminder 8% |
| Action | Log at the table in under a minute: "who tasted it?" per kid, household's frequent plants first, repeat last dinner | Median 10 plants per session was recall; target 3–6 per dinner while the kid watches |
| Reward | Card unlock on first taste, silver at 5 tastes, gold at 10; album completion; family progress to 30; avatar accessory on album completion; facts on the card back | Tiny Tastes / Food Dudes: 10–15 exposures; reaching 30 alone did not retain |
| Investment | Kid builds an avatar in the first minute; per-member collection grows; household members and dinner time configured; class group joined | Avatars ignored when hidden; friends ≈ 2× engagement |

## Design rules that follow
- Rewards must be **cumulative and visible to the kid at the moment of logging**. If the parent
  logs alone after bedtime it is a chore, not a game.
- The parent's measurable outcome is the kid's taste count over months ("Mila eats 41 plants
  now, 12 in September"), not the weekly number. That is what the subscription is for.
- Notifications are the dinner-table question, never a nag; three ignored in a row → move or go
  quiet ([[source-family-mode-context]] §5).
- No sibling-vs-sibling competition; no punishment without a freeze (pillar 4,
  [[concept-brand-pillars]]).
- Instrument sent / delivered / opened / logged-within-3h from day one. The PWA recorded none.

## Evidence & examples
- Streak rescue 46% vs daily reminder 8% logged within 3 h _(as of 2026-09-07,
  [[source-supabase-metrics-2026-09]])_.
- 7 of 13 hit 30 in a week; 5 left anyway _(same source)_.
- Users with ≥1 friend ≈ 2× active weeks _(as of 2026-05-30, [[source-supabase-metrics]],
  correlational, n=13)_.
- Duolingo: streak with freeze, profile as trophy shelf, characters animated in Rive, reminders
  that stop themselves when ignored _(public product knowledge, undated)_.

## Contradictions / open questions
- All evidence is from adults, n=13, one of them the founder. The loop is a hypothesis to test
  with five families at week 4 and week 8 (D13).
- Loss-framed nudges work, but pillar 4 forbids punishment. Resolution: the nudge is about
  *keeping* something ("one plant tonight keeps the family streak at 12"), and the freeze absorbs
  a miss.
- Which age band leads the design (3–6 vs 6–11) changes how much the kid can do alone.

## Related pages
- [[overview]] · [[concept-achievement-system]] · [[concept-stickiness-moat]] · [[concept-engagement-drivers]] ·
  [[concept-engagement-snapshot]] · [[persona-household-parent]] ·
  [[decision-2026-09-07-app-v1-scope]] · [[decision-2026-09-06-family-mode-pivot]]
