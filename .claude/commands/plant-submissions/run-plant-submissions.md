# Run Plant Submissions

## Layer 01 — Description
description: "Process all pending plant submissions from plant_submissions — research each plant, insert as a fully-populated DB record with EN/NL/IT translations, and mark approved, duplicate, or flagged."

Use whenever users have submitted plant suggestions in-app and the `plant_submissions` table has pending rows.

---

## Layer 02 — Instructions

**IMPORTANT:** Every submission must end as approved, duplicate, or flagged. Never skip one silently.

### Step 1 — Fetch pending submissions

```sql
SELECT id, proposed_name, proposed_category, notes
FROM plant_submissions
WHERE status = 'pending'
ORDER BY created_at ASC;
```

If zero rows: report "No pending submissions" and stop.

---

### Step 2 — Process each submission (one at a time)

**2a — Research the plant**

Run 3–4 web searches (proposed_name may be in EN, NL, or IT):
1. `"[proposed_name]" plant food identification`
2. `"[proposed_name]" English name botanical family category`
3. `"[proposed_name]" Dutch Italian translation common name`
4. `"[canonical English name]" harvest season months Northern Hemisphere`

Determine:
- **canonical_en** — English common name
- **canonical_nl** — Dutch common name
- **canonical_it** — Italian common name
- **slug** — canonical_en lowercased, spaces→hyphens, strip non-alphanumeric except hyphens
- **emoji** — single most fitting food emoji
- **category** — one of: `fruit` | `vegetable` | `herb` | `nut_seed` | `legume` | `whole_grain` | `ferment`
- **subcategory** — freeform (e.g. "leafy green", "root vegetable", "citrus", "stone fruit")
- **color** — dominant color of edible part: `red` | `orange` | `yellow` | `green` | `blue` | `purple` | `white` | `brown`
- **botanical_family** — e.g. "Apiaceae", "Solanaceae"
- **is_seasonal** — true if meaningfully limited to certain months, false if year-round
- **season_months** — int array of peak harvest months 1–12 (empty `{}` if not seasonal)
- **search_aliases** — at minimum: canonical_en, canonical_nl, canonical_it, botanical name, regional variants

If fields cannot be determined with confidence → skip to Step 2d (flag).

**2b — Check for duplicate**

```sql
SELECT id, name FROM plants WHERE slug = '[derived-slug]';
```

If found: record existing id, skip to duplicate path in 2c.

**2c — Insert plant + translations OR mark duplicate**

New plant:
```sql
INSERT INTO plants (
  slug, name, emoji, category, subcategory, color,
  botanical_family, is_seasonal, season_months, search_aliases, is_active
) VALUES (
  '[slug]', '[canonical_en]', '[emoji]',
  '[category]'::plant_category, '[subcategory]',
  '[color]'::plant_color, '[botanical_family]',
  [true|false], '{[1,2,3]}',
  '{"[alias1]","[alias2]","[alias3]"}', true
) RETURNING id, slug, name;
```

Then insert all 3 translations:
```sql
INSERT INTO plant_translations (plant_id, locale, name) VALUES ('[id]', 'en', '[canonical_en]');
INSERT INTO plant_translations (plant_id, locale, name) VALUES ('[id]', 'nl', '[canonical_nl]');
INSERT INTO plant_translations (plant_id, locale, name) VALUES ('[id]', 'it', '[canonical_it]');
```

Mark approved:
```sql
UPDATE plant_submissions
SET status = 'approved', linked_plant_id = '[new_plant_id]', reviewed_at = NOW()
WHERE id = '[submission_id]';
```

Mark duplicate:
```sql
UPDATE plant_submissions
SET status = 'duplicate', linked_plant_id = '[existing_plant_id]', reviewed_at = NOW()
WHERE id = '[submission_id]';
```

**2d — Flag unresolvable**

Do NOT modify the DB. Log to summary: submission id, proposed_name, searches tried, reason it could not be resolved.

---

### Step 3 — Verify

```sql
SELECT p.slug, p.name, COUNT(pt.locale) AS translation_count
FROM plants p
LEFT JOIN plant_translations pt ON pt.plant_id = p.id
WHERE p.slug IN ('[slug1]', '[slug2]')
GROUP BY p.id ORDER BY p.name;
```

Flag any row where `translation_count != 3`.

---

### Step 4 — Summary report

```
PLANT SUBMISSIONS RUN — [date]
==============================

APPROVED ([n]):
  - [proposed_name] → [canonical_en] (slug: [slug])

DUPLICATES ([n]):
  - [proposed_name] → already exists as [existing plant name]

FLAGGED / UNRESOLVED ([n]):
  - [proposed_name]: [reason]

VERIFICATION: All translations present: YES / NO
REMAINING PENDING: [n]
```

---

## Layer 03 — Tools

| Type | Resource |
|------|----------|
| MCP    | `mcp__claude_ai_Supabase__execute_sql` — project ref `lkmfmdehysmbstnfdbyg` |
| SEARCH | WebSearch — identify plant (EN/NL/IT name, botanical family, season) |

**SQL notes:**
- `season_months` literal: `'{1,2,3}'` (string), not `ARRAY[1,2,3]`
- Enums must be cast: `'vegetable'::plant_category`, `'green'::plant_color`
- Apostrophes in names: use dollar-quoting — `$$King's spear$$`
- `search_aliases` format: `'{"cucumber","komkommer","cetriolo","Cucumis sativus"}'`
- If `proposed_category` was set on the submission, use it as a strong hint but trust research over it
