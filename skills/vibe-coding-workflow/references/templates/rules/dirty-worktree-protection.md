<!-- vibe-managed:start rule-dirty-worktree version=0.2 type=template -->
# Dirty Worktree Protection

## Pre-Edit Check (P0 — runs before any edit, not only before commit)
Before editing any file:
- Check `git status` if inside a git repo
- Identify pre-existing uncommitted changes
- Do NOT overwrite, reformat, stage, stash, reset, or commit unrelated user changes
- If target files contain unrelated user edits, edit only the exact required region
- Do not overwrite unrelated dirty hunks
- If the required edit overlaps unknown user changes, stop and ask the developer
- Never stage, stash, reset, reformat, or commit unrelated user changes

## Hard Rules
- Never stage or commit changes the developer did not explicitly request
- Never overwrite unrelated dirty hunks
- If the required edit cannot be safely isolated from unrelated changes, stop and ask
<!-- vibe-managed:end rule-dirty-worktree -->
