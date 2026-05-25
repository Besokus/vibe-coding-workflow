# Repair Mode

## Entry

Use for explicit repair requests (`--repair`, "repair workflow", "fix workflow config").

## Rule

Repair is additive and non-destructive:
- Only update content inside `<!-- vibe: managed -->` / `<!-- /vibe: managed -->` blocks
- Preserve user customizations outside managed blocks
- If file has no managed block markers, treat as fully user-owned — skip unless `--force` is used
- Add missing files from templates (check all 13 rules files)
- Re-detect and update tech stack section if stale
- Re-detect broken verification commands
- Verify profile configuration
- Verify L2 plan gate and L3 discovery gate are configured correctly
- If `CLAUDE.md` is oversized, recommend split; do not force-move user text

## Managed Block Strategy

### Files with managed blocks
- Replace content only between `<!-- vibe: managed -->` and `<!-- /vibe: managed -->`
- Leave all other content intact
- If a file has managed blocks but is missing some expected blocks, add them

### Files without managed blocks
- Skip entirely during repair (these are user-customized)
- Report as "skipped — no managed block markers"
- If user explicitly requests `--force`, regenerate entire file from template

## Repair Actions

1. Generate missing workflow files from templates (check all 13 rules files)
2. For existing files with managed blocks: refresh content inside markers from templates
3. Re-detect and update tech stack section if stale
4. Add missing rules index references in `CLAUDE.md`
5. Re-detect broken verification commands
6. Verify profile is set (add if missing, default to balanced)
7. Verify L2 plan gate and L3 discovery gate are configured correctly
8. Check and update skill-dispatch.md available skills section
9. If `CLAUDE.md` is oversized, recommend split; do not force-move user text

Use `references/templates.md` only when creating or patching files inside managed blocks.

## Ambiguity Handling

If uncertain whether section is user-customized:
- Check for managed block markers first
- If markers exist, only edit inside them
- If no markers, stop and ask before editing that section

## Output Contract

Return:
- fixed items (files regenerated or patched)
- skipped items with reason (no managed block markers, likely user customization)
- added items (new files created)
- follow-up recommendation: run `/init-vibe --audit`
