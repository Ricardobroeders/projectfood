# Auth email templates

Source of truth for the emails Supabase Auth sends. The live copies live in the dashboard
(Authentication → Email Templates), which is why they are pushed from here with `push.mjs`
rather than edited there.

- `magic-link.html`: the sign-in code for an existing account.
- `confirm-signup.html`: the same code for a new account (Supabase picks this one on first sign-in).

Both are built for dark mode: `color-scheme: light` so mail clients do not invert them, every
colour set inline and again under `prefers-color-scheme: dark` and the Outlook `data-ogsb` /
`data-ogsc` hooks, no images (a transparent logo is what breaks first), dark text on a light card.
The only variable is `{{ .Token }}`. Copy is English only; per-language templates would need the
locale in user metadata, which the app does not store (backlog row 13).

Push: `SUPABASE_ACCESS_TOKEN=sbp_... node supabase/templates/push.mjs` (`--dry-run` to preview).
