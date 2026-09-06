---
title: SEO — roadmap & KPIs (family mode)
type: seo
tags: [seo, plan, roadmap, family-mode]
created: 2026-09-06
updated: 2026-09-06
sources: [source-family-mode-context.md, seo-keyword-strategy.md, seo-content-types.md, seo-technical-audit.md, seo-app-store-aso.md]
---

# SEO — roadmap & KPIs (family mode)

**In one line:** Small and sequenced to real moments. Phase 0 clears health claims and pulls
volumes; Phase 1 ships only what the November class pilot and the EU-Schoolfruit weeks need;
content grows in Phase 2 only if the dinner habit holds past week 4 and a class replicates.
Budget: about half a day a week until then. Effort: S = hours, M = a day or two, L = a week+.

> **Operating model:** Claude writes and ships on `main`; Ricardo decides, reviews the copy that
> speaks to parents, tests, and does the human outreach (sister, party parents, the class,
> Tommy Tomato / Spoony). Track in Linear with the `content` label.

## Gates (from the validation plan, file §7 and §6)
- **G1 — Dinner habit holds** for the five families past week 4 (dinners logged per household
  per week). Unlocks Phase 2 content investment.
- **G2 — One class runs** in November and produces the playbook. Unlocks the schoolfruit and
  class content at scale.
- **G3 — A second class replicates** without founder seeding. Unlocks IT/EN expansion and
  programmatic plant cards.

## Phase 0 — clean-up & validation (Sep – Oct 2026)
| Task | Owner | Effort | Done when |
|---|---|---|---|
| Rewrite hero, meta, manifest to the family promise; remove health claims (#1, #9) | Claude, Ricardo approves wording | S | Deployed, no "boosts gut diversity" anywhere |
| OG image per locale + `summary_large_image` (#2) | Claude | S | WhatsApp unfurl shows the card |
| Search Console + Bing + IndexNow (#3) | Ricardo verifies, Claude submits | S | Indexed pages baseline recorded below |
| Authorise DataForSEO; pull volumes for the 30-term shortlist; rewrite tiers in [[seo-keyword-strategy]] | Ricardo → Claude | S | Tables carry dated numbers |
| Remove `/recipes`, disallow `/u/`, freeze adult learn hub with a dated note (#5, #6, #10) | Claude | S | |
| Privacy page for parents (#14), `llms.txt` (#11) | Claude | S | |
| Pull behavioural numbers from Supabase (file §7) to a `source-` page | Claude | S | Feeds G1 |

## Phase 1 — the November pilot needs these (Oct – Dec 2026)
| Task | Owner | Effort | Notes |
|---|---|---|---|
| Parent landing page (NL first, then IT/EN) with "coming to the App Store" until native ships | Claude | M | Format 1 |
| `/klas` class challenge page + printable poster + WhatsApp template + milestone share card | Claude, Ricardo tests with the class parent | M | Format 2; live before the class starts |
| Printable plant cards (40) + proefkaart + groentebingo PDFs, NL | Claude (uses existing renders) | M | Format 3; the link magnet |
| "EU-Schoolfruit: thuis meedoen" companion page, NL | Claude | S | Format 5; deliveries start 9 Nov |
| NL cornerstone: "Kind lust geen groente? Zo leert een kind alles eten" + 2 method articles | Claude, Ricardo reviews tone | L | Format 4; only after DataForSEO confirms demand |
| App Store / Play listing drafts in 3 locales, screenshots plan | Claude drafts, Ricardo submits | M | [[seo-app-store-aso]]; ready before TestFlight |
| Universal Links / App Links handler for `/klas/<code>` | Claude (Expo + Next) | M | Class plumbing |

## Phase 2 — after G1 and G2 (Jan – Apr 2027)
| Task | Owner | Effort | Notes |
|---|---|---|---|
| Remaining NL method articles (rewards, neophobia, the dinner question, schoolfruit at home) | Claude | M each | |
| IT cornerstone + neofobia method article + IT printables | Claude | L | "Frutta e verdura nelle scuole" companion |
| Honest app comparison (test Teach Your Monster, Yummi, EatPal first) | Ricardo tests, Claude writes | M | Format 6 |
| Family 30 + "what counts" hub, 3 locales | Claude | M | Format 8, legacy asset |
| Directory listings (nobigapps, AlternativeTo), Product Hunt at native launch | Ricardo | S | |
| Outreach: Tommy Tomato, Spoony, Gezonde School newsletters, parent communities | Ricardo | S ongoing | |

## Phase 3 — after G3 (May – Aug 2027)
| Task | Owner | Effort | Notes |
|---|---|---|---|
| Plant card pages, gated, 40 first | Claude | L | Format 7 |
| EN cornerstone + comparison localisation | Claude | L | |
| Aggregate-data content ("what 1,000 Dutch kids tasted this year"), privacy-gated | Claude | M | The proprietary-data moat, made visible |
| Second school year prep: schoolfruit pages refreshed for 2027/28, class kit v2 | Claude | S | |

## KPIs (revised targets after Phase 0 volumes)
| KPI | Baseline 2026-09 | Dec 2026 | Apr 2027 | Sep 2027 |
|---|---|---|---|---|
| Direct-link → install conversion (class links) | n/a | measured | ≥ 30% | ≥ 40% |
| Classes started / replicated without seeding | 0 / 0 | 1 / 0 | 3 / 1 | 10 / 5 |
| Indexed pages (all locales) | ~24 | 40 | 80 | 150 |
| NL shortlist terms in top 10 | 0 | 2 | 5 | 8 |
| IT shortlist terms in top 10 | 0 | 0 | 2 | 5 |
| Search Console clicks / month | unknown | 150 | 800 | 3,000 |
| Printable downloads / month | 0 | 50 | 300 | 1,000 |
| Organic (non-class) household signups / month | 0 | 5 | 30 | 100 |
| AI-search citations (monthly probe, 3 languages) | 0 of 9 | 1 | 3 | 6 |

The first two rows are the ones that matter; the rest is the background asset compounding.

## Baseline
_To be filled in Phase 0: indexed pages, impressions, clicks per locale; store metrics once
live._

## Review cadence
- Monthly: Search Console + store funnels into this page; shortlist ranks; AI probe.
- At each gate (G1/G2/G3): decide whether the next phase's content is funded at all.

## Related pages
- [[seo-overview]] · [[seo-keyword-strategy]] · [[seo-content-types]] · [[seo-app-store-aso]] ·
  [[seo-technical-audit]] · [[source-family-mode-context]] ·
  [[decision-2026-09-06-family-mode-pivot]] · [[research-survey-plan]]
