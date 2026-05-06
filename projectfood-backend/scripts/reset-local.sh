#!/usr/bin/env bash
# reset-local.sh — nuke local dev DB and re-apply all migrations + seed
# Usage: ./scripts/reset-local.sh

set -euo pipefail

cd "$(dirname "$0")/.."

echo "→ Resetting local Supabase DB (migrations + seed)…"
supabase db reset

echo "✓ Local DB reset complete."
