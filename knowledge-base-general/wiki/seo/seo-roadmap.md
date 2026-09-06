---
title: SEO — roadmap & KPIs
type: seo
tags: [seo, plan, roadmap]
created: 2026-09-06
updated: 2026-09-06
sources: [seo-keyword-strategy.md, seo-content-types.md, seo-technical-audit.md]
---

# SEO — roadmap & KPIs

**In one line:** Five phases over ~12 months. Phase 0 is a week of setup and validation; Phases
1–2 are the "what counts" and app-intent pages that can rank within months; Phases 3–4 are the
compounding programmatic and off-site work. Effort: S = hours, M = a day or two, L = a week+.

> **Operating model:** Claude writes and ships; Ricardo decides, reviews copy, tests locally,
> and does the outreach that needs a human. Track work in Linear with the `content` label (the
> `content-creation:create-learn-issues` skill already creates the six Cluster-1 issues).

## Phase 0: setup & validation (week 1–2)
| Task | Owner | Effort | Done when |
|---|---|---|---|
| Authorise the DataForSEO connector; pull volumes/difficulty for the 30-term shortlist in [[seo-keyword-strategy]]; update the demand tiers in that page | Ricardo → Claude | S | Tables carry real numbers _(dated)_ |
| Verify Google Search Console + Bing Webmaster; submit sitemap; enable IndexNow | Ricardo (verification) → Claude | S | Both consoles show `projectfood.dev` indexed |
| Technical fixes #1–#4, #7, #8, #10, #11 from [[seo-technical-audit]] (OG image, app schema, recipes noindex, titles, IT phrasing, llms.txt, sitemap dates) | Claude | M | Deployed; validated with Rich Results Test |
| Decide the three open decisions in [[seo-technical-audit]] (recipes, public profiles, plant-page gates) | Ricardo | S | Logged as `decision-` pages in the wiki |
| Baseline: record current indexed pages, impressions, clicks per locale | Claude | S | Numbers in this page under "Baseline" |

## Phase 1: foundation content (month 1–2)
| Task | Owner | Effort | Notes |
|---|---|---|---|
| Expand the 2 existing learn articles to 1,200+ words and add NL/IT FAQs | Claude | M | Fixes gap #5 |
| Write the remaining 5 Cluster-1 articles (gut microbiome, science origin, gut-brain, how to hit 30, herbs & spices) in EN, then NL, then IT | Claude, Ricardo reviews | L | Run `create-learn-issues` first |
| "What counts" hub + first 15 rulings (coffee, tea, chocolate, olive oil, spices, potatoes, bread, hummus, beans, nuts, popcorn, juice, frozen, colours, mushrooms) × 3 locales | Claude | L | Highest-priority pages in the whole plan |
| NL/IT home-page sections answering "app / gratis / Android" + `/android` install page | Claude | S | Gap #7 |
| Author/E-E-A-T: Person schema, article bylines, about-page anchor | Claude | S | Gap #6 |

## Phase 2: conversion pages (month 2–4)
| Task | Owner | Effort | Notes |
|---|---|---|---|
| Honest app comparison page (test each app first) | Ricardo tests, Claude writes | M | Refresh quarterly; disclose authorship |
| Checklist page + free PDF × 3 locales | Claude | M | Link magnet for dietitians/bloggers |
| `/challenge` landing ("with friends") × 3 locales; NL timed for MDL Fonds season | Claude | M | Our wedge |
| Remaining 15 rulings; interlink all rulings ↔ plant pages ↔ pillar | Claude | M | |
| Submit to nobigapps, AlternativeTo; prepare Product Hunt launch | Ricardo | S | First backlinks |
| Reddit / HealthUnlocked / Mumsnet: answer existing "which app" threads honestly | Ricardo | S, ongoing | No spam; link when asked |

## Phase 3: programmatic & seasonal (month 4–8)
| Task | Owner | Effort | Notes |
|---|---|---|---|
| Fill `season_months` for all fruit + vegetable plants (NL climate as reference, note IT differences) | Claude, Ricardo checks | M | Data prerequisite |
| Plant reference page template + generation for the 39 seasonal + ~30 edge-case plants, behind the quality gates | Claude | L | Index in batches; watch Search Console coverage |
| Seasonal month pages × 3 locales, monthly refresh + in-app "in season now" | Claude | M | Ties to [[concept-stickiness-moat]] |
| Second pillar: "Fibre diversity, not fibre quantity" + 3 clusters | Claude | L | Rides the 2026 trend |
| Roll out remaining plant pages as they clear the gates | Claude | ongoing | |

## Phase 4: authority & AI search (month 6–12, ongoing)
| Task | Owner | Effort | Notes |
|---|---|---|---|
| MDL Fonds outreach: propose Project Food as the 2027 challenge companion (free, NL, social) | Ricardo | M | Biggest single NL link/partner |
| Dietitian & newsletter outreach with the checklist PDF and rulings hub | Ricardo | S, ongoing | |
| Monitor AI-search presence: ask ChatGPT/Perplexity/Gemini "best app to track 30 plants a week (Android / Nederlands / italiano)" monthly; log whether we are cited and from where | Claude | S monthly | GEO metric |
| Public profile / share-card OG images if profiles go public | Claude | M | Word-of-mouth amplifier |
| Quarterly content refresh: comparison page, seasonal data, rulings for new foods people ask about | Claude | S quarterly | |

## KPIs
| KPI | Baseline (2026-09) | 3 months | 6 months | 12 months |
|---|---|---|---|---|
| Indexed pages (all locales) | ~24 (5 pages × 3 + 3 hubs + 6 articles) | 80 | 200 | 400+ |
| Search Console impressions / month | unknown (set in Phase 0) | 5k | 25k | 100k |
| Search Console clicks / month | unknown | 200 | 1,500 | 6,000 |
| Shortlist terms in top 10 (of 30) | 0 | 5 (mostly NL/IT) | 12 | 20 |
| Organic signups / month (via `signup_source`) | 0 | 10 | 50 | 200 |
| AI-search citations (monthly probe, 3 languages × 3 assistants) | 0 of 9 | 2 | 5 | 7 |

These targets are deliberately modest for a zero-authority domain and are meant to be revised
after Phase 0 volumes come in. The year-one strategy goal (~200 MAU) does not depend on SEO;
SEO is the channel that makes year two possible.

## Baseline
_To be filled in Phase 0: indexed pages, impressions, clicks, per locale._

## Review cadence
- Monthly: Search Console numbers into this page, rank shortlist, AI-search probe.
- Quarterly: refresh comparison page, revisit demand tiers, lint this folder.

## Related pages
- [[seo-overview]] · [[seo-keyword-strategy]] · [[seo-content-types]] ·
  [[seo-technical-audit]] · [[seo-serp-landscape]] · [[research-survey-plan]]
