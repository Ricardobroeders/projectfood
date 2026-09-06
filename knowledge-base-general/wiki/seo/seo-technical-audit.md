---
title: SEO — technical audit of projectfood.dev (family mode)
type: seo
tags: [seo, technical, audit, family-mode]
created: 2026-09-06
updated: 2026-09-06
sources: [seo-content-types.md, seo-app-store-aso.md, source-family-mode-context.md]
---

# SEO — technical audit of projectfood.dev (family mode)

**In one line:** The Next.js marketing site stays (D2) and its technical base is sound. Three
things change with family mode: **health-claim copy has to go**, the site needs **app-link
plumbing** for the native apps and class invites, and the adult learn hub gets frozen rather
than grown. Audited from the codebase on 2026-09-06, not from a live crawl.

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
