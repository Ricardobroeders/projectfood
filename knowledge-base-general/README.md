# Project Food — Knowledge Base

An LLM-maintained knowledge base built on [Andrej Karpathy's "LLM Wiki" pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).
Focus: **business & strategy** and **product & user research** for Project Food.

The idea: instead of re-deriving knowledge from raw documents on every question (RAG), the LLM
**incrementally builds and maintains a persistent, interlinked wiki**. You curate sources and ask
questions; the LLM does all the writing, summarizing, cross-referencing, and bookkeeping.

## How to use it

1. **Add a source.** Drop a document (article, transcript, interview notes, PDF→markdown,
   screenshot) into `raw/`. Use the [Obsidian Web Clipper](https://obsidian.md/clipper) to pull
   web articles in as markdown.
2. **Ingest it.** Tell the agent: *"Ingest the new file in raw/."* It reads the source, writes a
   summary page, updates the relevant entity/concept/persona pages, refreshes `index.md`, and
   logs the operation.
3. **Ask questions.** *"What do we know about competitor pricing?"* The agent reads `index.md`,
   drills into the relevant pages, and answers with citations. Good answers can be filed back as
   new pages so your explorations compound.
4. **Lint periodically.** *"Run a lint pass."* The agent flags contradictions, stale claims,
   orphan pages, and gaps, and suggests next questions.

## Layout

| Path           | What it is                                                      |
|----------------|----------------------------------------------------------------|
| `CLAUDE.md`    | The schema — rules the agent follows. The most important file. |
| `index.md`     | Catalog of every wiki page. Read first on any query.           |
| `log.md`       | Append-only chronological record of operations.                |
| `raw/`         | Your immutable source documents (`raw/assets/` for images).    |
| `wiki/`        | The LLM-maintained pages. Start at `wiki/overview.md`.         |
| `templates/`   | Page templates the agent copies when creating new pages.        |

## Working in Obsidian

Open this folder as your Obsidian vault (already done). Useful setup:

- **Graph view** shows the shape of the wiki — hubs and orphans.
- **Attachment folder:** Settings → Files and links → set to `raw/assets/` so clipped images
  land in one place. Bind *"Download attachments for current file"* to a hotkey.
- **Dataview plugin** (optional) can build live tables from the YAML frontmatter on each page.

The whole folder is a git repo, so you get version history for free.
