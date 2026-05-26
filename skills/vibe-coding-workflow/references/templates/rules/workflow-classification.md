<!-- vibe-managed:start rule-workflow-classification version=0.2 type=template -->
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

## Downgrade Mechanics

Levels may be downgraded when discovery proves the scope is narrower than initially classified.

### L3 -> L2
- Allowed after read-only discovery proves scope is limited (2-3 files, single module, low risk)
- State evidence for downgrade (file count, modules touched, risk factors absent)
- Provide L2 plan and wait for confirmation before editing

### L2 -> L1
- Allowed if discovery proves the change is single-file, local, low-risk, and has clear acceptance criteria
- State evidence for downgrade (single file, no cross-module impact, tests not required)
- Continue with L1 focused validation

## Hard Rule
Downgrade is never automatic. The agent must explicitly state the downgrade, the evidence, and continue at the lower level's gate.
<!-- vibe-managed:end rule-workflow-classification -->
