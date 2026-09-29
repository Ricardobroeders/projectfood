---
title: SEO — roadmap & KPIs (family mode)
type: seo
tags: [seo, plan, roadmap, family-mode]
created: 2026-09-06
updated: 2026-09-29
sources: [seo-audit-2026-09-29.md, source-family-mode-context.md, seo-keyword-strategy.md, seo-content-types.md, seo-technical-audit.md, seo-app-store-aso.md]
---

# SEO — roadmap & KPIs (family mode)

**In one line:** Since 2026-09-29 SEO is an active track, not a half-day-a-week background job:
one day of hygiene, one home-page decision, then a queue that keeps the nightly routine writing
until the end of the year, then authority. The store stays the front door and the class gates
(G1 to G3) still decide the class and schoolfruit content. Effort: S = hours, M = a day or two,
L = a week+.

> **Rewritten 2026-09-29** from the live audit in [[seo-audit-2026-09-29]]. The 2026-09-06
> version ran SEO at "about half a day a week until the class channel is proven"; Ricardo asked
> on 2026-09-29 to grow search value quickly and has the time, so the phases below are batches
> with owners, not quarters. The order respects the one thing
> ([[decision-2026-09-29-one-thing-way-of-working]]): none of batch 0 to 2 touches the app or the
> tester clock; it is the fourteen-day window used well.

> **Operating model:** Claude writes and ships on `main` (batch 0, the queue, the templates);
> Ricardo decides the wording that says what the site is (batch 1), supplies accounts and links,
> makes the PDFs in Figma, and does the human outreach (batch 3). The nightly routine
> (`PF - Learn Article`, 03:05) is the content engine; its queue is `content/learn/queue.json`.

## Gates (unchanged, scoped to class content)
- **G1 — Dinner habit holds** for the five families past week 4. Unlocks the class kit copy.
- **G2 — One class runs** in November and produces the playbook. Unlocks the schoolfruit and
  class pages (formats 2 and 5).
- **G3 — A second class replicates** without founder seeding. Unlocks the aggregate-data content.
The hub, pillar 2, the printables, the plant pages and the comparison page do not wait for a gate.

## Batch 0 — hygiene (Claude, about one working day, no decision needed)
_Shipped 2026-09-29 (code commit on `main`, content republished the same day). Every row below is done; the a11y and cache rows are measured on the next Lighthouse run._

| Task | Effort | Done when |
|---|---|---|
| `dynamicParams = false` on the locale layout: `/foo.txt` returns 404, not the English home page | S | `curl -I https://projectfood.dev/foo.txt` is 404 |
| Remove the `recipes` route and its messages keys | S | `/en/recipes` is 404 |
| Legacy learn pages: `meta_title` without the doubled "\| Project Food", descriptions without the health claim (content files; the rewrite itself is batch 2.2) | S | Titles ≤ 60 characters |
| "stamps" → achievements in privacy and delete-account copy ×3; own descriptions for terms and contact | S | `learn:check`-style grep finds no "stamp" in `messages/*.json` marketing copy |
| One `Organization` node (`organizationNode()`) on the home page; `sameAs` on Organization and Person when the links arrive | S | One logo URL in every graph |
| `Article.image` + `opengraph-image.tsx` for hub, pillar and cluster routes from the plant renders, `summary_large_image` | M | A WhatsApp share of an article shows the card; Rich Results Test lists the image |
| Hero and feature images through `next/image` (no `unoptimized`), sized | S | Home LCP < 2.5 s mobile in Lighthouse |
| Viewport zoom re-enabled; `#A39B91` meta text to a readable token; hero line kept as decoration | S | Lighthouse a11y ≥ 95 |
| Locale cookie set only on change, so the CDN caches the static pages. **Found deeper on 2026-09-29:** the cookie was not the cause; the single root layout called next-intl's `getLocale()` above the `[locale]` segment, which made every marketing page a dynamic render (five prerendered routes in the manifest). Fixed with two root layouts: `app/[locale]/layout.tsx` for the site, `app/(pwa)/layout.tsx` for the app | S → M | `x-vercel-cache: HIT` on a second request to `/nl` |
| IndexNow ping in `learn-publish.mjs`; Atom feed at `/[locale]/learn/feed` | S | Bing shows the ping; feed validates |

## Batch 1 — the brand query and the front door (Claude drafts, Ricardo approves)
_Approved by Ricardo and shipped 2026-09-29 (evening): home ×3 as the family app page (hero
"The family app where kids taste" / "Every taste becomes a card", three steps with the plant
renders, two cited sentences, six visible FAQ mirrored in FAQPage JSON-LD, the pillar and two
clusters linked, Play closed-test CTA with an "iPhone follows" note); About with the family pivot
in two paragraphs and the cited 30 line instead of "backed by science"; manifest description and
`theme_color` `#F5C518`. `SoftwareApplication` JSON-LD is wired in `lib/seo.ts` (`STORE`) and
emits once `playPublic` is true; the header "Open the app" still goes to the PWA login for the
existing adult accounts. Open on this batch: Person `sameAs`, Bing and Ahrefs verification._
| Task | Owner | Effort | Done when |
|---|---|---|---|
| Home page ×3 as the family app page: hero, three steps (plant renders until the listing screenshots are exported from Figma), two cited sentences of tasting science (no claim), FAQ, one paragraph linking the pillar and two clusters, store CTA (closed-test link now, badge after), title without the em dash | Claude, Ricardo approves wording | M | No "boosts gut diversity" anywhere; "app" and the family in title and H1 in three locales |
| About page: greengrocer story kept, "backed by science" and the adult tracking paragraph replaced by the family pivot; Person `sameAs` | Claude, Ricardo approves | S | |
| `SoftwareApplication` JSON-LD with the store URL; manifest description and `theme_color` (`#16a34a`) aligned | Claude | S | Public Play URL exists |
| Search Console baseline exported to `raw/`; Bing Webmaster Tools and Ahrefs Webmaster Tools verified | Ricardo | S | Baseline row filled below |

## Batch 2 — the queue (the scaling model)
_Refilled 2026-09-29: 19 open rows in `queue.json` (2.1 to 2.6, one a night, to about
2026-10-18), after the two routine branches of 2026-09-28 and 09-29 were merged into `main`.
Rows 2.2 carry `rewrite: true` (live legacy pages written fresh, slugs kept); 2.7 to 2.9 need a
template or an asset first and are Claude's build steps, not queue rows._

| Order | Rows | Locales | Owner | Effort |
|---|---|---|---|---|
| 2.1 | `picky-eater-toddler` | en | routine | 1 night |
| 2.2 | Pillar 2 for the family: `plant-diversity`, `what-counts-as-a-plant`, new `as-a-family` (`30-planten-als-gezin` / `30-piante-in-famiglia` / `30-plants-a-week-as-a-family`); slugs kept | nl, it, en | rows written 2026-09-29, routine writes the pages | 9 nights |
| 2.3 | IT: `bambino-non-mangia-psicologia` · `bambino-2-anni-non-mangia-piu` · `alimentazione-selettiva-cause` | it | rows written 2026-09-29, routine | 3 nights |
| 2.4 | EN lists and tools: picky eater food list · picky eater chart (printable landing) · picky eater checklist | en | routine | 3 nights |
| 2.5 | Siblings: `hiding-vegetables` (en), `toddler-wont-eat-vegetables` (it) | en, it | routine | 2 nights |
| 2.6 | NL `geen-strijd-aan-tafel` | nl | rows written 2026-09-29, routine | 1 night |
| 2.7 | Printables hub + tasting chart, plant cards, veg bingo landing pages | nl, it, en | PDFs Ricardo (Figma, existing renders); pages Claude | M + M |
| 2.8 | Plant pages `/[locale]/plants/[slug]` from the database; 40 most-tasted indexed, 184 `noindex` until reviewed (item 5) | nl, it, en | Claude | L |
| 2.9 | Honest app comparison ("game, not therapy") | en, then nl, it | Ricardo tests the apps, Claude writes | M |
| 2.10 | Second daily trigger if quality holds after two weeks; routine model decision (Opus 5) | | Ricardo decides | S |

## Batch 3 — authority (Ricardo's outreach, Claude's assets)
| Task | Owner | Effort |
|---|---|---|
| `sameAs`: Play, App Store, LinkedIn, GitHub (README links the site), ricardobroeders.nl after the certificate fix | Ricardo supplies, Claude wires | S |
| Launch listings: Product Hunt, AlternativeTo, nobigapps, directories in [[seo-serp-landscape]] | Ricardo | S |
| Printables offered to the sites ranking for "groente proefkaart" / "picky eater chart", JGZ practices, Tommy Tomato, Spoony; forum answers, never posts | Ricardo, Claude drafts | S ongoing |
| The greengrocer-to-family-app story to Eindhoven and Brabant press and founder podcasts | Ricardo | S |
| After G3: "what 1,000 Dutch kids tasted this year", privacy-gated | Claude | M |

## Class channel content (gated, unchanged)
| Task | Gate | Effort |
|---|---|---|
| `/klas` class challenge page + poster + WhatsApp template + milestone card | G2 (row 12 decides the channel) | M |
| "EU-Schoolfruit: thuis meedoen" (NL), "Frutta e verdura nelle scuole: a casa" (IT) | G2 | S |
| Universal Links / App Links for `/klas/<code>` | G2 | M |

## KPIs
| KPI | Baseline 2026-09-29 | Dec 2026 | Apr 2027 | Sep 2027 |
|---|---|---|---|---|
| Sitemap URLs / pages with impressions | 44 / 3 | 80 | 200 | 300 |
| NL shortlist terms in top 10 | 0 (unmeasured) | 3 | 6 | 8 |
| IT shortlist terms in top 10 | 0 (unmeasured) | 2 | 5 | 6 |
| EN list and chart terms in top 10 | 0 | 1 | 3 | 5 |
| Brand query "project food app" | lost to namesakes | won | won | won |
| Search Console clicks / month | 0 (1 click in 3 months) | 150 | 800 | 3,000 |
| Referring domains (real; Ahrefs counts 762 spam-farm domains at DR 0) | 1 (own GitHub) | 10 | 30 | 60 |
| Printable downloads / month | 0 | 50 | 300 | 1,000 |
| Lighthouse mobile home (perf / a11y) | 91 / 88 | ≥ 95 / ≥ 95 | | |
| Direct-link → install conversion (class links) | n/a | measured | ≥ 30% | ≥ 40% |
| Organic (non-class) household signups / month | 0 | 5 | 30 | 100 |

## Baseline
Search Console, web search, 2026-06-27 to 2026-09-29 (export in `raw/gsc-export-2026-09-29/`,
Ricardo, 2026-09-29): **1 click, 28 impressions in three months.** Netherlands 15 impressions,
Italy 3, Belgium 2; desktop 23, mobile 5. Queries: "project food" 4 impressions at position 2.5
(the one click), "plant food" 9 at position 44, "foodproject" 2, "projectfood.it" 1. Pages with
impressions: `/nl` 19, `/` 6, `/it` 5; no learn page had an impression yet (the family pages are
12 days old). Sitemap 44 URLs; home Lighthouse 91 / 88 / 96 / 92, article 100 / 90 / 100 / 92;
0 Open Graph images; 1 known referring domain. This is the zero line every KPI above is measured
against.

## Review cadence
- Weekly while batch 2 runs: queue rows written, pages indexed (Search Console), one article
  read against the brand gates.
- Monthly: Search Console and store funnels into this page; shortlist ranks; the AI-search probe
  in three languages; the KPI table.
- At each gate (G1 to G3): whether the class content is funded.

## Related pages
- [[seo-audit-2026-09-29]] · [[seo-overview]] · [[seo-keyword-strategy]] · [[seo-content-types]] ·
  [[seo-app-store-aso]] · [[seo-technical-audit]] · [[seo-site-architecture]] ·
  [[source-family-mode-context]] · [[decision-2026-09-06-family-mode-pivot]] ·
  [[decision-2026-09-29-one-thing-way-of-working]]
