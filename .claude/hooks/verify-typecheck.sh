#!/usr/bin/env bash
# Stop hook: catches invented APIs / wrong signatures regardless of agent claims.
# Wire in .claude/settings.json under hooks.Stop once the project has a typecheck script.
if [ -f package.json ] && grep -q '"typecheck"' package.json; then
  npm run --silent typecheck || { echo "BLOCKED: typecheck failed — agent claims of working code are invalid." >&2; exit 2; }
fi
