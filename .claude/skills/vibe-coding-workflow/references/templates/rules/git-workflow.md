<!-- vibe-managed:start rule-git-workflow version=0.2 type=template -->
# Git Workflow

## Auto-commit is opt-in
Never commit unless one of these is true:
- developer explicitly asks to commit
- project CLAUDE.md explicitly enables auto-commit
- current task instruction explicitly says auto-commit is allowed

## Commit Hard Boundaries
Before commit:
- worktree reviewed with git status
- only task-related files staged
- validation passed or failure is explicitly documented
- no secrets, env files, lockfile churn, generated noise, or unrelated formatting
- commit message describes user-facing intent
- L2 requires developer-confirmed plan
- L3 requires developer-confirmed implementation path

## Never auto-commit
- after failed validation
- after L3 discovery only
- when unrelated files are dirty
- when generated files are unexpectedly changed
- when user customizations may be overwritten

## Staging Rule
Stage files explicitly by name. Do not use broad staging (git add -A) unless developer explicitly requested it.
<!-- vibe-managed:end rule-git-workflow -->
