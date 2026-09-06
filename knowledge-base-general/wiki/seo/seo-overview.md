---
title: SEO strategy — overview (family mode)
type: seo
tags: [seo, growth, marketing, strategy, family-mode]
created: 2026-09-06
updated: 2026-09-06
sources: [source-family-mode-context.md, seo-serp-landscape.md, seo-technical-audit.md]
---

# SEO strategy — overview (family mode)

**In one line:** SEO is **not** the launch channel. The launch channel is the school class
([[source-family-mode-context]] §6). Search work has two jobs now: (1) make the marketing site
and the App Store listing convert the parent who clicks a link in a class WhatsApp group, and
(2) build a 12-month compounding asset around **parent search intent** ("kind lust geen
groente" and its Italian and English equivalents), in a non-medical voice, at low weekly
effort until the class channel is proven.

> **Rewritten 2026-09-06** after the family-mode direction landed. The first version of this
> folder (same day, earlier) targeted adult gut-health searchers and treated SEO as the main
> organic channel. That is superseded. What survives from it is kept explicitly below.
>
> **Pages in this folder:**
> - [[seo-keyword-strategy]] — parent-intent clusters in NL/IT/EN, priorities, tracking list
> - [[seo-serp-landscape]] — who ranks for parent queries, the picky-eater app field, partners
> - [[seo-content-types]] — formats mapped to the family loop (dinner, groceries, class)
> - [[seo-app-store-aso]] — App Store / Play listing strategy, the new front door
> - [[seo-technical-audit]] — site state, plus the app-link and no-health-claims fixes
> - [[seo-roadmap]] — small, timed to the November class pilot and EU-Schoolfruit

## What the pivot changes for search
| Before (adult gut-health tracker) | Now (family app) |
|---|---|
| Searcher = adult curious about "30 plants" | Searcher = **parent** with a dinner problem ("my kid won't eat vegetables") |
| Discovery = Google → PWA landing → "add to home screen" | Discovery = **WhatsApp link → App Store page → install**. Google is secondary |
| Voice = light science, gut diversity | Voice = **behaviour, not medicine**: tasting, exposures, joy. No health claims (YMYL) |
| Competitors = 30-plants trackers, ZOE | Competitors = **picky-eater apps** (Yummi, EatPal, Food Explorer Club, Teach Your Monster) + parenting publishers. ZOE cannot follow |
| Seasonal pages as a content pillar | **Dropped** as a brand theme (D12): seasonal/eco is texture inside advice only |
| SEO = main organic channel | SEO = **background asset**; class channel = launch; ASO = front door |

## What survives from the first version
- The technical base (sitemap, hreflang, JSON-LD, learn hub) and the gap list in
  [[seo-technical-audit]].
- The **"what counts as a plant"** cluster and the adult 30-plants landscape: still the most
  searched question in the niche and still ours to answer, but now **P2**, not the bet. Parents
  ask it too ("does ketchup count?").
- The rule that every page ends in the app. Now: ends in the App Store.
- The plant-database idea, reframed: plant **cards** (D8), not plant encyclopaedia pages.

## Where we stand _(as of 2026-09-06)_
| Area | State |
|---|---|
| Product | PWA live; native iOS/Android via Expo decided, not built. Family data model not built |
| Marketing site | Next.js stays (D2). Hero copy still says "Science shows eating 30 different plants a week boosts gut diversity" — a health claim, must go |
| Learn hub | 2 adult gut-science articles (thin). Planned "gut-brain / mood" cluster is now a health-claim risk |
| App Store | No listing yet. This becomes the primary conversion surface |
| Audience | 15 users, NL-heavy. Five families (sister first) are the next cohort; one school class in November |
| Data | Behavioural numbers still to be pulled (file §7). Parent-search volumes still to be pulled via DataForSEO (file §6, §8) |

## Principles (how search fits family mode)
1. **Behaviour, not medicine.** Write about tasting, exposures, dinner rituals, "learning to eat
   everything". Never about gut health outcomes for children. This is both the brand rule (no
   health claims) and the SEO rule (avoids medical YMYL scrutiny for a new domain).
2. **The App Store page is the landing page.** Most parents arrive from a WhatsApp link. The
   website's job is to make that click land well (badges, 20-second explanation, screenshots of
   a kid unlocking a card) and to catch the parent who Googles "project food app" afterwards.
3. **Parent voice, kid-visible reward.** Content speaks to the parent; the artefacts (cards,
   charts, class posters) are made to be shown to the kid. Same split as the habit loop.
4. **Joy, not guilt, in copy too.** No "picky eater" shaming, no "fix your child". Pillar 4
   applies to headlines. Use the parent's own words for search ("kind lust geen groente") but
   answer without judgement.
5. **NL first, IT second, EN last.** NL is where the users, the sister's family and the first
   class are. IT follows (founder context, mensa culture). EN is crowded and served last.
6. **Small and timed.** Until a second class replicates without founder seeding, SEO gets a
   fixed, small budget (≈ half a day a week) and is sequenced to real moments: the November
   class pilot and the EU-Schoolfruit weeks (NL deliveries 9 Nov 2026 – 16 Apr 2027).
7. **No child data on public pages.** Public profiles, class pages, share cards: households and
   classes, never named children. Non-negotiable given GDPR-K.

## The bet, in three lines
- Own the **"my kid won't eat vegetables → make tasting a game"** answer in Dutch, then Italian,
  with content that is honest about the science (10–15 tastes, rewards for tasting not clean
  plates) and never medical.
- Make **printable plant cards and a class challenge kit** the link magnets: the things a parent
  or teacher actually forwards.
- Get the **App Store listing** right in three languages before anyone links to it, because the
  listing, not the website, is where the class channel converts.

## Risks & open questions
- **Volumes unvalidated.** The context file itself says: pull parent-cluster volumes via
  DataForSEO before investing in content. Authorise the connector; this is Phase 0.
- **Family mode is unvalidated.** Five parent conversations and week-4 dinner data decide what
  gets built. SEO should not run ahead of that: nothing here assumes features that do not exist
  beyond what the decisions table commits to.
- **Two audiences on one site.** The adult 30-plants content stays live and useful. Keep it,
  date it, do not grow it, and keep the home page unambiguous: family first.
- **Kids-app perception.** Content and listing must read as a *family* app (parent's phone,
  parent's account), never a kids' app, to stay out of Apple's Kids Category and COPPA/GDPR-K
  territory (file §3.3).
- **Health-claim leftovers.** Hero copy, manifest description ("Good gut, good life" is a brand
  line, fine; "boosts gut diversity" is a claim, not fine) and the planned gut-brain article need
  a pass. See [[seo-technical-audit]].

## Related pages
- [[source-family-mode-context]] · [[decision-2026-09-06-family-mode-pivot]] ·
  [[persona-household-parent]] · [[concept-word-of-mouth]] · [[concept-brand-pillars]] ·
  [[overview]]
