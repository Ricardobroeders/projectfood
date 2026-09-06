---
title: SEO strategy — overview
type: seo
tags: [seo, growth, marketing, strategy]
created: 2026-09-06
updated: 2026-09-06
sources: [seo-serp-landscape.md, seo-technical-audit.md, source-competitor-scan.md]
---

# SEO strategy — overview

**In one line:** Organic search (Google *and* AI search) is the one compounding acquisition
channel that fits the strategy's "no paid acquisition, word of mouth by design" posture. It
takes 6–12 months to pay off, which is exactly why the foundations get built now.

> **Start here.** This folder (`wiki/seo/`) holds the research and the plan:
> - [[seo-keyword-strategy]] — what people search in EN/NL/IT, and which terms we go after
> - [[seo-serp-landscape]] — who ranks today, what competitors publish, where the gaps are
> - [[seo-content-types]] — the content formats we can build, mapped to keywords and funnel
> - [[seo-technical-audit]] — what the site already does right, and what is missing
> - [[seo-roadmap]] — phased plan, effort estimates, KPIs

## Why SEO, and why now
- `STRATEGY.md` rules out paid acquisition in year 1 and bets on word of mouth. SEO is the
  only other channel that compounds without a budget. It costs time and content, not money.
- The category has real, growing demand in all three of our languages ("30 plants a week",
  "30 planten per week", "30 vegetali a settimana"), pushed by [[entity-zoe]] /
  [[entity-tim-spector]], the fibre trend (2026 trend reports moved from "fibermaxxing" to
  "fibre *diversity*"), and Dutch institutions (the MDL Fonds *30 Planten Challenge*).
  Details in [[seo-serp-landscape]].
- We are a **web app on our own domain**. Every competitor that lives only in the App Store
  ([[entity-eating30]], Plant Points, Clove, 30Veg) cannot rank a content page. That is a
  structural advantage, if we use it.
- We are also the only one of them that runs on **Android** (PWA). "30 plants app android" is
  a query the iOS-only field structurally cannot answer.
- Lead time: the domain is new (April 2026) with essentially zero authority. Realistic
  expectation: measurable traffic in 3–6 months, meaningful traffic in 9–12.

## Where we stand _(as of 2026-09-06)_
| Area | State |
|---|---|
| Domain | `projectfood.dev`: new (Apr 2026), no known backlinks, generic brand name |
| Marketing pages | Home, About, Contact, Terms, Privacy × EN/NL/IT. `/recipes` is a "coming soon" placeholder |
| Learn hub | 1 pillar + 1 cluster, published 2026-05-19, all 3 locales. Bodies ~300 words EN, ~200 words NL/IT. FAQ blocks only in EN |
| Technical | Sitemap, robots, hreflang and JSON-LD (WebSite, Organization, Article, FAQPage, Breadcrumb) already live. Missing: OG image, app schema, author/E-E-A-T signals, Search Console (unverified). See [[seo-technical-audit]] |
| Data assets | 224 active plants with EN/NL/IT names, search aliases, botanical family, category, colour, season months (39 seasonal), images. A programmatic-SEO asset nobody else in the niche exposes on the open web |
| Audience | 15 registered users (NL 8, EN 6, IT 1). NL-heavy, which is also where the SEO gap is biggest |
| Tooling | Vercel Analytics only. No keyword-volume data yet: the DataForSEO connector is not authorised |

## Principles: how SEO fits the brand
1. **The website teaches; the app counts.** Pillar 1 ("count, don't preach",
   [[concept-brand-pillars]]) is an *in-app* rule. The marketing site is where curiosity gets
   answered, and `/learn` already does this. Keep the boundary explicit: no lecturing inside the
   app; all science, lists and explainers live on projectfood.dev.
2. **Answer, don't argue.** Most demand is question-shaped ("does coffee count?", "wat telt
   mee?"). Short, honest answers with a clear scoring rule win featured snippets *and* AI-search
   citations.
3. **NL and IT first, EN long-tail.** EN head terms belong to ZOE, Boots, Waitrose and
   publisher-tier domains. NL and IT results are thin, and most of our users are Dutch. Rank
   where we can win; take EN long-tail as it comes.
4. **Every page ends in the app.** A content page that does not hand the reader a reason to open
   the app ("log it", "see what you are missing this week") is a blog post, not acquisition.
5. **Honest comparisons.** Comparison pages name competitors and their real strengths
   (Eating30's 500 plants and barcode scanning). Credibility is the moat; Google's review
   guidelines punish fake comparisons anyway.
6. **No content that violates a non-goal.** No recipe library for SEO (`STRATEGY.md`
   non-goal). No precision-nutrition claims. No diet-culture language.

## The bet, in three lines
- Own **"what counts as a plant"** in three languages: the most useful, most searched and most
  AI-cited question in the niche.
- Turn the plant database into **the reference for plant diversity** (plant pages, seasonal
  pages, checklists): content only a web app with a database can generate.
- Be the **only social 30-plants tracker on the open web**, and make sure every "best app"
  list and AI answer knows it.

## Risks & open questions
- **Search volumes are unvalidated.** Every demand tier in [[seo-keyword-strategy]] is inferred
  from SERP composition and publisher behaviour, not from volume data. Authorise the DataForSEO
  connector (claude.ai → connector settings) and run the validation step in [[seo-roadmap]]
  Phase 0 before committing writing hours.
- **Brand name is generic.** "Project Food" collides with unrelated projects, so branded search
  stays noisy. Not a reason to rename; a reason to make "Project Food 30 plants" the phrase
  people repeat.
- **Programmatic pages can turn into thin or doorway content.** Quality gates are defined in
  [[seo-content-types]]. Do not index a plant page until it clears them.
- **A social competitor now exists.** Clove (iOS) ships a community feed, XP and shared
  milestones, the first direct rival with social features. `STRATEGY.md`'s question "what if a
  competitor bolts on social?" is no longer hypothetical. See [[seo-serp-landscape]].
- **The recipes page.** A live "coming soon" page sits in the nav as thin content. Decide:
  build it (against the non-goal) or remove/noindex it. Recommendation in
  [[seo-technical-audit]].

## Related pages
- [[overview]] · [[compare-projectfood-vs-competitors]] · [[concept-word-of-mouth]] ·
  [[concept-brand-pillars]] · [[persona-believer]] · [[concept-30-plants-origin]]
