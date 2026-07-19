# Security & Encryption Standard

## Encryption at rest

- Sensitive fields (tokens, PII, financial data): AES-256-GCM via Node crypto or a vetted lib. Never ECB mode, never hand-rolled ciphers.
- Unique IV per encryption operation; IV stored alongside ciphertext, never reused.
- Passwords are HASHED, not encrypted: argon2id (preferred) or bcrypt cost >= 12. Never MD5/SHA-x for passwords.

## Encryption in transit

- TLS 1.2+ everywhere, including service-to-service. No `rejectUnauthorized: false` ever.
- HSTS on public endpoints; secure + httpOnly + sameSite on session cookies.

## Key management

- Keys from a secret manager (AWS KMS / Vault / GCP KMS) via src/infra/config — never in code, env files committed, or logs.
- Separate keys per environment; rotation plan documented in an ADR; old key retained only for decrypt-and-rewrap.

## Tokens & sessions

- JWTs: short-lived access (<=15m) + rotating refresh; algorithm pinned (RS256/EdDSA), `alg: none` and HS/RS confusion rejected; verify iss/aud/exp.
- Session invalidation on password change and logout.

## Fix workflow (security fixes)

1. security-auditor files the finding (CRITICAL) with exploit scenario.
2. implementer fixes on a `fix/sec-<slug>` branch; test-engineer adds a regression test proving the exploit is closed.
3. security-auditor re-audits and must return CLEARED before git-officer commits.
4. If the vulnerability shipped to main: note affected versions in the PR and flag the human for disclosure/rotation decisions (rotate any possibly exposed secrets).
