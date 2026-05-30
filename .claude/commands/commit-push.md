# Commit & Push

## Layer 01 — Description
description: "Stage all current changes, generate a commit message from the diff, commit, and push to origin. Does not merge."

Use when Ricardo says "commit and push", "ship it", or "commit when done". Does not merge into main — that requires explicit confirmation per the workflow in CLAUDE.md.

---

## Layer 02 — Instructions

1. Run `git status` — identify all modified, staged, and untracked files.

2. Run `git diff` and `git diff --staged` — review the full changeset to inform the commit message.

3. Run `git log --oneline -5` — match the repo's commit message style (conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, etc.).

4. Draft a commit message:
   - Line 1: `type(scope): short imperative description` — focus on the *why*, not the *what*
   - Optional body: 1–2 sentences of context if non-obvious
   - Trailer: `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`

5. Stage files explicitly by name — never use `git add -A` or `git add .`. List any untracked files left out and why.

6. Commit using a HEREDOC:
   ```bash
   git commit -m "$(cat <<'EOF'
   type(scope): description

   Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
   EOF
   )"
   ```

7. Push to origin:
   ```bash
   git push -u origin HEAD
   ```

8. Report: files committed, commit hash, push status, anything left unstaged.

---

## Layer 03 — Tools

| Type | Resource |
|------|----------|
| BASH | `git status`, `git diff`, `git log`, `git add`, `git commit`, `git push` |
