<!-- vibe-managed:start rule-verification-discipline version=0.2 type=template -->
# Verification Discipline

## Level-Based Verification
- L0: visual check, no syntax errors
- L1: targeted type-check or in-scope test
- L2: targeted test + type-check + lint; plan must list verification commands
- L3: full validation + regression + rollback plan; discovery phase only proposes verification plan

## Verification Requirements
- No completion claims without fresh evidence
- Final response stays compact (see output contracts below)
- Full logs to `.ai/logs/` only when useful for later reference
- No verbal claims — show command output
- Task is not complete until:
  - level gate was satisfied
  - task acceptance criteria passed
  - required verification ran
  - failures were handled through failure-protocol.md

## Output Contracts

### Success Output
```
Done:
- Changed: <summary>
- Verified: <command> passed
- Commit: not committed
- Notes: <optional>
```

### Failure Output
```
Blocked:
- Command: <command>
- Error: <relevant error>
- Likely cause: <hypothesis>
- Next safe step: <action>
- Need confirmation: yes/no
```

## Failure Handling
- On verification failure -> follow failure-protocol.md
- Do not claim completion with failed verification
<!-- vibe-managed:end rule-verification-discipline -->
