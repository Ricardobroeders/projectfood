# Project Food — Claude working instructions

## Workflow

- After completing a task, commit the changes with a clear commit message.
- **Do not push.** Ricardo pushes manually and decides when to deploy (later via Vercel).
- When there is a dev server running and the change is testable in the browser, verify it before committing.

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
