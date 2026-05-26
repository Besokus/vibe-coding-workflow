<!-- vibe-managed:start rule-priority version=0.2 type=template -->
# Rule Priority

## When rules conflict, apply the stricter rule.
If unsure, stop and ask the developer.

## Priority Order (1 = highest)

1. Developer's latest explicit instruction
2. Safety / confirmation policy
3. Dirty worktree protection (pre-edit check)
4. Scope control
5. Workflow classification (L0-L3)
6. Task contract (per-task self-check)
7. Command policy (risk-based command classification)
8. Failure protocol (F1/F2/F3)
9. Verification discipline
10. Git workflow
11. Skill dispatch

## Workflow Profiles

### fast
- L2 may use a shorter plan but still requires developer confirmation
- Must NOT bypass high-risk confirmations (auth, security, data, destructive ops)
- L3 discovery-first remains active

### balanced (default)
- L2 requires plan confirmation before implementation
- L3 requires read-only discovery before edits
- Standard confirmation policy applies

### strict
- L1+ requires more frequent confirmation checkpoints
- Auto-commit is forbidden unless explicitly authorized by developer
- Reclassification checkpoints are enforced more aggressively
- All git writes (stage, commit, push) require explicit developer instruction

## Design Principle

vibe-coding-workflow optimizes for low-friction execution under clear boundaries:
small tasks move fast, medium tasks require lightweight alignment,
and large or risky tasks require discovery-first governance.
<!-- vibe-managed:end rule-priority -->
