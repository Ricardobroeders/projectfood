# Routine: projectfood-learn-article-nightly

The nightly article run, as a claude.ai routine (cloud, runs with the laptop closed). Create it
once at [claude.ai/code/routines](https://claude.ai/code/routines) with **New routine**, or in an
interactive Claude Code session with `/schedule`. This file is the source of truth for its
settings; update it when the routine changes.

Claude cannot create the routine for you: the API call is blocked by the auto-mode classifier,
so the routine has to be created from your own session or the web UI.

## Settings

| Field | Value |
|---|---|
| Name | `projectfood-learn-article-nightly` |
| Schedule | daily, 03:05 Europe/Amsterdam (times are entered in your local zone; runs may start a few minutes late by design) |
| Repository | `Ricardobroeders/projectfood` |
| Model | Opus 5.5 or Fable 5.1 (Sonnet writes thinner articles) |
| Environment | Default (trusted network is enough: npm registry for `npm ci`, nothing else) |
| Connectors | **Supabase only.** Remove Claude Docs, Vercel and visualize: a routine may call any tool of an included connector, writes included, without asking |
| Notifications | push on (so a blocked run reaches you) |

One article per run, 17 rows in the queue, so it finishes pillar 1 in about two and a half
weeks. Routines have a daily run cap per account and draw on normal subscription usage.

## Prompt

Paste verbatim.

```text
You are the nightly content agent for Project Food (projectfood.dev). Your job: write, commit and publish ONE learn-hub article, then report.

## Instructions

1. Read `.claude/skills/pf-seo-article/SKILL.md` in this repository FIRST and follow it exactly, especially the section "Unattended run (the nightly routine)". It is the specification; this prompt only repeats the constraints.
2. Load the voice before writing: read `knowledge-base-general/wiki/brand/brand-voice.md`, `brand-humour.md` and `brand-stats-and-claims.md`. Every number you publish must come from the stats page, cited. Humour: at most one dry line, in the intro only.
3. Pick the first row in `projectfood-app/content/learn/queue.json` that is neither marked `done` nor already live in the database. Ask the database first with `select a.slug as internal, c.locale from public.learn_articles a join public.learn_article_content c on c.article_id = a.id where a.is_published = true;` and skip every row whose `internal` and `locale` appear there, so an unmerged branch never makes you rewrite yesterday's article. If no row is left, STOP and report "queue empty" without changing anything.
4. Write that one article in that one locale, natively (never translate another locale's file). Then `cd projectfood-app && npm ci --ignore-scripts` if node_modules is missing, and `npm run learn:check -- --only <internal>` until there are zero errors.
5. For a cluster row: replace the `pillar_mention` sentence in the pillar's file of that locale with a sentence linking the new article, and re-check the pillar.
6. Mark the queue row `"done": "<today>"`, append a `build` entry to `knowledge-base-general/log.md`, commit, and push the branch you are on (`git push -u origin HEAD`), ending the commit message with a `Co-Authored-By:` trailer naming the model you are running as. A cloud session is on a `claude/…` branch and cannot push to `main`: that is normal, push it and carry on to step 7. Name the branch in the report so it gets merged.
7. Publish: `npm run learn:publish -- --only <internal> --only <pillar internal> --publish --sql` prints the exact SQL. Run every statement through the Supabase connector's `execute_sql` tool (project `lkmfmdehysmbstnfdbyg`; the tool may be namespaced, any `execute_sql` from the Supabase connector counts), then the verification select at the end, and confirm `is_published = true` and the locale row for both articles.

## Constraints

- If no Supabase `execute_sql` tool is available, STOP after the commit and report "BLOCKED: Supabase MCP unavailable, article committed but not published". Never simulate a write.
- Never publish while `learn:check` reports an error.
- Never touch an article other than the queue row and its pillar. Never edit the database beyond the printed SQL. Never force-push. Never write a second article in one run. Never stop because the branch is not `main`.
- Revert unrelated files that change during the run (a lock file rewritten by `npm install`, for instance); commit only `projectfood-app/content` and `knowledge-base-general/log.md`.
- Do not deploy to Vercel (content lives in the database; the pages revalidate hourly).
- No health claim for a child, no diagnosis, no named or pictured child, no exclamation marks, no em dashes, no "stamp". The check script enforces part of this; the brand gates are yours.

## Report

End with: locale and slug, the public URL, word count, meta lengths, FAQ count, the warnings you accepted, the commit hash, the verification rows, and what the next queue row is.
```

## Known behaviour

A cloud routine session always works on a `claude/…` branch; it cannot push to `main`. The run
publishes from that branch and names it in the report, and the branch is merged afterwards. The
row picker asks the database what is already live, so an unmerged branch never causes a rewrite.

## After creating it

1. Click **Run now** once and read the session. A one-off run does not count against the daily
   cap. Check the article, then let the schedule take over.
2. To pause it, use the on/off switch on the routine's detail page. To stop it permanently,
   delete the routine; the queue file stays.
3. To change what it writes, edit `projectfood-app/content/learn/queue.json`: reorder rows,
   change a `topic`, or add `"done": "skip"` to a row you do not want.
4. The same steps run locally with `/run-learn-article` in an interactive session.

## What it writes into

- Content files: `projectfood-app/content/learn/<internal>/<locale>.md`
- Database: `learn_articles` and `learn_article_content` (project `lkmfmdehysmbstnfdbyg`)
- Log: `knowledge-base-general/log.md`
