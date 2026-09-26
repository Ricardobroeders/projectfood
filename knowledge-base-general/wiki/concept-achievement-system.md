---
title: Achievement system (cards, albums, milestones)
type: concept
tags: [retention, gamification, achievements, family-mode]
created: 2026-09-10
updated: 2026-09-26
sources: [source-supabase-metrics-2026-09.md, source-family-mode-context.md, live Supabase plant_logs (queried 2026-09-18)]
---

_Naming (2026-09-22): these are **achievements** in the app and in every piece of copy (NL prestaties, IT traguardi). Until 2026-09-22 they were called "stamps"; code identifiers, i18n keys and asset paths keep `stamp` and are not renamed._

# Achievement system (cards, albums, milestones)

**In one line:** The goal layer of the family app: three tiers of things to earn (a card per
plant, an album per group of plants, a milestone achievement per behaviour) that never reset, always
show the next reachable goal, and are earned at the dinner table while the kid watches. Proposed
by Ricardo on 2026-09-10 as the backbone of the goal-oriented mindset and the main answer to
churn; it fills the reward and investment steps of [[concept-retention-loop]]. Status: design
proposal, to be tested with five families (D13).

## Explanation

**Why a collection and not a target.** The PWA had one goal, 30 plants a week, and it reset
every Monday. Seven of 13 users reached it and five of those left anyway
([[source-supabase-metrics-2026-09]]). A goal that resets teaches "done"; a collection teaches
"next". The system below turns every logged taste into progress on at least one visible goal,
which is what "goal-oriented" means in practice: the user can always answer "what am I close
to?".

### Tier 1: Cards (one per plant, per kid)
- Unlock on the first taste, silver at 5 tastes, gold at 10 (v1 feature 1 in
  [[decision-2026-09-07-app-v1-scope]]; the Tiny Tastes / Food Dudes exposure counts).
- The atomic achievement. With roughly 150 plants in the database each kid has hundreds of card
  states to move; the tier never runs out.
- The card back carries one kid fact and one parent tip (feature 3). Opening the back is itself
  a first-time achievement (Curious); the POC showed this lands.
- Progress copy is always remaining effort ("2 more tastes to silver"), never a percentage.

### Tier 2: Albums (groups of cards)
- By botanical family with kid names ("The Tomato Family"), by colour (Rainbow), by season
  (time-limited); about 12 at launch (feature 2). Completion per album; completing one unlocks an
  avatar accessory (feature 4) and is the shareable moment for the class group.
- Albums are where the paid Sunday advice (feature 11) plugs in: "Two plants finish The Tomato
  Family, both in season this week." The paid feature becomes the accelerator of the collection
  instead of generic variety advice. This is the strongest business link in the system.
- Album difficulty is designed, not accidental. The first album must be completable within about
  two weeks of ordinary dinners, aimed at the week 0→1 and week 4→5 cliffs; later albums take a
  season.

### Tier 3: Milestone achievements (behaviours, per kid or per household)
Rare, behavioural, capped at about 20 at launch. Every achievement maps to a behaviour we want at the
table, never to opening the app, sharing, or changing a setting. Starting set:

| Achievement | Trigger | Level | Why |
|---|---|---|---|
| First bites | 3 tastes logged | kid | Day-one win; proven in the POC |
| Curious | first card back opened | kid | Teaches that the card has two sides |
| Brave bite | tasted a plant previously marked "refused" | kid | The behaviour parents pay for: exposure becomes acceptance |
| Rainbow week | 5 colours in one week | kid | Variety without the number 30 |
| Table talk 7 / 30 / 100 | dinners logged in a row, freeze covers a miss (D7) | household | Streak rescue worked (46%); the freeze keeps pillar 4 |
| Family of 30 | 30 distinct plants in a week | household | The old goal, demoted to one achievement among many |
| Album keeper | first album completed | kid | Bridges tiers 2 and 3 |
| Season keeper | a seasonal album completed in time | kid | Time-limited reason to come back |
| Full table | every household member tasted the same plant | household | Sibling cooperation, not competition |
| Cheerleader | first cheer sent to another household | household | The one social investment that correlated with 2× engagement |

### Tier 3 as a ladder: the calibrated proposal (2026-09-18)

**The problem.** The 16 achievements that shipped in the store POC on 2026-09-16 all have first-week
targets (3 plants, 5 vegetables, 7 dinners, one week of 30). Measured against the live data,
every engaged user unlocked all of them on their first day in the new app: Ricardo's account
received 15 achievements at once after onboarding, and the mid-engaged PWA users would have had 14–16
within their first two weeks _(as of 2026-09-18, live Supabase `plant_logs`, n=14 members with
logs)_. A shelf that is full on day one gives rule 2 ("the next goal is always visible") nothing
to point at.

**The fix: keep the 16 achievements, give each one levels.** Levels keep the shelf rare (rule 6: about
20 achievements), keep one image per achievement, and turn every achievement into a ladder whose rungs sit at one
week, one month, one season and one year of ordinary dinners. The celebration becomes a level-up;
the shelf shows the level reached with a frame (bronze, silver, gold, platinum). This is also the
"5 / 50 / 100" ladder from Ricardo's 2026-09-10 notes, applied to achievements instead of card facts.

**Calibration.** Targets were set on where real users stood, not on round numbers alone
_(all figures as of 2026-09-18, live data)_:

| Member (days active / span) | Distinct plants | Veg | Fruit | Herb | Nut | Legume | Grain | Ferment | Superfood | Silver / gold / 25× cards | Max one plant | Weeks ≥30 | Longest streak (household) | Biggest day |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Ricardo (118 / 145) | 165 | 60 | 34 | 20 | 23 | 12 | 8 | 8 | 36 | 83 / 58 / 11 | 40 | 21 | 27 | 30 |
| Alissa (108 / 139) | 139 | 55 | 30 | 12 | 18 | 12 | 4 | 8 | 32 | 69 / 45 / 10 | 46 | 19 | 18 | 29 |
| Nicole (27 / 117, active) | 75 | 24 | 17 | 8 | 7 | 7 | 8 | 4 | 17 | 13 / 1 / 0 | 13 | 1 | 3 | 13 |
| Marijke (23 / 47, left) | 74 | 32 | 16 | 8 | 11 | 1 | 5 | 1 | 17 | 23 / 3 / 0 | 10 | 4 | 6 | 27 |
| Imke (7 / 24, left) | 91 | 34 | 24 | 13 | 14 | 2 | 3 | 1 | 23 | 19 / 0 / 0 | 7 | 4 | 2 | 51 |
| Bram (17 / 43, left) | 60 | 24 | 15 | 10 | 8 | 6 | 1 | 1 | 13 | 5 / 0 / 0 | 6 | 2 | 4 | 21 |
| Rob (3 / 21, left) | 74 | 38 | 6 | 17 | 6 | 4 | 1 | 2 | 12 | 0 / 0 / 0 | 3 | 2 | 2 | 63 |
| Marhein (24 / 96, left) | 59 | 24 | 9 | 6 | 10 | 6 | 1 | 3 | 17 | 0 / 0 / 0 | 3 | 0 | 5 | 9 |

Catalogue ceilings: 224 plants, 76 vegetables, 49 fruits, 26 herbs, 27 nuts and seeds, 21
legumes, 17 whole grains, 8 ferments, 44 superfoods, 18 nightshades, 8 colours.

**The ladder.** Level 1 is the achievement as it ships today (unchanged, so no unlock is taken away).
"All" means the whole category, which makes the top level of a category achievement the category album
of tier 2 until real albums exist.

| Achievement | Scope | Level 1 (first week) | Level 2 (first month) | Level 3 (a season) | Level 4 (a year) | Ricardo / Alissa today |
|---|---|---|---|---|---|---|
| Explorer (distinct plants ever; today "First bites") | kid | 3 | 50 | 100 | 200 | L3 · L3 |
| Green machine (vegetables) | kid | 5 | 20 | 40 | 76, all | L3 · L3 |
| Fruit basket | kid | 5 | 12 | 25 | 49, all | L3 · L3 |
| Herb garden | kid | 3 | 8 | 15 | 26, all | L3 · L2 |
| Nutcracker | kid | 3 | 8 | 15 | 27, all | L3, 4 from L4 · L3 |
| Bean counter (legumes) | kid | 3 | 6 | 10 | 21, all | L3 · L3 |
| Grain train | kid | 3 | 5 | 8 | 17, all | L3 · L1 |
| Bubbly (ferments) | kid | 2 | 4 | 6 | 8, all | L4 · L4 |
| Superfood | kid | 5 | 15 | 30 | 44, all | L3 · L3 |
| Tomato family (nightshades) | kid | 5 | 10 | 18, all | – | L2 · L2 |
| Rainbow (colours) | kid | 5 in one week | all 8 ever | all 8 in one week | – | L2 · L2 |
| Big dinner (distinct plants in one day) | household | 10 | 15 | 20 | 30 | L4 · L3, 1 away |
| Table talk (dinners in a row, freeze counts) | household | 7 | 14 | 30 | 100 | L2, 3 from L3 · L2 |
| Family of thirty (weeks with 30 distinct) | household | 1 | 4 | 12 | 52 | L3 · L3 |
| Regulars (card levels) | kid | 10 silver cards | 10 gold cards | 10 plants tasted 25× | one plant tasted 50× | L3, 10 from L4 · L3, 4 from L4 |
| Full table (plants every member tasted) | household | 1 | 10 | 30 | 100 | needs a second member |
| Curious | household | first card back opened | – | – | – | done |

Reading the last column: after five months the two heaviest users still have six to eight rungs
open, each between 1 and 60 tastes away. That is the "just far enough" test: the next goal is
concrete, and none of them is done in a day.

**Where churn sits, and which rung should be half done there.** The retention curve of the 14
members: 100% log in week 0, 64% in week 1, 50% in week 2, 43% in week 4, 36% in week 5, 21% from
week 7 on _(as of 2026-09-18, live data)_. Two cliffs: week 0→1 (a third gone; an onboarding
problem, not a goal problem) and weeks 5→7 (43% to 21%). The five mid-engaged users who left did
so after 21–47 days holding 59–91 distinct plants, 24–38 vegetables, 4 weeks of 30 at most, and
0–3 gold cards. On the ladder above that puts them, at the moment they left, at 60–90% of Explorer
level 3 and of Green machine level 3, at level 2 of Family of thirty, and at 0–30% of Regulars
level 2. So the rungs that are half done at the second cliff are Explorer 100 and Green machine
40: the card-teaser push (rule 8) and the Sunday nudge should name those first ("9 vegetables
from Green machine gold"), and a level that crosses 50% and 75% is a push moment in its own
right. Caveats: n=14, adults only, several of the departed users entered days in bulk (Rob's
biggest day is 63 plants, Imke's 51), and one household is the founder's.

**Built 2026-09-18** (migration `20260918110000_stamp_ladder.sql`, app commit the same day) with the
targets exactly as in the table; Ricardo can tune any rung in `definitions.ts`. Rainbow counts
"weeks with 5 colours" (1 / 4 / 12 / 52), which keeps one metric per achievement; Regulars is the one achievement
whose metric changes per rung. Rungs unlock in order.

**Rung nudge (built 2026-09-20).** The push moment above is live: `send-notifications` mirrors the
ladder (`ladder.ts`, same targets and metrics as `definitions.ts`; change both) and, 90–75 minutes
before dinner, names the one rung closest to its next level once it passed 50% or 75% ("Halfway
there: Mia needs 9 more vegetables for Green machine gold"), deep-linking to Unlocks. Marketing
channel, under the card-teaser flag (off by default), at most one per household every three days,
each mark once (`achievement_nudges`). A household's first run only records where it already stands,
so the nudge follows real crossings, not history. Copy in en/nl/it in `rung-copy.ts`.

**Time over bulk (device feedback, same day).** Ricardo's worry: count-based achievements can be dumped
in one day, and the data agrees (Rob logged 63 plants on one day, Imke 51, both left). Two changes:

- Discovery achievements (Explorer, the eight category achievements, Superfood, Tomato family): rung 1 counts
  every plant; rungs 2–4 only count a plant once it has been tasted on **two different days**
  (a taste row is one plant on one day, so card levels and Regulars were already day-based).
- Two consistency achievements, household scope: **Regular table**, dinner logged on 5 / 20 / 60 / 200
  different days; **Steady weeks**, weeks with four dinners logged, 1 / 4 / 12 / 40 (migration
  `20260918130000_weekly_active_days.sql` adds `active_days` to `household_weekly_history`).
  Renders to generate: `achievement-regular_table.png` (a calendar page with ticked days) and
  `achievement-steady_weeks.png` (a week strip with four plates).

Levels show as pips under the achievement, not as coloured rings (rings read as noise on the shelf).

**What it takes to build.** `achievement_unlocks` gains a `level` column (unique on household,
member, achievement, level); the engine records the highest level reached; the celebration sheet
says "Green machine · silver"; copy per level in en/nl/it; the Unlocks shelf draws the frame. Level
1 rows already unlocked stay valid. Rainbow level 3 needs the current week's colours only (the
unlock row persists), so no history RPC is required. Full table needs a household with two members
to be reachable, which is the family case by design.

**Prize images, one per achievement.** Level is shown by the frame around the same image (bronze, silver,
gold, platinum ring), so 17 renders cover the shelf. Style: one object, 3D clay, soft studio light,
plain white background, no text, square, matching the plant renders.

Ids and files (2026-09-18): the ladder needs ids without a number in them, so the migration renames
the existing `achievement_unlocks.achievement_id` values. Originals go in the public Storage bucket
`achievements` as `achievement-<id>.png` (square, 1024 px; the name pattern is fixed by Ricardo's n8n
workflow); `scripts/build-assets.mjs` resizes them to `assets/stamps/<id>.webp` and generates the
lookup, like the plants. Frames are drawn in code.

| Achievement | Id today | Id after the ladder |
|---|---|---|
| Explorer | `first_bites` | `explorer` |
| Green machine | `veg_5` | `green_machine` |
| Fruit basket | `fruit_5` | `fruit_basket` |
| Herb garden | `herb_3` | `herb_garden` |
| Nutcracker | `nut_3` | `nutcracker` |
| Bean counter | `legume_3` | `bean_counter` |
| Grain train | `grain_3` | `grain_train` |
| Bubbly | `ferment_2` | `bubbly` |
| Superfood | `superfood_5` | `superfood` |
| Tomato family | `tomato_family` | `tomato_family` |
| Rainbow | `rainbow` | `rainbow` |
| Big dinner | `big_dinner` | `big_dinner` |
| Regular table | new | `regular_table` |
| Steady weeks | new | `steady_weeks` |
| Table talk | `streak_7` | `table_talk` |
| Family of thirty | `thirty` | `family_of_thirty` |
| Regulars | new | `regulars` |
| Full table | `full_table` | `full_table` |
| Curious | `curious` | `curious` |

1. Explorer: a compass whose needle is a carrot, or a small flag planted in a bitten apple.
2. Green machine: a toy tractor built from vegetables (broccoli wheels, pepper cab).
3. Fruit basket: a woven basket overflowing with fruit.
4. Herb garden: a terracotta pot with basil, rosemary and thyme.
5. Nutcracker: a wooden nutcracker soldier holding a walnut.
6. Bean counter: an abacus with beans for beads.
7. Grain train: a toy train with wagons of oats, rice and wheat.
8. Bubbly: a fermentation jar with rising bubbles and a cabbage leaf.
9. Superfood: a blueberry wearing a cape.
10. Tomato family: a family portrait of tomato, potato, pepper and aubergine.
11. Rainbow: an arc built from produce in eight colours.
12. Big dinner: a long table crowded with dishes.
13. Table talk: two chairs at a small table with a candle (the streak achievement; a flame alone reads as "hot").
14. Family of thirty: a large number 30 made of plants.
15. Regulars: a loyalty stamp card with a golden bite mark.
16. Full table: a family of avatars around one shared plate.
17. Curious: an open book with a plant growing out of the page.

### Secret achievements (brainstorm 2026-09-23/24, not yet decided)
A hidden layer under the ladder, for the "what is left" after the shelf is known (Ricardo's input of
2026-09-20, worked through with Claude on 2026-09-23/24; the live state sits in the parking lot of
[[strategy-backlog]], item 16). Rules agreed so far: one level only, never a ladder; hidden tiles show
a `?` on the grey locked ground and the real render once found (a faded render would give the
answer away); the shelf reveals how many are hidden, never a name; never in a push or the paid
layer; a secret rewards behaviour the family would want anyway, never a puzzle. The cheating
achievement is kept as **Nice try** (the idiom exists in all five locales), fires at 50 distinct
plants in one day, touches no data, and its body states the two-day rule that already makes a bulk
day worthless for rungs 2–4 (the PWA bulk-loggers hit 51 and 63 plants in a day and left; Big dinner
level 4 celebrates 30). Six candidates that need no backend work, Ricardo cuts to five: Nice try,
Full spectrum, At the table, Night owl, Same again, Everyone different. Technically a secret is a
definition plus copy (`achievement_unlocks.achievement_id` is unconstrained text), so no migration.

## Design rules
1. **Never resets.** Levels only go up; a streak can end but achievements and cards stay. Loss is
   absorbed by the freeze.
2. **The next goal is always visible.** Home shows the three nearest achievements by remaining
   effort ("1 more taste", "2 plants to finish", "3 dinners to 7"). Without this rail the
   collection is a museum; with it, it is a goal system.
3. **Earned at the table.** The unlock plays when the parent logs "who tasted it" so the kid sees
   it. A log entered after bedtime replays its unlocks the next time the kid's screen opens
   ("Mila earned 2 things last night").
4. **One system, two audiences.** The same events roll up into the parent's monthly recap
   ("Mila eats 41 plants now, 12 in September; 6 gold cards"). No separate parent gamification.
5. **One celebration per session.** Several unlocks from one log stack into one sheet (achievement
   press first, then the cards), never a chain of modals (POC rounds 1–3: contained motion).
6. **Scarcity by tier.** Cards are abundant, albums are the middle, achievements are rare.
7. **Per kid, never ranked.** Each kid owns a collection; household achievements are shared; no sibling
   leaderboard ([[concept-brand-pillars]], pillar 4).
8. **Achievements drive the triggers.** The card-teaser push (feature 7) names the nearest
   achievement ("Your pumpkin card is 1 taste from silver"); the Sunday advice names the nearest
   album. A trigger without a goal behind it was the PWA's daily reminder (8%).

## Why it matters to Project Food
- Retention: replaces the resetting weekly count with cumulative progress, the gap the PWA data
  exposed ([[concept-retention-loop]]).
- Monetisation: the Sunday advice becomes "how to finish the next album", a concrete reason to
  pay that is tied to the kid's collection ([[concept-stickiness-moat]]).
- Content: albums and card backs give the five-locale content pipeline a structure to fill.
- Data model (PF-38): per-member taste counters, achievement definitions, per-member progress,
  unlock events; instrument unlock → next-open interval from day one.

## Evidence & examples
- 7 of 13 hit 30 in a week; 5 left _(as of 2026-09-07, [[source-supabase-metrics-2026-09]])_.
- Retention cliffs at week 0→1 (a quarter gone) and week 4→5 (58% → 42%); three-month retention
  effectively zero _(same source)_.
- Streak rescue 46% vs daily reminder 8% logged within 3 h _(same source)_.
- Users with ≥ 1 friend ≈ 2× active weeks _(as of 2026-05-30, [[source-supabase-metrics]],
  correlational, n=13)_.
- POC (Linear PF-56, 2026-09-07 to 09-08): First bites and Curious achievements and the press-down
  celebration were accepted on device ("minimal but noticeable").
- Store POC on device (2026-09-18): all 16 first-week achievements unlocked on day one for the engaged
  accounts; the retention curve and per-member counts behind the ladder are in the tier 3 section
  above _(live Supabase `plant_logs`, n=14 members, queried 2026-09-18)_.
- Duolingo: daily quests rail, streak with freeze, achievement tiers _(public product knowledge,
  undated)_.

## Contradictions / open questions
- All evidence is from adults, n=13, one of them the founder. Test at week 4 and week 8 with five
  families (D13).
- "Brave bite" needs a "refused" state at logging time (one extra tap per kid, not a form).
- Album count and difficulty need the real plant list; 12 is a placeholder.
- XP: the POC's +10 per plant is a fourth currency next to cards, albums and achievements. Lean: drop
  XP for v1 and revisit if kids ask for a score. Not decided.
- Ricardo's inputs of 2026-09-10 (plane notes, `raw/ricardo-brainstorm-2026-09-10-plane.md`),
  to be brainstormed: a gold economy earned per person per taste and spent on avatars and
  borders, which re-opens the XP question and the "accessories are earned, not bought" rule;
  fun facts and border colours unlocking at 5 / 50 / 100 tastings of one plant (Tibia bestiary),
  a longer ladder than the 1 / 5 / 10 card levels that could carry the years after gold.
- Pack opening and rare cards (Ricardo, 2026-09-26; state in the parking lot of [[strategy-backlog]]).
  Packs are the one mechanic that adds anticipation to a deliberately deterministic system, but a pack
  may never grant a plant card without breaking what a card means. Resolved in the brainstorm: rarity
  attaches to the hard bite (a refused plant tasted, a plant new to the household) rather than to a
  dice roll, so it cannot be faked and it steers behaviour; cheating has no payoff while the reward
  has no value outside the family, which rules out trading and purchasable Sprouts; pulls pace per
  logged day, the same principle as the two-day rule above. Build order: a Sunday reveal of the week's
  already-earned cards, then foils drawn in code, then paced pulls.
- Card depth past gold (Ricardo, same day). Levels 1 / 5 / 10 extended to 25 and 50, with the target
  scaled by the plant's `category` rather than tuned per plant (his own examples put vegetables high
  and a ferment low, and category is already on every plant). Calibration: the most-eaten single plant
  in the live data is 40 and 46 over about five months, so 25 is a season and 50 is over a year. Two
  limits: a level must be a treatment of the one render that plant already has, drawn in code like the
  achievement frames, or the art bill is 224 × 5 renders; and the exposure research behind silver and
  gold (10–15 tastings) does not reach 50, so depth is collection rather than acceptance, never nudged
  and never claimed. The governing rule for any reward here, from Ricardo's own objection about the
  tenth spinach: effort maps to outcome upward, the floor is guaranteed and scales with the deed, and
  randomness may only add on top over variants of equal value.
- Where achievements live in navigation is open. Ricardo's Figma tab bar (2026-09-10) has
  Log / Family / Groceries / Account; if achievements are the backbone they need a first-class
  home (a Collection tab, or the kid's Family page).
- Secret achievements: six candidates await Ricardo's cut to five (section above, 2026-09-24).
- Store POC 2026-09-16: the 16 goals run on real history
  (`projectfood-mobile/src/features/achievements/definitions.ts`) and unlock rows live in
  `achievement_unlocks`. The ladder shipped on 2026-09-18 with the proposed targets; still open: whether the targets
  feel right after a month with families. The rung nudge shipped 2026-09-20; open: whether 90 minutes
  before dinner and one nudge per household per three days feel right, and whether the silent
  baseline should instead name the single nearest rung on day one.

## Related pages
- [[overview]] · [[concept-retention-loop]] · [[concept-brand-pillars]] ·
  [[concept-stickiness-moat]] · [[decision-2026-09-07-app-v1-scope]] ·
  [[persona-household-parent]] · [[source-family-mode-context]]
