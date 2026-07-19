# Testing Standard

## Requirements per change

- New logic → unit tests in colocated `*.test.ts`.
- Bug fix → failing regression test written FIRST, then the fix.
- New endpoint/integration → integration test in `tests/integration/` using mocks or testcontainers. Never hit live services.

## Gates

- Coverage floor: 80% lines/branches on `src/domain/` and `src/service/` (`npm run test:coverage`).
- Full suite green before any commit. git-officer verifies this and refuses otherwise.
- Flaky test → quarantine with a linked issue within the same PR, never silently retried.

## Forbidden

- Deleting, skipping (`.skip`), or loosening assertions of a failing test to go green.
- Testing implementation details; test observable behavior through public interfaces.
- Shared mutable state between tests; each test sets up and tears down its own data.

## Performance testing

- Hot paths must be declared in the ADR or PR description; only declared hot paths require benchmarks.
- Micro-benchmarks: Vitest `bench` in `*.bench.ts` next to the code; committed with a baseline number in the PR.
- Load tests: `tests/perf/` using autocannon or k6 against key endpoints; run via `npm run test:perf`.
- Budgets (tune after baseline): p95 latency <= 300ms per endpoint under nominal load, error rate < 0.1%.
- CI runs perf budgets as INFORMATIONAL initially; promote to blocking via an ADR once a stable baseline exists.
- Regressions: a claimed optimization without a before/after measurement is rejected in review.
