<!-- vibe-managed:start rule-scope-control version=0.2 type=template -->
# Scope Control

## Hard Boundaries
- Only implement what was explicitly requested
- No incidental fixes, no speculative abstractions
- No new dependencies or refactors unless required

## Scope Drift Correction
If implementation reveals a better but broader solution:
- do not silently expand scope
- report the tradeoff
- ask developer whether to switch scope

## Skill Constraint
When consulting another skill, keep the current task scope.
A skill may refine method, not expand objective.
<!-- vibe-managed:end rule-scope-control -->
