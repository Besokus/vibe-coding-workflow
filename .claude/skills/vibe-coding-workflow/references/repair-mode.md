# Repair Mode

## Entry

Use for explicit repair requests (`--repair`, "repair workflow", "fix workflow config").

## Rule

Repair is additive and non-destructive:
- Only update content inside `<!-- vibe-managed:start -->` / `<!-- vibe-managed:end -->` blocks identified by block ID
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
- Match blocks by ID (e.g., `<!-- vibe-managed:start claude-metadata -->`)
- Only refresh content between matching start/end markers for known block IDs
- Leave all other content intact
- Unknown block IDs should be reported, not rewritten
- If a file has managed blocks but is missing some expected blocks, add them

### Files without managed blocks
- Skip entirely during repair (these are user-customized)
- Report as "skipped — no managed block markers"
- If user explicitly requests `--force`, regenerate entire file from template

## Managed Block Refresh Logic

When refreshing a managed block, determine the refresh method by its `type` attribute:

### Content Type: Template-Driven (type=template)
These managed blocks contain content that does not depend on project state.
- All `.claude/rules/*.md` files (rule-priority, workflow-classification, etc.)
- `CLAUDE.md` Rules Index section (`claude-rules-index`)

**Refresh method**: Replace content between start/end markers with fresh template from `references/templates/rules/<block-id>.md`, using the template file that matches the block ID.

### Content Type: Detected (type=detected)
These managed blocks contain values detected from project files at init time.
- `CLAUDE.md` Tech Stack / Profile / Verification Commands (`claude-metadata`)
- `skill-dispatch.md` Available Skills section (`rule-skill-dispatch-available`)

**Refresh method**: Re-detect values from project files (same detection logic as init mode steps 1-2), then update the content inside markers using the template structure but with re-detected values. Do NOT replace with raw template (which has `[detected]` placeholders).

### Content Type: User-Customizable (outside managed blocks)
These sections are intentionally left outside managed blocks so users own them.
- `CLAUDE.md` Core Principles section
- `CLAUDE.md` Workflow section

**Refresh method**: Never touch. User-owned.

## Stale Version Detection

When repairing, compare marker version (e.g., `version=0.2`) against the current template version:
- If versions match: refresh content normally
- If versions differ: refresh content AND update version string to current template version
- Report stale blocks in repair output

## Repair Actions

1. Generate missing workflow files from templates (check all 13 rules files)
2. For each existing file with managed blocks:
   - If template-driven block: replace content inside markers from templates, matched by block ID
   - If detected block: re-detect values, then update content inside markers with detected values (not raw template)
3. Add missing rules index references in `CLAUDE.md` (inside `claude-rules-index` block)
4. Verify profile is set (add if missing, inside `claude-metadata` block, default to balanced)
5. Verify L2 plan gate and L3 discovery gate are configured correctly
6. Check and update skill-dispatch.md available skills section (re-scan available skills, update `rule-skill-dispatch-available` block)
7. If `CLAUDE.md` is oversized, recommend split; do not force-move user text

Use `references/templates.md` only when creating or patching files inside managed blocks.

## Ambiguity Handling

If uncertain whether section is user-customized:
- Check for managed block markers first
- If markers exist, only edit inside them (match by block ID)
- If no markers, stop and ask before editing that section

## Output Contract

Return:
- fixed items (files regenerated or patched)
- skipped items with reason (no managed block markers, likely user customization)
- added items (new files created)
- follow-up recommendation: run `/init-vibe --audit`
