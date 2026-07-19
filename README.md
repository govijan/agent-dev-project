# Claude Code Agent Foundation Kit (TypeScript + GitHub Flow)

## Install

1. Copy CLAUDE.md, .claude/, and docs/ into your repo root (merge with existing files if present).
2. Restart your Claude Code session so the new .claude/agents/ directory is picked up by the watcher.
3. Commit everything — the agent team is shared with your dev team via git.

## Smoke test

Run one small feature end-to-end:
"Use system-architect to plan adding a /health endpoint, then implementer to build it,
test-engineer to test it, code-reviewer to review, and git-officer to commit on a feat branch."

## Creating future agents

Always go through agent-architect:
"Use the agent-architect subagent to create a <role> agent that <responsibility>."
