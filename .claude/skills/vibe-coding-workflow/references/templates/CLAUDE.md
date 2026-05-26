# CLAUDE.md - [Project Name]

<!-- vibe-managed:start claude-metadata version=0.2 type=detected -->
## Tech Stack
- Language: [detected]
- Framework: [detected]
- Package manager: [detected]
- Test: [detected]

## Workflow Profile
- Profile: balanced  # balanced | fast | strict — see .claude/rules/rule-priority.md
- Auto-commit: off
- L2 confirmation: required
- L3 confirmation: required

## Verification Commands
build: [detected]
test: [detected]
lint: [detected]
typecheck: [detected]
<!-- vibe-managed:end claude-metadata -->

## Core Principles
- Prefer minimal correct changes
- Do not implement unrequested features
- Match existing project patterns
- No new dependencies/refactors unless required

## Workflow
- Classify task level (L0-L3), re-check before first edit and after failure
- L0/L1 direct, L2 requires plan confirmation, L3 read-only discovery first
- DoD = Level Baseline + Task-Derived Acceptance Criteria
- L3 and high-risk operations require developer confirmation

## Rules Index
<!-- vibe-managed:start claude-rules-index version=0.2 type=template -->
### Always-load
- `.claude/rules/rule-priority.md`
- `.claude/rules/workflow-classification.md`
- `.claude/rules/task-contract.md`
- `.claude/rules/confirmation-policy.md`
- `.claude/rules/scope-control.md`
- `.claude/rules/dirty-worktree-protection.md`

### On-demand
- `.claude/rules/command-policy.md`
- `.claude/rules/planning-policy.md`
- `.claude/rules/failure-protocol.md`
- `.claude/rules/verification-discipline.md`
- `.claude/rules/git-workflow.md`
- `.claude/rules/skill-dispatch.md`
- `.claude/rules/context-hygiene.md`
<!-- vibe-managed:end claude-rules-index -->
