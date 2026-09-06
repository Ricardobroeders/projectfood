---
title: SEO — technical audit of projectfood.dev
type: seo
tags: [seo, technical, audit]
created: 2026-09-06
updated: 2026-09-06
sources: [seo-content-types.md]
---

# SEO — technical audit of projectfood.dev

**In one line:** The technical base is better than most solo projects (sitemap, robots,
hreflang, rich JSON-LD already shipped). The gaps are social preview, app schema, E-E-A-T
signals, a thin placeholder page, and unverified search-engine tooling. Audited from the
codebase on 2026-09-06 (`projectfood-app/`), not from a live crawl.

## What is already right _(as of 2026-09-06)_
| Item | Where | Note |
|---|---|---|
| Locale routing with localised slugs | `middleware.ts`, `lib/marketing.ts` | `/nl/over`, `/it/chi-siamo`, `/nl/leer/...` rewritten to internal routes |
| `hreflang` alternates + `x-default` | `lib/marketing.ts` → `generateMetadata` | On marketing pages and learn pages |
| Sitemap | `app/sitemap.ts` | Static pages + learn hub + published pillars/clusters, per locale, with alternates |
| Robots | `app/robots.ts` | App routes (`/home`, `/log`, `/stats`, `/account`, `/advice`, `/leaderboard`, `/login`, `/api`, `/auth`) disallowed |
| JSON-LD | `app/[locale]/page.tsx`, `components/learn-json-ld.tsx` | `WebSite`, `Organization`, `CollectionPage`, `Article`, `FAQPage`, `BreadcrumbList` |
| Per-article SEO fields | `learn_article_content` | `meta_title`, `meta_description`, `sd_keywords`, `sd_faq`, `sd_citations`, `related_article_slugs` |
| Static generation | `generateStaticParams` on marketing + learn pages | Server-rendered HTML for crawlers |
| Analytics | `@vercel/analytics` in `app/layout.tsx` | Page views only |
| PWA manifest | `public/manifest.json` | Description already carries the brand promise |

## Gaps and fixes (ordered by impact ÷ effort)
| # | Gap | Impact | Fix | Effort |
|---|---|---|---|---|
| 1 | **No Open Graph / Twitter image.** `twitter.card` is `summary` and no `opengraph-image` exists. Every shared link unfurls without a picture, which hurts word of mouth more than SEO | High | Add `app/[locale]/opengraph-image.tsx` (static brand card) and per-article OG images; switch to `summary_large_image` | S |
| 2 | **Search Console / Bing Webmaster unverified** (nothing in repo; status unknown) | High | Verify `projectfood.dev` in Google Search Console and Bing Webmaster Tools; submit sitemap; enable IndexNow on Vercel | S |
| 3 | **`/recipes` placeholder is live, in the nav, indexable** ("This page is being built") | Med | Remove from nav and add `robots: { index: false }` until it has content, or delete the route. Building it conflicts with the no-recipe-library non-goal | S |
| 4 | **No `SoftwareApplication` / `WebApplication` schema** | Med | Add to home JSON-LD: name, `applicationCategory: HealthApplication`, `operatingSystem: Web, Android, iOS`, `offers: 0 EUR`, `inLanguage: [en, nl, it]` | S |
| 5 | **Learn articles are thin** (~300 words EN, ~200 NL/IT); **FAQ only in EN** (`sd_faq` empty for NL/IT) | High | Expand bodies to 1,200+ words; add 3–5 FAQ items per locale (they feed `FAQPage`) | M per article |
| 6 | **Author is the Organization** (`author: { '@id': ORG_ID }`) | Med (E-E-A-T, GEO) | Add a `Person` author (Ricardo) with an about-page anchor; show name + date on articles; link the "Born between the vegetables" story | S |
| 7 | **Home page `<title>`** is `Project Food — Good gut, good life.` and hero copy never says "app", "free", "Android", "tracker" | Med | Title: `Project Food — Free 30 plants a week tracker (web app, Android & iPhone)`; NL/IT equivalents with "app", "gratis", "vegetali". Add an indexable feature/FAQ section below the hero | S |
| 8 | **IT phrasing**: articles and hero use "30 piante"; Italian search uses "30 vegetali a settimana" | Med (IT) | Lead with "vegetali", keep "piante" as secondary; update `it.json` and IT article titles/meta | S |
| 9 | **Public profiles `/u/[username]`** are client-rendered (`'use client'`) and not disallowed in robots | Low now, decision needed | Either server-render a minimal public card (name, plants this week, share image) and add to sitemap, or disallow `/u/` in robots. Recommend: render + index only if the user opts in to a public profile | M |
| 10 | **No `llms.txt`**, no plain "what is this" paragraph for AI crawlers | Low–Med | Add `public/llms.txt` summarising the app, languages, platforms and the learn hub | S |
| 11 | **Sitemap `lastModified: new Date()`** for static pages on every build | Low | Use real dates so Google's freshness signal means something | S |
| 12 | **Robots allows `/[locale]/recipes` and `/login` is disallowed** while the CTA links to `/login` | Low | Fine for now; once a signup page exists, make it indexable with its own copy | — |
| 13 | **Core Web Vitals / mobile** | Unknown | Run PageSpeed Insights on `/en/`, `/nl/leer/plant-diversity`; fix anything below 90 on mobile | S–M |

## Decisions needed (Ricardo)
1. **Recipes:** remove/noindex the placeholder (recommended), or commit to a weekly-plan page
   (not a recipe library) as described in [[seo-content-types]] §"What we will not build".
2. **Public profiles:** index opt-in public profiles (word-of-mouth surface) or keep them private.
3. **Programmatic plant pages:** approve the quality gates in [[seo-content-types]] §6 before
   any pages are generated.
4. **DataForSEO connector:** authorise it in claude.ai connector settings so keyword volumes
   can be pulled directly into this wiki.

## Measurement setup (Phase 0 in [[seo-roadmap]])
- **Google Search Console + Bing Webmaster:** impressions, clicks, queries, indexed pages, per
  locale via URL filter (`/nl/`, `/it/`).
- **Rank tracking:** the 10-terms-per-language shortlist in [[seo-keyword-strategy]], checked
  monthly (DataForSEO once connected; Search Console positions meanwhile).
- **Attribution:** `?utm_source=learn` on every in-content CTA, and a `signup_source` column
  (or `user_settings` field) populated from the referrer at first login, so organic signups are
  countable in the existing `analytics_*` views ([[source-supabase-metrics]]).
- **Vercel Analytics:** keep for page views; add custom events for `open_app` clicks from
  content pages.

## Related pages
- [[seo-overview]] · [[seo-content-types]] · [[seo-roadmap]] · [[source-app-mockups]]
