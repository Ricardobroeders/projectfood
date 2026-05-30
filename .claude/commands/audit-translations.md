# Audit Translations

## Layer 01 — Description
description: "Scan all three locale files for missing or mismatched keys, and surface hardcoded strings in TSX/TS files that bypass i18n."

Use after adding new UI text, when a UI element appears untranslated, or as a pre-ship sanity check.

---

## Layer 02 — Instructions

1. Read all three locale files:
   - `projectfood-app/messages/en.json`
   - `projectfood-app/messages/nl.json`
   - `projectfood-app/messages/it.json`

2. Compare key sets across all three. Report:
   - Any key present in one locale but missing in another
   - Any key whose value is an empty string `""` in any locale

3. Grep TSX/TS source for hardcoded user-visible strings (text not passed through `t()`):
   ```bash
   grep -rn '>[A-Z][a-z ]' projectfood-app/app --include="*.tsx" \
     | grep -v '//\|className\|import\|console\|aria-\|data-'
   ```
   Also check for string literals that look like sentences inside JSX.

4. Print a structured report:
   ```
   AUDIT TRANSLATIONS — [date]
   ===========================

   MISSING KEYS ([n]):
     - [key.path] — in en, missing in nl, it

   EMPTY VALUES ([n]):
     - [locale] → [key.path]

   SUSPECTED HARDCODED STRINGS ([n]):
     - [file:line]: "[text]"

   ALL CLEAR: YES / NO
   ```

5. For each missing key: propose the NL and IT translations using context from surrounding keys. Present proposals to Ricardo for confirmation before writing anything.

6. Once confirmed, add all missing/empty values to the correct locale JSON files.

---

## Layer 03 — Tools

| Type | Resource |
|------|----------|
| READ | `messages/en.json`, `messages/nl.json`, `messages/it.json` |
| BASH | `grep` — locate hardcoded strings in TSX source |
