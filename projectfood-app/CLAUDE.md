# Project Food — Claude working instructions

## Task management

The to-do list is "Next to pick up" in `knowledge-base-general/wiki/strategy-backlog.md`
(see the repo-root `CLAUDE.md`). There is no external tracker since 2026-09-20. This app is the
marketing site for projectfood.dev plus the legacy PWA; new product work goes to `projectfood-mobile`.

## Workflow

Work directly on `main`. No feature branches for now: this is a one-person project and Vercel
keeps a deployment per commit with instant rollback, so branches only add ceremony
(decided 2026-09-06; revisit if a second contributor joins).

1. **Implement** — make the change and run whatever check applies (`npm run build`, a quick local test).
2. **Commit** — one commit per task on `main`, conventional-commit style (`feat(...)`, `fix(...)`, `docs(...)`).
3. **Push** — push right after committing. Every push to `main` deploys to production on Vercel; tell Ricardo when it is live.
4. **Backlog** — if the task was on "Next to pick up", tick it off there.

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

## Learn content (projectfood.dev/learn)

Articles are files, the database is the render source. Never edit `learn_articles` /
`learn_article_content` by hand.

- `content/learn/<internal-slug>/article.json` (`type`, `pillar`, `display_order`, `emoji`) and
  `<locale>.md` (YAML front matter + Markdown body) per locale that exists. Front matter: `slug`
  (that locale's public slug), `title`, `subtitle`, `meta_title` (≤ 55, the layout appends
  " | Project Food"), `meta_description` (120 to 155), `keywords`, `related` (two internal slugs),
  `faq` (4 to 6 `q`/`a`), `citations`, optional `draft: true`.
- The internal slug is the folder name and `learn_articles.slug`; public slugs differ per locale
  (`learn_article_content.slug`, migration `20260924120000_learn_locale_slugs`). Pairing for
  pillar 1: `learn-to-eat-everything` = alles-leren-eten / imparare-a-mangiare-tutto;
  `toddler-wont-eat` = peuter-wil-niet-eten / il-bambino-non-mangia; `how-many-times-to-try-a-food`
  = hoe-vaak-proeven; `picky-eater-toddler` = moeilijke-eter / selettivita-alimentare;
  `toddler-wont-eat-vegetables` = peuter-eet-geen-groente (nl only); `vegetables-kids-will-eat` =
  welke-groente-vinden-kinderen-lekker; `hiding-vegetables` = groente-verstoppen (nl only);
  `food-neophobia` = voedselneofobie / neofobia-alimentare.
- `npm run learn:check -- --only <internal>` lints (lengths, FAQ, links, banned words);
  `npm run learn:publish -- --only <internal> [--dry] [--publish]` upserts through PostgREST with
  the service role key and calls `/api/revalidate` when `REVALIDATE_SECRET` is set (Vercel +
  `.env.local`). `--publish` sets `is_published` and `published_at` once; a pillar goes live only
  with at least two clusters in that locale.
- Pages are static (`revalidate = 3600`), read with the anon client, and render the FAQ as a
  visible `<details>` accordion (the FAQPage JSON-LD must match visible content), related cards
  from `related_article_slugs`, a byline with the Person author, and `hasPart` / `isPartOf`.
- Writing an article: the `pf-seo-article` skill (repo root `.claude/skills/`), which loads
  `pf-voice` first.

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
