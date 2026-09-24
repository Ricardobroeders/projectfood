---
title: SEO — site architecture (sitemap, page types, structured data, research brief)
type: seo
tags: [seo, sitemap, structured-data, keyword-research, family-mode]
created: 2026-09-23
updated: 2026-09-24
sources: [seo-keyword-strategy.md, seo-content-types.md, seo-technical-audit.md, seo-serp-landscape.md]
---

# SEO — site architecture for projectfood.dev

**In one line:** Three hubs under one home page, in en/nl/it only until the Dutch numbers prove
the model (decided 2026-09-23, de/fr follow the app locale). The site already routes
pillar → cluster (`/nl/leer/<pillar>/<article>`) and emits `CollectionPage`, `Article`,
`FAQPage` and `BreadcrumbList`; the skeleton is there, the content is not. Keyword research
decides the *order* of cluster pages and what to expect, not the shape of the site.

## Sitemap (Dutch slugs; English and Italian alternates in the table below)
```
/                                  Home = the app page. Owns the brand query.
/over                              About: Ricardo, the greengrocer story. Trust anchor for parents.
/leer                              Learn hub index.
/leer/alles-leren-eten             PILLAR 1 · "Kinderen en groente: zo leert je kind groente eten, zonder strijd" (numbers: [[seo-pillar-alles-leren-eten]])
   /peuter-wil-niet-eten             general toddler refusal, the biggest NL cluster (880/mo, KD 11)
   /hoe-vaak-proeven                 how many tastes, the Leren-lusten-plan, the proefkaart (absorbs rewards)
   /moeilijke-eter                   the picky-eater identity, without the label sticking
   /peuter-eet-geen-groente          toddler + vegetables, with fruit as a section
   /welke-groente-vinden-kinderen-lekker   the list page, later fed by our own tasting data
   /groente-verstoppen               hiding vegetables: the stance page
   /voedselneofobie                  neophobia is normal, 2–6 y (short)
   (sections, not pages: rewards, pressure and clean plates, fruit, the dinner question)
/leer/30-planten                   PILLAR 2 · existing "Waarom 30 verschillende planten per week?", reframed for the family
   /wat-telt-mee                     existing cluster → the does-it-count hub (ketchup, koffie, aardappel, brood)
   /als-gezin                        30 as a family: how the count works when four people eat
/printables                        HUB 3 · free PDFs, the link magnet
   /proefkaart                       tasting chart, 10–15 boxes
   /plantenkaarten                   40 plant cards from the clay renders
   /groentebingo                     veg bingo
/planten/[slug]                    Phase 3, gated: 40 common plants indexable, the rest noindex
/privacy · /voorwaarden · /contact · /account-verwijderen    support pages, indexable, not targets
/recepten                          REMOVE (non-goal; live placeholder today)
```

| Page | en | nl | it |
|---|---|---|---|
| Pillar 1 | `/learn/learn-to-eat-everything` | `/leer/alles-leren-eten` | `/impara/imparare-a-mangiare-tutto` |
| Pillar 2 | `/learn/30-plants` | `/leer/30-planten` | `/impara/30-piante` |
| Printables hub | `/printables` | `/printables` | `/stampabili` |
| Tasting chart | `/printables/tasting-chart` | `/printables/proefkaart` | `/stampabili/tabella-assaggi` |
| Plant cards | `/printables/plant-cards` | `/printables/plantenkaarten` | `/stampabili/carte-delle-piante` |
| Veg bingo | `/printables/veggie-bingo` | `/printables/groentebingo` | `/stampabili/tombola-delle-verdure` |
| Plant pages | `/plants/<slug>` | `/planten/<slug>` | `/piante/<slug>` |

Pillar 2's existing slug is `plant-diversity` with cluster `what-counts-as-a-plant`; keep the
slugs (they are indexed since 2026-05) and change titles and copy, do not redirect.

## Why hubs, and the rules that make them work
- **Topical authority is per topic, not per site.** A new domain ranks for "hoe vaak moet een
  kind iets proeven" because five linked pages around one parent problem say more than five
  scattered posts. Each hub is one intent moment: dinner (pillar 1), groceries (pillar 2), the
  fridge door (printables).
- **One intent per page.** A term with its own intent and enough volume gets a page; below that
  it becomes an H2 or a FAQ entry in the hub page. The research sheet decides which.
- **Links both ways, on every page.** Pillar links every cluster in its body; each cluster links
  the pillar in the first paragraph and two siblings at the end; the printables hub is linked
  from every article ("print de proefkaart"); every page ends in the app (store badge).
- **No empty states.** A pillar is published together with at least two clusters; the
  printables hub goes live with real PDFs; plant pages stay noindex until they carry 150 words of
  their own.
- **Voice gates apply to URLs too.** No "kind" or "kinderen" in the hub slugs that will be
  shared (the store rule); "alles-leren-eten" (the Dutch idiom) not "kind-lust-geen-groente" as the pillar slug,
  the title carries the search phrase instead.

## Structured data per page type
The site emits `WebSite`, `Organization`, `CollectionPage`, `Article`, `FAQPage` and
`BreadcrumbList` today ([[seo-technical-audit]]). Schema is a parsing aid and a tie-breaker,
not a ranking lever; Google dropped `HowTo` rich results (2023-09) and limits `FAQPage` rich
results to government and health sites (2023-08), so neither earns a visible snippet for us.
Keep it correct and small:

| Page type | Types | Notes |
|---|---|---|
| Home | `WebSite`, `Organization`, `SoftwareApplication` (`MobileApplication`) | `sameAs` → Play listing, App Store later, founder site, LinkedIn. `operatingSystem: Android` (iOS when live), `applicationCategory: LifestyleApplication`, `offers: price 0`. **No `aggregateRating` until Play shows real reviews**, then mirror Play's number |
| About | `AboutPage`, `Person` (Ricardo) | The `Person` is reused as `author` on every article (E-E-A-T, AI-search attribution) |
| Learn index | `CollectionPage`, `BreadcrumbList` | exists |
| Pillar | `Article`, `BreadcrumbList`, `FAQPage` where a real FAQ exists | `author: Person`, `about` the topic, `dateModified` honest |
| Cluster | `Article`, `BreadcrumbList` | `isPartOf` the pillar |
| Printables hub | `CollectionPage`, `BreadcrumbList` | |
| Printable | `DigitalDocument` (`encodingFormat: application/pdf`, `isAccessibleForFree: true`), `ImageObject` preview | The preview image is what Pinterest and WhatsApp pick up |
| Plant page | `WebPage`, `BreadcrumbList`, `ImageObject` | Not `Product`; no health properties |
| Comparison (Phase 2) | `Article`, `ItemList` | |

Every page: `hreflang` for en/nl/it plus `x-default` (exists), canonical, one OG image per
locale (missing today, [[seo-technical-audit]] #2).

## Research brief (Ricardo, manual tools; Claude files the numbers)
Research sets the order of the cluster pages and the expectations, so it runs **in parallel
with** the skeleton (home, about, printables), not before it. Terms: the 30-term shortlist in
[[seo-keyword-strategy]] plus anything the tools suggest. One row per term:

| Column | What to record |
|---|---|
| Term, language, country | NL → Netherlands (Belgium as a note), IT → Italy, EN → UK first |
| Search volume | monthly, tool and date |
| Keyword difficulty | tool score; note which tool, scales differ |
| Intent | know / do / tool / app / brand |
| SERP features | AI Overview present, People also ask (copy the questions: they are the FAQ), video, image pack |
| Top 3 | domains and page type (institution, media, blog, app listing); whether any tool or app ranks |
| Seasonality | Google Trends: September, January and the schoolfruit window (Nov–Apr) |
| Our target | which page in the sitemap above, or "section in <hub>" |

Thresholds for a domain with no authority yet (heuristics, revise after the first 90 days):
- **Difficulty:** ≤ 20 on Ahrefs, ≤ 30 on Semrush for the first ten pages; up to 40 for the
  pillar itself, which earns its rank from the cluster.
- **Volume worth a page:** ≥ 100/month NL, ≥ 200 IT, ≥ 500 EN. Below that, a section, unless
  the intent is exactly ours ("app kind groente eten" at 30/month is still a page).
- **Skip:** any term whose page 1 is entirely institutions and hospitals (medical intent), any
  term that needs a health claim to answer.

Deliverable: the tables in [[seo-keyword-strategy]] rewritten with dated numbers, priorities
re-ordered, and the Search Console shortlist confirmed.

## "Proven", the gate for de/fr (decided 2026-09-23)
The roadmap's KPI table ([[seo-roadmap]]) is the gate. De/fr on the website waits for the
**April 2027 column met for NL** (five shortlist terms in the top 10, 800 Search Console
clicks a month, 300 printable downloads a month) **and** the app speaking de/fr with a Play
listing in both. Earlier only if IT replicates NL on its own within a quarter.

## Order of work
1. Skeleton (Claude, no numbers needed): home as the app page in en/nl/it, `/recepten` removed,
   `SoftwareApplication` + `Person`, OG image per locale, About refreshed. Fixes the brand query.
2. Printables hub with three real PDFs, NL first, en/it a week later. The link magnet.
3. Research sheet (Ricardo) → numbers filed → the pillar-1 clusters ordered.
4. Pillar 1 with its first two clusters, NL. Then pillar 2 reframed and `wat-telt-mee` grown.
5. IT mirrors NL one step behind. EN gets the home, printables and pillar 2; pillar 1 in EN
   waits for the numbers (page 1 is institutional).

## Related pages
- [[seo-overview]] · [[seo-keyword-strategy]] · [[seo-content-types]] · [[seo-technical-audit]] ·
  [[seo-serp-landscape]] · [[seo-roadmap]] · [[strategy-backlog]]
