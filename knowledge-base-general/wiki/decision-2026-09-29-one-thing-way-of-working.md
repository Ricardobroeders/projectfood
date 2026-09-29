---
title: The One Thing as the way of working
type: decision
tags: [decision, way-of-working, focus, backlog]
created: 2026-09-29
updated: 2026-09-29
date: 2026-09-29
status: accepted
sources: []
---

# The One Thing as the way of working

**Date:** 2026-09-29  **Status:** accepted (Ricardo)

## Context
Ricardo asked on 2026-09-29 to run the project the way Gary Keller and Jay Papasan describe in
*The One Thing* (2013): a person or a company always knows its top 1, 2, 3, works on those first,
and lets the rest come after. His own words: "I have a tendency to deviate from the plan and start
many other things." The day's example made the point: the Play closed test stood at 6 of the 12
opt-ins that start the fourteen-day clock, and everything after (production access, the first
release, marketing) waits on that clock, while the list held twenty numbered items.

The book's tools that matter here: the **focusing question** ("what is the one thing I can do
such that by doing it everything else becomes easier or unnecessary?"), the **domino run** (line
the work up so the lead domino knocks over the rest; success is sequential, not simultaneous),
**goal setting to the now** (someday → year → month → week → today, each rung derived from the
one above), and **time blocking** (protect the hours for the one thing before anything else gets
a slot).

## Decision
1. **"Next to pick up" in [[strategy-backlog]] opens with a block called "The one thing".** At
   most three lines. Each names the lead domino, what it unlocks, and who moves it. It is
   re-asked with the focusing question every session, dated, and renumbered as soon as line 1
   falls. Everything below the block waits unless it is on the way to one of the three.
2. **Claude opens every "what's next" answer with the block**, then the rest of the list. The
   root `CLAUDE.md` protocol says so.
3. **When Ricardo drops an idea or starts other work mid-session, Claude parks the idea in the
   parking lot and says in one sentence whether it beats line 1.** Then it does what Ricardo
   decides. One sentence, never a lecture; the decision stays his.
4. **The ladder.** Today's line is derived from the week, the week from the month. On
   2026-09-29: this month, both stores live (Play production after the fourteen days and Google's
   two reviews; iOS approved and released); this week, twelve testers in and Apple's
   questionnaire answered; today, chase the testers. The rungs above "this month" (this year,
   someday) are Ricardo's to state; until then the list runs at month, week and today.

## Rationale
- A twenty-item list with three parts is complete but not directive; it tells a reader what
  exists, not what to do at 09:00. The block answers that in three lines.
- The lead domino is usually a clock nobody else can start (a tester count, a review queue, a
  DNS change). Naming it makes the cost of a detour visible: a day spent elsewhere while the
  clock is stopped is a day added to launch.
- Ricardo asked for the discipline himself, so the one-sentence check is a service, not a
  correction. Keeping it to one sentence keeps it that way.

## Alternatives considered
- Priority tags on every item (P1/P2/P3): after a week everything is P1 again; the block forces
  a choice of three.
- A weekly plan: Ricardo deviates daily, so the check has to be per session, not per week.
- No change, the three-part list alone: that is the state that produced twenty items and a
  stalled clock.

## Consequences
- [[strategy-backlog]] "Next to pick up" gets the block; the KB schema (rule 5 under "Strategy
  backlog") and the root `CLAUDE.md` protocol describe it; a feedback memory tells Claude to
  apply it in every session.
- Watch: if the block grows past three lines or stops changing for a week, it has become a list
  again. Then re-ask the focusing question rather than add a fourth line.
- Time blocking is Ricardo's side: the first working block of the day goes to line 1.

## Related pages
- [[strategy-backlog]]
- [[decision-2026-09-16-store-poc-scope]]
- [[overview]]
