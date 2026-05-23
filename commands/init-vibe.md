---
description: Initialize project with Vibe Coding workflow. Detects tech stack, generates thin CLAUDE.md + .claude/rules/. Supports init, audit, and repair modes.
argument-hint: "[--dry-run | --force | --audit | --repair | --with-hooks | --minimal]"
---

# /init-vibe

Initialize the current project with the Vibe Coding 4-level workflow (L0-L3).

Invokes the `vibe-coding-workflow` skill to detect tech stack, generate CLAUDE.md and `.claude/rules/` files, and reference existing global tools (ECC rules, skills, agents).

## Usage

```
/init-vibe                  → audit-first: check existing, then ask init/repair/skip
/init-vibe --force          → init mode: fresh generate, overwrite CLAUDE.md if exists
/init-vibe --dry-run        → detect and show what WOULD be generated, no writes
/init-vibe --audit          → audit mode: check existing CLAUDE.md + rules, report issues
/init-vibe --repair         → repair mode: fix missing/broken files, preserve user edits
/init-vibe --with-hooks     → include optional hooks suggestions
/init-vibe --minimal        → generate CLAUDE.md only (no .claude/rules/ split)
```

## Mode Combinations

```
/init-vibe --audit --with-hooks    → audit + show hooks recommendations
/init-vibe --repair --with-hooks   → repair + generate hooks suggestions
/init-vibe --force --minimal       → thin CLAUDE.md only, no rules split
```

## What It Does

### Init Mode (default when no CLAUDE.md exists)

1. **Detect** — read project files to detect tech stack, package manager, verification commands
2. **Scan** — discover actually available global agents, skills, commands (no hardcoded lists)
3. **Generate** — create:
   - `CLAUDE.md` — thin project workflow entry point (~40 lines)
   - `.claude/rules/workflow-classification.md` — L0-L3 + DoD formula
   - `.claude/rules/verification-discipline.md` — verification + output format
   - `.claude/rules/bug-fix-discipline.md` — RED→GREEN bug fix workflow
   - `.claude/rules/confirmation-policy.md` — L0-L2 auto, L3 confirm
   - `.claude/rules/scope-control.md` — scope boundaries + incidental fix rule
   - `.claude/rules/failure-protocol.md` — 2-strike escalation
   - `.claude/rules/context-hygiene.md` — file responsibilities + cross-session recovery
   - `.claude/rules/git-workflow.md` — auto-commit triggers + commit boundaries + pre-commit verification
4. **Report** — detected stack, generated files, referenced global resources

### Audit Mode (--audit)

Checks existing workflow for 10 criteria: CLAUDE.md presence, tech stack section, rules references, verification commands, rules directory, individual rules files, command validity, CLAUDE.md length, scope control, confirmation policy. Reports PASS/FAIL for each. Never writes files.

### Repair Mode (--repair)

Fixes issues found by audit: generates missing files, updates stale tech stack, adds missing rules references, re-detects broken commands. Preserves user modifications — never overwrites customized sections.

## Output

```
## /init-vibe 完成

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
- CLAUDE.md — 项目工作流入口（薄）
- .claude/rules/*.md — 7 个规则文件

### 引用的全局资源
- ECC rules: ~/.claude/rules/ecc/common, ecc/web, ecc/zh
- Skills: planning-with-files, karpathy-guidelines, verification-before-completion, systematic-debugging
- Agents: code-reviewer, security-reviewer, tdd-guide, planner (等 N 个)

### Hooks 建议
[仅 --with-hooks 时显示]

现在可以直接说需求开始开发。AI 会自动按 L0-L3 分级执行。
运行 /init-vibe --audit 可随时检查工作流健康状况。
```
