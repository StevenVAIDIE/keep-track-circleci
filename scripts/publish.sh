#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -f .env.local ]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

if [ -z "${WEB_EXT_API_KEY:-}" ] || [ -z "${WEB_EXT_API_SECRET:-}" ]; then
  echo "Error: WEB_EXT_API_KEY and WEB_EXT_API_SECRET must be set (env vars or .env.local)." >&2
  echo "Get them from https://addons.mozilla.org/developers/addon/api/key/" >&2
  exit 1
fi

yarn extension:lint
yarn extension:build
yarn extension:publish
