---
title: SEO — App Store & Google Play (ASO) for the native launch
type: seo
tags: [seo, aso, app-store, family-mode]
created: 2026-09-06
updated: 2026-09-06
sources: [source-family-mode-context.md, seo-serp-landscape.md]
---

# SEO — App Store & Google Play (ASO) for the native launch

**In one line:** With native iOS/Android decided (D1), the App Store listing becomes the
primary conversion surface: it is what gets pasted into a class WhatsApp group. Get the
listing right in NL, IT and EN before anyone links to it; store search is a bonus, not the
plan.

## What the listing has to do
1. Convert a parent who arrives from a shared link in under 20 seconds (screenshots do this).
2. Read as a **family** app on the parent's phone, never a kids' app (no Kids Category, rated
   4+; file §3.3).
3. Be findable for the few store searches that matter per language.

## Metadata plan (draft, validate with a store keyword tool before submission)
| Field | EN | NL | IT |
|---|---|---|---|
| Name (30) | Project Food: Family Plants | Project Food: Planten Gezin | Project Food: Piante Famiglia |
| Subtitle (30) | Kids taste, family collects | Kinderen proeven, gezin telt | I bimbi assaggiano, insieme |
| Keywords (100, no repeats of name/subtitle) | picky eater,vegetables,kids food,tasting,30 plants,cards,dinner,healthy eating,challenge,class | kind groente,moeilijke eter,proeven,30 planten,gezin,kaarten,avondeten,gezond eten,schoolfruit,klas | bambini verdura,neofobia,assaggiare,30 vegetali,famiglia,carte,cena,mangiare sano,scuola,classe |
| Category | Health & Fitness (primary), Food & Drink (secondary) | same | same |
| Age rating | 4+ (not Kids Category) | | |

Notes: Apple indexes name + subtitle + keyword field per locale and ignores duplicates; the
NL and IT locales must be real local keyword research, not translations. On Google Play the
long description is indexed, so the NL/IT descriptions carry the parent-problem phrasing
("kind lust geen groente") naturally, once.

## Screenshots (the real ranking factor for conversion)
1. Kid's finger tapping a plant on the parent's phone, card flips to "unlocked".
2. The family ring: "17 of 30 this week, together".
3. Class milestone: "Our class ate 100 different plants".
4. The Sunday advice: "3 plants you have not had in 3 weeks, and how to serve them".
5. Privacy frame: "One account. Your phone. No child profiles online."
Captions in the parent's voice, localised. No child faces.

## Ratings & reviews
- Ask for a rating only after a **card unlock** or a **family 30**, never at onboarding and
  never after a notification (mirrors D9 for push permission).
- Reply to every review in the reviewer's language.

## Web ↔ store plumbing (see [[seo-technical-audit]])
- Smart App Banner (`apple-itunes-app` meta) and Google Play install prompts on the marketing
  site once the apps exist.
- **Universal Links / App Links** for class invites: a `/klas/<code>` link must open the app if
  installed, else the store, else the web fallback. This is the class channel's plumbing.
- `SoftwareApplication` JSON-LD with both store URLs; App Store badges in the hero.
- Deep-link the share cards (milestone, card unlock) to the same handler.

## Measurement
- App Store Connect / Play Console: impressions → product page views → installs, by source
  (web referrer vs store search vs direct link). The **direct-link conversion rate** is the
  class-channel KPI.
- Per-class UTM/referral code on the invite link so replication in a second class is
  measurable (file §6 sequence).

## Related pages
- [[seo-overview]] · [[seo-keyword-strategy]] · [[seo-content-types]] · [[seo-technical-audit]] ·
  [[seo-roadmap]] · [[decision-2026-09-06-family-mode-pivot]]
