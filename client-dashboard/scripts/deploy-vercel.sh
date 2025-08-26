#!/usr/bin/env bash
set -euo pipefail

# Deploy current project directory to Vercel prod without prompts.
# Requirements:
# - vercel CLI installed (added as devDependency)
# - VERCEL_TOKEN exported in env or stored via `vercel login`

if ! command -v vercel >/dev/null 2>&1; then
  echo "vercel CLI not found. Installing locally..." >&2
  npx --yes vercel --version >/dev/null 2>&1 || true
fi

echo "Starting Vercel deploy (prod)..."
vercel deploy --prod --yes --confirm || {
  echo "Vercel deploy failed" >&2
  exit 1
}

echo "Vercel deploy completed."


