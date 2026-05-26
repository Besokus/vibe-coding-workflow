<!-- vibe-managed:start rule-command-policy version=0.2 type=template -->
# Command Policy

## Risk-Based Classification

### Allowed (no confirmation needed)
- read-only commands (cat, ls, git log, git diff, grep, glob)
- focused tests for changed code
- lint / typecheck
- build (on project that already builds)

### Confirm first (ask before running)
- dependency install (npm install, pip install, etc.)
- broad format that touches untouched files
- generated-file rewrite (lockfiles, artifacts, dist/)
- git branch / checkout

### Must confirm (requires explicit developer approval)
- database migration
- deploy / publish
- destructive filesystem operations (rm -rf, del)
- git reset (any form except soft HEAD~1 for commit fixup)
- git clean
- force push

### Never without explicit request
- rm -rf (on non-generated directories)
- git reset --hard
- force push to main/master
- publish to package registries
<!-- vibe-managed:end rule-command-policy -->
