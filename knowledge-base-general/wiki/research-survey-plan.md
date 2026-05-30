---
title: User survey plan (target ~2026-06)
type: plan
tags: [user-research, survey, pricing, ux]
created: 2026-05-30
updated: 2026-05-30
sources: []
status: draft
target_send: 2026-06-30
---

# User survey plan (target ~2026-06)

**Purpose:** a single survey to the early user base (~13 now, more by send time) to validate UX,
the strategy's open questions, pricing, and the business-model features — and to learn why people
do or don't use the app. Responses will be **joined to each respondent's logging behaviour** for
segmented analysis.

**Status:** draft question bank. Finalise just before sending (~end June 2026). See decisions to
make at the bottom.

## Method
- **Audience:** all registered users at send time (current testers + any new signups).
- **Linking to behaviour:** respondents give their **name**; Ricardo knows the user base and maps
  each name to the right account, then joins to `plant_logs` via `user_id` (linking source:
  [[source-supabase-metrics]]). Results are reported anonymously — only Ricardo sees the
  name↔account mapping. State this in the intro and get consent ("we'll match your answers to your
  in-app activity to improve the product"). **No names/PII go into this wiki** — only
  aggregate/segmented results.
- **Segments to cut results by** (from log data): hit-30 vs never; has friends vs solo
  ([[concept-engagement-drivers]]); active vs lapsed (WAU/MAU gap, [[concept-engagement-snapshot]]);
  heavy vs light loggers; locale (NL/EN/IT).
- **Keep it short** — early cohort is tiny; aim ~5–8 min. Use mostly closed questions for
  segmentation, a few open-text for the "why."

## Objectives → covered by section
1. UX friendliness → §C
2. Strategy open questions → §D (pulls from `STRATEGY.md` open questions)
3. Price sweet spot (too much / too little) → §F (Van Westendorp)
4. Business-model features → §E
5. Why they use / don't use it → §B
6. Connect to log behaviour → Method + Analysis

---

## Question bank (draft)

### A. Identity & consent (for linking to logs)
1. Your name: ______ *(so we can match your answers to your activity; results stay anonymous —
   only Ricardo sees the link)*.
2. Consent checkbox: "OK to match my responses to my in-app activity."

### B. Why use / why not
*Skip "why did you start?" — this cohort was personally invited, so that answer is biased
("Ricardo asked me"). Focus on what's kept them, not what got them in.*

3. What keeps you coming back — or what made you stop? *(open)*
4. If Project Food disappeared tomorrow:
   a. How would you feel? *(Very disappointed / Somewhat / Not disappointed)* — Sean Ellis PMF
      question; "very disappointed" ≥40% is the benchmark.
   b. What would you miss most, and what would get harder in your week? *(open)* — probes the
      stickiness/moat thesis directly ([[concept-stickiness-moat]]: "without us, Sunday gets
      harder"). Tells us which specific value to double down on.
5. In a typical week, what stops you from logging more? *(multi-select: forget / too fiddly /
   plant not in list / don't see the point / nothing)* — ties to the effortless-logging gap.

### C. UX friendliness
*5-point ease scale (Very hard → Very easy) for each:*
7. Logging a plant you just ate.
8. Finding a specific plant in search. *(probes the ~150-plant catalog limit)*
9. Understanding what counts toward your 30.
10. Seeing your weekly progress / where you stand.
11. Using the social/leaderboard part.
12. Overall, how easy is Project Food to use? *(or run the full 10-item SUS if we want a
    benchmarkable score — decide at finalisation.)*
13. Anything confusing or annoying? *(open)*

### D. Strategy open questions
*Test the bets in `STRATEGY.md` and the [[compare-projectfood-vs-competitors]] thesis.*
14. Do you use Project Food with friends? *(Yes, actively / Have friends added but don't engage /
    No)* — validates the social moat ([[concept-engagement-drivers]]).
15. How much do friends/leaderboard motivate you? *(1–5)*.
16. Have you invited (or wanted to invite) someone? *(Invited & they joined / Invited, didn't
    join / Wanted to / No)* — the word-of-mouth bet.
17. Which best describes you? *(Want to eat better without obsessing / Into precision nutrition /
    Already very healthy, just tracking / Curious, not committed)* — tests "broader wellness vs
    ZOE niche" question.
18. Do you use any other food/health apps? Which? *(open / list incl. ZOE, MyFitnessPal,
    Eating30)* — competitive overlap.

### E. Features & business model
19. How valuable would each be? *(Not / Nice-to-have / Would pay for)* —
    AI weekly advice; smart shopping list that fills your gaps; gap analysis (what you're missing);
    friend challenges; household/shared streak; supermarket integration (AH/Picnic/Jumbo);
    wearable/Apple Health sync; recipe suggestions for your picks.
20. If you'd pay for one thing only, which? *(single-select from above)*.
21. Free vs paid: which of today's features would you expect to stay free? *(multi-select)* —
    sanity-check the free/paid line in `STRATEGY.md`.

### F. Pricing (Van Westendorp — the sweet-spot method)
*Frame: "Project Food Plus (AI advice + shopping list + friend challenges), per month."*
22. At what monthly price would it be **so expensive** you wouldn't consider it? *(too expensive)*
23. At what price would it be **expensive, but you'd still consider** it? *(getting pricey)*
24. At what price would it be **a good deal / good value**? *(good value)*
25. At what price would it be **so cheap you'd doubt the quality**? *(too cheap)*
   → Intersections give the acceptable range and the optimal price point; compare against the
   current €3.49/mo plan.
26. Direct reaction: €3.49/mo or €29/yr — *(Too high / About right / Too low / Wouldn't pay at any
    price)*.

### G. Wrap-up
27. NPS: how likely to recommend Project Food? *(0–10)*.
28. One thing we should build or fix next? *(open)*.

---

## Analysis plan
- Join responses to `plant_logs` on `user_id`; report everything **by segment** (hit-30 vs not,
  social vs solo, active vs lapsed, locale).
- Cross-checks worth doing: do "very disappointed" (Q5) users skew social/hit-30? Do lapsed users
  cite logging friction (Q6)? Does willingness-to-pay (Q19/F) correlate with engagement depth?
- Van Westendorp → acceptable price range + optimal point; compare to €3.49.
- Feed findings back into [[persona-believer]] (finally validate/split it), `STRATEGY.md` open
  questions, and a new metrics/insights page.

## Decisions to make before sending (~end June 2026)
- Tool (Tally / Typeform / Google Forms — needs to capture the linking email).
- Anonymous vs identified (identified is needed for the log join; offer anonymity as fallback).
- Length: short UX block vs full 10-item SUS.
- Incentive? (early cohort may respond without one.)
- Localise into NL/IT, or English-only for now.

## Related pages
- [[overview]] · [[compare-projectfood-vs-competitors]] · [[concept-engagement-drivers]] ·
  [[concept-engagement-snapshot]] · [[persona-believer]] · [[source-supabase-metrics]]
