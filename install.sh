#!/bin/sh
# Install Vibe Coding Workflow for Claude Code
# Copies skill folder → ~/.claude/skills/vibe-coding-workflow/
# Copies init-vibe.md → ~/.claude/commands/

set -e

SOURCE_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

echo "[vibe-coding-workflow] 安装开始"

# skill folder
SKILL_SRC_DIR="$SOURCE_DIR/skills/vibe-coding-workflow"
SKILL_DEST_DIR="$CLAUDE_DIR/skills/vibe-coding-workflow"

if [ ! -d "$SKILL_SRC_DIR" ]; then
  echo "[vibe-coding-workflow] ⚠ skill 源目录不存在: $SKILL_SRC_DIR"
  exit 1
fi

mkdir -p "$SKILL_DEST_DIR"
cp -R "$SKILL_SRC_DIR"/. "$SKILL_DEST_DIR"
echo "[vibe-coding-workflow] ✓ skill 目录已安装到 $SKILL_DEST_DIR"

# init-vibe command
CMD_SRC="$SOURCE_DIR/commands/init-vibe.md"
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
