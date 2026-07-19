# Code Review Standard

## Flow

Every diff is reviewed by code-reviewer before commit. Changes touching auth, crypto, payments,
session handling, file upload, or config are ALSO reviewed by security-auditor.

## Severity tiers

- CRITICAL (blocks commit): security vulnerability, data loss risk, broken public contract,
  secret in code, missing input validation at a boundary, failing/weakened test.
- WARNING (fix before merge unless justified in PR): error swallowed silently, missing timeout,
  layering violation, unbounded query, missing test for new logic.
- SUGGESTION (optional): naming, style, simplification.

## Rules

- code-reviewer never edits code; findings go back to implementer.
- Reviews reference file:line and state the fix, not just the problem.
- git-officer refuses to commit while Critical findings are open.

## Performance & optimization checklist (reviewed on every diff)

- WARNING unless on a hot path (then CRITICAL-eligible):
  - N+1 queries; missing pagination/limits on list queries; SELECT * on wide tables.
  - O(n^2)+ work on unbounded input; repeated work inside loops that belongs outside.
  - Sync/blocking calls (fs.readFileSync, crypto sync) on the request path.
  - Sequential awaits for independent operations (use Promise.all).
  - Unbounded in-memory accumulation (loading whole datasets/files instead of streaming).
  - Missing caching consideration for repeated identical external calls.
- Optimization discipline: no speculative micro-optimization that hurts readability; measurable hot-path claims need a benchmark or profile in the PR.
