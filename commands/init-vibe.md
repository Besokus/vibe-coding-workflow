---
description: Initialize project with Vibe Coding workflow. Detects tech stack, generates thin CLAUDE.md + .claude/rules/. Supports init, audit, and repair modes.
argument-hint: "[--dry-run | --force | --audit | --repair | --with-hooks | --minimal | --profile fast|balanced|strict]"
---

# /init-vibe

Initialize the current project with the Vibe Coding 4-level workflow (L0-L3).

Invokes the `vibe-coding-workflow` skill to detect tech stack, generate CLAUDE.md and `.claude/rules/` files, and reference existing global tools (ECC rules, skills, agents).

## Usage

```
/init-vibe                  → audit-first: check existing, then ask init/repair/skip
/init-vibe --force          → init mode: fresh generate, overwrite CLAUDE.md if exists
/init-vibe --dry-run        → detect and show what WOULD be generated, no writes
/init-vibe --audit          → audit mode: semantic check of existing workflow (14+ criteria)
/init-vibe --repair         → repair mode: fix missing/broken, preserve user edits via managed blocks
/init-vibe --with-hooks     → include optional hooks suggestions
/init-vibe --minimal        → generate CLAUDE.md only (no .claude/rules/ split)
/init-vibe --profile fast   → compact L2 plans, no high-risk bypass
/init-vibe --profile strict → L1+ more confirmations, no auto-commit
/init-vibe --profile balanced → default; L2 confirm, L3 discovery-first
```

## Mode Combinations

```
/init-vibe --audit --with-hooks    → audit + show hooks recommendations
/init-vibe --repair --with-hooks   → repair + generate hooks suggestions
/init-vibe --force --minimal       → thin CLAUDE.md only, no rules split
/init-vibe --force --profile fast  → init with fast profile, overwrite existing
```

## What It Does

### Init Mode (default when no CLAUDE.md exists)

1. **Detect** — read project files to detect tech stack, package manager, verification commands
2. **Scan** — discover actually available global agents, skills, commands (no hardcoded lists), including project and user skills for dispatch registration
3. **Profile** — ask or detect profile preference (fast / balanced / strict)
4. **Generate** — create:
   - `CLAUDE.md` — thin project workflow entry point (~40 lines) with profile and always-load/on-demand split
   - `.claude/rules/rule-priority.md` — priority order + profile semantics
   - `.claude/rules/workflow-classification.md` — L0-L3 + reclassification checkpoints
   - `.claude/rules/task-contract.md` — per-task self-check baseline
   - `.claude/rules/confirmation-policy.md` — L0-L2 auto, L3+high-risk confirm
   - `.claude/rules/scope-control.md` — scope boundaries + drift correction
   - `.claude/rules/dirty-worktree-protection.md` — pre-edit dirty state check (P0)
   - `.claude/rules/command-policy.md` — risk-based command classification
   - `.claude/rules/planning-policy.md` — L2 plan gate, L3 discovery gate
   - `.claude/rules/failure-protocol.md` — F1/F2/F3 failure state machine + skill fallback
   - `.claude/rules/verification-discipline.md` — verification + output format
   - `.claude/rules/git-workflow.md` — auto-commit opt-in + hard boundaries
   - `.claude/rules/skill-dispatch.md` — skill dispatch registry with detected skills + fallbacks
   - `.claude/rules/context-hygiene.md` — file responsibilities + always-load/on-demand strategy
5. **Report** — detected stack, generated files with classification, referenced global resources, registered skills

### Audit Mode (--audit)

Performs both structural and semantic audit:
- Structural: checks file existence, profile presence, rules directories, managed block markers
- Semantic: rule conflict detection, L2/L3 gate strength, auto-commit safety, dirty worktree protection scope, skill reference validity, managed block consistency
Reports PASS/FAIL/WARN for each criterion with severity. Never writes files.

### Repair Mode (--repair)

Additive and non-destructive repair using managed block markers:
- Only updates content inside `<!-- vibe: managed -->` blocks
- User customizations outside managed blocks are preserved
- Files without managed blocks are skipped (reported as "user-owned, skipped")
- Generates missing files from templates (all 13 rules files)
- Re-detects stale tech stack, broken verification commands
- Updates skill-dispatch.md available skills section
- Use `--force` to regenerate files without managed blocks

## Output

```
## /init-vibe 完成

### Workflow Profile
- Profile: balanced

### 检测到的技术栈
- 语言: TypeScript
- 框架: Next.js 14
- 包管理: pnpm
- 测试: Vitest

### 验证命令
- build: pnpm build
- test: pnpm test
- lint: pnpm lint
- typecheck: pnpm typecheck

### 生成的文件
Always-load (日常任务加载):
- CLAUDE.md — 项目工作流入口
- .claude/rules/*.md — 6 条核心规则

On-demand (大任务时加载):
- .claude/rules/*.md — 7 条治理规则

### 引用的全局资源
- ECC rules: ~/.claude/rules/ecc/common, ecc/web, ecc/zh
- Skills: planning-with-files, karpathy-guidelines, verification-before-completion, systematic-debugging
- Agents: code-reviewer, security-reviewer, tdd-guide, planner (等 N 个)

### 已注册的技能
- ✅ systematic-debugging — exact match（带内置 fallback）
- ↪ grill-with-docs → 使用 my-doc-agent 作为替代（keyword: docs）
- ⛔ karpathy-guidelines — 未安装，使用 scope-control.md 作为 fallback

### Hooks 建议
[仅 --with-hooks 时显示]

现在可以直接说需求开始开发。AI 会自动按 L0-L3 分级执行。
L2 任务会先提供计划等你确认；L3 任务会先做 read-only 调研再出方案。
Profile 控制体验强度但不绕过安全边界。
运行 /init-vibe --audit 可随时检查工作流健康状态。
```
