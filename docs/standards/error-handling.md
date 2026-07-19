# Exception Handling Standard

## Error model

- Typed error hierarchy in `src/errors/`: `AppError` base with `code`, `httpStatus`, `isOperational`.
  Subclasses: ValidationError(400), AuthError(401), ForbiddenError(403), NotFoundError(404), ConflictError(409), ExternalServiceError(502), InternalError(500).
- Domain/service layers throw typed errors; ONLY the global error middleware maps them to HTTP responses.

## Rules

1. Never swallow: no empty catch, no `catch { return null }` without logging + a typed rethrow or explicit documented recovery.
2. Catch SPECIFIC error types. A broad catch is allowed only at process boundaries (middleware, job runners, message consumers).
3. Every external call (src/infra): timeout + retry with exponential backoff and jitter for transient failures only (network, 429, 5xx). Never retry non-idempotent operations blindly.
4. Fail fast on programmer errors (isOperational=false): log, alert, crash-and-restart rather than continuing in unknown state.
5. Logs: error code, message, correlation ID, operation context. NEVER stack traces to clients, NEVER PII/secrets/tokens in logs.
6. `unhandledRejection` and `uncaughtException` handlers registered at bootstrap: log, flush, exit non-zero.
7. Promise discipline: no floating promises (lint-enforced); `Promise.allSettled` when partial failure is acceptable, `Promise.all` only when any failure should abort.
