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

1. Determine requested mode:
- `--audit` or phrases like "audit/check workflow" -> audit mode
- `--repair` or phrases like "repair/fix workflow" -> repair mode (managed block aware)
- `--with-hooks` -> same base mode, with hooks guidance
- `--profile fast|balanced|strict` -> set workflow profile (default: balanced)
- default `/init-vibe` -> init mode

2. Load only the mode reference you need:
- Init: `references/init-mode.md`
- Audit: `references/audit-mode.md`
- Repair: `references/repair-mode.md`

3. Load `references/templates.md` only when generating or repairing files.

4. Keep output contract stable per mode. Do not mix unrelated mode details into response.

## Hard Constraints

- Audit mode is read-only.
- Repair mode is additive and non-destructive.
- If user customizations are ambiguous, ask before touching that section.
- Do not overwrite user-authored sections unless explicitly requested.

