---
title: Two ways to use it: alone, or with everyone at your table
type: decision
tags: [value-proposition, personas, copy, brand, retention, family-mode]
created: 2026-10-07
updated: 2026-10-07
sources: [interview-closed-test-2026-09.md, source-supabase-metrics.md, concept-habits-four-laws.md]
status: accepted
---

# Two ways to use it: alone, or with everyone at your table

**In one line:** Project Food is for the adult who holds the phone, whether they count for
themselves or for everyone who eats with them. Copy stops assuming a parent and kids, stops
saying "dinner" for the act of logging, and says "the plants you tasted today". The dinner time
stays as the moment of the daily reminder. (Ricardo, 2026-10-07.)

## Context

The pivot of 2026-09-06 ([[decision-2026-09-06-family-mode-pivot]]) made the household parent
the primary persona and wrote every surface for a parent with kids: the app ("Tonight's dinner",
"Tap what the family tasted", "Your family"), the notifications ("What did the family taste
tonight?"), the website ("The family app where kids taste") and the privacy policy ("Made for
families, used by parents"). The closed test showed something else: almost every tester uses
the app for themselves ([[interview-closed-test-2026-09]]; the survey of 1.0.29 has "Adults
only" and "It is just for me" as answers for that reason). The solo adult of the PWA era
([[persona-believer]]) never went away; the family-first copy wrote them off. Row 3 of the
backlog had carried this as an open question since 2026-09-22.

A second confusion came with the word "dinner": the app counts any food logged on a day, at any
meal, but the copy said "log dinner", "dinners in a row", "Big dinner", "Tonight's dinner". The
streak strings were already moved to "days" on 2026-10-07 (1.0.34); this decision finishes the
job.

## Decision

1. **Two customer types, one product.** The solo adult and the household are both first-class.
   Nothing in the copy presumes children. The household is "everyone at your table"; a kid is a
   member kind, not the audience.
2. **The adult who holds the phone is always "you".** Alone, "you" is the user. With others,
   "you" is the one logging, and the people at the table are named by the app from the member
   list (the notification already says "What did Mia & Tom taste tonight?" when kids exist).
3. **Log the plants you ate today, not dinner.** Every meal counts. "Dinner" survives only as
   the time of the daily reminder ("When do you usually eat dinner?", "Dinner time" in Account),
   because that is the last meal for most people and the reminder lands after it (Ricardo:
   "that's no biggy"). Achievement names and bodies that said dinner say day.
4. **The website leads with the goal, then offers both ways.** Hero: taste 30 different plants
   a week, every taste becomes a card, alone or with everyone at the table. The children's
   science and the learn articles stay, as the second way, not the only one. The learn hub keeps
   its parent framing: the articles answer parents' searches and that is their job
   ([[seo-roadmap]]).
5. **Privacy and terms say what is true:** an app for adults; children, if added, are profiles
   on the adult's account and never sign in. The data stored does not change.
6. **The journeys may differ.** The four laws of habit read differently for a solo adult and for
   a table with kids ([[concept-habits-four-laws]]: the kid column becomes "the others at the
   table, if any"). When a feature is built, both types are taken into account, or the journey
   is deliberately split once more than one member is active on the account. That split is a
   design choice per feature, not a global mode.
7. **Store listings follow once they are safe to touch.** The Apple version is in review and
   locked; the Play listing is left alone during the closed test. Both full descriptions turn
   family-first in their second sentence and get the same treatment after the verdict and the
   production application ([[seo-app-store-aso]]). The names and subtitles are already
   goal-first and audience-neutral.

## Rationale

- The testers are the evidence: solo use is the norm in the test, and the one-thing block
  depends on those testers staying and logging.
- The brand pillars never said "family"; they say count, different, effortless, joy
  ([[concept-brand-pillars]]). The family framing was a persona choice, not a brand rule.
- "Dinner" was already wrong for the streak (any meal counts) and had confused testers into
  thinking only the evening meal counted.
- The two personas want the same loop (a trigger, a one-minute log, a reward that accumulates);
  only the reward's audience differs. One product, worded for the adult, serves both.

## Consequences

- Brand voice updated the same day ([[brand-voice]]): the listener is the adult who holds the
  phone, alone or for a household; "the family" leaves the Use table; "today, what you ate"
  replaces "tonight, dinner"; gate 3 becomes "for adults, alone or with a household, never a
  kids app".
- App strings in en, nl, it rewritten (1.0.37, over the air): auth tagline, onboarding step 2
  and 3, Log header, Home empty state, stats bodies, achievement names and bodies (Big dinner →
  Big day, Family of thirty → Thirty club, Regular table and Full spectrum count days), the
  people screen, Account rows, notification labels, the permission prompt.
- Notification copy in `send-notifications` redeployed: the daily question falls back to "What
  did you taste today?" when no kids are named; the streak keeper and the rung nudge say "you"
  instead of "the family"; units count days, not dinners.
- Website static pages rewritten in en, nl, it: home, about, contact meta, terms meta, privacy
  (intro, section 2, items), delete-account. Learn hub untouched.
- Personas: [[persona-believer]] is back as the solo adult, co-primary with
  [[persona-household-parent]]. Row 1 (value proposition) and row 3 (personas) of the backlog
  updated.
- The Figma store screenshots and the store descriptions are the next surfaces, after the
  stores unlock.

## Alternatives considered

- **Keep family-first and add a solo mode.** Two copies of every string and a mode switch
  nobody asked for. Rejected: the neutral wording serves both without a mode.
- **Rename "dinner time" to "reminder time".** Rejected by Ricardo: the dinner anchor is right,
  it is the last meal of the day for most, and the question "when do you usually eat dinner?"
  is easier to answer than "when do you want a reminder?".

## Related pages

- [[decision-2026-09-06-family-mode-pivot]] · [[persona-believer]] · [[persona-household-parent]] ·
  [[brand-voice]] · [[concept-brand-pillars]] · [[concept-habits-four-laws]] ·
  [[interview-closed-test-2026-09]] · [[seo-app-store-aso]] · [[strategy-backlog]]
