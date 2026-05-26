# Audit Mode

## Entry

Use for explicit audit/check requests (`--audit`, "audit workflow", "check workflow health").

## Rule

Audit is read-only. Never write files.

## Structural Checklist

1. `CLAUDE.md` exists
2. `CLAUDE.md` has tech stack section
3. `CLAUDE.md` references `.claude/rules/`
4. `CLAUDE.md` includes verification commands
5. `CLAUDE.md` has workflow profile (fast / balanced / strict)
6. `.claude/rules/` directory exists
7. Required rules files exist (all 13: rule-priority, workflow-classification, task-contract, confirmation-policy, scope-control, dirty-worktree-protection, command-policy, planning-policy, failure-protocol, verification-discipline, git-workflow, skill-dispatch, context-hygiene)
8. Rules index is split into always-load and on-demand groups
9. Files are wrapped in versioned managed block markers (`<!-- vibe-managed:start -->` / `<!-- vibe-managed:end -->` with block ID, version, and type attributes)
10. Managed block marker versions are current (no stale templates)

## Semantic Audit

### Rule Conflicts
- Scan for contradictory instructions across rules
- Example: workflow-classification allowing auto-execute vs confirmation-policy requiring confirmation on the same scenario
- Example: scope-control forbidding incidental fixes vs another rule suggesting clean-as-you-go

### L2 Plan Gate Strength
- Verify that L2 truly requires plan confirmation before edits (not just "prefer" or "consider")
- Check that planning-policy.md exists and lists concrete deliverables (files, steps, acceptance criteria)
- Flag if L2 can be bypassed in fast profile without developer awareness

### L3 Discovery Gate Strength
- Verify that L3 truly restricts to read-only before direction confirmation
- Check that L3 discovery output includes findings, options, risks, and recommended path
- Flag if L3 allows any edits before developer confirms direction

### Auto-Commit Safety
- Check that auto-commit is opt-in (not enabled by default)
- Verify commit hard boundaries exist (validation, staging, L2/L3 gates)
- Flag any unconditional auto-commit language

### Dirty Worktree Protection
- Check that dirty-worktree-protection.md exists
- Verify it guards pre-edit (not just pre-commit)
- Flag if it only checks at commit time
- Verify policy permits safe minimal patches to unrelated dirty files
- Verify policy forbids touching unrelated dirty hunks
- Flag contradictory language ("never touch" vs "patch minimally" in same rule)

### Skill Reference Validity
- Check that skill-dispatch.md references exist as either:
  - Project-local skills (`.claude/skills/*/SKILL.md`)
  - User-global skills (`~/.claude/skills/*/SKILL.md`)
- Flag references to skills that are neither installed nor have a documented fallback

### Managed Block Consistency
- Check that rule files have `<!-- vibe-managed:start -->` / `<!-- vibe-managed:end -->` markers with block IDs
- Flag files with old-style `<!-- vibe: managed -->` markers (needs migration)
- Verify marker format: `<!-- vibe-managed:start <block-id> version=<version> type=<type> -->`
- Flag files where block IDs don't match expected IDs from templates
- Flag files with missing version or type attributes

### Stale Template Versions
- Check marker version attribute against current template version (0.2)
- Report blocks with version < 0.2 as stale, recommend `--repair`
- Report unknown block IDs (not in the managed block registry) as potentially user-added

### CLAUDE.md Size
- Warn if CLAUDE.md exceeds 60 lines (indicates rule content leaking out of .claude/rules/)

### Output Format
- Verify the output contract is compact: status per check, not raw file dumps

## Output Contract

Return:
- structural checks (passed / failed / missing)
- semantic issues with severity (warning / blocking)
- specific file locations for each issue
- repair recommendation command

Example recommendation:
- `/init-vibe --repair` for structural issues
- `/init-vibe --repair --force` for missing managed blocks
- Manual edit for rule conflicts
