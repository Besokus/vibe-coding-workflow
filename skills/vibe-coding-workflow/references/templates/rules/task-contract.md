<!-- vibe-managed:start rule-task-contract version=0.2 type=template -->
# Task Contract

## Structure
Before starting any L2 or L3 task, establish a Task Contract:

```
Task Contract:
- Goal:
- Level:
- Scope:
- Non-goals:
- Allowed actions:
- Confirmation needed before:
- Verification:
- Commit policy:
- Current evidence:
- Reclassification trigger:
```

## Rules
- If task exceeds Scope or touches Non-goals, stop and reconfirm.
- If verification fails, follow failure-protocol.md before retrying.
- If Commit policy is not explicitly set, default to "no auto-commit."
- Required for L2 and L3; optional for ambiguous L1.
- Must be updated when task level changes.

## Scope Boundary
Scope and Non-goals define the limits of what the AI may do.
Anything not listed in "Scope" is out of bounds unless explicitly confirmed.
<!-- vibe-managed:end rule-task-contract -->
