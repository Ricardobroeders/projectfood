# Project Food — Knowledge Base Schema

This is an LLM-maintained knowledge base built on Andrej Karpathy's "LLM Wiki" pattern.
It supports **Project Food**, whose mission is to help people enjoy healthy food habits.

This file is the contract between you (the LLM agent) and this wiki. Read it fully at the
start of every session. It tells you how the wiki is structured and exactly what to do when
ingesting sources, answering questions, or maintaining the wiki.

**The golden rule:** The human curates sources, explores, and asks questions. *You* do all the
writing, summarizing, cross-referencing, filing, and bookkeeping. The human never writes wiki
pages by hand — you maintain everything.

## Domain focus

This wiki concentrates on two areas (expand only when the human asks):

1. **Business & strategy** — market landscape, competitors, partnerships, monetization,
   positioning, meeting notes, internal decisions, OKRs.
2. **Product & user research** — user interviews, surveys, feedback, usability findings,
   personas, feature ideas, retention/engagement insights, competitor product teardowns.

## Architecture

Three layers:

- **`raw/`** — the human's curated source documents (articles, transcripts, interview notes,
  PDFs converted to markdown, screenshots, exports). **Immutable: read from it, never edit it.**
  Images and attachments go in `raw/assets/`.
- **`wiki/`** — the LLM-generated, interlinked markdown pages. You own this layer entirely.
- **schema (`CLAUDE.md`, this file)** + **`index.md`** + **`log.md`** — navigation and rules.

## Directory layout

```
knowledge-base-general/
├── CLAUDE.md          # this file — the schema / rules
├── README.md          # human-facing quickstart
├── index.md           # catalog of every wiki page (content-oriented)
├── log.md             # append-only chronological record of all operations
├── raw/               # immutable source documents
│   └── assets/        # images and attachments
├── wiki/              # LLM-maintained pages (you own this)
│   └── overview.md    # top-level synthesis / entry point
└── templates/         # page templates to copy when creating new pages
```

## Page types (in `wiki/`)

Use a filename prefix so pages group naturally and the graph stays legible:

| Prefix          | Type            | Use for                                                        | Template                       |
|-----------------|-----------------|---------------------------------------------------------------|--------------------------------|
| `source-`       | Source summary  | One page per ingested raw document                            | `templates/source-summary.md`  |
| `entity-`       | Entity          | A company, competitor, person, partner, market segment        | `templates/entity.md`          |
| `concept-`      | Concept         | A recurring idea, strategy, framework, metric                 | `templates/concept.md`         |
| `persona-`      | Persona         | A user persona / segment built from research                  | `templates/persona.md`         |
| `interview-`    | Interview       | A single user interview / research session                    | `templates/interview.md`       |
| `decision-`     | Decision        | An internal decision and its rationale (lightweight ADR)      | `templates/decision.md`        |
| `compare-`      | Comparison      | A side-by-side analysis (e.g. competitor vs competitor)       | `templates/comparison.md`      |

Filenames: lowercase, kebab-case, after the prefix. E.g. `entity-myfitnesspal.md`,
`concept-habit-loop.md`, `persona-busy-parent.md`, `decision-2026-05-30-freemium-tiers.md`.

## Frontmatter convention

Every wiki page starts with YAML frontmatter so Obsidian's Dataview can query it:

```yaml
---
title: MyFitnessPal
type: entity            # source | entity | concept | persona | interview | decision | comparison
tags: [competitor, nutrition-tracking]
created: 2026-05-30
updated: 2026-05-30
sources: [source-techcrunch-mfp-2026.md]   # raw or source- pages this page draws from
---
```

## Dating & recency (resolving overlapping information)

Dates are how we know which information is newer when sources overlap or conflict. Be disciplined:

- **Page-level:** keep `created` and `updated` in frontmatter accurate. Bump `updated` every
  time you change a page. Source pages also carry `date_published` (when the source itself was
  produced — which may differ a lot from when we ingested it).
- **Claim-level:** when a fact could change over time (pricing, headcount, feature set, market
  share, a user's stated preference), tag it inline with the date it was true and its source,
  e.g. `Pro tier is €9.99/mo _(as of 2026-03, [[source-...]])_`. The publish date of the source
  is the date the claim was true — not the ingest date.
- **When two sources conflict:** prefer the one with the **more recent `date_published`**. Don't
  silently delete the older claim — keep it under "Contradictions / open questions" with both
  dates so the history of what we believed (and when) is visible. Example:
  `Was €7.99 (2025-11, [[source-a]]); now €9.99 (2026-03, [[source-b]]).`
- **When dates are unknown:** mark the claim as undated rather than guessing, and flag it as a
  gap to resolve during the next lint pass.
- **During lint:** surface claims whose newest supporting source is old enough to be stale, so
  the human can decide whether to re-source them.

## Linking

- Link liberally with Obsidian wikilinks: `[[entity-myfitnesspal]]`, `[[concept-habit-loop]]`.
- A `[[link]]` to a page that doesn't exist yet is fine — it marks a page worth creating.
- Every page should have at least one inbound link (avoid orphans). `overview.md` and
  `index.md` are the top of the link tree.
- When you create or update a page, also add the reciprocal links on related pages.

## Operations

### Ingest (the human drops a source into `raw/` and asks you to process it)

1. Read the source in `raw/` completely. If it references images in `raw/assets/`, view them.
2. Briefly discuss the key takeaways with the human before writing.
3. Create a `source-<slug>.md` summary page (use the template). Capture: what it is, where it
   came from, date, key claims, notable quotes, and implications for Project Food.
4. Update or create the relevant `entity-`, `concept-`, `persona-`, etc. pages. Integrate the
   new information — don't just append. If the new source **contradicts** an existing claim,
   flag it explicitly on the affected page under a "Contradictions / open questions" heading.
5. Add/refresh cross-references between all touched pages.
6. Update `index.md` (add the new pages with one-line summaries).
7. Append an entry to `log.md`.
8. A single source typically touches 5–15 pages. Tell the human what you changed.

### Query (the human asks a question)

1. Read `index.md` first to locate relevant pages, then drill into them.
2. Synthesize an answer **with citations** back to wiki pages and/or raw sources.
3. If the answer is valuable and reusable (a comparison, an analysis, a synthesis), offer to
   **file it back** as a new wiki page (`compare-`, `concept-`, etc.) so explorations compound.
4. Log significant queries in `log.md`.

### Lint (periodic health check — run when asked, or proactively suggest it)

Check for and report:
- Contradictions between pages.
- Stale claims newer sources have superseded.
- Orphan pages (no inbound links).
- Concepts mentioned repeatedly but lacking their own page.
- Missing cross-references.
- Data gaps that a web search or new source could fill.

Then suggest concrete next questions to investigate and sources to seek out.

## index.md and log.md

- **`index.md`** is content-oriented: a catalog of every wiki page, grouped by type, each with
  a wikilink and a one-line summary. Update it on every ingest. Read it first on every query.
- **`log.md`** is chronological and append-only. Every entry starts with a parseable prefix:
  `## [YYYY-MM-DD] <op> | <title>` where `<op>` is `ingest`, `query`, `lint`, or `setup`.
  This makes `grep "^## \[" log.md | tail -5` give the last 5 operations.

## Conventions & style

- Write in clear, neutral prose. Pages are reference material, not essays.
- Always cite where a claim comes from (link the `source-` page or `raw/` file).
- Prefer updating an existing page over creating a near-duplicate. Before creating a page,
  check `index.md` for an existing page covering the same entity/concept under a different name.
- Convert relative dates to absolute dates (e.g. "last week" → the actual date).
- Keep `overview.md` current as the synthesized big-picture entry point.
- This whole directory is a git repo — meaningful changes are worth committing.

## When in doubt

This schema is a living document. If you and the human discover a better convention, update
this file so future sessions inherit it.
