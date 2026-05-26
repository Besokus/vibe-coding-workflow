# Vibe Coding Workflow

**4-Level (L0-L3) AI-Assisted Development Workflow — Init, Audit, Repair**

A structured workflow system for Claude Code that brings discipline, predictability, and context efficiency to AI-assisted software development. Automatically classifies tasks by complexity, enforces verification at every level, and keeps the AI focused on what you actually asked for.

`vibe-coding` `ai-coding` `ai-assisted-development` `prompt-engineering` `developer-workflow` `coding-agent` `spec-driven-development` `task-decomposition` `llm-workflow` `software-development`

---

## Quick Start

### 安装

**方式一：npx（推荐）**
```bash
# 在你的项目根目录执行：安装到 .claude/（项目范围）
npx vibe-coding-workflow

# 安装到 ~/.claude/（全局范围，所有项目可用）
npx vibe-coding-workflow --scope user
```

**方式二：npm（可选）**
```bash
# 全局安装（安装到 ~/.claude/，适合想在所有项目里使用）
npm install -g vibe-coding-workflow
```

**方式三：一键脚本**
```bash
# macOS / Linux
sh install.sh

# Windows PowerShell
.\install.ps1
```

**方式四：手动安装**
```
下载本项目，将以下文件复制到对应位置：

~/.claude/skills/vibe-coding-workflow/SKILL.md
~/.claude/commands/init-vibe.md
```
> 各平台目录说明见下方 [手动安装说明](#手动安装说明)

### 初始化项目

```bash
cd your-project
/init-vibe
```

AI 自动检测技术栈、扫描可用的全局工具，生成 CLAUDE.md + `.claude/rules/`。

### 开始开发

直接说需求，AI 自动分级执行：

```
L1 | 添加用户头像上传接口
  → DoD: 4xx 校验通过 + 文件落盘 + typecheck pass
```

L0/L1 静默执行不打断；L2 需先提计划确认后再执行；L3 和安全敏感操作会暂停确认。

---

## Highlights

- **L0-L3 Task Classification** — AI auto-classifies tasks into 4 levels so simple changes stay fast and risky changes get proper process
- **Reclassification Checkpoints** — AI re-checks task level before first edit, after failure, and when scope expands, preventing silent underestimation
- **L2 Plan Gate** — medium tasks require a proposed plan (files, steps, acceptance criteria) and developer confirmation before implementation
- **L3 Discovery-First** — complex tasks start read-only, producing findings and options before any code is written
- **Definition of Done Formula** — `DoD = Level Baseline + Task-Derived Acceptance Criteria`, adapts to every task without being too rigid or too vague
- **Zero Distraction for Simple Work** — L0/L1 execute silently with no interruptions; L2 requires plan confirmation before implementation; L3 and high-risk operations require appropriate confirmation
- **Context Hygiene Built In** — 13 generated rules files (6 always-load + 7 on-demand) define exactly when to `/clear`, what each file is responsible for, and how to recover across sessions
- **Profiles** — fast/balanced/strict profiles control experience intensity without bypassing safety boundaries
- **Managed Block Repair** — `--repair` only updates vibe-managed blocks, preserving user customizations
- **Self-Healing** — audit and repair modes let you check and fix workflow health at any time
- **Plugs Into Your Existing Toolchain** — detects and references your existing ECC rules, agents, skills, and commands instead of duplicating them
- **Thin CLAUDE.md** — the generated CLAUDE.md is ~40 lines; detailed rules live in `.claude/rules/`

---

## What Pain Points It Solves

| Problem | How It Solves |
|---------|---------------|
| **AI does too much** — adds features you didn't ask for, refactors unrelated code | Scope control rules enforce: only what's explicitly requested, no "incidental fixes", no speculative abstractions. Scope drift correction: AI must report better-but-broader solutions instead of silently expanding |
| **Context rot** — long sessions degrade AI quality, context window fills with noise | Context hygiene rules define when to `/clear`, what goes in which file, and how to recover across sessions |
| **Unstable workflow** — sometimes you plan, sometimes you don't, no consistent process | L0-L3 classification forces the right level of process for each task automatically |
| **AI underestimates complexity** — starts editing a "simple fix" that turns into cross-module changes | Reclassification checkpoints: AI re-checks task level before first edit, at second file, and after failure. Scope escalation pauses for developer decision |
| **Same bug fixed 3 times** — AI patches the same symptom repeatedly without diagnosing root cause | 2-strike protocol: after 2 failures, stop patching, re-diagnose, escalate |
| **No recovery after /clear** — lose all context of what you were doing | Cross-session recovery via task_plan.md, findings.md, progress.md — new sessions pick up where you left off |
| **Over-interruption** — AI asks for confirmation on trivial changes | Confirmation policy: L0/L1 auto-execute, L2 requires plan confirmation, only L3 and high-risk ops block |
| **CLAUDE.md bloat** — rules files that grow to 200+ lines and nobody reads them | Thin CLAUDE.md (~40 lines) + 13 focused rules files in `.claude/rules/` with always-load/on-demand split |
| **Manual mode selection** — you have to tell the AI what complexity level to use for each task | Task classification protocol with hard upgrade conditions (file count, security, API changes, failure count) — the AI determines the level automatically |

---

## The L0-L3 Model

| Level | Scope | Gate | Baseline DoD |
|-------|-------|------|-------------|
| **L0** | Typo,文案,注释,纯样式微调 | 无限制，直接改 | 变更可见 + 无语法错误 |
| **L1** | 单文件,代码逻辑小改,一行修复 | 附近代码检查后最小 patch | targeted type-check 或 scope 内单测 |
| **L2** | 2-3 文件,业务逻辑变更,新增测试 | **须先提计划**（文件清单+步骤+验收标准），开发者确认后方可实现 | targeted test + type-check + lint |
| **L3** | 3+ 文件,安全/API/性能/重构 | **仅 read-only discovery**，出 findings+options+risks，开发者确认方向后才可编辑 | 完整验证 + 回归 + rollback plan |

### Upgrade Conditions (Hard Rules, Not AI Judgment)

**Upgrade to L2:** changes business logic, needs tests, touches 2+ files, needs to read existing patterns.

**Upgrade to L3:** touches 4+ files (or 3+ with cross-module), involves auth/security/payments/migration/cache/concurrency, changes public API/schema/config, first fix attempt failed, test failure cause unclear, architecture decision needed.

**Reclassification Checkpoints (Mandatory):**
The agent must re-check task level at: before first edit, after reading initial files, before editing a second file, after first failed verification, when discovering API/config/schema/security impact, when acceptance criteria are unclear.

**If scope exceeds current level:**
- L1→L2: stop editing, propose plan, wait for confirmation
- L2→L3: stop editing, switch to read-only discovery, summarize changes so far, ask developer whether to keep/revert/continue

---

## Definition of Done

```
DoD = Level Baseline + Task-Derived Acceptance Criteria
```

**Level Baseline** — the minimum verification gate for that level (see table above)

**Task-Derived Acceptance Criteria** — AI derives 2-3 specific conditions from your request:

```
你: "新增用户头像上传接口"
  → AC1: POST /user/avatar 返回 200，文件落盘
  → AC2: 无效格式返回 400
  → AC3: 超过 2MB 返回 413
```

Both must pass. Neither alone is sufficient.

**Completion requires all four:**
1. Level gate was satisfied (L2 plan confirmed / L3 direction confirmed)
2. Task acceptance criteria passed
3. Required verification ran (per level, fresh evidence)
4. Failures were handled through failure-protocol.md

---

## Workflow Profiles

The workflow profile controls experience intensity without reducing hard safety boundaries.

| Profile | L2 Plan | L3 Discovery | Auto-Commit | Confirmation |
|---------|---------|--------------|-------------|--------------|
| **fast** | Compact plan, still requires confirmation | Read-only discovery, no edits before direction | Opt-in only | Does NOT bypass high-risk (auth, security, data, destructive ops) |
| **balanced** (default) | Full plan (files, steps, acceptance criteria) | Same as fast | Opt-in only | Standard L0-L3 policy |
| **strict** | Full plan + more frequent re-checks | Same as fast + stricter scope enforcement | Forbidden unless explicit dev authorization | L1+ more frequent checkpoints, all git writes require explicit instruction |

**Key constraint across all profiles:** Fast profile cannot bypass confirmation-policy.md "Always L3" items (auth, security, payments, DB schema, etc.). The profile only affects routine task flow, never safety.

---

## Managed Block Repair

When `--repair` runs, it respects managed block markers to preserve your customizations:

```
# In any generated file:
<!-- vibe-managed:start claude-metadata version=0.2 type=detected -->
...generated content (will be refreshed by --repair)...
<!-- vibe-managed:end claude-metadata -->

...your custom content (preserved across --repair)...
```

- Content inside `<!-- vibe-managed:start -->` / `<!-- vibe-managed:end -->` blocks gets refreshed from templates, matched by block ID
- Content outside these markers is left untouched
- Files without managed block markers are treated as fully user-owned and are skipped during repair
- Use `--force` to regenerate a file entirely from its template

This allows you to add custom rules, notes, or modifications to any generated file without losing them on repair.

---

## Output Examples

### Success (compact)
```
Done:
- Changed: src/user/avatar.ts — added POST /user/avatar endpoint
- Verified: `pnpm typecheck` passed, `pnpm test` passed (3/3)
- Commit: not committed
```

### Blocked (failure with clear next step)
```
Blocked:
- Command: pnpm test
- Error: 1 test failed — avatar.test.ts:42 expected 200 got 400
- Likely cause: file size validation rejecting valid payload
- Next safe step: check file size threshold in avatar.test.ts
- Need confirmation: yes
```

---

## Command Reference

```
/init-vibe                      → audit-first: check existing, then ask init/repair/skip
/init-vibe --force              → init mode: fresh generate, overwrite if exists
/init-vibe --dry-run            → detect and show what WOULD be generated, no writes
/init-vibe --audit              → audit mode: semantic check (14+ criteria, never writes)
/init-vibe --repair             → repair mode: managed block repair, preserve user edits
/init-vibe --with-hooks         → include optional hooks configuration suggestions
/init-vibe --minimal            → generate CLAUDE.md only (no .claude/rules/ split)
/init-vibe --profile fast       → compact L2 plans, no high-risk bypass
/init-vibe --profile strict     → L1+ more confirmations, no auto-commit
```

---

## 手动安装说明

### 文件位置（安装目标）

```
技能文件: ~/.claude/skills/vibe-coding-workflow/SKILL.md
命令文件: ~/.claude/commands/init-vibe.md
```

### 各平台对应目录

| 平台 | ~/.claude 实际路径 |
|------|-------------------|
| macOS | `/Users/<用户名>/.claude` |
| Linux | `/home/<用户名>/.claude` |
| Windows | `C:\Users\<用户名>\.claude` |

### 快速复制（推荐）

仓库目录结构直接对应安装路径，复制 `.claude/` 到用户目录即可：

```bash
# macOS / Linux
cp -r .claude ~/.claude
```

```powershell
# Windows PowerShell
Copy-Item -Recurse .claude $env:USERPROFILE\.claude
```

> 注意：这会合并到已有的 `.claude/` 目录，不会覆盖其他 skills/commands。

### 逐文件复制

Windows（PowerShell）：
```powershell
New-Item -ItemType Directory -Path "$env:USERPROFILE\.claude\skills\vibe-coding-workflow" -Force
Copy-Item .claude\skills\vibe-coding-workflow\SKILL.md "$env:USERPROFILE\.claude\skills\vibe-coding-workflow\SKILL.md"
Copy-Item .claude\commands\init-vibe.md "$env:USERPROFILE\.claude\commands\init-vibe.md"
```

macOS / Linux：
```bash
mkdir -p ~/.claude/skills/vibe-coding-workflow
cp .claude/skills/vibe-coding-workflow/SKILL.md ~/.claude/skills/vibe-coding-workflow/SKILL.md
cp .claude/commands/init-vibe.md ~/.claude/commands/init-vibe.md
```

---

## What `/init-vibe` Generates

```
your-project/
├── CLAUDE.md                       — thin project workflow entry (~40 lines)
└── .claude/rules/
    ├── rule-priority.md            priority order + profile semantics (always-load)
    ├── workflow-classification.md  L0-L3 + reclassification checkpoints (always-load)
    ├── task-contract.md            per-task self-check baseline (always-load)
    ├── confirmation-policy.md      L0-L1 auto, L2 plan-confirm, L3+high-risk confirm (always-load)
    ├── scope-control.md            scope boundaries + drift correction (always-load)
    ├── dirty-worktree-protection.md pre-edit dirty state P0 check (always-load)
    ├── command-policy.md           risk-based command classification (on-demand)
    ├── planning-policy.md          L2 plan gate, L3 discovery gate (on-demand)
    ├── failure-protocol.md         F1/F2/F3 failure state machine (on-demand)
    ├── verification-discipline.md  verification + output format (on-demand)
    ├── git-workflow.md             auto-commit opt-in + boundaries (on-demand)
    ├── skill-dispatch.md           skill dispatch with fallbacks (on-demand)
    └── context-hygiene.md          file responsibilities + loading strategy (on-demand)
```

---

## FAQ

**Q: Does this skill run during normal coding and interfere?**
No. The skill's description is scoped to init/audit/repair phrases only. Normal requests like "fix this bug" or "add a feature" won't trigger it. After init, the generated CLAUDE.md and `.claude/rules/` govern daily development.

**Q: I already have a CLAUDE.md. Will /init-vibe overwrite it?**
`/init-vibe` (no flags) audits first. If CLAUDE.md exists, it reports findings and asks whether you want to init (replace), repair (fix issues), or skip. Only `--force` overwrites without asking.

**Q: Can I customize the generated rules?**
Yes. Edit outside the `<!-- vibe-managed:start -->` / `<!-- vibe-managed:end -->` blocks to keep your changes across `--repair` runs. Edits inside managed blocks will be refreshed from templates. Files without managed block markers are treated as fully user-owned and skipped by `--repair` (use `--force` to regenerate from template).

**Q: What if something goes wrong?**
Run `/init-vibe --audit` to check workflow health. It runs both structural (file existence, managed blocks) and semantic (rule conflicts, L2/L3 gate strength, auto-commit safety, skill reference validity) checks — over 14 criteria. Reports PASS/FAIL/WARN with severity. Then `/init-vibe --repair` fixes what it can using managed block markers.

---

## Integration With Your Toolchain

The workflow doesn't replace your tools — it orchestrates them:

| Tool / Skill | Role | Fallback |
|------|------|----------|
| `planning-with-files` | Persistent task plans, cross-session recovery | Manual task_plan.md |
| `karpathy-guidelines` | Simplicity constraints, surgical changes | scope-control.md directly |
| `verification-before-completion` | Verification gate — no completion without evidence | verification-discipline.md |
| `systematic-debugging` | Structured 4-phase debugging | Built-in F2 protocol (reproduce, hypothesis, focused attempt) |
| `diagnose` | Deeper diagnosis for repeated failure | Escalate to F3 (read-only discovery + developer consultation) |
| `grill-with-docs` | Clarifying domain terms, docs, requirements at L3 | Ask developer directly |
| `grill-me` | Stress-testing plan assumptions | Built-in plan review against task contract |
| `writing-plans` | L2 plan quality refinement | Built-in L2 plan template |
| `code-reviewer` agent | Post-implementation code review | — |
| `security-reviewer` agent | Security audit before commits | — |
| `tdd-guide` agent | Test-driven development workflow | — |

Every skill reference in `skill-dispatch.md` includes both `[if available]` and `[fallback]` branches, so the workflow works whether or not you have installed optional skills.

---

## Project Structure

```
vibe-coding-workflow/
├── README.md                  # 项目介绍
├── package.json               # npm package (npx 入口)
├── install.js                 # Node.js 跨平台安装脚本
├── install.sh                 # macOS / Linux 安装脚本
├── install.ps1                # Windows PowerShell 安装脚本
├── commands/
│   └── init-vibe.md           # /init-vibe 命令源码
├── skills/
│   └── vibe-coding-workflow/  # skill 单一事实源（source of truth）
│       ├── SKILL.md           # 路由入口（精简）
│       └── references/        # 按需加载文档
│           ├── templates.md   # 模板索引 + managed block 注册表
│           └── templates/     # 独立模板文件
│               ├── CLAUDE.md
│               └── rules/
├── scripts/
│   └── validate-skill-layout.js
└── .claude/
    └── skills/
        └── vibe-coding-workflow/  # 项目内镜像（用于 Claude Code 项目技能加载）
```

---

## License

MIT

---

## Maintainers: Publish For npx

To make `npx vibe-coding-workflow` work for everyone, publish this repo to npm:

```bash
npm login
npm publish
```

Notes:
- Ensure `package.json` has a unique `"name"` (use a scope like `@yourname/vibe-coding-workflow` if needed).
- `bin.vibe-coding-workflow` points to `install.js` so `npx` can run it. The `postinstall` script is informational only (no file writes).
- Keep `skills/vibe-coding-workflow/` as the only editable source. `.claude/skills/vibe-coding-workflow/` should stay an identical mirror.

Pre-publish checks:

```bash
npm run validate:skills
node install.js --dry-run
```
