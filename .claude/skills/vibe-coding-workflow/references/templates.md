# Templates

This file is the template index. It describes how variables are populated and which
individual template files to use. Individual template payloads live in the `templates/` directory.

## Usage

When generating or repairing workflow files, read template content from:

| Target File | Template Source | Type |
|-------------|----------------|------|
| `CLAUDE.md` | `templates/CLAUDE.md` | Dynamic variables filled from project detection |
| `.claude/rules/rule-priority.md` | `templates/rules/rule-priority.md` | Static, copy as-is |
| `.claude/rules/workflow-classification.md` | `templates/rules/workflow-classification.md` | Static, copy as-is |
| `.claude/rules/task-contract.md` | `templates/rules/task-contract.md` | Static, copy as-is |
| `.claude/rules/confirmation-policy.md` | `templates/rules/confirmation-policy.md` | Static, copy as-is |
| `.claude/rules/scope-control.md` | `templates/rules/scope-control.md` | Static, copy as-is |
| `.claude/rules/dirty-worktree-protection.md` | `templates/rules/dirty-worktree-protection.md` | Static, copy as-is |
| `.claude/rules/command-policy.md` | `templates/rules/command-policy.md` | Static, copy as-is |
| `.claude/rules/planning-policy.md` | `templates/rules/planning-policy.md` | Static, copy as-is |
| `.claude/rules/failure-protocol.md` | `templates/rules/failure-protocol.md` | Static, copy as-is |
| `.claude/rules/verification-discipline.md` | `templates/rules/verification-discipline.md` | Static, copy as-is |
| `.claude/rules/git-workflow.md` | `templates/rules/git-workflow.md` | Static, copy as-is |
| `.claude/rules/skill-dispatch.md` | `templates/rules/skill-dispatch.md` | Static content + dynamic available skills block |
| `.claude/rules/context-hygiene.md` | `templates/rules/context-hygiene.md` | Static, copy as-is |

## Variable Filling

When generating `CLAUDE.md`, replace `[detected]` placeholders with values detected from the project:

| Placeholder | Detection Source |
|-------------|-----------------|
| `[Project Name]` | `package.json#name`, `pyproject.toml`, `go.mod`, or directory basename |
| `[detected]` Language | `package.json` → Node, `pyproject.toml` → Python, `go.mod` → Go, `Cargo.toml` → Rust, `pom.xml` → Java |
| `[detected]` Framework | `next.config.*` → Next.js, `vite.config.*` → Vite, `svelte.config.*` → Svelte |
| `[detected]` Package manager | Lock file detection: `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `package-lock.json` → npm |
| `[detected]` Test | `jest.config.*` → Jest, `vitest.config.*` → Vitest, `pytest` → pytest, `go test` → Go test |
| `[detected]` build/test/lint/typecheck | From `package.json` scripts or detected tooling |

## Managed Block Markers

When generating or repairing rules files, wrap generated content in versioned managed block markers:

```markdown
<!-- vibe-managed:start block-id version=0.2 type=template|detected -->
...generated content...
<!-- vibe-managed:end block-id -->
```

### Block ID Registry

| Block ID | File | Type | Purpose |
|----------|------|------|---------|
| `claude-metadata` | CLAUDE.md | detected | Tech stack, profile, verification commands |
| `claude-rules-index` | CLAUDE.md | template | Rules index |
| `rule-priority` | rule-priority.md | template | Priority order + profile semantics |
| `rule-workflow-classification` | workflow-classification.md | template | L0-L3 + reclassification |
| `rule-task-contract` | task-contract.md | template | Per-task self-check |
| `rule-confirmation-policy` | confirmation-policy.md | template | Confirmation levels |
| `rule-scope-control` | scope-control.md | template | Scope boundaries |
| `rule-dirty-worktree` | dirty-worktree-protection.md | template | Pre-edit dirty state check |
| `rule-command-policy` | command-policy.md | template | Risk-based command classification |
| `rule-planning-policy` | planning-policy.md | template | L2/L3 planning gates |
| `rule-failure-protocol` | failure-protocol.md | template | F1/F2/F3 state machine |
| `rule-verification-discipline` | verification-discipline.md | template | Verification + output format |
| `rule-git-workflow` | git-workflow.md | template | Auto-commit + boundaries |
| `rule-skill-dispatch` | skill-dispatch.md | template | Skill registry |
| `rule-skill-dispatch-available` | skill-dispatch.md | detected | Available skills table |

### Refresh Rules

- **type=template**: Replace entire content between markers from template (static).
- **type=detected**: Re-detect values from project files, then fill in (never use template placeholders).
- Content outside markers: user-owned, never touched during repair.
- Files without markers: treated as fully user-owned; repair skips unless `--force`.

### Stale Detection

During audit, compare marker `version` against the current template version.
If versions differ, report as stale and recommend `--repair`.
