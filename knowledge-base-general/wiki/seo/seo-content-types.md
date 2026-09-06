---
title: SEO — content types for family mode
type: seo
tags: [seo, content, marketing, family-mode]
created: 2026-09-06
updated: 2026-09-06
sources: [source-family-mode-context.md, seo-keyword-strategy.md, seo-serp-landscape.md, concept-brand-pillars.md]
---

# SEO — content types for family mode

**In one line:** Nine formats, each tied to a loop moment (dinner, groceries, class), a keyword
cluster, and a pillar check. The two link magnets are **printable plant cards** and the
**class challenge kit**, because those are what a parent or teacher actually forwards. Content
volume stays small until the class channel is proven.

## Summary table
| # | Format | Clusters | Loop moment | Effort | Phase |
|---|---|---|---|---|---|
| 1 | Parent landing page + App Store badges | B, A | Conversion (WhatsApp click) | M once | 0–1 |
| 2 | Class challenge page + kit | S | Class channel | M | 1 (Nov) |
| 3 | Printable plant cards + tasting chart | T, M | Dinner / fridge | M once | 1 |
| 4 | "Learn to eat everything" pillar + method articles | P, M | Dinner | M each | 1–2 (NL first) |
| 5 | Schoolfruit companion pages (NL, IT) | S | Class channel, seasonal by calendar not by produce | S | 1 |
| 6 | Honest app comparison ("game, not therapy") | A | Conversion | M, quarterly refresh | 2 |
| 7 | Plant card pages (programmatic, gated) | T, W | Long tail + GEO | L | 3 |
| 8 | Family 30 + "what counts" (legacy asset) | W | Groceries | S–M | 2–3 |
| 9 | Off-site & shareable artefacts | all | Word of mouth | ongoing S | 1+ |

## 1. Parent landing page + App Store badges (Phase 0–1)
- **What:** The home page rewritten for the parent who arrives from a class WhatsApp group:
  one sentence ("Your kids tap what they ate at dinner. The family collects 30 plants a week.
  Together."), three screenshots (kid unlocking a card, family ring, class milestone), App
  Store + Google Play badges, "free for families", languages. Below the fold: how it works in
  three steps, the tasting science in two sentences (no health claims), FAQ (age, privacy,
  "is it a kids app?": no, it is the parent's phone).
- **Until native ships:** same page with "Coming to the App Store" and a WhatsApp-friendly
  share link; the PWA stays as the fallback for the five-family cohort.
- **Pillar check:** Joy not guilt in every headline; no "fix your picky eater".

## 2. Class challenge page + kit (Phase 1, live before the November pilot)
- **What:** `/klas` (`/class`, `/classe`): how a class challenge works (one parent starts it,
  households join by link, the class collects plants together, milestones at 50/100/150
  different plants, no per-child ranking), a printable A4 poster for the classroom door, a
  WhatsApp message template, and the shareable milestone card.
- **Why:** this *is* the launch channel (file §6). The page must be forwardable, not rankable.
  Ranking for "klas challenge gezond eten" is a bonus.
- **Rules from the decisions:** collective milestones only (D6); asynchronous between
  households (D5); no child names or photos on any public artefact.

## 3. Printable plant cards + tasting chart (Phase 1, the link magnet)
- **What:** A free PDF set of the 3D clay-render plant cards (start with ~40 common veg and
  fruit), a "proefkaart" tasting chart (tick a box per taste, 10–15 boxes, sticker-sized), and a
  veg bingo. NL, IT, EN.
- **Why:** proven demand (gratisbeloningskaart.nl, Pinterest, Sterk & Zoet) with clip-art
  quality on page 1; our renders are the best-looking version by far; the physical card mirrors
  the in-app unlock (D8), so the PDF *is* the onboarding.
- **Science note on the page:** rewards work when they reward *tasting* (Tiny Tastes, Food
  Dudes), not clean plates. Say it in one line, cite it, move on.
- **Asset reuse:** the `food-images` bucket and the n8n image pipeline already exist.

## 4. "Learn to eat everything" pillar + method articles (Phase 1–2, NL first)
- **Pillar:** "Kind lust geen groente? Zo leert een kind alles eten (zonder strijd)": the
  cornerstone NL article. Behavioural, honest, warm. Structure: why kids refuse (neophobia is
  normal, 2–6 y), what the research says (10–15 tastes; taste beats look; rewards for tasting;
  peer modelling), what backfires (pressure, dessert bribes, clean-plate rule, sibling
  competition), the dinner-table question ritual, a tasting chart, FAQ. 1,500+ words.
- **Method clusters:** "Hoe vaak moet een kind iets proeven?" · "Belonen voor proeven: wat
  werkt en wat niet" · "Voedselneofobie: normaal, en zo ga je ermee om" · "De ene vraag die het
  avondeten verandert" (what did you eat today) · "Schoolfruit weken: thuis meedoen".
- **Voice rules:** no diagnoses, no medical outcomes, no "your child should". When a case is
  clearly clinical, point to JGZ / pediatrician / a dietitian (Spoony, Kieskeurige Eters).
- **Then IT** (neofobia alimentare vocabulary), **then EN**.
- **What happens to the existing adult learn hub:** keep the two articles live and dated; do
  not write the planned gut-brain/mood cluster (health claim); the "what counts" cluster moves
  to format 8.

## 5. Schoolfruit companion pages (Phase 1)
- **What:** "EU-Schoolfruit: zo doe je thuis mee" (NL) and "Frutta e verdura nelle scuole: a
  casa" (IT): the calendar (NL 9 Nov 2026 – 16 Apr 2027), what the kids get at school, the
  one question to ask at pick-up, how the class challenge fits, printable chart.
- **Why:** this is the *only* seasonal content we make, and it is seasonal by calendar, not by
  produce, so it respects D12 while riding a real institutional cycle. Every participating
  class is a pre-warmed audience.

## 6. Honest app comparison (Phase 2)
- **What:** "Apps that help kids try vegetables: a parent's comparison" (and NL/IT): Teach
  Your Monster, Yummi, EatPal, Food Explorer Club, Food Hopper, Spoony (offline), Project Food.
  Columns: who holds the phone, reward model (extrinsic shop vs intrinsic cards), family vs
  single child, therapy vs game, price, languages, Android.
- **Rules:** test each app first; disclose authorship; update quarterly; be generous about
  Teach Your Monster (free, research-backed).

## 7. Plant card pages, programmatic and gated (Phase 3)
- **What:** `/[locale]/plants/[slug]` reframed as the **card**: image, name in three languages,
  one kid-level fun fact, "how families serve it so kids will taste it" (two sentences), counts
  as one plant, related cards, "collect it in the app". Later, anonymous aggregate stats from
  our own data ("tasted by 1,200 kids", the proprietary-data moat).
- **Quality gates (unchanged):** ≥150 words of plant-specific prose, ≥1 unique data point,
  internal links both ways, start with ~40 common plants, hold the rest as `noindex`.
- **Privacy gate:** aggregates only, minimum group sizes, never per-household.

## 8. Family 30 + "what counts" (Phase 2–3, legacy asset)
- **What:** "30 plants a week as a family: how the count works when four people eat" plus the
  "does it count?" hub (ketchup, coffee for parents, chocolate, potatoes, bread, mixed beans)
  in three languages. Grocery-moment content: what the family has not had in three weeks
  mirrors the paid advice (D11) without giving it away.
- **Why keep it:** still the most searched question in the adult niche, still unowned, parents
  ask it too, and it feeds the AI-search answers for "what counts".

## 9. Off-site & shareable artefacts (ongoing)
- Class milestone card, card-unlock share image, class poster: each with a dynamic OG image
  so the link unfurls in WhatsApp. This is the word-of-mouth container (D6, D8).
- Directories and communities: see [[seo-serp-landscape]]. GEO: monthly probe of AI assistants
  in three languages; make sure the comparison page and directories carry us.

## What we will not build
- **Recipes.** Non-goal; AI suggestions tied to gaps only.
- **Seasonal produce calendars.** D12: texture inside advice, not a theme.
- **Medical picky-eating content** (ARFID, sensory feeding therapy). Refer out.
- **Anything that names or pictures a child.** Households and classes only.
- **Adult gut-science expansion.** Keep what exists, dated; no new pillars.

## Related pages
- [[seo-overview]] · [[seo-keyword-strategy]] · [[seo-serp-landscape]] · [[seo-app-store-aso]] ·
  [[seo-technical-audit]] · [[seo-roadmap]] · [[concept-brand-pillars]] ·
  [[concept-word-of-mouth]] · [[decision-2026-09-06-family-mode-pivot]]
