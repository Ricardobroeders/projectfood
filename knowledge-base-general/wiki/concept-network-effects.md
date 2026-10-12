---
title: Network effects, the growth test for every feature
type: concept
tags: [growth, network-effects, social, retention, business-model]
created: 2026-10-12
updated: 2026-10-12
sources: [source-research-market-size-2026-10.md, decision-2026-10-12-social-layer-shape.md, concept-business-model.md]
---

# Network effects, the growth test for every feature

**In one line:** Project Food's costs barely grow with users, so success depends on one thing:
whether growth can feed itself. Ricardo, 2026-10-12: "it's all based on can we get a network
effect off the ground; can it grow exponentially, only then it can be successful. Keep it in
mind when building; it helps us make good decisions in the social features."

## Why it matters
- **Costs are nearly flat.** The model artifact
  (https://claude.ai/artifact/D38Kfd3LBPcDQqd3sW2Sku) shows tools at about €2,000 a year; the
  database, push and the article routine barely move with users. Only the store fee (15%) and VAT
  scale with revenue. Each extra user is almost pure margin.
- **Paid installs do not scale for us.** At about €2.50 net a month per payer and 2% to 3% of
  installs paying, a bought install has to cost cents. Growth has to come from users bringing
  users.
- **The market is big enough** ([[source-research-market-size-2026-10]]): 3.8 million Dutch adults
  want to eat healthier; a salary needs about 2,000 paying users at any time.

## Three different things, often mixed up
1. **A viral loop** (growth): a user brings in new users through invites and shares. Grows if each
   user brings more than one new user over their lifetime, counting only those who stay.
2. **A social network effect** (value): the app is worth more to you because people you know use
   it: a friend who notices your gold card, a friend streak, a cheer. This keeps people.
3. **A data network effect** (value): the app gets better with more users. Small for us: the
   "typical household" lines in stats, plant facts that improve with feedback.

Project Food is a single-player habit at its core, so 2 has to be designed in; it does not come
for free. 1 is where exponential growth lives; 2 is what makes 1 worth it. Both are worked on together.

## Both loops at once, or the bucket leaks
Every new user brought in by a loop leaves at the churn rate. With 78% of payers gone within a
year (model default, RevenueCat medians), a loop has to run much faster just to stand still.
Halving churn is worth as much as doubling invites. Ricardo, 2026-10-12: look at both. Bringing
people in and keeping them are worked on together; a feature that does both comes first.

## The test for a feature
Before a feature is built, answer two questions:
1. **Does it bring someone new in?** At a natural moment, with the install in the same tap
   (the invite link or QR of [[decision-2026-10-12-social-layer-shape]] carries it).
2. **Does it make someone stay because of another person?**

A feature that does neither is a nice-to-have and waits. A feature that does both goes first.

## Where the network is
- **The household is the smallest network.** A second adult on the account is the invite with
  the highest chance of success, and it was named a paid-worthy feature in
  [[source-research-app-benefits-2026-10]].
- **Networks are local.** Friends, a class, a school, a street: dense clusters, one at a time
  (the class WhatsApp group of [[source-family-mode-context]]; Eindhoven first). One active
  cluster is worth more than many scattered users.
- **Moments that carry an invite:** setting up the household, a gold card, a finished album, a
  friend streak, a weekly result worth showing.

## Limits we keep
- Children are never a profile, never searchable, never shown
  ([[decision-2026-10-12-social-layer-shape]]); the network is between adults.
- No public feed, no leaderboards between strangers, no name search; social is a person who
  notices, not a feed.
- No dark patterns: an invite is never a condition for a reward, and nothing punishes not
  inviting (pillar 4, [[concept-brand-pillars]]).

## What to measure from day one
Invites sent per active user, invite to install, invite to active after four weeks, and
retention of users with at least one friend against those without (in the PWA, friends went
with about double the engagement, [[concept-engagement-drivers]]). Events live in `app_events`.

## Related pages
- [[decision-2026-10-12-social-layer-shape]] · [[concept-word-of-mouth]] ·
  [[concept-stickiness-moat]] · [[concept-business-model]] · [[concept-retention-loop]] ·
  [[strategy-backlog]] (rows 4, 12, 17)
