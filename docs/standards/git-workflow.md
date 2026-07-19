# Git Workflow — GitHub Flow

## Branches

- `main` is always deployable and protected. No direct commits — PRs only.
- Branch from main: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`, `docs/<slug>`.
- Short-lived branches; rebase on main before opening a PR.

## Commits — Conventional Commits

- `feat:`, `fix:`, `test:`, `refactor:`, `docs:`, `chore:` (+ optional scope: `feat(auth): ...`).
- Imperative subject ≤ 72 chars; body explains WHY. Atomic: one logical change per commit.
- Never commit .env, secrets, credentials, or generated artifacts.
- Never `--force`, never `--no-verify` (enforced by settings deny rules).

## PR checklist (git-officer enforces before push)

1. lint + typecheck + full test suite green
2. code-reviewer approved; security-auditor approved if security-sensitive paths touched
3. No open Critical findings; ADR linked if structural
4. PR description: what, why, test evidence
