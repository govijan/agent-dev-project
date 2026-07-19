# Architecture Standard

## Layering

api (controllers/routes) → service (use cases) → domain (pure business logic) → infra (db, clients, framework).
Dependencies point inward only. `domain/` imports nothing from api/service/infra and no framework code.

## Boundaries

- External calls (HTTP, DB, queues) only via `src/infra/` clients with timeouts and retry/backoff.
- Input validated with Zod at the api boundary only; inner layers trust typed data.
- No circular dependencies (enforced by lint rule / dependency-cruiser).
- Money as integer minor units; time in UTC ISO-8601.

## Change control

A structural change = new top-level module, new production dependency, new external service, or any cross-layer exception.
Structural changes require an ADR in `docs/adr/NNN-title.md` (Context, Decision, Alternatives, Consequences),
approved by system-architect BEFORE implementation starts. Everything else proceeds without an ADR.
