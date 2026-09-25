---
name: pf-seo-article
description: Write, check and publish one learn-hub article (pillar or cluster) for projectfood.dev in one locale, from the pillar page plan. Use when asked to write, draft, rewrite, update, check or publish a learn article, a pillar page or a cluster page. Trigger phrases: "write the article", "draft the pillar", "cluster page", "publish the learn article", "learn:check", "learn:publish".
---

# pf-seo-article

One page, one locale, one intent. The routine goes brief → outline → draft → meta → FAQ →
links → file → check → review → publish → bookkeeping. Run every step; the check script
enforces the mechanical ones, the brand gates are yours.

## 0. Inputs

- The plan row: type (pillar / cluster), locale, public slug, keyword set, topic description.
  Source: `knowledge-base-general/wiki/seo/seo-pillar-alles-leren-eten.md` (the "plan in one
  table" per language) or Ricardo's sheet.
- The internal slug (the folder name) and, for a cluster, the pillar's internal slug. The pairing
  table lives in `projectfood-app/CLAUDE.md` under "Learn content".

## 1. Load the voice

Run the `pf-voice` skill: read `wiki/brand/brand-voice.md`, `brand-humour.md`,
`brand-stats-and-claims.md`. Register: parent. Search vocabulary ("kind lust geen groente",
"picky eater toddler") is allowed in title, H1 and meta; the body answers without the label.

## 2. Brief

- The page's keyword map on the pillar page (primary, secondary, questions).
- The locale's classified export in `wiki/seo/exports/pillar-1/` (`*-semrush-classified-*.csv`):
  the question rows for this cluster are the FAQ and H2 seeds.
- Page-1 competitors for the term in `wiki/seo/seo-serp-landscape.md`: what they cover, what
  they miss (usually: the honest number, what backfires, the tasting count).
- Write down 4 to 6 questions a parent typed. They become H2s or FAQ entries.

## 3. Outline

- **H1** = the title, carrying the search phrase (the slug carries the promise).
- **Intro**, answer first, at most 80 words, one dry line allowed (see brand-humour).
- **H2s** from the keyword set and the questions: 6 to 8 for a pillar, 4 to 6 for a cluster.
  Each H2 a claim or the parent's question in their words.
- **One science paragraph** with a citation from the stats page. Not more.
- **What backfires** (forcing, the clean plate, dessert as a bribe, sibling comparison), stated
  without blame.
- **When to ask for help**, one paragraph, no humour: consultatiebureau / JGZ (NL), pediatra (IT),
  "your doctor" (EN). Only where the topic touches weight, very few foods, or distress.
- **One plain paragraph on the app** near the end: what it does at the table, no promise. The
  page renders the store CTA; do not write a second one.
- **FAQ**, 4 to 6 questions.
- A pillar also carries a short section per cluster with the link to it; the page renders the
  cluster card list below the body as well.

## 4. Draft

- Natively in the locale, by a parent who writes that language. Never translate another locale's
  file.
- Length: pillar 1,500 to 2,200 words; cluster 900 to 1,400. The check enforces the minimum.
- The search phrase appears in the title, the H1, the first 100 words, one H2 and the meta.
  Once each, naturally; no stuffing.
- Paragraphs open with their claim, 2 to 4 sentences. Lists of at most 7 items. Digits.
- Vocabulary and gates from pf-voice. No health claim, no diagnosis, no "should".

## 5. Meta and dek

- `meta_title`: 45 to 55 characters, the search phrase first, no brand (the layout appends
  " | Project Food"). Sentence case.
- `meta_description`: 120 to 155 characters, contains the answer, no exclamation mark, no humour.
- `subtitle`: one sentence, the dek under the H1.

## 6. FAQ

4 to 6 questions from step 2, answered in 40 to 70 words each, answer first, plain text (no
markdown, no links), no humour. Sub-threshold search terms live here. The page renders them as
an accordion at the bottom and mirrors them in FAQPage JSON-LD; both must match, so the FAQ is
written once, in the front matter.

## 7. Citations

Only sources from `brand-stats-and-claims.md`. Inline "(Cooke, 2011)" at the end of the
sentence, and the `citations` list in the front matter (author, title, year, doi, url).

## 8. Links

- **Cluster → pillar** in the first paragraph, as a site-relative path in this locale
  (`/nl/leer/alles-leren-eten`), plus exactly two siblings in `related` (internal slugs; the
  page renders them as cards).
- **Pillar → every cluster** of this locale in the body, in the section about that topic; the
  page also renders the cluster list. Links to clusters that are planned but not written yet are
  allowed in a draft (warning), not at publish time (error). Republish the pillar when a cluster
  goes live.
- The printable (tasting chart) once it exists; the app CTA is rendered, never written.

## 9. Write the file

```
projectfood-app/content/learn/<internal>/article.json     type, pillar, display_order, emoji
projectfood-app/content/learn/<internal>/<locale>.md      front matter + body
```

Front matter keys: `slug`, `title`, `subtitle`, `meta_title`, `meta_description`, `keywords`
(list), `related` (two internal slugs), `faq` (list of `q` / `a`), `citations` (list), optional
`draft: true` (kept in git, never uploaded). Body starts after the closing `---`, no H1 (the
title is the H1), H2 and H3 only.

Then, in `projectfood-app`:

```
npm run learn:check -- --only <internal>
```

Fix every error. Read the warnings and decide.

## 10. Review and publish

Ricardo reads the file in git. Then:

```
npm run learn:publish -- --only <internal> --dry        # prints the rows, writes nothing
npm run learn:publish -- --only <internal>               # upserts, unpublished stays unpublished
npm run learn:publish -- --only <internal> --publish     # sets is_published, published_at once
```

`--publish` on a pillar only together with at least two clusters of that locale (no empty
states). The script revalidates the site when `REVALIDATE_SECRET` is set; otherwise the pages
refresh within the hour. Verify: open the page, check the FAQ accordion, the related cards, the
byline; view source for the JSON-LD (`Article` with `author` Person, `isPartOf` / `hasPart`,
`BreadcrumbList`, `FAQPage`); `/sitemap.xml` lists the URL with its hreflang set.

## 11. Bookkeeping

- `knowledge-base-general/log.md`: a `build` entry naming the page and locale.
- `wiki/strategy-backlog.md`: row 6 next step; item 14 in "Next to pick up".
- Ricardo's sheet: the `live` column.

## Unattended run (the nightly routine)

The claude.ai routine `projectfood-learn-article-nightly` and the local command
`/run-learn-article` both run this. Nobody is watching: every step is mandatory and the report
at the end is the only trace. One article per run.

0. **Preconditions.** Repo root, branch `main`, `git status` clean. `cd projectfood-app && npm ci
   --ignore-scripts` succeeds (the scripts need js-yaml). If not, stop and report.
1. **Pick the row.** `projectfood-app/content/learn/queue.json`, the first row without `done`. If
   there is none, stop and report "queue empty" and do nothing else. The row gives `internal`,
   `type`, `pillar`, `locale`, `slug`, `display_order`, `title_hint`, `keywords`, `topic`,
   `related`, `pillar_mention`.
2. **Write the article** with steps 1 to 9 above, in that locale, natively. `article.json`
   exists for every folder of pillar 1; create it only for a new folder. A pillar row also writes
   one announcement sentence per planned cluster of that locale (queue rows with the same
   `pillar` and `locale`), each its own sentence ending in that language's "gets its own article",
   so a later run can turn it into a link. A cluster row links the pillar in its first paragraph.
3. **Check.** `npm run learn:check -- --only <internal>`: zero errors, or stop and report the
   errors; commit nothing.
4. **Link from the pillar** (cluster rows only). In the pillar's `<locale>.md`, replace the
   `pillar_mention` sentence with one that links `/<locale>/<learn base>/<pillar slug>/<slug>`.
   If the sentence announces two clusters, keep the announcement of the one still missing as
   its own sentence. Then `npm run learn:check -- --only <pillar internal>`.
5. **Bookkeeping.** Set `"done": "<YYYY-MM-DD>"` on the queue row. Append to
   `knowledge-base-general/log.md`: `## [<date>] build | learn: <slug> (<locale>) written and
   published by the nightly routine` with a three-line paragraph (words, FAQ count, warnings).
6. **Commit and push.** `git add projectfood-app/content knowledge-base-general/log.md`, commit as
   `content(<locale>): <slug>, nightly routine` with the trailer
   `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`, then `git push origin HEAD:main`.
   If the push is rejected, push `HEAD:claude/learn-<slug>` instead, stop before publishing, and
   report the branch.
7. **Publish.** `npm run learn:publish -- --only <internal> --only <pillar internal> --publish
   --sql` prints the exact SQL (no keys needed): the upserts plus a verification select. Run
   every statement through the Supabase connector's `execute_sql` tool (project
   `lkmfmdehysmbstnfdbyg`; the tool may be namespaced, any `execute_sql` from the Supabase
   connector counts), then the verification select, and confirm `is_published = true` and the
   `<locale>` row for both articles. If there is no Supabase `execute_sql` tool but
   `SUPABASE_SERVICE_ROLE_KEY` is set, run the same command without `--sql` instead. If neither
   exists, stop and report "BLOCKED: no publish path"; the article stays committed and
   unpublished. Never simulate a write.
8. **Report** in this order: locale and slug, the public URL, words, meta lengths, FAQ count,
   the warnings you accepted, the commit hash, the publish verification rows, and "live within
   the hour" (the SQL path does not revalidate; the pages refresh on their own).

Never: publish with check errors; touch any article other than this one and its pillar; edit
the database by hand beyond the printed SQL; force-push; run a second row in the same run.

## The gate checklist

Before `--publish`, in this order:
1. Joy, not guilt: a tired parent feels helped, not judged.
2. No health claim for a child; no diagnosis; referral in one calm sentence where needed.
3. No named or pictured child; households and families only.
4. `learn:check` passes with zero errors; every warning read.
5. The search phrase is in title, H1, first 100 words, one H2 and the meta, once each.
6. FAQ answers are complete sentences a parent can act on.
7. Links: pillar in the first paragraph (cluster), every cluster (pillar), two related.
