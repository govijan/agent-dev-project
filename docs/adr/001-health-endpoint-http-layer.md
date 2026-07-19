# ADR 001: Introduce HTTP layer via Node built-in `http` for GET /health

Date: 2026-07-20 | Status: Proposed | Approved-by: system-architect

## Context

The project currently has no HTTP server, no `src/api`/`src/service`/`src/infra` modules, and only a single
`src/domain/add.ts` unit. We need to expose `GET /health` returning `200` with JSON body `{"status":"ok"}`
and `Content-Type: application/json`.

Per `docs/standards/architecture.md`, a "structural change" is any new top-level module, new production
dependency, new external service, or cross-layer exception, and requires an ADR before implementation.
This change introduces:

- A new top-level module (`src/api/`, `src/service/`, plus a process entrypoint `src/server.ts`).
- A decision on whether to add a web-framework production dependency (express/fastify/koa) or use Node's
  built-in `node:http` module.

`package.json` currently has **no** HTTP framework dependency. `devDependencies` include `typescript`,
`vitest`, `eslint`, `prettier`, `zod`, `tsx` — no `express`/`fastify`/`koa`/`hono` etc.

## Decision

1. **No new production dependency.** Use Node's built-in `node:http` module to run the server and dispatch
   the single route. A minimal, hand-written router (a handful of lines) matches method + pathname to a
   handler. This satisfies the guard against "new production dependencies when stdlib or an existing
   dependency suffices" — a single static-JSON health route does not justify pulling in Express/Fastify and
   their transitive dependency trees, security surface, and version-upgrade burden.
2. **Layering** (api → service → domain → infra, dependencies inward only):
   - `src/service/health/getHealthStatus.ts` — use-case function, the single source of truth for what the
     health status _is_. Today it is a constant `{ status: "ok" }`; this is the natural extension point if a
     future health check needs to report DB/dependency liveness. No `src/domain/` code is introduced for
     this feature because there is no business rule to encapsulate — the architecture standard requires
     layers to be respected when they carry logic, not that every layer be populated for every feature.
   - `src/api/health/health.controller.ts` — HTTP-facing controller. Owns only HTTP concerns: matching the
     request, calling the service function, setting status code 200, `Content-Type: application/json`, and
     writing the serialized JSON body. Imports the service layer only, never `node:http` server bootstrap
     concerns beyond the request/response objects it's handed.
   - `src/api/router.ts` — minimal method+path dispatch table used by the entrypoint; returns a `404` JSON
     body for unmatched routes.
   - `src/server.ts` — composition root / process entrypoint. Creates the `http.Server` via `node:http`,
     wires the router, starts `listen()`, and registers `unhandledRejection`/`uncaughtException` handlers per
     `docs/standards/error-handling.md` rule 6. This file is the only place that constructs the framework
     (Node's `http` module) and is intentionally outside the api/service/domain/infra chain as the wiring
     file — analogous to a `main`.
   - `src/infra/` is not touched by this change: infra is for outbound external calls (DB, queues, other
     services) per the architecture standard; the process's own inbound HTTP server is not an "infra client."
3. **No Zod validation on this endpoint.** `GET /health` takes no path params, no query string, and no
   request body — there is no external input to validate. `docs/standards/architecture.md` requires Zod
   "at the api boundary" for _input_; there is none here, so a schema would be a no-op that adds noise
   without reducing risk. Per `docs/standards/security.md`, the response contains no PII/secrets, so no
   encryption/redaction concerns apply either. If `/health` later accepts input (e.g., a `?verbose=` flag),
   a Zod schema must be added at that time.

## Alternatives considered

- **Express** — familiar, widely used, but is a new production dependency (plus its transitive deps) for a
  single static-JSON route; rejected as disproportionate footprint for current needs.
- **Fastify** — faster and has built-in schema validation, but same objection: new production dependency
  not justified by one endpoint; can be revisited via a new ADR if the API surface grows materially
  (multiple routes, need for plugins/middleware ecosystem, streaming, etc.).
- **Hand-rolled but no service layer (api directly returns literal JSON)** — simpler, but skips the
  service-layer use-case boundary the architecture standard calls for and makes future extension (e.g.
  dependency health checks) require restructuring; rejected in favor of a thin service function now.

## Consequences

- Zero new production dependencies; `npm ls` production dependency surface unchanged.
- If/when a second or third route is added with real routing needs (path params, middleware, content
  negotiation), the hand-rolled router will need to grow or be replaced — that point is the trigger to
  revisit this ADR and consider Fastify/Express via a new ADR, not before.
- Future health-check enrichment (e.g., DB ping) has a designated home: `src/service/health/getHealthStatus.ts`
  and, if it starts calling out to dependencies, corresponding `src/infra/` clients with timeout/retry per
  `docs/standards/error-handling.md`.
- `src/server.ts` becomes the process entrypoint; `package.json` will need a `start`/`dev` script (e.g. via
  `tsx src/server.ts`) — left to the implementer, not itself structural.
