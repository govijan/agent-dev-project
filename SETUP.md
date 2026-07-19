# Setup Guide — Agent Foundation Kit

## Phase 0 — Prerequisites

- Node.js LTS, git, GitHub repo with `main` as default branch
- Claude Code installed (`npm install -g @anthropic-ai/claude-code`) and logged in
- GitHub CLI (`gh auth login`) — git-officer uses it for PRs

## Phase 1 — Install the kit

Copy CLAUDE.md, SETUP.md, .claude/, docs/, .github/ into the repo root (merge if files exist).

## Phase 2 — Make the gates real (npm scripts)

Every gate runs npm scripts; they must exist or agents fail closed.

```bash
npm i -D typescript vitest @vitest/coverage-v8 eslint prettier zod tsx autocannon
```

package.json scripts:

```json
{
  "scripts": {
    "lint": "eslint . && prettier --check .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:perf": "node tests/perf/run.mjs"
  }
}
```

tsconfig.json must have `"strict": true`. Run each script once manually — all must pass (or pass trivially) before agents start.

## Phase 3 — Protect main on GitHub

Settings → Branches → protect `main`: require PR before merge, require status check `verify`, block force pushes. Without this, only local settings stop a direct push.

## Phase 4 — First launch

```bash
cd <repo> && claude
```

Restart once after install (the agents-directory watcher only covers dirs that existed at session start). Verify with `/agents` — all seven must list. Commit the kit on a `chore/agent-foundation` branch via a normal PR.

## Phase 5 — Smoke test (one feature through the full chain)

Prompt:

> Use system-architect to plan a GET /health endpoint returning {status:"ok"}. Then implementer builds it, test-engineer tests it, code-reviewer reviews, and git-officer commits on feat/health-endpoint and opens a PR.

Check: architect gave a placement verdict; reviewer produced tiered findings and re-ran checks itself; git-officer walked its 4-gate checklist, used Conventional Commits, and ASKED before pushing; CI `verify` ran on the PR.

## Phase 6 — Daily loop

plan (system-architect, if structural) → build (implementer) → test (test-engineer) → review (code-reviewer [+ security-auditor if auth/crypto/payments/config]) → ship (git-officer). You approve pushes and merge PRs.

## Phase 7 — Growing the team

Always via agent-architect:

> Use the agent-architect subagent to create a <role> agent that <single responsibility>.
> Review the generated file like code. Upgrade any agent's model by editing `model:` in its frontmatter (picked up within seconds, no restart).

## Troubleshooting

- Agents not in /agents → restart session (new-directory watcher rule)
- Gates failing → run the npm script manually; fix tooling, not the agent
- Hook blocks constantly → typecheck genuinely failing; `npm run typecheck` and fix
- Agent skipped a standard → add `@` back for that one doc in CLAUDE.md
- git push denied → working as intended; deny rules block force/main pushes
