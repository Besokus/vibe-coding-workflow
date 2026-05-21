#!/usr/bin/env node
/**
 * vibe-coding-workflow installer
 *
 * Copies SKILL.md → ~/.claude/skills/vibe-coding-workflow/
 * Copies init-vibe.md → ~/.claude/commands/
 *
 * Usage:
 *   npm install -g vibe-coding-workflow   (auto-runs via postinstall)
 *   node install.js                        (manual)
 *   node install.js --dry-run             (preview only)
 */

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');

const HOME = process.env.HOME
  || process.env.USERPROFILE
  || path.join(process.env.HOMEDRIVE, process.env.HOMEPATH);

const CLAUDE_DIR = path.join(HOME, '.claude');
const SKILLS_DIR = path.join(CLAUDE_DIR, 'skills');
const COMMANDS_DIR = path.join(CLAUDE_DIR, 'commands');
const TARGET_SKILL_DIR = path.join(SKILLS_DIR, 'vibe-coding-workflow');

const SOURCE_DIR = path.resolve(__dirname);
const SOURCE_SKILL = path.join(SOURCE_DIR, '.claude', 'skills', 'vibe-coding-workflow', 'SKILL.md');
const SOURCE_COMMAND = path.join(SOURCE_DIR, '.claude', 'commands', 'init-vibe.md');

function log(msg) {
  console.log(`[vibe-coding-workflow] ${msg}`);
}

function copyFile(src, dest, description) {
  if (!fs.existsSync(src)) {
    log(`⚠  ${description} 源文件不存在: ${src}`);
    return false;
  }
  if (DRY_RUN) {
    log(`📋  将复制 ${description} → ${dest}`);
    return true;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  log(`✓  ${description} 已安装到 ${dest}`);
  return true;
}

log('安装开始' + (DRY_RUN ? ' (dry-run 模式)' : ''));

copyFile(SOURCE_SKILL, path.join(TARGET_SKILL_DIR, 'SKILL.md'), 'SKILL.md');
copyFile(SOURCE_COMMAND, path.join(COMMANDS_DIR, 'init-vibe.md'), 'init-vibe 命令');

if (!DRY_RUN) {
  log('安装完成！现在可以在任意项目中运行 /init-vibe 开始使用。');
  log('');
  log('快速开始:');
  log('  1. cd your-project');
  log('  2. /init-vibe');
  log('  3. 开始开发，AI 自动按 L0-L3 分级执行');
}
