<!-- vibe-managed:start rule-context-hygiene version=0.2 type=template -->
# Context Hygiene

## File Responsibilities
- CLAUDE.md: project entry point, tech stack, profile, verification commands
- .claude/rules/: detailed workflow rules
- .ai/logs/: verification evidence, findings, progress

## Loading Strategy
- Always-load files (rule-priority, workflow-classification, task-contract, confirmation-policy, scope-control, dirty-worktree-protection) are consulted on every task
- On-demand files (command-policy, planning-policy, failure-protocol, verification-discipline, git-workflow, skill-dispatch, context-hygiene) are loaded when the relevant situation arises

## When to /clear
- before starting a significantly different task
- when response quality degrades
- after 3+ failed attempts on the same issue
- when context feels bloated

## Cross-Session Recovery
- Use planning-with-files for persistent task plans
- On session start, check .ai/logs/ and task_plan.md for context
<!-- vibe-managed:end rule-context-hygiene -->
