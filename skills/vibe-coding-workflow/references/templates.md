# Templates

This file stores reusable template payloads for generation/repair phases.
Load only when writing files.

## `CLAUDE.md` Template (Thin)

```markdown
# CLAUDE.md - [Project Name]

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
```

## Rules Files

Generate and maintain the following files when initializing or repairing.

### `rule-priority.md`

```markdown
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
```

### `workflow-classification.md`

```markdown
# Workflow Classification

## L0: Tiny
Examples: typo, copy text, comments, formatting-only

Allowed:
- direct edit
- no plan

Must upgrade if:
- touches logic
- test/build needed
- more than one file

## L1: Small
Examples: single-file local logic fix, obvious bug with known root cause, small config/doc update

Allowed:
- inspect nearby context
- make minimal edit
- run focused validation

Must upgrade if:
- needs design choice
- changes behavior beyond one local path
- first fix fails
- touches public API or dependency config

## L2: Planned Change
Examples: 2-3 files, feature-sized behavior change, bugfix requiring tests, non-trivial refactor inside one module

Gate:
- AI must propose a compact plan first
- developer must confirm before edits
- plan must list files, acceptance criteria, verification

Must upgrade to L3 if:
- touches 4+ files
- cross-module behavior
- auth/security/data/schema/performance/concurrency
- architecture decision
- unclear desired behavior
- repeated failure

## L3: Discovery First
Examples: broad feature, architecture/refactor, security/auth/data migration, unclear product behavior, debugging across subsystems

Gate:
- AI may only do read-only discovery first
- no edits before developer confirms direction
- discovery output must include findings, options, risks, recommended path

## Reclassification Checkpoints

The agent must re-check task level:
- before first edit
- after reading initial files
- before editing a second file
- after first failed verification
- when discovering public API/config/schema/security impact
- when acceptance criteria are unclear

If actual scope exceeds current level:
- stop
- state old level -> new level
- explain trigger
- follow the higher-level gate before continuing

If L1 becomes L2:
- stop editing
- propose plan
- wait for developer confirmation

If L2 becomes L3:
- stop editing
- switch to read-only discovery
- summarize already changed files
- ask developer whether to keep, revert, or continue from current state
```

### `task-contract.md`

```markdown
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
```

## Rules
- If task exceeds Scope or touches Non-goals, stop and reconfirm.
- If verification fails, follow failure-protocol.md before retrying.
- If Commit policy is not explicitly set, default to "no auto-commit."

## Scope Boundary
Scope and Non-goals define the limits of what the AI may do.
Anything not listed in "Scope" is out of bounds unless explicitly confirmed.
```

### `confirmation-policy.md`

```markdown
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
```

### `scope-control.md`

```markdown
# Scope Control

## Hard Boundaries
- Only implement what was explicitly requested
- No incidental fixes, no speculative abstractions
- No new dependencies or refactors unless required

## Scope Drift Correction
If implementation reveals a better but broader solution:
- do not silently expand scope
- report the tradeoff
- ask developer whether to switch scope

## Skill Constraint
When consulting another skill, keep the current task scope.
A skill may refine method, not expand objective.
```

### `dirty-worktree-protection.md`

```markdown
# Dirty Worktree Protection

## Pre-Edit Check (P0 — runs before any edit, not only before commit)
Before editing any file:
- Check `git status` if inside a git repo
- Identify pre-existing uncommitted changes
- Do NOT overwrite, reformat, stage, stash, reset, or commit unrelated user changes
- If target files contain unrelated user edits, patch only the minimal region
- If safe patching is not possible, stop and ask the developer

## Hard Rules
- Never touch files that have pre-existing unrelated dirty state
- Never stage or commit changes the developer did not explicitly request
- If a file must be modified but contains unrelated user changes, patch only the exact lines needed
```

### `command-policy.md`

```markdown
# Command Policy

## Risk-Based Classification

### Allowed (no confirmation needed)
- read-only commands (cat, ls, git log, git diff, grep, glob)
- focused tests for changed code
- lint / typecheck
- build (on project that already builds)

### Confirm first (ask before running)
- dependency install (npm install, pip install, etc.)
- broad format that touches untouched files
- generated-file rewrite (lockfiles, artifacts, dist/)
- git branch / checkout

### Must confirm (requires explicit developer approval)
- database migration
- deploy / publish
- destructive filesystem operations (rm -rf, del)
- git reset (any form except soft HEAD~1 for commit fixup)
- git clean
- force push

### Never without explicit request
- rm -rf (on non-generated directories)
- git reset --hard
- force push to main/master
- publish to package registries
```

### `planning-policy.md`

```markdown
# Planning Policy

## L2 Plan Gate
Before implementation, provide:
- task interpretation
- files likely to change
- 2-4 step plan
- acceptance criteria
- validation commands
- explicit non-goals

Wait for developer confirmation.

In fast profile, plan may be shorter but must still cover files, steps, and acceptance criteria.

## L3 Discovery Gate
Before any edit:
- inspect repository read-only
- identify relevant modules and ownership boundaries
- list options with tradeoffs
- call out risks and unknowns
- recommend one path
- ask developer to confirm target outcome and implementation boundary

## Related Skills
- See `skill-dispatch.md` for available skills and fallbacks
```

### `failure-protocol.md`

```markdown
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
```

### `verification-discipline.md`

```markdown
# Verification Discipline

## Level-Based Verification
- L0: visual check, no syntax errors
- L1: targeted type-check or in-scope test
- L2: targeted test + type-check + lint; plan must list verification commands
- L3: full validation + regression + rollback plan; discovery phase only proposes verification plan

## Verification Requirements
- No completion claims without fresh evidence
- Full log to `.ai/logs/`
- No verbal claims — show command output
- Task is not complete until:
  - level gate was satisfied
  - task acceptance criteria passed
  - required verification ran
  - failures were handled through failure-protocol.md

## Failure Handling
- On verification failure -> follow failure-protocol.md
- Do not claim completion with failed verification
```

### `git-workflow.md`

```markdown
# Git Workflow

## Auto-commit is opt-in
Never commit unless one of these is true:
- developer explicitly asks to commit
- project CLAUDE.md explicitly enables auto-commit
- current task instruction explicitly says auto-commit is allowed

## Commit Hard Boundaries
Before commit:
- worktree reviewed with git status
- only task-related files staged
- validation passed or failure is explicitly documented
- no secrets, env files, lockfile churn, generated noise, or unrelated formatting
- commit message describes user-facing intent
- L2 requires developer-confirmed plan
- L3 requires developer-confirmed implementation path

## Never auto-commit
- after failed validation
- after L3 discovery only
- when unrelated files are dirty
- when generated files are unexpectedly changed
- when user customizations may be overwritten

## Staging Rule
Stage files explicitly by name. Do not use broad staging (git add -A) unless developer explicitly requested it.
```

### `skill-dispatch.md`

```markdown
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
<!-- This section is populated by /init-vibe with detected skills.
     Format:
     - ✅ systematic-debugging (exact match)
     - ↪ my-debug-agent (alternative for: diagnose) — keywords: debug, troubleshoot
     - ⛔ karpathy-guidelines (not found, fallback active)
-->

## Constraint
Skills assist diagnosis and planning. They do not bypass L2/L3 confirmation gates.
```

### `context-hygiene.md`

```markdown
# Context Hygiene

## File Responsibilities
- CLAUDE.md: project entry point, tech stack, profile, verification commands
- .claude/rules/: detailed workflow rules
- .ai/logs/: verification evidence, findings, progress

## Loading Strategy
- Always-load files (rule-priority, workflow-classification, task-contract, confirmation-policy, scope-control, dirty-worktree-protection) are consulted on every task
- On-demand files (command-policy, planning-policy, failure-protocol, verification-discipline, git-workflow, skill-dispatch, context-hygiene) are loaded when the relevant situation arises

## When to /clear
- before starting a significantly different task
- when response quality degrades
- after 3+ failed attempts on the same issue
- when context feels bloated

## Cross-Session Recovery
- Use planning-with-files for persistent task plans
- On session start, check .ai/logs/ and task_plan.md for context
```

## Managed Block Markers

When generating or repairing rules files, wrap generated content in managed block markers:

```markdown
<!-- vibe: managed -->
...generated content...
<!-- /vibe: managed -->
```

User modifications outside these markers are preserved during repair.
Files without markers are treated as fully user-owned; repair will skip them unless `--force` is used.
