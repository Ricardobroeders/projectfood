#!/usr/bin/env bash
# apply.sh — push migrations and seed to a linked remote Supabase project
# Usage: ./scripts/apply.sh
# Prerequisites: supabase CLI installed, `supabase link` already run

set -euo pipefail

cd "$(dirname "$0")/.."

echo "→ Pushing migrations…"
supabase db push

echo "→ Seeding plant catalog…"
# psql is the most reliable way to apply seed to remote
# Requires SUPABASE_DB_URL (postgres://… connection string for your project)
if [ -z "${SUPABASE_DB_URL:-}" ]; then
  echo "ERROR: Set SUPABASE_DB_URL to your project's database connection string."
  echo "  Find it at: Supabase Dashboard → Project → Settings → Database → Connection string (URI)"
  exit 1
fi

psql "$SUPABASE_DB_URL" -f supabase/seed.sql

echo "✓ Done. Migrations and seed applied to remote project."
