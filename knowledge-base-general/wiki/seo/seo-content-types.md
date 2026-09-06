---
title: SEO — content types & formats
type: seo
tags: [seo, content, marketing]
created: 2026-09-06
updated: 2026-09-06
sources: [seo-keyword-strategy.md, seo-serp-landscape.md, concept-brand-pillars.md]
---

# SEO — content types & formats

**In one line:** Ten content formats, each tied to a keyword cluster from
[[seo-keyword-strategy]], a funnel stage, and a strategy check against [[concept-brand-pillars]]
and the `STRATEGY.md` non-goals. Two things we deliberately will not build are listed at the end.

## Summary table
| # | Format | Clusters served | Funnel | Effort | Lives at |
|---|---|---|---|---|---|
| 1 | Learn pillar & cluster articles | A, E | Awareness | M per article | `/learn/...` (exists) |
| 2 | "What counts" hub + food rulings | B | Consideration | S per ruling | `/learn/what-counts/...` |
| 3 | Checklist page + printable PDF | C | Consideration → conversion | M once | `/learn/checklist` |
| 4 | Honest app comparison | D | Conversion | M once, refresh quarterly | `/compare` or `/learn/best-apps` |
| 5 | Localised app landing sections (NL/IT/Android) | D | Conversion | S | `/nl/`, `/it/`, `/android` |
| 6 | Plant reference pages (programmatic) | G, B, F | Long tail | L to build, then automatic | `/plants/[slug]` |
| 7 | Seasonal month pages | F | Recurring awareness | M + data | `/learn/in-season/[month]` |
| 8 | Challenge / "with friends" landing | H | Conversion (our wedge) | M | `/challenge` |
| 9 | Shareable week pages & OG images | H | Word of mouth | M | `/u/[username]`, dynamic OG |
| 10 | Off-site: directories, forums, AI-search presence | D | Conversion + authority | ongoing S | external |

## 1. Learn pillar & cluster articles (exists: expand)
- **What:** The `/learn` hub already has pillar `plant-diversity` and cluster
  `what-counts-as-a-plant`. Six clusters are already specified in the
  `content-creation:create-learn-issues` skill (what counts, gut microbiome, science origin,
  gut-brain, how to hit 30, herbs & spices). Only one is written.
- **Fix first:** bodies are ~300 words EN / ~200 words NL & IT and FAQs exist only in EN. Page-1
  competitors run 1,200–2,500 words with FAQ. Expand before adding new ones.
- **Strategy check:** allowed on the website (see principle 1 in [[seo-overview]]); keep the tone
  "honest explainer", not "microbiome lecture". Cite DOIs (the schema already supports
  `sd_citations`).
- **Next pillars (P2/P3):** "Fibre diversity, not fibre quantity" (rides the 2026 trend);
  "Eating 30 plants on a budget / in the Netherlands / in Italy".

## 2. "What counts" hub + one ruling per food (P1, biggest lever)
- **What:** A hub page ("Does it count? The complete list") plus ~30 short ruling pages or
  anchored sections: *coffee, tea, dark chocolate, olive oil, potatoes, bread/pasta, hummus,
  mixed beans, mixed nuts, peanut butter, popcorn, juice, frozen/tinned, colour variants, tofu,
  oat milk, mushrooms, seaweed, ferments, smoothies* (full seed list in
  [[seo-keyword-strategy]]).
- **Template (per ruling):** one-line verdict → 2–3 sentence reasoning → "how we count it in
  Project Food" (ties to our 7 categories; mushrooms and ferments get an honest note) →
  FAQ (2–3 Q&A, feeds `FAQPage` schema) → "Log it" CTA.
- **Why it wins:** question-shaped, snippet-friendly, AI-citable, and every visitor is already
  tracking or about to. Three languages, cheap to produce, and no one owns it.
- **Structured data:** `FAQPage` + `Article` (already implemented for clusters).

## 3. Checklist page + printable PDF (P1)
- **What:** A web checklist of ~100 common plants grouped by our categories, with a free PDF
  (no email gate: the gate is "or track it in the app instead"). NL and IT versions.
- **Why:** "30 plants a week checklist / printable / lijst" is proven demand (Etsy sellers,
  dietitian PDFs rank). The PDF earns links from bloggers and dietitians.
- **Strategy check:** Pillar 3 says "tap as you eat", so the page's message is "print it if you
  like paper; the app remembers for you". Fine.

## 4. Honest app comparison (P1)
- **What:** "Best apps to track 30 plants a week (2026)": Eating30, Plant Points, Clove, 30Veg,
  Thirty Plants, ZOE, Project Food. Feature matrix (platform, price, plant count, barcode/voice,
  social, Android/web, languages). Say plainly where others are stronger.
- **Why:** app-intent traffic converts; small sites already rank for it; AI assistants cite
  comparison tables when asked "which app should I use".
- **Rules:** update quarterly, date it, disclose it is written by us. Google's review-content
  guidance rewards first-hand testing, so actually use the apps.

## 5. Localised app landing sections (P1, small)
- **What:** Add a short indexable section to the NL and IT home pages that literally answers
  "30 planten per week app (gratis, ook op Android)" / "app 30 vegetali a settimana", plus an
  `/android` (and `/pwa`) page explaining install on Android/iPhone.
- **Why:** these queries have no web competition; the current hero copy never says "app",
  "gratis", "Android" or "vegetali".
- **Also:** add `SoftwareApplication` schema ([[seo-technical-audit]]).

## 6. Plant reference pages, programmatic (P2/P3, the compounding asset)
- **What:** `/[locale]/plants/[slug]` for the 224 active plants: name in three languages,
  aliases, category, botanical family, colour, "counts as 1 plant", season months, image,
  related plants (same family/category), the ruling if it is an edge case, "log it" CTA.
- **Why:** entity pages are what LLMs and Google both like; no tracker exposes its DB; the
  seasonal and alias data make each page genuinely distinct.
- **Quality gates (do not index a page until it passes):**
  1. ≥150 words of *plant-specific* prose (how it is eaten, season, one useful fact),
     generated once and human-reviewed, not templated boilerplate.
  2. At least one unique data point beyond the name (season, family, alias, edge-case ruling).
  3. Internal links in and out (category hub, seasonal month, related plants).
  4. Start with the 39 seasonal plants and the ~30 edge cases; hold the rest as `noindex`
     until they clear the bar.
- **Risk:** 672 thin pages would look like doorway spam. The gates are the answer.

## 7. Seasonal month pages (P2)
- **What:** "30 plants in season in September (Netherlands)": twelve pages per locale, generated
  from `season_months` and refreshed monthly, with "in season now" featured in the app.
- **Why:** recurring monthly demand; our angle ("hit 30 with what is in season") is unique
  against Milieu Centraal/AH style calendars; also a retention hook ("Sunday gets harder",
  [[concept-stickiness-moat]]).
- **Data gap:** only 39 of 224 plants carry season data. Fill it for at least the fruit and
  vegetable categories first.

## 8. Challenge / "with friends" landing (P1)
- **What:** `/challenge`: "Do the 30 plants challenge with friends": how it works, a 4-week
  structure, invite flow, leaderboard screenshot. NL version timed against the MDL Fonds June
  challenge; offer it as the companion app.
- **Why:** the only cluster where we are the natural answer ([[concept-word-of-mouth]],
  [[concept-engagement-drivers]]: friends ≈ 2× engagement), and "challenge" is a rising NL query.

## 9. Shareable week pages & OG images (P2)
- **What:** Public profile pages (`/u/[username]`, already exist but client-rendered) and a
  "my 30/30 week" share card with a dynamic Open Graph image.
- **Why:** not search volume, but the "30/30 week" is the deck's screenshot-worthy moment; a
  link that unfurls with a real image travels further than a screenshot. Decide indexability
  in [[seo-technical-audit]].

## 10. Off-site presence (ongoing)
- Directories and comparison articles (nobigapps, AlternativeTo, Product Hunt), forum answers
  where the question is asked, dietitian and Substack outreach, MDL Fonds partnership. See
  [[seo-serp-landscape]]. This is what makes AI assistants recommend us: they cite lists and
  directories, not home pages.
- **GEO basics on-site:** every page states plainly what Project Food is ("a free web app to
  track 30 plants a week with friends, EN/NL/IT, Android and iPhone"), FAQ blocks with direct
  answers, dated and attributed articles, and an `llms.txt` at the root summarising the site.

## What we will not build for SEO (and why)
- **A recipe library.** Explicit `STRATEGY.md` non-goal; huge content cost; undifferentiated.
  "30 plants meal plan" demand is served with a *weekly plan* page built from categories and
  swaps, not recipes. The current `/recipes` placeholder should go ([[seo-technical-audit]]).
- **Microbiome deep-science content beyond the pillars.** ZOE owns it; against Pillar 1's
  spirit; not our audience ([[persona-believer]] wants a simple way to act, not a course).

## Related pages
- [[seo-overview]] · [[seo-keyword-strategy]] · [[seo-serp-landscape]] ·
  [[seo-technical-audit]] · [[seo-roadmap]] · [[concept-brand-pillars]] ·
  [[concept-word-of-mouth]] · [[concept-stickiness-moat]]
