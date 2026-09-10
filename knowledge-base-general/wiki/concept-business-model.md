---
title: Business model (subscription first, affiliate as upside)
type: concept
tags: [business-model, pricing, monetisation, family-mode]
created: 2026-09-10
updated: 2026-09-10
sources: [decision-2026-09-07-app-v1-scope.md, source-family-mode-context.md]
---

# Business model (subscription first, affiliate as upside)

**In one line:** A household subscription (€3.99 a month or €39.99 a year, proposed by Ricardo
on 2026-09-10) sold to the parent once the app has shown evidence about the kid, with the
weekly shopping list as the paid ritual and grocery affiliate revenue as a later, NL-only
upside. Status: brainstorm, options laid out, decision pending (strategy backlog row 9,
Linear PF-54).

## Explanation

### The goal ladder
Ricardo's framing: a side project that must first break even, then expand. Two facts shape
the ladder. Variable cost per household is close to zero (Supabase Pro covers the first
100k monthly users, push is free through Expo, one advice call per household per week costs
well under a cent), so the business is margin-rich. Growth is the constraint, not cost.

| Stage | Fixed cost per year | Paying households needed | What it proves |
|---|---|---|---|
| 0. Now (Supabase Free, EAS free) | ≈ €120 (Apple €99, Google once, domain) | 4–5 annual | Nothing yet; the app is free for the five families |
| 1. Real users (Supabase Pro, an EAS paid plan) | ≈ €750–800 | ≈ 30 | Break-even on tools |
| 2. "Worth continuing" (€1,000 net per month) | same | ≈ 360 monthly or ≈ 430 annual | The class channel replicates |

Stage 2 is where the honest arithmetic sits: at a typical 3–5% free-to-paid conversion it
needs 8,000–12,000 active households, roughly 400 classes. If instead one in five households
that are still active at week 5 pays, and half of new households reach week 5, it needs about
4,000 households, or 200 classes. The paid plan must therefore convert the *engaged* parent at
week 4–5, not the installer on day one.

### Net revenue per sale
Stores act as merchant of record: the shown price includes VAT, the store deducts VAT and its
commission (15% under the small-business programmes, S4 in
[[decision-2026-09-07-app-v1-scope]]), RevenueCat is free under $2,500 monthly tracked revenue.

| Price (NL, 21% VAT) | Net to Project Food |
|---|---|
| €3.99 / month | ≈ €2.80 / month |
| €39.99 / year | ≈ €28.10 / year (≈ €2.34 / month) |
| €34.99 / year | ≈ €24.60 / year |
| €29.99 / year | ≈ €21.10 / year |

Italy (22% VAT) is a few cents lower. Apple's EU terms from 2026-10-01 allow link-out or
alternative payment at a lower commission; the gain is a few points on the annual plan, so
revisit only at stage 2.

### Pricing
- **€3.99 a month is fine.** It sits where consumer nutrition and kids' learning apps land
  (roughly €25–60 a year, undated market knowledge).
- **€39.99 a year is ten months of monthly**, a weak annual incentive. Annual matters more here
  than in most apps: the retention cliff is at week 4–5, so a monthly subscriber can cancel at
  exactly the moment the collection starts to pay off, while an annual buyer gives the kid
  twelve months. Options: (a) standard €39.99 with an introductory first year at €29.99 for the
  founding cohorts (both stores support introductory offers and grandfathered prices), or
  (b) €34.99 standard. Lean: (a).
- **Price per household, never per child.** The plan is a family plan by nature.

### Free/paid boundary (the decision that shapes the schema)
| Option | Free | Paid "Family" plan | Assessment |
|---|---|---|---|
| A. Parent payoff paid (lean) | The whole kid loop for every child: logging, cards, albums, stamps, streak, cheers, class milestone | Sunday shopper advice + shopping list + pre-grocery reminder, monthly recap card, "over time" insights, export | Never paywalls a child's reward (pillar 4), keeps the class network free to form, converts at week 4–5 with evidence |
| B. Capacity paid | One child + the core loop | More children + the parent tools | Converts two-kid families fast but paywalls a sibling's collection; hurts the classroom network |
| C. Trial then hard paywall | 14 days | Everything | Highest revenue per install, kills class virality and the five-family learning; rejected for v1 |

Lean: **A**, with a soft cap (more than five children) that nobody hits. What is paid is what
the parent gets, which is exactly feature 11 of the v1 scope.

### Timing and sequence
1. v1 to the five families with everything unlocked, no payments (Ricardo, 2026-09-08).
2. Payments switch on when the Sunday advice exists, because that is what is sold.
3. First paid touch: the first shopping list is free ("your first list is on us"). The real ask
   arrives with the first monthly recap at week 4 ("Mila tasted 14 new plants in September"),
   annual first, monthly second.
4. Founding-cohort introductory price for the first classes; standard price after.

### Network effects, honestly
The kid's collection is single-household value; the network effects are local: one parent
brings a class of 20–25 households, cheers run between households, the class milestone is
shared. Growth is viral inside a class and jumps between classes through parents. That still
means acquisition can be near-free, which is the point, but the free tier must include
everything a parent needs to join a class and cheer, or the network never forms.

### The shopping cart and affiliate revenue
Ricardo's idea (2026-09-10): checking off plants or seeing recommendations adds items to a
cart; before the household's usual grocery time (set in the account) a reminder arrives; the
cart can be pushed to an Albert Heijn list or online basket, earning affiliate commission.

- **Build it as a retention feature first.** Groceries is the second existing ritual next to
  dinner ([[source-family-mode-context]]). A pre-grocery reminder that carries the list is a
  trigger with a goal behind it ([[concept-achievement-system]] rule 8): "two plants finish The
  Tomato Family, both in season". It belongs in the paid plan under option A.
- **Affiliate facts** _(as of 2026-09-10)_: Albert Heijn runs its partner programme on
  Partnerize and pays 2–3% of the net online basket
  ([ah.nl partner programme via Partnerize](https://www.emerce.nl/nieuws/albert-heijn-nieuw-commissiemodel-partners-ahnl),
  [rate listing](https://app.hienergy.ai/a/albert-heijn)). Bring! has no official public API;
  only unofficial libraries exist
  ([bring-api](https://github.com/miaucl/bring-api), [python-bring-api](https://pypi.org/project/python-bring-api/)),
  so a direct "add to Bring" integration is not production-safe. Generic grocery programmes pay
  5–10% or a flat €10–15 per new customer
  ([overview](https://uppromote.com/affiliate-programs/grocery/)); Italy has no obvious
  equivalent to the AH programme yet.
- **Illustration**: 1,000 households, 1% ordering online through our link each week, an €80
  basket at 2.5% → ≈ €20 a week, ≈ €90 a month, against ≈ €250 a month from subscriptions at a
  10% paid share. Upside of perhaps 20–40% on top of subscription at scale, NL only, zero
  marginal effort once built. Not the model, a bonus.
- **Design constraint**: the list is retailer-neutral through the system share sheet (any list
  app, WhatsApp, Reminders) with "Open in AH" as one option; no sponsored products inside the
  kid's collection ([[concept-brand-pillars]]).

### What the data model needs now (PF-38)
- `households.plan` (free | family) fed by a RevenueCat webhook into an Edge Function; the
  entitlement is household-level.
- Children unlimited in the schema; feature flags for advice, list, recap and insights read
  the plan.
- Store price points stay outside the schema.
- Events for the KPIs in backlog row 11: week-5-retained → paid conversion, annual share,
  refund rate, net revenue per household.

## Why it matters to Project Food
Break-even on tools is trivial (about 30 households); the real question is whether the class
channel replicates enough for stage 2. Option A protects that channel, sells the parent payoff
that the retention loop already produces, and keeps Ricardo's "no payments until the basics
work" sequence.

## Evidence & examples
- Store commission after VAT and RevenueCat threshold _(as of 2026-09-07,
  [[decision-2026-09-07-app-v1-scope]] S3/S4)_.
- Retention cliff week 4→5 (58% → 42%) _(as of 2026-09-07, [[source-supabase-metrics-2026-09]])_.
- AH partner programme 2–3% on Partnerize _(as of 2026-09-10, links above)_.

## Contradictions / open questions
- Ricardo's price moved from €29.99 (2026-09-07 assumption) to €39.99 (2026-09-10 proposal);
  resolved here as standard €39.99 with an introductory €29.99, pending his call.
- Conversion assumptions are generic; no data of our own until the first paid cohort.
- A class or teacher tier, gift subscriptions (grandparents) and web link-out are parked.

## Related pages
- [[strategy-backlog]] (row 9) · [[decision-2026-09-07-app-v1-scope]] ·
  [[concept-retention-loop]] · [[concept-achievement-system]] · [[concept-stickiness-moat]] ·
  [[concept-brand-pillars]] · [[source-family-mode-context]]
