---
name: vibe-coding-workflow
description: |
  New project AI development workflow initializer. Handles init, audit,
  and repair of CLAUDE.md and .claude/rules/. Triggers on: "/init-vibe",
  "init-vibe", "initialize project workflow", "setup project workflow",
  "audit project workflow", "repair project workflow". NOT a runtime
  coding controller — daily development is governed by the generated
  CLAUDE.md and rules, not by this skill.
---

# Vibe Coding Workflow Initializer

**This skill is an init/audit/repair tool, NOT a runtime controller.**
After initialization, the generated CLAUDE.md and `.claude/rules/` take over daily development governance. This skill only runs when explicitly invoked via `/init-vibe` or equivalent trigger phrases.

---

## Entry: Determine Mode

When triggered:

1. **Check for existing CLAUDE.md** at the project root:
   - **No CLAUDE.md** → **Init mode** (generate fresh)
   - **CLAUDE.md exists, user said "audit"/"check"** → **Audit mode** (report issues only)
   - **CLAUDE.md exists, user said "repair"/"fix"/"update"** → **Repair mode** (fix issues)
   - **CLAUDE.md exists, no qualifier** → **Audit-first**, then ask: init (replace), repair (fix), or skip

2. **Check for `.claude/rules/` directory** — report what already exists.

---

## Init Mode

### Step 1: Detect Project Context

Read these files (ALL optional — missing is fine):

| File | Detects |
|------|---------|
| `package.json` | Node.js, npm/pnpm/yarn/bun, scripts |
| `pyproject.toml` / `requirements.txt` | Python, uv/pip/poetry |
| `go.mod` | Go |
| `Cargo.toml` | Rust |
| `pom.xml` / `build.gradle*` | Java, Maven/Gradle |
| `composer.json` | PHP |
| `Gemfile` | Ruby |
| `CMakeLists.txt` | C/C++ |
| `next.config.*` | Next.js |
| `vite.config.*` | Vite |
| `tailwind.config.*` | Tailwind |
| `svelte.config.*` | Svelte |
| `tsconfig.json` | TypeScript |
| `Dockerfile` / `docker-compose.yml` | Container |
| `.github/` / `.gitlab-ci.yml` | CI/CD |

Extract verification commands from `package.json` scripts or equivalents:
- `build`, `test`, `lint`, `typecheck`, `format`

### Step 2: Scan Global Tool Availability

**Do NOT hardcode lists.** Detect what actually exists:

- Skills: List `~/.claude/skills/*/SKILL.md` — read each frontmatter `name` + `description`, report only those relevant to this project's tech stack
- Agents: List `~/.claude/agents/*.md` — read each frontmatter, filter by relevance
- Commands: List `~/.claude/commands/*.md` — report key commands (`/code-review`, `/quality-gate`, `/santa-loop`, etc.)
- Rules: Check `~/.claude/rules/ecc/` for available rule layers (common, web, zh, typescript, python, etc.)

Relevance filter: match agent/skill language tags against detected project languages. Example: `python-reviewer` is relevant for a Python project, `go-reviewer` is not.

### Step 3: Generate CLAUDE.md

Create `CLAUDE.md` at the project root. **Keep it thin** — detailed rules live in `.claude/rules/`.

Use the template in [Templates: CLAUDE.md](#templates-claudemd).

### Step 4: Generate `.claude/rules/` Files

Create the directory `CLAUDE.md` if it doesn't exist, then write:

| File | Content |
|------|---------|
| `workflow-classification.md` | L0-L3 classification, upgrade conditions, DoD formula |
| `verification-discipline.md` | Verification output format, success/failure, logs |
| `bug-fix-discipline.md` | RED → GREEN, reproduce-first rule |
| `confirmation-policy.md` | L0/L1/L2 auto, L3 confirm, what counts as high-risk |
| `scope-control.md` | Incidental fix rule, no new deps, no speculative abstractions |
| `failure-protocol.md` | 2-strike escalation, re-diagnose vs escalate |
| `context-hygiene.md` | File responsibilities, when to /clear, cross-session recovery |

Use the templates in the [Templates](#templates-generated-rules-files) section below.

### Step 5: Report

Output:

```
## /init-vibe 完成

### 检测到的技术栈
- 语言: [detected]
- 框架: [detected]
- 包管理: [detected]
- 测试: [detected]

### 验证命令
- build: [command]
- test: [command]
- lint: [command]

### 生成的文件
- CLAUDE.md — 项目工作流入口（薄）
- .claude/rules/workflow-classification.md
- .claude/rules/verification-discipline.md
- .claude/rules/bug-fix-discipline.md
- .claude/rules/confirmation-policy.md
- .claude/rules/scope-control.md
- .claude/rules/failure-protocol.md
- .claude/rules/context-hygiene.md

### 引用的全局资源
- ECC rules: ~/.claude/rules/ecc/[detected applicable layers]
- Skills: [detected relevant skills, count only]
- Agents: [detected relevant agents, count only]
- Commands: /code-review, /quality-gate, /santa-loop, [others detected]

### Hooks 建议
[list recommended hooks if --with-hooks]

现在可以直接说需求开始开发。AI 会自动按 L0-L3 分级执行。
```

---

## Audit Mode (--audit / "audit workflow")

Check existing CLAUDE.md and `.claude/rules/` for issues:

### Audit Checklist

1. **CLAUDE.md exists?** No → report missing
2. **CLAUDE.md has tech stack section?** No → needs update
3. **CLAUDE.md references `.claude/rules/`?** No → rules split not done
4. **CLAUDE.md has verification commands?** No → needs detection
5. **`.claude/rules/` directory exists?** No → rules missing
6. **Each expected rules file exists?** List missing ones
7. **Verification commands still work?** Test each, report failures
8. **CLAUDE.md length?** >80 lines → should be thinned (rules belong in `.claude/rules/`)
9. **Scope control section present?** No → risk of scope creep
10. **Confirmation policy present?** No → risk of unnecessary interruptions

### Audit Output

```
## Audit 结果

### 通过 ✓
- [list checks that passed]

### 警告 ⚠
- [list warnings — missing rules files, stale commands]

### 问题 ✗
- [list blockers — no CLAUDE.md, broken verification]

### 建议操作
/init-vibe --repair  # 修复所有可修复的问题
```

Audit never writes files. It only reports.

---

## Repair Mode (--repair / "repair workflow")

Fix issues found by audit:

1. **Missing files** → generate them from templates
2. **Stale tech stack** → re-detect and update CLAUDE.md tech stack section only
3. **Missing rules references** → add rules index to CLAUDE.md
4. **Broken verification commands** → re-detect from package files
5. **CLAUDE.md too long** → prompt user to split rules into `.claude/rules/` (never force-split user content)

**Repair preserves user modifications.** Only add missing pieces; never overwrite sections the user has customized. If uncertain whether a section is user-modified, ask.

### Repair Output

```
## Repair 完成

### 修复的内容
- [list what was fixed]

### 跳过的内容（可能为用户自定义）
- [list what was skipped]

建议运行 /init-vibe --audit 再次检查。
```

---

## Optional: Hooks Mode (--with-hooks)

When the user explicitly requests hooks, generate `.claude/hooks.json` suggestions. Default: **do NOT touch hooks** unless `--with-hooks` is passed or the user says "configure hooks".

Recommended hooks (language-adaptive):

1. **Format on Write** (if formatter exists: prettier, black, gofmt, etc.)
2. **Lint on Write** (if linter exists: eslint, ruff, golangci-lint, etc.)
3. **Type-check on Write** (if type checker exists: tsc, mypy, etc.) — use incremental + timeout-capped
4. **Build on Stop** — verify production build at session end

Report the hooks template for the user to review; don't enable without confirmation.

---

## Templates: CLAUDE.md

```markdown
# CLAUDE.md — [Project Name]

## 技术栈

- 语言: [detected]
- 框架: [detected]
- 包管理: [detected]
- 测试: [detected]

## 验证命令

```
build:   [detected]
test:    [detected]
lint:    [detected]
typecheck: [detected]
```

## 核心原则

- 优先最小的正确变更
- 不实现未明确要求的功能
- 匹配现有项目风格后再创造
- 禁止引入新依赖、抽象、模式、重构（除非任务明确需要）

## 工作流

### 每个任务开始

声明等级和原因，一行输出：
```
L1 | 单文件修复
```

### Definition of Done

```
DoD = Level Baseline + Task-Derived Acceptance Criteria
```

每个任务结束时检查：
1. Level Baseline 满足（见 `.claude/rules/workflow-classification.md`）
2. 从需求推导的具体验收条件满足（2-3 条，任务开始时声明）
3. 两者全通过才算完成

### 确认策略

- **L0/L1/L2**: 默认执行，不打断用户
- **L3 / 高风险操作**: 需用户确认后执行

详见 `.claude/rules/confirmation-policy.md`

## 规则索引

| 文件 | 内容 |
|------|------|
| `.claude/rules/workflow-classification.md` | L0-L3 分级 + 升级条件 + DoD 公式 |
| `.claude/rules/verification-discipline.md` | 验证纪律 + 输出格式 |
| `.claude/rules/bug-fix-discipline.md` | Bug 修复 RED→GREEN |
| `.claude/rules/confirmation-policy.md` | L0-L2 自动，L3 确认 |
| `.claude/rules/scope-control.md` | 范围控制 + 顺手修复规则 |
| `.claude/rules/failure-protocol.md` | 2-strike 失败处理 + 升级路径 |
| `.claude/rules/context-hygiene.md` | 上下文管理 + 文件职责边界 |

## 全局资源

### ECC Rules
`~/.claude/rules/ecc/` — 编码规范、安全、测试标准
适用层: [detected applicable layers — common, web, zh, typescript, etc.]

### 可用 Skills
[detected relevant skills — list names only]

### 可用 Agents
[detected relevant agents — list names only]
```

---

## Templates: Generated Rules Files

### `.claude/rules/workflow-classification.md`

```markdown
# Task Classification Protocol

## 复杂度分级

### L0: Tiny Edit
适用范围: typo、文案、注释、纯样式微调

- 行为: 直接改，不做 plan
- 验证: 不需要（或肉眼确认）
- 输出: 一句话总结

**Baseline DoD**: 变更可见 + 无语法错误

### L1: Small Code Change
适用范围: 单文件、代码逻辑小改、一行修复

- 行为: 读附近现有代码（模式匹配），最小 patch
- 验证: targeted type-check 或 scope 内单测
- 输出: 改了哪个文件 + 验证结果一行

**Baseline DoD**: 改动文件 targeted 验证通过 + 无作用域内回归

### L2: Medium Feature / Bug Fix
适用范围: 2-3 个文件、业务逻辑变更、新增测试

- 行为: 简短 plan（写在对话里，不创建文件），写或更新测试
- 验证: targeted test + type-check + lint
- 输出: 变更摘要（改了哪些文件 + 沿用了哪个现有模式 + 没有做哪些额外功能 + 验证命令 + 结果）

**Baseline DoD**: 原需求满足 + 测试通过 + typecheck/lint 通过 + 手动确认行为

### L3: High-Risk / Broad Change
适用范围: 3+ 文件、安全/API/性能/重构

- 行为: 先写 findings.md + task_plan.md，输出 scope/risk/verification plan，需用户确认
- 验证: 分层验证 → 全面回归，rollback plan + migration risk
- 输出: 完整报告

**Baseline DoD**: 完整验证计划执行 + 回归通过 + 回滚方案有效 + 用户确认

## 升级条件

默认从 L0/L1 开始。命中以下任一条件升级：

### 升级到 L2
- 修改业务逻辑
- 需要新增或修改测试
- 涉及 2 个以上文件
- 需读取现有代码模式后实现

### 升级到 L3
- 预计修改 3 个以上文件
- 涉及认证、授权、安全、支付、数据迁移、缓存、并发、性能
- 会改变 public API、数据库 schema、配置格式或用户可见行为
- 需要跨模块理解
- 第一次修复失败
- 测试失败原因不明确

### 反向检查
实际修改后发现文件数或影响范围超出初始等级 → 必须升级并暂停说明。

## Definition of Done

```
DoD = Level Baseline + Task-Derived Acceptance Criteria
```

### Level Baseline
每个等级的最低验证门槛（见上方各等级的 Baseline DoD）。

### Task-Derived Acceptance Criteria
AI 在任务开始时从需求推导 2-3 条具体验收条件：

```
例: "新增用户头像上传接口"
  → AC1: POST /user/avatar 返回 200 且文件落盘
  → AC2: 无效格式返回 400
  → AC3: 超过 2MB 返回 413
```

### 完成判定
- Level Baseline ✓ + 所有 Acceptance Criteria ✓ = Done
- 任一未满足 → 继续，不可标记完成
```

### `.claude/rules/verification-discipline.md`

```markdown
# Verification Discipline

## 铁律

**禁止口头声称"完成了"——必须实际运行验证命令并展示结果。**

## 输出格式

### 成功
```
\$ command
exit 0
[summary — one line]
```

### 失败
```
\$ command
exit N
[first relevant error only]
→ 下一步: [fix plan — one line]
```

## 日志管理

完整验证日志写入 `.ai/logs/`，不塞入对话上下文。

## 何时验证

| Level | 验证范围 |
|-------|---------|
| L0 | 肉眼确认 |
| L1 | targeted type-check 或 scope 内单测 |
| L2 | targeted test + type-check + lint |
| L3 | 分层验证 → 全面回归 |

## Definition of Done Gate

每个任务结束时：
1. 运行该等级的验证命令
2. 对照 Acceptance Criteria 逐条确认
3. Baseline + AC 全通过 → Done
```

### `.claude/rules/bug-fix-discipline.md`

```markdown
# Bug Fix Discipline

## 强制流程

```
1. 确认复现方式（不跳过！）
2. 能写测试 → 先写 failing test（RED）
   不能写测试 → 记录复现命令或手动步骤
3. 修复（GREEN）
4. 确认测试通过
```

## 禁止

- 在未确认复现的情况下"修一个看起来相关的地方"
- 跳过第 1 步直接改代码
- 多个 bug 一起修（一次只修一个）

## 修复后的验证

修复后运行相关测试套件，确认：
- Bug 场景现在通过
- 无回归
```

### `.claude/rules/confirmation-policy.md`

```markdown
# Confirmation Policy

## 原则

**减少不必要的中断，在需要决策时才对用户打断。**

## 分级确认

| Level | 策略 | 说明 |
|-------|------|------|
| L0 | 静默执行 | 不通知 |
| L1 | 静默执行 | 不通知 |
| L2 | 静默执行 | 完成后输出摘要 |
| L3 | 需用户确认 | 实施前需确认 scope/risk/plan |

## L3 确认内容

在实施前输出：
```
### 任务范围
[具体边界]

### 风险
[列出主要风险]

### 验证计划
[how to verify success]

确认继续？
```

## 高风险触发

以下操作即使文件数少，也必须走 L3 确认：
- 修改 `.env` / `.env.example` / 密钥管理
- 修改数据库 schema / migration
- 修改认证/授权逻辑
- 修改 API 合约（breaking change）
- `git push --force`
- `rm -rf` / destructive ops
```

### `.claude/rules/scope-control.md`

```markdown
# Scope Control

## 核心约束

**只做任务明确要求的事情，不做任何多于最小变更的改动。**

## 绝对禁止

- 添加未要求的功能
- 为假想的复用创建抽象
- 重构不相关的代码
- 改动未触及文件的格式
- 未经明确同意引入新依赖
- 创建未要求的文档

## 顺手修复规则

发现与当前任务无关的问题时：
- ❌ 不要顺手修
- ✓ 记录到 findings.md 或任务结束时的 "Not addressed" 段

原因: "顺手修"是 scope creep 的最大来源，也是回归 bug 的常见入口。

## 自我检查

每次变更后问：
1. 这个改动是任务要求的吗？
2. 有没有多改任何文件？
3. 有没有"顺便"做了什么？
```

### `.claude/rules/failure-protocol.md`

```markdown
# Failure Protocol

## 2-Strike Rule

同一问题失败 2 次后：

### 1. 停止
不要再尝试 patch。更多的 patch 不会解决问题，只会增加混乱。

### 2. 记录
在 findings.md 中记录：
```markdown
## [问题简述]

### 尝试过的方案
1. [方案 1 + 结果]
2. [方案 2 + 结果]

### 当前症状
[具体错误信息]

### 下一步
[re-diagnose / subagent / 求助]
```

### 3. 选择下一步

| 情况 | 下一步 |
|------|--------|
| 不确定根因 | 重新诊断（更广的日志、更小的隔离） |
| 确定根因但方案都不对 | 使用 subagent（systematic-debugging 或 code-reviewer） |
| 完全卡住 | 向用户求助，带上 findings.md |

## 升级信号

不是所有失败都要升级。升级的信号：
- 同一个 symptom 反复出现
- 修复引入新 bug
- 修复行为不可预测
- 代码逻辑复杂到无法追踪
```

### `.claude/rules/context-hygiene.md`

```markdown
# Context Hygiene

## 上下文文件职责

| 文件 | 职责 | 何时读写 |
|------|------|---------|
| `CLAUDE.md` | 项目级规则入口 | 每次会话自动加载，通常不修改 |
| `task_plan.md` | 当前任务的计划、阶段、决策 | L3 时创建；跨会话恢复时读取 |
| `findings.md` | 发现的问题、失败的尝试、调查笔记 | 任何时候记录；诊断前回顾 |
| `progress.md` | 当前任务进度、剩余工作 | L2/L3 更新 |
| `.ai/logs/` | 验证命令完整输出 | 每次验证写入 |

## 何时 /clear

不按固定节奏 /clear。只在以下情况：

1. **任务完成 + 信息已持久化** — task_plan.md/progress.md 已更新
2. **2 次失败 debug** — 上下文已混乱，先写 findings.md 再清
3. **切换模块** — 新任务与之前上下文无关

## 上下文消费规则

- CLAUDE.md: 自动加载，不要重复读取
- .claude/rules/*.md: 按需读取（L0/L1 不读，L2/L3 读相关文件）
- task_plan.md: L3 时创建，跨会话恢复时读取
- 全局 ECC rules: 自动加载，不要重复读取

## 跨会话恢复

新会话开始时：
1. 读取 CLAUDE.md（自动）
2. 检查 task_plan.md + findings.md + progress.md 是否存在
3. 若存在 → 报告当前状态，提示下一步
4. 若不存在 → 按新任务处理

## 引用全局 Skills

以下 skill 提供更详细的上下文管理：

| Skill | 用途 |
|-------|------|
| `planning-with-files` | 文件持久化、自动 read-before-write、3-strike 错误处理 |
| `karpathy-guidelines` | Think Before Coding、Simplicity First、Surgical Changes、Goal-Driven Execution |
| `verification-before-completion` | 无新验证证据不得声称完成 |
| `systematic-debugging` | 4 阶段诊断：根因调查 → 修复 → 验证 → 文档 |
```

---

## Notes

- **This skill never runs during daily coding.** Its description is scoped to init/audit/repair phrases. Normal development conversation ("fix this bug", "add a feature", "refactor this") won't trigger it.
- **All runtime governance is in CLAUDE.md + `.claude/rules/`.** This skill only creates those files.
- **ECC rules are referenced, not duplicated.** The generated files point to `~/.claude/rules/ecc/` instead of copying their content.
- **Hooks are opt-in.** Never modify hooks configuration unless the user explicitly requests it with `--with-hooks`.
