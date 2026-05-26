---
name: vibe-coding-workflow
description: |
  Project workflow initializer and maintainer for Claude Code.
  Use only for explicit init/audit/repair requests such as:
  "/init-vibe", "init project workflow", "audit workflow", "repair workflow".
  Do not use this skill for daily coding tasks.
---

# Vibe Coding Workflow Router

This skill is a mode router. Keep runtime context minimal.

## Scope Guard

- Trigger only when user explicitly asks for workflow bootstrap/maintenance.
- Never use this skill for normal coding requests.
- After initialization, runtime governance is in project `CLAUDE.md` and `.claude/rules/`.

## Dispatch

1. **Determine base mode** (first match):
- `--audit` or phrases like "audit/check workflow" -> audit mode
- `--repair` or phrases like "repair/fix workflow" -> repair mode
- default `/init-vibe` -> init mode

2. **Determine modifiers** (always evaluated, independent of base mode):
- `--dry-run` or "preview/show what would be generated" -> modifier: dry_run = true
- `--minimal` or "CLAUDE.md only" -> modifier: minimal = true
- `--profile fast|balanced|strict` -> modifier: profile = <value> (default: balanced)
- `--with-hooks` -> modifier: with_hooks = true

3. **Apply modifiers to base mode**:
- `dry_run` + init -> run detection + report only, skip all file writes
- `minimal` + init -> generate CLAUDE.md only, skip `.claude/rules/`
- `dry_run` + audit -> no effect (audit is already read-only)
- `minimal` + audit/repair -> no effect (--minimal only applies to init)
- `profile` + any -> pass profile value to mode reference, each mode handles profile contextually
- `with_hooks` + any -> include hooks suggestions in output

4. **Load references**:
- Audit mode: `references/audit-mode.md`
- Repair mode: `references/repair-mode.md`
- Init mode: `references/init-mode.md` (pass modifiers: dry_run, minimal, profile, with_hooks)
- Templates: `references/templates.md` (only when generating or repairing files)

5. Keep output contract stable per mode. Do not mix unrelated mode details into response.

## Hard Constraints

- Audit mode is read-only.
- Repair mode is additive and non-destructive.
- If user customizations are ambiguous, ask before touching that section.
- Do not overwrite user-authored sections unless explicitly requested.

