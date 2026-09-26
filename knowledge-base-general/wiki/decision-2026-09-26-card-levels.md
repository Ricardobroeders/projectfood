---
title: Card levels at 3 / 8 / 15, placed against the churn curve
type: decision
tags: [decision, achievements, retention, cards, gamification]
created: 2026-09-26
updated: 2026-09-26
date: 2026-09-26
status: accepted
sources: [source-supabase-metrics-2026-09.md]
---

# Card levels at 3 / 8 / 15, placed against the churn curve

**Date:** 2026-09-26  **Status:** accepted

## Context
A plant card had three levels since the store POC: bronze on the first taste, silver at 5, gold at
10, where a taste is one plant on one day. Ricardo raised it on 2026-09-26 out of the loyalty
brainstorm (see [[strategy-backlog]] parking lot, pack opening): "I have many gold already", and
proposed raising the ladder to 10 / 25 / 50 "so we keep the duration of earning longer".

Live `plant_logs` to 2026-09-25 agreed with the complaint. Gold at 10 caught a third of every card
the two heaviest accounts own (Ricardo 60 of 169, Alissa 46 of 139 over about five months), and
silver caught half. The ladder had no top: the most-tasted single plant in the database is 43 and 50.

## Decision
**Bronze 3, silver 8, gold 15.** The card itself still appears on the first taste and is not a
level. Platinum at 25 and diamond at 50 are agreed in principle and **held back** until there are
cup renders (Ricardo: "keep platinum and diamond out for now, we will add these later").

Thresholds live in one place, `projectfood-mobile/src/features/plants/cardLevel.ts`. Adding a level
is a line there plus a cup render; the screens follow.

Ricardo is drawing **gold renders of the plants themselves**, so the plant turns gold once a card
reaches gold, "this way we could satisfy the customer that they will see more and more gold plants
occurring in their screen if they keep eating". The plumbing shipped the same day: `build-assets`
pulls the renders from the bucket folder `food-images/gold/<file>` at the plant's own file name, and
a plant without one keeps its normal render, so the set can grow one file at a time (Ricardo is
working most-eaten first, so nobody should notice the gap; yoghurt is in).

**The ground goes gold with the render**, on every surface a plant appears on: the Log shelf, the
disc the member menu grows from, today's chips on Home, the card window front and back, the
per-member card tiles under Unlocks and the plant page hero. `useGoldPlants` answers "has anyone at
the table taken this to gold" from the taste counts already in the cache, so no surface drills the
flag through props; the Unlocks tiles stay per member because that screen is already scoped to one.
The ground is its own token, `colors.goldSoft` `#F9DE72`, not the existing `colors.gold` (the metal)
and not the marigold accent's soft tint, which is the same pale gold and would have made a gold
plant look like any accent surface; it was picked against the real render at three values, deep
enough to read as gold next to the pastel category tints and apart from the whole-grain tint, pale
enough for the gold render to stand on.

## Rationale
The rungs are placed against the PWA's churn curve so that one lands **before** each moment people
left _(live `plant_logs`, 15 users, queried 2026-09-26)_:

| Lifespan (last log − first log) | Users |
|---|---|
| 1 week or less | 5 |
| 2 to 3 weeks | 2 |
| 4 to 5 weeks | 2 |
| 6 to 8 weeks | 2 |
| Over 3 months | 4 |

Median day on which a member's **first** card of each level fires, same query:

| Level | Tastes | First one lands | Churn moment it beats | Ricardo holds | Alissa holds |
|---|---|---|---|---|---|
| Card | 1 | dinner one | — | 169 | 139 |
| Bronze | 3 | day 6 | the one-week exit, 5 of 15 users | 120 | 96 |
| Silver | 8 | day 24 | the four to five week exit | 64 | 51 |
| Gold | 15 | day 40 | the six to eight week exit (spans of 44 and 48 days) | 38 · 22% | 29 · 21% |
| _Platinum, held_ | 25 | day 78 | month 3, where the old product reached zero | 15 | 12 |
| _Diamond, held_ | 50 | day 147 | month 5 and beyond | 0 | 1 |

Under this ladder **every user who churned would have left holding bronze cards** (Imke 35,
Marijke 32, Nicole 29, Bram 17, Rob 4, Marhein 2) and two would have reached silver. Gold falls
from 36% of a heavy collection to 22%, which is what the complaint asked for.

The churn curve comes from a product where nothing accumulated at all (Ricardo's own caveat), so it
is a floor rather than a forecast. It is still the only real curve available, and the rungs are
placed against it for that reason.

## Alternatives considered
- **Ricardo's first proposal, bronze 10 / silver 25 / gold 50, with the card itself at bronze.**
  Rejected on the data: five of the eight PWA members with 60+ plants logged would own zero cards
  (their best plant reached 7, 3, 6 and 3 tastes), and a typical member's first card would not
  arrive until day 31 to 46, right across the worst cliff. The counter-argument that the achievement
  shelf covers the early period is half right: it fires 15 or 16 level-1 achievements on day one
  _(as of 2026-09-18, [[concept-achievement-system]])_ and then goes quiet for weeks, which is
  exactly the window the card ladder has to fill.
- **20 / 40 above the existing gold**, keeping 1 / 5 / 10. Rejected: it leaves gold at 36% and a
  50-taste rung that the whole database reached once in five months reads as decoration.
- **Targets scaled per plant category.** Proposed by Claude on 2026-09-26 and withdrawn the same day:
  ferment holds the highest count in the database (yoghurt at 51 and 43) while it would have had the
  lowest target, and the top plants span every category at once (carrot 43, yoghurt 43, chia 41,
  black pepper 40, mango 39, oats 38), so a high count marks a household staple, not a category.
  Ricardo added the decisive reason: plants and categories keep being added, which would move the
  goalposts under a collection that must never reset (design rule 1).

## Consequences
- **The Log shelf is alphabetical since 2026-09-26**, not the household's frequent plants first.
  Frequency order sorted every gold card into one block at the top; alphabetical scatters them, so
  a gold plant turns up while scrolling. This trades against "log at the table in under a minute"
  in [[concept-retention-loop]], which is what frequency order was for, and now rests on the search
  field and the category tabs. Watch it in the closed test. It also deleted a mechanism: the order
  no longer depends on what has been tasted, so a plant logged tonight cannot jump, and the
  frozen-per-visit order added on 2026-09-24 to stop that went with it.
- **Regulars follows the metals by name.** Its first two rungs count cards at 8 and 15 instead of
  5 and 10, so "earn 10 silver cards" stays true, in `definitions.ts` and in the notification mirror
  `supabase/functions/send-notifications/ladder.ts` (change both, they cannot import each other).
  Rungs 3 and 4 already name plain numbers, 25 and 50, which are the held platinum and diamond.
- **A card below bronze is a new visual state**: collected, cup faded, with the tastes still to go.
- **Existing level counts drop for the two heavy accounts** (Ricardo 86 silver / 60 gold becomes
  64 / 38). Levels are computed from tastes rather than stored, so nothing is demoted in the
  database, and the twelve closed testers have no history. This was free to do before the closed
  test opens and would have broken design rule 1 (never resets) afterwards.
- **A child's curve will be slower** than the two adult accounts this was calibrated on, whose top
  plants include black pepper and chilli flakes. Bronze at 3 survives that; gold at 15 is the real
  long-term goal for the actual user, not the held platinum.
- **To watch:** whether gold at 15 still feels earned after a month with families, and what a
  child's depth curve looks like before platinum and diamond are switched on.

## Related pages
- [[concept-achievement-system]] · [[concept-retention-loop]] · [[strategy-backlog]] ·
  [[source-supabase-metrics-2026-09]] · [[decision-2026-09-07-app-v1-scope]]
