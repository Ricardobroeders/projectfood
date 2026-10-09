# projectfood-admin

Internal tools for Project Food. Today: the asset pipeline (a script plus a job table). Later: the
admin app at admin.projectfood.dev (decided 2026-09-22: own folder, Supabase auth with an admin
flag) with the asset queue, the SEO backlog, customer-journey mapping and notification campaigns.

## Asset pipeline

Replaced the n8n "Content creation workflow" on 2026-10-09. Same prompts, same buckets, same file
names, so new renders sit in the family of the existing ones.

| kind | input | file | default quality |
|---|---|---|---|
| `plant` | plant slug (name, category, subcategory, family read from `plants`) | `food-images/<slug>.png`, then `plants.image_url` is set | medium |
| `gold` | plant slug | `food-images/gold/<slug>.png` (build-assets picks it up by slug) | medium |
| `achievement` | achievement id + description | `achievements/achievement-<id>.png` | high |
| `ui` | file name + description | `images/app-ui-images/<name>.png` | high |

```bash
cd projectfood-admin && npm install            # once
npm run assets -- add plant kohlrabi           # the plant must exist in public.plants first
npm run assets -- add gold kohlrabi
npm run assets -- add achievement 23 "a bronze trophy cup shaped like a carrot"
npm run assets -- add ui streak-flame "a small friendly orange flame"
npm run assets -- scan-plants                  # queues every active plant without image_url
npm run assets -- list                         # the queue, with the cost of what is pending
npm run assets -- run --dry                    # prints the resolved prompts, no API calls
npm run assets -- run                          # drains the queue, oldest first (--limit N)
npm run assets -- retry <job-id>               # an error row back to pending
```

Secrets come from `projectfood-admin/.env` or, when that file is absent, from
`../projectfood-app/.env.local` (the site already holds the Supabase service role key and the
OpenAI key). Nothing is committed.

Notes
- Quality low is for pipeline tests only (about one cent): transparent backgrounds come out
  unreliable at low. Medium is about four cents, high about seventeen.
- A job is a row in `public.asset_jobs` (migration `supabase/migrations/20261009120000_asset_jobs.sql`,
  service role only). One open job per asset; a done or failed one can be queued again.
- Mobile bundles renders at build time: after new plant or gold renders, run
  `node scripts/build-assets.mjs` in `projectfood-mobile` and ship with the next build or OTA.
- The website's 128 px plant thumbnails come from the `/image-updater` routine, unchanged.
