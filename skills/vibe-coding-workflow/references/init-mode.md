# Init Mode

## Entry

Use for explicit initialization requests (`/init-vibe`, "init project workflow", "setup workflow").

### Pre-Guard: Existing CLAUDE.md Check

Before any detection steps:

- Check if `CLAUDE.md` already exists in project root
- If it exists AND `--force` was NOT requested:
  - **Switch to audit-first mode** — run a lightweight audit of existing workflow
  - Report findings (profile, file count, structural issues)
  - Ask developer: `[init (replace)]` / `[repair (fix issues)]` / `[skip]`
  - Do NOT proceed to generate files unless developer chooses "init"
- If `--force` was requested: proceed with init (overwrites existing CLAUDE.md)

### Flag Modifiers

These flags modify init behavior and must be checked at each step:

- `--dry-run`: Run detection + scan + report. Skip all file writes. Show "Would generate: ..." in output.
- `--minimal`: Run full detection cycle, generate CLAUDE.md only. Skip `.claude/rules/` generation.
- `--profile fast|balanced|strict`: Set workflow profile (default: balanced).

### Dry-Run Short-Circuit

If `--dry-run`:
1. Run steps 1-4 (detect, scan, profile selection)
2. Show generation preview with "Would generate:" prefix
3. Skip steps 5-7 entirely
4. Produce output report with `[DRY RUN — no files written]` banner
5. Return immediately

### Init Steps

1. Detect project context from common files (all optional):
- `package.json`
- `pyproject.toml` / `requirements.txt`
- `go.mod`
- `Cargo.toml`
- `pom.xml` / `build.gradle*`
- `composer.json`
- `Gemfile`
- `CMakeLists.txt`
- `next.config.*` / `vite.config.*` / `svelte.config.*`
- `tsconfig.json`
- `Dockerfile` / `docker-compose.yml`
- `.github/` / `.gitlab-ci.yml`

2. Detect available verification commands from project scripts/tooling:
- `build`, `test`, `lint`, `typecheck`, `format`

3. Scan skills — both project-local and user-global — for dispatch registration:
- Project skills: `.claude/skills/*/SKILL.md`
- User skills: `~/.claude/skills/*/SKILL.md`
- Available agents: `.claude/agents/*.md` and `~/.claude/agents/*.md`
- Available commands: `.claude/commands/*.md` and `~/.claude/commands/*.md`
- ECC rules: `~/.claude/rules/ecc/`

   For each referenced skill in `skill-dispatch.md`, use three-tier matching:

   **Tier 1 — Exact match:** name matches an installed skill/agent → `[available]`

   **Tier 2 — Functional alternative:** no exact match found. Scan `name` and `description` of all installed skills/agents for keyword affinity using this reference map:

   | Referenced Skill | Alternative Keywords to Match |
   |---|---|
   | `systematic-debugging` | debug, diagnose, troubleshoot, bug, root-cause, trace, investigation |
   | `diagnose` | debug, troubleshoot, root-cause, investigation, trace, log-analysis |
   | `grill-with-docs` | docs, document, research, understand, clarify, domain, reference, context7 |
   | `grill-me` | review, critique, stress-test, challenge, assumptions, verify-plan |
   | `karpathy-guidelines` | simplify, minimal, surgical, clean, reduce, scope, refactor, guideline, principle |
   | `writing-plans` | plan, planning, strategy, roadmap, decompose, task-breakdown |
   | `verification-before-completion` | verify, validate, test, check, confirm, complete, done, quality |
   | `planning-with-files` | plan, task, persist, track, progress, todo, checkpoint, milestone |
   | `receiving-code-review` | review, feedback, pr, pull-request, code-quality, cr |

   For each keyword match found, record it as `[alternative]` with the discovered skill name and why it matches.

   **Tier 3 — No match:** no exact match and no keyword affinity → `[fallback]` (use built-in protocol)

   Write the complete three-tier dispatch table into the generated `skill-dispatch.md`.

4. Ask developer for profile preference (or detect from flags):
- `--profile fast` — compact L2 plans, but still require confirmation; no high-risk bypass
- `--profile balanced` — default; L2 confirm, L3 discovery-first
- `--profile strict` — L1+ more frequent confirmation; no auto-commit

   Default to `balanced` if not specified.

5. Generate project `CLAUDE.md` (thin entrypoint) with profile and rules split into always-load / on-demand.
   Use the template from `templates/CLAUDE.md` (indexed by `templates.md`) — managed blocks are already segmented:
   - Tech Stack / Profile / Verification Commands inside `<!-- vibe-managed:start claude-metadata -->` (auto-refreshable, re-detected on repair)
   - Core Principles / Workflow outside managed blocks (user-customizable, never overwritten)
   - Rules Index inside `<!-- vibe-managed:start claude-rules-index -->` (template-driven, refreshed from template on repair)

6. If `--minimal` was NOT requested, generate `.claude/rules/` files — all 13 rules using versioned managed block markers (`<!-- vibe-managed:start block-id version=0.2 type=template|detected -->`). Read each rule template from `references/templates/rules/<name>.md`:
   - `rule-priority.md`
   - `workflow-classification.md`
   - `task-contract.md`
   - `confirmation-policy.md`
   - `scope-control.md`
   - `dirty-worktree-protection.md`
   - `command-policy.md`
   - `planning-policy.md`
   - `failure-protocol.md`
   - `verification-discipline.md`
   - `git-workflow.md`
   - `skill-dispatch.md`
   - `context-hygiene.md`

   Wrap generated content in `<!-- vibe-managed:start block-id version=0.2 type=... -->` / `<!-- vibe-managed:end block-id -->` blocks. Use block IDs from the registry in `templates.md` managed block markers section.

7. If `--with-hooks` is requested, provide hooks suggestions (do not auto-enable).

## Files To Generate

All files (default):
- `CLAUDE.md`
- `.claude/rules/rule-priority.md`
- `.claude/rules/workflow-classification.md`
- `.claude/rules/task-contract.md`
- `.claude/rules/confirmation-policy.md`
- `.claude/rules/scope-control.md`
- `.claude/rules/dirty-worktree-protection.md`
- `.claude/rules/command-policy.md`
- `.claude/rules/planning-policy.md`
- `.claude/rules/failure-protocol.md`
- `.claude/rules/verification-discipline.md`
- `.claude/rules/git-workflow.md`
- `.claude/rules/skill-dispatch.md`
- `.claude/rules/context-hygiene.md`

Minimal mode (`--minimal`): `CLAUDE.md` only (no `.claude/rules/` files).

Use `references/templates.md` for exact template content.

## Output Contract

Return:
- operation mode: init / dry-run / minimal
- if dry-run: `[DRY RUN — no files written]` banner at top of report
- selected profile (fast / balanced / strict)
- detected stack summary
- selected verification commands
- generated file list with always-load / on-demand classification
- referenced global resources summary (skills, agents, commands, ECC rules)
- detected and registered skills summary (three-tier status per referenced skill:
  - ✓ `systematic-debugging` — exact match
  - ~ `grill-with-docs` → using `my-doc-agent` as alternative (keyword: docs)
  - ✗ `karpathy-guidelines` — not found, using fallback)
- recommended installations for critical/recommended missing skills (one-line hint, no verbose prompt)
- optional hooks suggestions if requested
