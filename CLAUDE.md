# Project Food — repo guide for Claude

Solo founder: Ricardo Broeders. The product is a family app (parent's phone, kid taps, cards
unlock on tasting), built greenfield on Expo + Supabase since 2026-09-07. Read this file first,
then the memory index; open the knowledge base when the work touches product or strategy.

## Layout
- `projectfood-mobile/` — the Expo SDK 57 + TypeScript app (Expo Router in `src/app`).
  Run: `cd projectfood-mobile && npx expo start --lan` (Expo Go on Ricardo's OnePlus).
  Design rules live in code: `src/constants/theme.ts` (tokens, `radiusFor`, `iconFor`, accent
  switch via `EXPO_PUBLIC_ACCENT`) and `src/constants/motion.ts` (motion classes).
- `projectfood-app/` — the legacy Next.js PWA (adult "30 plants" tracker). Marketing site only
  from here on; do not extend the PWA.
- `knowledge-base-general/` — the knowledge hub (LLM wiki). Its own `CLAUDE.md` is the schema;
  read it before writing there. The app spec is `wiki/decision-2026-09-07-app-v1-scope.md` plus
  `wiki/concept-retention-loop.md`. Undecided ideas: `wiki/strategy-backlog.md`.
- `design-library/` — gitignored, local only; its README holds the family-mode re-brief.

## "What's next?" protocol
When Ricardo asks what to pick up next (any phrasing: what's next, to-do list, where were we,
what's open):
1. Read `knowledge-base-general/wiki/strategy-backlog.md`: first the "Next to pick up" section,
   then the Summary table.
2. Read the Linear project "Family app v1" (team Project Food, key PF) through the Linear MCP
   for execution state.
3. Answer in one screen: Ricardo's open decisions first, then Claude's next build step, then
   blocked items and why.
4. After any session that changes priorities, update "Next to pick up" in the backlog before
   ending.

## Working rules
- Git: `main` only, no feature branches. Commit and push when a piece of work is done.
- Strategy topics (value proposition, brand, personas, retention, achievements, SEO, social,
  tone of voice, business model, market, KPIs, …): end the conversation by updating the
  topic's row in the strategy backlog (status, holdings, open question, next step, date).
  A decision becomes a `decision-` page in the KB.
- Design taste: minimal but noticeable. Grey surfaces on white, no drop shadows, radius by
  height, named motion classes, only rewards bounce. Plants are 3D clay renders; other imagery
  animates in Rive.
- Decided, do not re-open: Expo over Flutter, Supabase-only backend, no PWA parity, five
  locales (en/nl/it/de/fr), RevenueCat for payments.
