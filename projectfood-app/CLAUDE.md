# Project Food — Claude working instructions

## Task management

Tasks are tracked in Linear under the **Project Food** team (key: `PF`).

- When starting a session or picking up new work, check Linear for current issues
- Check **In Progress** first (resume existing work), then **Todo** (pick up next item)
- You can reference an issue by number (e.g. `PF-5`) or say "pick up the next todo"
- Do not maintain a local to-do file — Linear is the single source of truth

## Workflow

Work directly on `main`. No feature branches for now: this is a one-person project and Vercel
keeps a deployment per commit with instant rollback, so branches only add ceremony
(decided 2026-09-06; revisit if a second contributor joins).

1. **Implement** — make the change and run whatever check applies (`npm run build`, a quick local test).
2. **Commit** — one commit per task on `main`, conventional-commit style (`feat(...)`, `fix(...)`, `docs(...)`).
3. **Push** — push right after committing. Every push to `main` deploys to production on Vercel; tell Ricardo when it is live.
4. **Linear** — if the task belongs to a Linear issue, mark it Done after the push.

Rollback: Vercel → instant rollback to the previous deployment, or `git revert` + push.
Flag risky changes (DB migrations, auth, billing) before pushing, not after.

## Stack

- Next.js 15 (not 16 — 16 had redirect loop bugs with Turbopack)
- Tailwind CSS v4 + shadcn/ui
- Supabase (Postgres + Auth + RLS) — project ref `lkmfmdehysmbstnfdbyg`
- Deploy: Vercel — monorepo root is the git repo, **Vercel Root Directory must be set to `projectfood-app`**

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
