#!/bin/sh
# Install Vibe Coding Workflow for Claude Code
# Copies SKILL.md → ~/.claude/skills/vibe-coding-workflow/
# Copies init-vibe.md → ~/.claude/commands/

set -e

SOURCE_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

echo "[vibe-coding-workflow] 安装开始"

# SKILL.md
SKILL_SRC="$SOURCE_DIR/.claude/skills/vibe-coding-workflow/SKILL.md"
SKILL_DEST="$CLAUDE_DIR/skills/vibe-coding-workflow/SKILL.md"

if [ ! -f "$SKILL_SRC" ]; then
  echo "[vibe-coding-workflow] ⚠ SKILL.md 源文件不存在: $SKILL_SRC"
  exit 1
fi

mkdir -p "$(dirname "$SKILL_DEST")"
cp "$SKILL_SRC" "$SKILL_DEST"
echo "[vibe-coding-workflow] ✓ SKILL.md 已安装到 $SKILL_DEST"

# init-vibe command
CMD_SRC="$SOURCE_DIR/.claude/commands/init-vibe.md"
CMD_DEST="$CLAUDE_DIR/commands/init-vibe.md"

if [ ! -f "$CMD_SRC" ]; then
  echo "[vibe-coding-workflow] ⚠ init-vibe 命令源文件不存在: $CMD_SRC"
  exit 1
fi

mkdir -p "$(dirname "$CMD_DEST")"
cp "$CMD_SRC" "$CMD_DEST"
echo "[vibe-coding-workflow] ✓ init-vibe 命令已安装到 $CMD_DEST"

echo ""
echo "[vibe-coding-workflow] 安装完成！现在可以在任意项目中运行 /init-vibe 开始使用。"
echo "[vibe-coding-workflow]"
echo "[vibe-coding-workflow] 快速开始:"
echo "[vibe-coding-workflow]   1. cd your-project"
echo "[vibe-coding-workflow]   2. /init-vibe"
echo "[vibe-coding-workflow]   3. 开始开发，AI 自动按 L0-L3 分级执行"
