<!-- vibe-managed:start rule-confirmation-policy version=0.2 type=template -->
# Confirmation Policy

## Level-Based Confirmation
- L0: no confirmation needed
- L1: no confirmation needed, upgrade on failure
- L2: confirm plan before implementation
- L3: read-only discovery only, confirm direction before any edits

## Always L3 (requires confirmation regardless of scope)
- auth / authorization
- payments
- security
- database schema / migrations
- public API contract
- concurrency / locking
- deployment / CI/CD
- secrets / env files
- destructive filesystem operations
- broad refactor

## Reconfirmation
If scope changes during implementation, stop and reconfirm.
<!-- vibe-managed:end rule-confirmation-policy -->
