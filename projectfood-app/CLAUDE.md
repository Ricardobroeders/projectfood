# Project Food — Claude working instructions

## Task management

Tasks are tracked in Linear under the **Project Food** team (key: `PF`).

- When starting a session or picking up new work, check Linear for current issues
- Check **In Progress** first (resume existing work), then **Todo** (pick up next item)
- You can reference an issue by number (e.g. `PF-5`) or say "pick up the next todo"
- Do not maintain a local to-do file — Linear is the single source of truth

## Workflow

Each task is implemented on a dedicated feature branch (named after the Linear issue, e.g. `rico/pf-7-...`).

1. **Implement** — work on the feature branch, commit when done.
2. **Test locally** — Ricardo tests the branch locally before anything is pushed.
3. **Merge** — once Ricardo confirms it looks good ("looks good", "ship it", etc.), Claude:
   - Pushes the branch to origin
   - Merges it into `main` (fast-forward)
   - Deletes the remote and local feature branch
   - Marks the Linear issue as Done

Do not push or merge without explicit confirmation from Ricardo.

## Stack

- Next.js 15 (not 16 — 16 had redirect loop bugs with Turbopack)
- Tailwind CSS v4 + shadcn/ui
- Supabase (Postgres + Auth + RLS) — project ref `lkmfmdehysmbstnfdbyg`
- Deploy target: Vercel (not yet connected)

## Key decisions

- **No next-pwa** — incompatible with Next.js 15. PWA via manifest.json + meta tags only.
- **Login page is a Client Component** — avoids server component / redirect conflicts.
- `logged_on` is client-computed (YYYY-MM-DD via `toLocaleDateString('en-CA')`) to avoid timezone-bucket issues.
- `plant_logs` is append-only; fix mistakes by delete + re-insert.
- All app pages are Client Components using SWR for instant cached navigation; no server pages in `(app)/`.
- `user_id` must be passed explicitly on `plant_logs` inserts (no column default; required by RLS).

## Translations

The app has three locales: **en**, **nl**, **it** — files in `messages/`. When adding or changing any user-facing string, always update all three files. Never add a key to one locale without adding it to the others.

## Design system

Tokens live in `app/globals.css`. Key values:
- Font: Plus Jakarta Sans
- Accent: `#F5C518` (yellow), pressed: `#F59A0E`, soft: `#FBEDB5`
- Bg: `#FFFFFF` (bg1), `#F4EFE8` (bg2 warm cream)
- Ink: `#1F1B16` (fg1), `#6B645C` (fg2), `#A39B91` (fg3)
- Borderless — no visible borders, soft shadows instead
- Radii: sm 12px, md 18px, lg 24px, xl 32px
- Category colors in `lib/cats.ts` — use DB enum values (`vegetable` not `veg`)
