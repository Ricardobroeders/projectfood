---
title: Germany comes before France, and sooner
type: decision
tags: [decision, market, localisation, seo, germany]
created: 2026-10-12
updated: 2026-10-12
date: 2026-10-12
status: accepted
sources: [source-research-market-size-2026-10.md]
---

# Germany comes before France, and sooner

**Date:** 2026-10-12  **Status:** accepted (Ricardo asked for Germany sooner; the placement is
Claude's proposal, which Ricardo can move)

## Context
The de/fr gate of 2026-09-23 ([[seo-site-architecture]], "Proven") kept German and French
together and behind the April 2027 column of the Dutch KPIs. The market research of 2026-10-12
([[source-research-market-size-2026-10]]) split them: Germany has 3.0 million adults aged 25
to 54 who already pay for a health or fitness app (9.6%, the second highest share after the
Netherlands), France 1.0 million (3.8%). Ricardo, the same day: get Germany in sooner rather than
later, because there we will depend more on search than in the Netherlands, where partners and
the founder's network carry the launch. Search takes three to six months to rank, so the
German pages have to start before the German app is needed.

What exists: the app has a `de` locale with 5 of 365 strings; plant names and facts exist in
en, nl and it only; the website routes en, nl and it.

## Decision
1. **German comes before French.** French keeps the original gate (the April 2027 Dutch
   column), and now also waits until German is live.
2. **German starts right after both stores are live and the Product Hunt launch (1 November
   2026)**, in three steps:
   - **Step 1, from November 2026: the German search base.** Ricardo runs the Semrush seeds for
     pillar 3 (healthy eating habits) and pillar 1 (children and vegetables) in Germany; Claude
     builds the `/de` website shell (home, About, privacy, an Impressum, hreflang) and queues the
     German learn articles for the nightly routine, pillar 3 first. German law requires an
     Impressum on the site; the Dutch site has none today.
   - **Step 2, in parallel: the app in German.** The 360 missing app strings, the plant names
     and the card facts and tips in German, written natively; the address form decided first
     (du, as Yazio and most German consumer apps use, is Claude's proposal). Ships over the air;
     the German store listings (Play and App Store, German screenshots from Ricardo's Figma)
     follow.
   - **Step 3, early 2027: the German launch.** Store listings live, the learn pages indexed,
     the Product Hunt and directory profiles updated with German.
3. **The Netherlands stays the first market.** German work fits around the Dutch launch and
   never takes line 1 of the one thing; Claude's side of steps 1 and 2 is the work for days when
   the Dutch line waits on a review or a clock.

## Rationale
- Revenue: the German paying pool is 3.3 times the Dutch one, at a net of about €28.56 per
  annual payer (19% VAT, 15% store commission).
- Search lead time: pages written in December rank by spring; pages written at launch rank by
  summer.
- Cost: the routine writes one article a night; translation of app strings and plant facts is
  Claude's work, not a hire.

## Alternatives considered
- Keep the 2026-09-23 gate (de and fr together after April 2027): loses six months of German
  search for no gain.
- German before the Dutch launch: splits the founder's attention during the stores' first
  weeks, against the one thing.
- Italy deeper first: Italy is live, but its paying pool is 0.61 million at 2.8%; it stays a reach
  market ([[source-research-market-size-2026-10]] section 4).

## Consequences
- [[seo-site-architecture]] "Proven" gate amended: it now holds for French only.
- [[strategy-backlog]]: Claude's build step 30 (German), Ricardo's decisions (address form,
  Semrush DE seeds), row 10 next step.
- Brand voice: German address form joins row 8's open DE/FR question; [[brand-voice]] gets a
  German section when step 2 starts.
- The company deck's roadmap names Germany under Next.

## Related pages
- [[source-research-market-size-2026-10]] · [[seo-site-architecture]] · [[seo-roadmap]] ·
  [[strategy-backlog]] · [[concept-business-model]]
