<!-- vibe-managed:start rule-failure-protocol version=0.2 type=template -->
# Failure Protocol

## Failure Levels

### F1: Single failure
Trigger:
- One verification command fails
- One implementation attempt fails

Required action:
- Capture exact command, exit code, first relevant error
- State likely cause
- Make one minimal corrective attempt if root cause is clear

### F2: Repeated or unclear failure
Trigger:
- Same symptom appears twice
- Fix introduces new failure
- Root cause is uncertain
- Test failure does not point to changed code

Required action:
- Stop patching
- Write findings to `.ai/logs/findings.md`
- Consult `systematic-debugging` if available; otherwise use built-in F2 protocol:
  1. Reproduce in smallest possible command/scope
  2. Produce new hypothesis before editing
  3. Make one focused attempt per hypothesis
- If no hypothesis is clear after two attempts, escalate to F3

### F3: Cross-module or high-risk failure
Trigger:
- Failure touches API, auth, data, concurrency, migration, build system
- More than one subsystem involved
- Debugging requires architecture decision
- F2 escalation (no clear hypothesis)

Required action:
- Upgrade task to L3
- Read-only discovery only
- Consult available skills (`grill-with-docs` if domain unclear, `systematic-debugging` for structured diagnosis)
- Ask developer to confirm diagnosis and repair plan

## Hard Constraints
- After the same failure appears twice, stop blind patching
- After a fix introduces a new failure, reclassify before editing again
- Default behavior after F2 is NOT to continue patching — enter read-only diagnosis
<!-- vibe-managed:end rule-failure-protocol -->
