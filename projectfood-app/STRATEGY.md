# Project Food — Strategy

> A working document for a solo, bootstrapped side project. This is not a pitch deck. It exists so I can disagree with my own future ideas, and so Claude can push back on feature requests that don't fit. Edit freely as the picture changes.

_Last updated: May 2026_

---

## Vision

A world where eating diverse, plant-forward food is the easy, social, slightly competitive thing — not a chore or a luxury wellness purchase.

## Mission (this year)

Build the daily companion app for people who want to eat more plants without becoming nutrition obsessives. Free, useful on its own, better with friends. Validate the concept, not the business model.

---

## Three pillars

These are interconnected. Scale requires retention, retention requires social hooks, and social hooks are also what justify paying. They are one strategy, not three.

### 1. Scale-dependent, but niche-deep

This is only a profitable business at scale — and "scale" here means roughly 10,000+ engaged users, not a million. That's a focused audience, not a mass-market product. The implication: go deeper for the people who care, don't broaden to chase casual interest.

### 2. Defensible value, not just useful value

People pay for outcomes they can't easily get elsewhere — not for "value." AI advice from a chatbot is hard to charge for in 2026; anyone can ask ChatGPT what to eat. Friends doing a challenge together, a household streak you'd lose, a shopping list integrated with daily life — those are outcomes free alternatives can't replicate.

The test for any premium feature: **is it defensible against a free alternative the user could already reach?** If no, it doesn't go behind the paywall.

### 3. Social by default

Self-reported plant counts are inherently soft data. What makes the product credible isn't the data — it's the **social trust contract**. Lying to a database is easy; lying to your friend on a shared streak is different. Friends keep each other honest, and they bring each other in. This isn't a retention feature bolted on top of a tracker; it's what makes the tracker work in the first place.

Corollary, applied as a design rule: **every solo feature should ask whether it can be made multiplayer.** Streaks → friend streaks. Stats → friend leaderboards. Advice → shared shopping list. Multiplayer-by-default is the principle.

---

## Target user

The broader "eat more plants" wellness audience — not the ZOE-paying gut-health niche, not the calorie-counting optimisers. People who want to eat better without turning it into a precision-nutrition project.

This is harder to reach than a sharper niche, because there's more noise and less obvious distribution. The friend-streak mechanic is what makes it tractable: the product creates its own distribution by giving users a reason to invite someone in.

---

## Year-one goal: prove the concept

The honest goal for the next 12 months is **lifestyle**: keep costs low, ride organic and word-of-mouth growth, validate that people use the app and bring friends. This is concept validation, not business validation.

**Success at month 12 looks like:**
- ~200 MAU, with reasonable week-4 retention (rough target: 30%)
- A meaningful share of users have at least one active friend connection
- Qualitative signal: users invite friends without being prompted

**If we're meaningfully below this**, the concept needs rethinking — not necessarily abandoned, but the assumption that "social plant tracking spreads via word of mouth" would be empirically weakened, and the next 12 months should look different.

This is a forcing function for honest reflection at month 12, not a kill switch.

---

## Non-goals

Things this app explicitly does not do, even if individual features within them might be tempting:

- **No calorie or macro tracking.** Different product, different audience, dilutes the plant-diversity focus.
- **No recipe library.** AI recipe *suggestions* tied to your specific gaps are fine. A browseable recipe collection is not — there are 100 apps for that, and it's not a defensible feature.
- **No precision-nutrition framing.** Direction over precision. "Eat more diverse plants" beats "you're 12g short on omega-3s."
- **No mass-market wellness branding.** The voice should feel personal and honest, not influencer-glossy.
- **No paid acquisition in year 1.** If word of mouth doesn't work, paid ads on a €3.49 product won't fix it — they'll just hide the problem.

---

## Distribution bet: word of mouth, by design

Word of mouth is the only channel I believe in for the next 6 months. That's an honest answer, not a hopeful one — but it carries a hard implication:

**Word of mouth doesn't happen by accident. Every feature must contain a reason to invite someone.**

A solo plant tracker doesn't get talked about. A friend streak does. A household challenge does. This is a stronger design constraint than it sounds. Any feature that can't answer "why would a user invite a friend into this?" is a candidate for cut or deprioritisation.

---

## Decision heuristics

When evaluating any new feature, ask:

1. **Multiplayer test.** Does this have a multiplayer version? If yes, build that one.
2. **Defensibility test.** Could the user get this from ChatGPT, MyFitnessPal, or Google in 30 seconds? If yes, it's not worth gating.
3. **Daily-open test.** Does this drive a daily open, or just a monthly one? Daily wins.
4. **Honesty test.** Does this make the soft "self-reported" data more credible — usually via social accountability — or does it just add another lonely chart?
5. **Invite test.** If a user uses this, do they have a reason to bring a friend in? If no, it's a retention feature, not a growth feature — fine, but be honest about which one.

A feature doesn't have to win on all five. But if it loses on most of them, it probably shouldn't ship this year.

---

## Pricing posture

€3.49/mo or €29/yr, with a strong free tier. Logging, weekly count, and personal streak stay free forever — these are the habit loop and they need to work for everyone. Paid tier sells *intelligence* (AI advice, shopping list, gap analysis) and *social* (friend challenges, household sharing).

Pricing isn't the lever to optimise this year. Conversion and MAU are. Pricing experiments come after the social loop is proven.

See `project-food-business-model.xlsx` for the full model.

---

## Future bets (tracked, not built)

Things worth thinking about but not building in year 1:

- **Loyalty / referral system.** Earn XP together, get rewarded for invites that stick. Strong fit with the social pillar, but premature until the core loop is proven.
- **Supermarket integrations** (Albert Heijn, Picnic, Jumbo). Shopping list → cart would be a killer NL-specific feature, but build complexity is high and the social loop matters more first.
- **Wearable integrations** (Whoop, Oura, Apple Health). Small, retention-positive audience. Worth revisiting in year 2 if quantified-self users emerge naturally.
- **Higher tier (€6.99) with integrations and household sharing.** If conversion plateaus at the €3.49 tier, this is the lever. Not before.

---

## What I'm not sure about (open questions)

Honest list of things this doc doesn't have a confident answer to. These should be revisited as evidence comes in:

- **Whether "broader wellness" is too broad.** It's harder to reach than the ZOE niche. If word of mouth doesn't compound, narrowing the audience may be the move.
- **Whether €3.49 is the right price.** Possibly underpriced for the social tier. Test later.
- **What replaces word of mouth if it doesn't work.** I don't have a backup channel I believe in. That's a risk worth naming.
- **When to consider a co-founder.** Solo is fine for year 1. Year 2 with real growth probably isn't.