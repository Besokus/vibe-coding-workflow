<!-- vibe-managed:start rule-skill-dispatch version=0.2 type=template -->
# Skill Dispatch

## Principle
Rules may instruct the agent to consult relevant skills, but must not bypass current task level gates.

## Dispatch Status

Each skill reference is assigned one of three statuses based on detection at init time:

| Status | Meaning |
|--------|---------|
| ✅ available | Exact skill name found in installed skills/agents |
| ↪ alternative | No exact match; a functionally similar skill/agent was discovered |
| ⛔ fallback | No match found; use the built-in protocol described here |

## Dynamic Dispatch

### Debug / Failure
- [available] First unclear failure: consult `systematic-debugging`
- [alternative → <name>] Use `<discovered-alternative>` which matches keywords: <keywords>
- [fallback] Use F2 protocol: reproduce in minimal scope, hypothesis before edit

- [available] Repeated failure: consult `diagnose`
- [alternative → <name>] Use `<discovered-alternative>` which matches keywords: <keywords>
- [fallback] Escalate to F3: read-only discovery, ask developer

- Verification uncertainty: consult `verification-before-completion` (or alt, or fallback to verification-discipline.md)

### Planning / Alignment
- [available] L3 goal alignment: consult `grill-with-docs` if domain terms unclear
- [alternative → <name>] Use `<discovered-alternative>` which matches keywords: <keywords>
- [fallback] Ask developer to clarify domain terms directly

- [available] Plan quality: consult `writing-plans` if task is broad enough
- [alternative → <name>] Use `<discovered-alternative>` which matches keywords: <keywords>
- [fallback] Use built-in L2 plan template (files, steps, acceptance criteria)

### Scope / Simplicity
- [available] Scope creep risk: consult `karpathy-guidelines`
- [alternative → <name>] Use `<discovered-alternative>` which matches keywords: <keywords>
- [fallback] Apply scope-control.md directly (no incidental fixes, no speculative abstractions)

- [available] Persistent plan files: consult `planning-with-files`
- [alternative → <name>] Use `<discovered-alternative>` which matches keywords: <keywords>
- [fallback] Write task_plan.md manually

## Available Skills (detected at init)
<!-- vibe-managed:start rule-skill-dispatch-available version=0.2 type=detected -->
<!-- This section is populated by /init-vibe with detected skills.
     Format:
     - ✅ systematic-debugging (exact match)
     - ↪ my-debug-agent (alternative for: diagnose) — keywords: debug, troubleshoot
     - ⛔ karpathy-guidelines (not found, fallback active)
-->
<!-- vibe-managed:end rule-skill-dispatch-available -->

## Constraint
Skills assist diagnosis and planning. They do not bypass L2/L3 confirmation gates.
<!-- vibe-managed:end rule-skill-dispatch -->
