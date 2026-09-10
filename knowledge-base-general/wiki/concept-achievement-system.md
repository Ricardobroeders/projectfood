---
title: Achievement system (cards, albums, milestones)
type: concept
tags: [retention, gamification, achievements, family-mode]
created: 2026-09-10
updated: 2026-09-10
sources: [source-supabase-metrics-2026-09.md, source-family-mode-context.md]
---

# Achievement system (cards, albums, milestones)

**In one line:** The goal layer of the family app: three tiers of things to earn (a card per
plant, an album per group of plants, a milestone stamp per behaviour) that never reset, always
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
  a first-time stamp (Curious); the POC showed this lands.
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

### Tier 3: Milestone stamps (behaviours, per kid or per household)
Rare, behavioural, capped at about 20 at launch. Every stamp maps to a behaviour we want at the
table, never to opening the app, sharing, or changing a setting. Starting set:

| Stamp | Trigger | Level | Why |
|---|---|---|---|
| First bites | 3 tastes logged | kid | Day-one win; proven in the POC |
| Curious | first card back opened | kid | Teaches that the card has two sides |
| Brave bite | tasted a plant previously marked "refused" | kid | The behaviour parents pay for: exposure becomes acceptance |
| Rainbow week | 5 colours in one week | kid | Variety without the number 30 |
| Table talk 7 / 30 / 100 | dinners logged in a row, freeze covers a miss (D7) | household | Streak rescue worked (46%); the freeze keeps pillar 4 |
| Family of 30 | 30 distinct plants in a week | household | The old goal, demoted to one stamp among many |
| Album keeper | first album completed | kid | Bridges tiers 2 and 3 |
| Season keeper | a seasonal album completed in time | kid | Time-limited reason to come back |
| Full table | every household member tasted the same plant | household | Sibling cooperation, not competition |
| Cheerleader | first cheer sent to another household | household | The one social investment that correlated with 2× engagement |

## Design rules
1. **Never resets.** Levels only go up; a streak can end but stamps and cards stay. Loss is
   absorbed by the freeze.
2. **The next goal is always visible.** Home shows the three nearest achievements by remaining
   effort ("1 more taste", "2 plants to finish", "3 dinners to 7"). Without this rail the
   collection is a museum; with it, it is a goal system.
3. **Earned at the table.** The unlock plays when the parent logs "who tasted it" so the kid sees
   it. A log entered after bedtime replays its unlocks the next time the kid's screen opens
   ("Mila earned 2 things last night").
4. **One system, two audiences.** The same events roll up into the parent's monthly recap
   ("Mila eats 41 plants now, 12 in September; 6 gold cards"). No separate parent gamification.
5. **One celebration per session.** Several unlocks from one log stack into one sheet (stamp
   press first, then the cards), never a chain of modals (POC rounds 1–3: contained motion).
6. **Scarcity by tier.** Cards are abundant, albums are the middle, stamps are rare.
7. **Per kid, never ranked.** Each kid owns a collection; household stamps are shared; no sibling
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
- POC (Linear PF-56, 2026-09-07 to 09-08): First bites and Curious stamps and the stamp-press
  celebration were accepted on device ("minimal but noticeable").
- Duolingo: daily quests rail, streak with freeze, achievement tiers _(public product knowledge,
  undated)_.

## Contradictions / open questions
- All evidence is from adults, n=13, one of them the founder. Test at week 4 and week 8 with five
  families (D13).
- "Brave bite" needs a "refused" state at logging time (one extra tap per kid, not a form).
- Album count and difficulty need the real plant list; 12 is a placeholder.
- XP: the POC's +10 per plant is a fourth currency next to cards, albums and stamps. Lean: drop
  XP for v1 and revisit if kids ask for a score. Not decided.
- Ricardo's inputs of 2026-09-10 (plane notes, `raw/ricardo-brainstorm-2026-09-10-plane.md`),
  to be brainstormed: a gold economy earned per person per taste and spent on avatars and
  borders, which re-opens the XP question and the "accessories are earned, not bought" rule;
  fun facts and border colours unlocking at 5 / 50 / 100 tastings of one plant (Tibia bestiary),
  a longer ladder than the 1 / 5 / 10 card levels that could carry the years after gold.
- Where achievements live in navigation is open. Ricardo's Figma tab bar (2026-09-10) has
  Log / Family / Groceries / Account; if achievements are the backbone they need a first-class
  home (a Collection tab, or the kid's Family page).

## Related pages
- [[overview]] · [[concept-retention-loop]] · [[concept-brand-pillars]] ·
  [[concept-stickiness-moat]] · [[decision-2026-09-07-app-v1-scope]] ·
  [[persona-household-parent]] · [[source-family-mode-context]]
