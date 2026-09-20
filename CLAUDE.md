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
2. Answer in one screen: Ricardo's open decisions first, then Claude's next build step, then
   the brainstorms to hold, then blocked items and why.
3. After any session that changes priorities, update "Next to pick up" in the backlog before
   ending.

There is no external tracker: Linear was dropped on 2026-09-20. The backlog's "Next to pick up"
is the only to-do list; do not look for or reference Linear issues.

How the backlog is organised (since 2026-09-20), so every session reads it the same way:
- "Next to pick up" is the one to-do list, in three parts: **Ricardo's decisions and accounts**
  (only he can do these), **Claude's next build steps** (ordered), **Brainstorms to hold**
  (topics to think through together; each names the ideas it will take and its outcome).
- "Parking lot: ideas, not to-dos" holds raw ideas Ricardo drops (e.g. Golden Sprouts, a fact
  per card level). An idea goes there with its date, the rows it touches and the brainstorm item
  that will challenge it. It is not a task until a brainstorm turns it into a decision page plus
  build steps on the list, at which point it leaves the parking lot.
- The Summary table is one row per strategy topic (status, next step); topic detail sections
  follow. When Ricardo drops an idea mid-conversation: parking lot + a note in the topic's row.
  When he asks for a to-do: the right part of "Next to pick up".

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
