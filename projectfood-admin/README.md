# projectfood-admin

Internal tools for Project Food, local only for now (Ricardo, 2026-10-09: try it on localhost
first; going online at admin.projectfood.dev is a later decision, item 29 in the backlog). Today:
the asset pipeline, as a browser page and as a terminal command over the same queue. Later on the
same shell: the SEO backlog and customer-journey mapping.

Only two services are involved: Supabase (the queue table and Storage) and OpenAI (gpt-image-1,
the key the site already uses). No spreadsheet, no n8n.

## Run it

```bash
cd projectfood-admin
npm install          # once
npm run dev          # http://127.0.0.1:3100
```

Secrets are read from `projectfood-admin/.env` or, when that file is absent, from
`../projectfood-app/.env.local` (Supabase URL, service role key, OpenAI key). Nothing is copied
and nothing is committed. The server binds to 127.0.0.1 only, so there is no login.

## Pages

- **Assets**: the queue. Add a job (kind, key, description for manual kinds, quality), open its
  prompt to edit it before running, press Run, see the renders in the Done grid.
- **Asset settings**: the kinds, one per flow. A kind is the data of one old n8n lane: where inputs come from (the plants
  table or a typed description), the prompt template with `{{placeholders}}` and a live preview,
  bucket and file name pattern, default quality, model, background, and whether to write
  `plants.image_url` when done. Edit a prompt, create a kind as a copy of another, delete one that
  has no jobs. The steps (inputs → prompt → image → upload → done) are fixed in `lib/pipeline.js`;
  a new image type is a new row, not new code.
- SEO backlog and Journey map: in the sidebar, not built yet (item 29c and 29d).

Styling follows the brand book (`wiki/brand/brand-design.md`): white page, warm grey surfaces,
ink text, marigold accent, Plus Jakarta Sans, radius by height, no shadows.

## The asset queue

Replaced the n8n "Content creation workflow" on 2026-10-09. The four kinds were seeded from it
verbatim (migration `20261009140000_asset_kinds.sql`), so new renders sit in the family of the
existing ones.

| kind | input | file | default quality |
|---|---|---|---|
| plant | plant slug (name, category, subcategory, family read from `plants`) | `food-images/<slug>.png`, then `plants.image_url` is set | medium |
| gold | plant slug | `food-images/gold/<slug>.png` (build-assets picks it up by slug) | medium |
| achievement | achievement id + description | `achievements/achievement-<id>.png` | high |
| ui | file name + description | `images/app-ui-images/<name>.png` | high |

Run sends one job per request, about 15 to 60 seconds each, and the page refreshes as they land.
Again queues the same render once more with the kind's current prompt, Retry puts a failed job
back, Remove or Hide drops the row (the file stays).

In the terminal, over the same queue:

```bash
npm run assets -- add plant kohlrabi           # the plant must exist in public.plants first
npm run assets -- add gold kohlrabi
npm run assets -- add achievement 23 "a bronze trophy cup shaped like a carrot"
npm run assets -- add ui streak-flame "a small friendly orange flame"
npm run assets -- scan-plants                  # queues every active plant without image_url
npm run assets -- list                         # the queue, with the cost of what is pending
npm run assets -- run --dry                    # prints the resolved prompts, no API calls
npm run assets -- run                          # drains the queue, oldest first (--limit N)
npm run assets -- retry <job-id>
```

Notes
- Quality low is for pipeline tests only (about one cent); transparent backgrounds come out
  unreliable at low. Medium is about four cents, high about seventeen.
- A job is a row in `public.asset_jobs`, a kind a row in `public.asset_kinds` (migrations
  `20261009120000_asset_jobs.sql` and `20261009140000_asset_kinds.sql`, service role only). One
  open job per asset; a done or failed one can be queued again.
- Never run `npm run build` while `npm run dev` is up: both write `.next/` and the dev server
  starts answering 500 until restarted.
- Mobile bundles renders at build time: after new plant or gold renders, run
  `node scripts/build-assets.mjs` in `projectfood-mobile` and ship with the next build or OTA.
- The website's 128 px plant thumbnails come from the `/image-updater` routine, unchanged.
- If this ever goes online: add Supabase auth with an admin allow-list before deploying, and move
  the two secrets into that Vercel project.
