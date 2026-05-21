# Vibe Coding Workflow

**4-Level (L0-L3) AI-Assisted Development Workflow — Init, Audit, Repair**

A structured workflow system for Claude Code that brings discipline, predictability, and context efficiency to AI-assisted software development. Automatically classifies tasks by complexity, enforces verification at every level, and keeps the AI focused on what you actually asked for.

`vibe-coding` `ai-coding` `ai-assisted-development` `prompt-engineering` `developer-workflow` `coding-agent` `spec-driven-development` `task-decomposition` `llm-workflow` `software-development`

---

## Quick Start

### 安装

**方式一：npm（推荐）**
```bash
# 进入项目目录后执行
npm install
# 或全局安装
npm install -g vibe-coding-workflow
```

**方式二：一键脚本**
```bash
# macOS / Linux
sh install.sh

# Windows PowerShell
.\install.ps1
```

**方式三：手动安装**
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

L0/L1/L2 静默执行不打断；L3 和安全敏感操作会暂停确认。

---

## Highlights

- **L0-L3 Task Classification** — AI auto-classifies tasks into 4 levels so simple changes stay fast and risky changes get proper process
- **Definition of Done Formula** — `DoD = Level Baseline + Task-Derived Acceptance Criteria`, adapts to every task without being too rigid or too vague
- **Zero Distraction for Simple Work** — L0/L1/L2 execute silently with no interruptions; L3 and high-risk operations require confirmation
- **Context Hygiene Built In** — 7 generated rules files define exactly when to `/clear`, what each file is responsible for, and how to recover across sessions
- **Self-Healing** — audit and repair modes let you check and fix workflow health at any time
- **Plugs Into Your Existing Toolchain** — detects and references your existing ECC rules, agents, skills, and commands instead of duplicating them
- **Thin CLAUDE.md** — the generated CLAUDE.md is ~40 lines; detailed rules live in `.claude/rules/`

---

## What Pain Points It Solves

| Problem | How It Solves |
|---------|---------------|
| **AI does too much** — adds features you didn't ask for, refactors unrelated code | Scope control rules enforce: only what's explicitly requested, no "incidental fixes", no speculative abstractions |
| **Context rot** — long sessions degrade AI quality, context window fills with noise | Context hygiene rules define when to `/clear`, what goes in which file, and how to recover across sessions |
| **Unstable workflow** — sometimes you plan, sometimes you don't, no consistent process | L0-L3 classification forces the right level of process for each task automatically |
| **"Looks done" but isn't** — AI claims completion without running tests or verification | Iron verification discipline: no completion claims without fresh evidence, full log to `.ai/logs/`, no verbal claims |
| **Same bug fixed 3 times** — AI patches the same symptom repeatedly without diagnosing root cause | 2-strike protocol: after 2 failures, stop patching, re-diagnose, escalate |
| **No recovery after /clear** — lose all context of what you were doing | Cross-session recovery via task_plan.md, findings.md, progress.md — new sessions pick up where you left off |
| **Over-interruption** — AI asks for confirmation on trivial changes | Confirmation policy: L0/L1/L2 auto-execute, only L3 and high-risk ops interrupt |
| **CLAUDE.md bloat** — rules files that grow to 200+ lines and nobody reads them | Thin CLAUDE.md (~40 lines) + 7 focused rules files in `.claude/rules/` |
| **Manual mode selection** — you have to tell the AI what complexity level to use for each task | Task classification protocol with hard upgrade conditions (file count, security, API changes, failure count) — the AI determines the level automatically |

---

## The L0-L3 Model

| Level | Scope | Behavior | Baseline DoD |
|-------|-------|----------|-------------|
| **L0** | Typo,文案,注释,纯样式微调 | 直接改，无 plan，不打断 | 变更可见 + 无语法错误 |
| **L1** | 单文件,代码逻辑小改,一行修复 | 读附近代码做模式匹配，最小 patch | targeted type-check 或 scope 内单测 |
| **L2** | 2-3 文件,业务逻辑变更,新增测试 | 简短 plan（对话内），写或更新测试 | targeted test + type-check + lint |
| **L3** | 3+ 文件,安全/API/性能/重构 | 写 findings.md + task_plan.md，需确认 | 完整验证 + 回归 + rollback plan |

### Upgrade Conditions (Hard Rules, Not AI Judgment)

**Upgrade to L2:** changes business logic, needs tests, touches 2+ files, needs to read existing patterns.

**Upgrade to L3:** touches 3+ files, involves auth/security/payments/migration/cache/concurrency, changes public API/schema/config, first fix attempt failed, test failure cause unclear.

**Reverse check:** if actual scope exceeds initial level → must upgrade and pause to explain.

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

---

## Command Reference

```
/init-vibe                  → audit-first: check existing, then ask init/repair/skip
/init-vibe --force          → init mode: fresh generate, overwrite if exists
/init-vibe --dry-run        → detect and show what WOULD be generated, no writes
/init-vibe --audit          → audit mode: check existing, report issues (never writes)
/init-vibe --repair         → repair mode: fix missing/broken, preserve user edits
/init-vibe --with-hooks     → include optional hooks configuration suggestions
/init-vibe --minimal        → generate CLAUDE.md only (no .claude/rules/ split)
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
├── CLAUDE.md                  — thin project workflow entry (~40 lines)
└── .claude/rules/
    ├── workflow-classification.md   L0-L3 + DoD formula
    ├── verification-discipline.md    verification + output format
    ├── bug-fix-discipline.md         RED→GREEN workflow
    ├── confirmation-policy.md        L0-L2 auto, L3 confirm
    ├── scope-control.md              scope boundaries + incidental fix rule
    ├── failure-protocol.md           2-strike escalation
    └── context-hygiene.md            file responsibilities + cross-session recovery
```

---

## FAQ

**Q: Does this skill run during normal coding and interfere?**
No. The skill's description is scoped to init/audit/repair phrases only. Normal requests like "fix this bug" or "add a feature" won't trigger it. After init, the generated CLAUDE.md and `.claude/rules/` govern daily development.

**Q: I already have a CLAUDE.md. Will /init-vibe overwrite it?**
`/init-vibe` (no flags) audits first. If CLAUDE.md exists, it reports findings and asks whether you want to init (replace), repair (fix issues), or skip. Only `--force` overwrites without asking.

**Q: Can I customize the generated rules?**
Yes. All `.claude/rules/*.md` files are plain markdown — edit them directly. Re-running `--repair` preserves your modifications and only adds missing pieces.

**Q: What if something goes wrong?**
Run `/init-vibe --audit` to check workflow health. It checks 10 criteria (CLAUDE.md presence, rules files, verification commands, etc.) and reports what's broken. Then `/init-vibe --repair` fixes what it can.

---

## Integration With Your Toolchain

The workflow doesn't replace your tools — it orchestrates them:

| Tool | Role |
|------|------|
| `planning-with-files` | Persistent task plans, cross-session recovery |
| `karpathy-guidelines` | Simplicity constraints, surgical changes |
| `verification-before-completion` | Verification gate — no completion without evidence |
| `systematic-debugging` | Structured 4-phase debugging |
| `code-reviewer` agent | Post-implementation code review |
| `security-reviewer` agent | Security audit before commits |

---

## Project Structure

```
vibe-coding-workflow/
├── README.md                  # 项目介绍
├── package.json               # npm package (postinstall 自动安装)
├── install.js                 # Node.js 跨平台安装脚本
├── install.sh                 # macOS / Linux 安装脚本
├── install.ps1                # Windows PowerShell 安装脚本
└── .claude/
    ├── skills/
    │   └── vibe-coding-workflow/
    │       └── SKILL.md       # 初始化器 skill（安装到 ~/.claude/skills/）
    └── commands/
        └── init-vibe.md       # /init-vibe 命令（安装到 ~/.claude/commands/）
```

---

## License

MIT
