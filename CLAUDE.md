# Agent-Driven TypeScript Project

Stack: TypeScript (strict), Node LTS, Vitest, ESLint+Prettier, Zod.
Verify: `npm run lint && npm run typecheck && npm test`

## Standards — read the relevant file BEFORE acting on its domain

docs/standards/: architecture.md · testing.md · code-review.md · git-workflow.md · security.md · error-handling.md

## Agents (.claude/agents/) — delegate by role

- agent-architect: creates/updates agent definitions (all new agents go through it)
- system-architect: structural approval + ADRs (docs/adr/)
- implementer: writes code | test-engineer: tests + coverage
- code-reviewer: reviews (no write access) | security-auditor: security (read-only)
- git-officer: the ONLY agent allowed git write commands

## Hard rules (all agents)

1. No secrets/PII in code or logs. Env/secret manager only.
2. Never delete, skip, or weaken a failing test. Fix the code or escalate.
3. No direct commits to main. No commit with open CRITICAL findings.
4. Parameterized queries only. Zod validation at every external boundary.
5. Ask the human before destructive or irreversible operations.
6. Structural change (new module/dependency/cross-layer) → ADR first.

## Verification (anti-hallucination)

7. Claims require evidence: paste real command output; cite only file:line read this session.
8. Verify library APIs against package.json/types before use; if unverifiable, say "unverified".
9. code-reviewer and git-officer re-run checks themselves — never trust reported results. CI on the PR is final truth.
