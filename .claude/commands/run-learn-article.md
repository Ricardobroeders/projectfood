# Run learn article

## Layer 01 — Description
description: "Write, commit and publish the next learn-hub article from content/learn/queue.json, the way the nightly routine does. One article per run."

Use when Ricardo says "run the next article", "write the next learn article", or wants to run
the nightly routine by hand. The claude.ai routine `projectfood-learn-article-nightly` runs the
same steps every night.

---

## Layer 02 — Instructions

1. Read `.claude/skills/pf-seo-article/SKILL.md` in full and follow the section
   "Unattended run (the nightly routine)" step by step, from the preconditions to the report.
2. Load the voice first: read `knowledge-base-general/wiki/brand/brand-voice.md`,
   `brand-humour.md` and `brand-stats-and-claims.md` (the `pf-voice` skill).
3. Publish path in a local session: `npm run learn:publish -- --only <internal> --only
   <pillar internal> --publish` (keys in `projectfood-app/.env.local`); the `--sql` path is for
   the cloud routine, which has the Supabase connector and no keys.
4. Do not deploy to Vercel (content lives in the database). Do not force-push.

---

## Layer 03 — Tools

| Type | Resource |
|------|----------|
| READ | `.claude/skills/pf-seo-article/SKILL.md`, `knowledge-base-general/wiki/brand/*.md`, `projectfood-app/content/learn/queue.json` |
| BASH | `npm ci --ignore-scripts`, `npm run learn:check`, `npm run learn:publish`, `git add`, `git commit`, `git push` |
| MCP  | Supabase `execute_sql` (cloud routine only, with the `--sql` output) |
