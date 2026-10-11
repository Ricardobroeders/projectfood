---
title: SEO — technical audit of projectfood.dev (family mode)
type: seo
tags: [seo, technical, audit, family-mode]
created: 2026-09-06
updated: 2026-10-11
sources: [seo-content-types.md, seo-app-store-aso.md, source-family-mode-context.md]
---

# SEO — technical audit of projectfood.dev (family mode)

**In one line:** The Next.js marketing site stays (D2) and its technical base is sound. Three
things change with family mode: **health-claim copy has to go**, the site needs **app-link
plumbing** for the native apps and class invites, and the adult learn hub gets frozen rather
than grown. Audited from the codebase on 2026-09-06, not from a live crawl.

> **Superseded on 2026-09-29** by [[seo-audit-2026-09-29]], a live crawl with Lighthouse and
> the demand numbers. This page stays for the family-mode fixes list and its numbering (#1 to
> #14): #6, #8 and #12 are done; #1, #2, #3, #5, #9, #11 and #13 are batches 0 and 1 of
> [[seo-roadmap]]; #4 and #10 wait for the store listing and the household share page.

## What is already right _(as of 2026-09-06)_
| Item | Where | Note |
|---|---|---|
| Locale routing with localised slugs | `middleware.ts`, `lib/marketing.ts` | `/nl/over`, `/it/chi-siamo`, `/nl/leer/...` |
| `hreflang` + `x-default` | `lib/marketing.ts` | Marketing and learn pages |
| Sitemap | `app/sitemap.ts` | Static pages + published learn content, per locale |
| Robots | `app/robots.ts` | App routes disallowed |
| JSON-LD | `app/[locale]/page.tsx`, `components/learn-json-ld.tsx` | `WebSite`, `Organization`, `CollectionPage`, `Article`, `FAQPage`, `BreadcrumbList` |
| Per-article SEO fields | `learn_article_content` | `meta_title`, `meta_description`, `sd_keywords`, `sd_faq`, `sd_citations` |
| Static generation | `generateStaticParams` | Crawlable HTML |
| Analytics | `@vercel/analytics` | Page views only |

## Gaps and fixes (impact ÷ effort)
| # | Gap | Impact | Fix | Effort |
|---|---|---|---|---|
| 1 | **Health claim in hero and meta**: `heroBody` = "Science shows eating 30 different plants a week boosts gut diversity" (all locales); `manifest.json` description similar | High (brand rule + YMYL) | Rewrite to the family promise: "Your kids tap what they ate. The family collects 30 plants a week. Together." Keep "Good gut, good life" as the brand line only | S |
| 2 | **No Open Graph image**; Twitter card is `summary` | High (WhatsApp unfurl is the channel) | `opengraph-image.tsx` per locale (family card), `summary_large_image`; dynamic OG for class milestones and card unlocks later | S → M |
| 3 | **Search Console / Bing unverified** | High | Verify, submit sitemap, IndexNow | S |
| 4 | **No app-link plumbing** | High at native launch | `apple-itunes-app` meta, Play install prompt, `SoftwareApplication` JSON-LD with store URLs, Universal Links / App Links handler for `/klas/<code>` and share cards ([[seo-app-store-aso]]) | M |
| 5 | **`/recipes` placeholder** live, in nav, indexable | Med | Remove from nav and route (non-goal) | S |
| 6 | **Learn hub is adult gut-science**; planned gut-brain cluster = health claim | Med | Freeze: keep the 2 articles live and dated, add a one-line "written for adults tracking 30 plants" note; do not write the mood article; create the family pillar as a separate learn pillar (`learn-to-eat-everything`) | S now, M later |
| 7 | **Learn articles thin** (~300 words EN, ~200 NL/IT); FAQ only in EN | Low now (frozen) | Only expand if they keep earning impressions | — |
| 8 | **Author = Organization** | Med (E-E-A-T, GEO) | `Person` author (Ricardo) + the grandfather-greengrocer story on About as the trust anchor for parents | S |
| 9 | **Home title/copy never says app, free, Android, family, kids** | Med | Title: `Project Food — the family app where kids taste and the whole household collects 30 plants`; NL/IT equivalents with "app", "gratis", "gezin", "kinderen" / "famiglia", "bambini", "vegetali" | S |
| 10 | **Public profiles `/u/[username]`** client-rendered, not disallowed | Decision | With family mode: households, not persons. Disallow `/u/` until a household share page exists; when it does, aggregates only, no child names | S |
| 11 | **No `llms.txt`** | Low–Med | Add: what the app is, for whom, platforms, languages, links to the class page and cards | S |
| 12 | **Sitemap `lastModified: new Date()`** | Low | Real dates | S |
| 13 | **Core Web Vitals** unknown | Unknown | PageSpeed on `/nl/` and one learn page; fix < 90 mobile | S–M |
| 14 | **Consent & privacy page** for parents | Med | Privacy page must state plainly: one parent account, member names stay on the phone/household, no child accounts, no ads. Parents check this before installing | S |

## Decisions needed (Ricardo)
1. Approve the hero/meta rewrite wording (#1, #9) — it changes what the site *is*.
2. Freeze vs delete the adult learn hub (#6). Recommendation: freeze, dated.
3. `/u/` profiles: disallow now (#10). Recommendation: yes.
4. Authorise DataForSEO so the parent-cluster volumes can be pulled (file §8).

## Measurement setup
- Search Console per locale folder; the 10-term shortlists in [[seo-keyword-strategy]].
- `signup_source` / referral code at first login, per class code where applicable, so the
  "did a second class replicate?" question is answerable from data ([[source-supabase-metrics]]
  views).
- App Store Connect / Play Console funnels by referrer once live ([[seo-app-store-aso]]).

## Related pages
- [[seo-overview]] · [[seo-content-types]] · [[seo-app-store-aso]] · [[seo-roadmap]] ·
  [[source-family-mode-context]]

## Structured data and metadata audit of the learn hub (2026-10-11)

Live pages read in three languages (pillar 3 EN, two clusters NL and IT, the hubs, home, about)
plus a scan of the 43 live content files. What is there and correct: canonical, hreflang with
x-default in head and sitemap, Open Graph and Twitter cards with a 1200×630 share image per page,
one `@graph` per page with Article (headline, description, inLanguage, wordCount, keywords, dates,
author Person, publisher Organization with logo, isPartOf/hasPart between pillar and clusters),
BreadcrumbList, FAQPage mirroring the accordion, CollectionPage on the hubs, WebSite and
Organization on the home, atom feed per locale, robots.txt, lastmod in the sitemap. Nothing invalid.

What is missing or costs value, in order:

1. **Done 2026-10-11.** **Rendered titles are too long.** The layout appends " | Project Food", so 39 of 43 article
   titles exceed 60 characters and 19 exceed 65 (NL pillar 3 is 70, IT sgarro 71). Google cuts at
   about 60 and rewrites long ones. Fix: article pages set an absolute title (no suffix; Google
   shows the site name on its own since 2022), or the meta_title cap drops from 55 to 45.
2. **No author profile.** `AUTHOR_SAME_AS` in `lib/seo.ts` is still empty (waiting for Ricardo's
   URLs since 2026-10-07), the Person node has only name and url, and the about page carries no
   Person/ProfilePage node. E-E-A-T and AI attribution both key on this.
3. **Ricardo collects the images (2026-10-11): one set per article folder, 16:9 at 1200×675, 4:3 at 1200×900, 1:1 at 1200×1200, named `<internal>-16x9.jpg`, `<internal>-4x3.jpg`, `<internal>-1x1.jpg`, no text in the image, in a public bucket `learn-covers`; then the page shows the 16:9 at the top with alt text from the front matter and `image` carries all three.** **The cover render is not on the page.** Every article has a plant render as share image and
   `Article.image`, but the page itself shows no image, so Google sees an image it cannot find in
   the content and Discover is out of reach. Fix: render the cover at the top with alt text, and
   serve the share route in 16:9, 4:3 and 1:1 so `image` carries three ratios.
4. **Done 2026-10-11, except the per-locale date (the content table has no created_at).** **Cheap Article properties not emitted:** `citation` (the DOIs are in the front matter),
   `timeRequired` (reading_time_min is in the database), `articleSection` (the pillar title),
   `isAccessibleForFree`. `datePublished` on an NL or IT page is the article's English date, not
   the day that language went live.
5. **Done 2026-10-11.** **Hub and home metadata.** Hub descriptions are 98 to 110 characters (floor is 120) and the hub
   titles carry no search phrase; home descriptions EN 163 and IT 167 characters (cut at 155).
6. **Keyword placement is uneven on the English pillar 3 set** (written in one go on 2026-10-10):
   by a rough scan the primary phrase is absent from the first 100 words on 17 of 43 files and
   from every H2 on 23, mostly English. The check script does not test this; a warning rule would.
7. Organization has no `sameAs` (Play listing once public, LinkedIn page); no image sitemap
   entries; FAQ rich results are not shown to sites like ours since 2023 (the node still feeds AI
   answers, keep it).

Not needed: `meta keywords` (ignored, harmless), SearchAction (no site search), SoftwareApplication
(gated until a store page is public, correct).
