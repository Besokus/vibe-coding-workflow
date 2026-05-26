#!/usr/bin/env node
/**
 * vibe-coding-workflow installer
 *
 * Copies skill folder and init-vibe.md to project .claude/ or user ~/.claude/.
 *
 * Usage:
 *   npx vibe-coding-workflow              (default: project .claude)
 *   npx vibe-coding-workflow --scope user (user ~/.claude)
 *   node install.js --dry-run             (preview only)
 */

const fs = require('fs');
const path = require('path');

function printHelp() {
  console.log([
    'vibe-coding-workflow installer',
    '',
    'Usage:',
    '  npx vibe-coding-workflow [--scope project|user] [--dry-run] [--cwd <dir>]',
    '',
    'Options:',
    '  --scope project|user   Install to project .claude (default) or ~/.claude',
    '  --project              Alias for --scope project',
    '  --user                 Alias for --scope user',
    '  --cwd <dir>            Override working directory for project installs',
    '  --dry-run              Print actions without copying',
    '  -h, --help             Show help',
  ].join('\n'));
}

function parseArgs(argv) {
  const args = { dryRun: false, scope: 'project', cwd: process.cwd(), help: false };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--dry-run') { args.dryRun = true; continue; }
    if (arg === '--project') { args.scope = 'project'; continue; }
    if (arg === '--user') { args.scope = 'user'; continue; }
    if (arg === '--scope') {
      const value = argv[i + 1];
      if (!value) throw new Error('--scope requires a value: project|user');
      args.scope = value;
      i += 1;
      continue;
    }
    if (arg === '--cwd') {
      const value = argv[i + 1];
      if (!value) throw new Error('--cwd requires a directory path');
      args.cwd = path.resolve(value);
      i += 1;
      continue;
    }
    if (arg === '--help' || arg === '-h') { args.help = true; continue; }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (args.scope !== 'project' && args.scope !== 'user') {
    throw new Error(`Invalid --scope: ${args.scope} (expected project|user)`);
  }

  return args;
}

let ARGS;
try {
  ARGS = parseArgs(process.argv.slice(2));
} catch (err) {
  console.error(`[vibe-coding-workflow] ${(err && err.message) ? err.message : String(err)}`);
  console.error('[vibe-coding-workflow] Run with --help for usage.');
  process.exit(2);
}

if (ARGS.help) {
  printHelp();
  process.exit(0);
}

const DRY_RUN = ARGS.dryRun;

const HOME = process.env.HOME
  || process.env.USERPROFILE
  || path.join(process.env.HOMEDRIVE, process.env.HOMEPATH);

const CLAUDE_DIR = ARGS.scope === 'user'
  ? path.join(HOME, '.claude')
  : path.join(ARGS.cwd, '.claude');
const SKILLS_DIR = path.join(CLAUDE_DIR, 'skills');
const COMMANDS_DIR = path.join(CLAUDE_DIR, 'commands');
const TARGET_SKILL_DIR = path.join(SKILLS_DIR, 'vibe-coding-workflow');

const SOURCE_DIR = path.resolve(__dirname);
const SOURCE_SKILL_DIR = path.join(SOURCE_DIR, 'skills', 'vibe-coding-workflow');
const SOURCE_COMMAND = path.join(SOURCE_DIR, 'commands', 'init-vibe.md');

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

function copyDirectoryRecursive(srcDir, destDir, description) {
  if (!fs.existsSync(srcDir)) {
    log(`⚠  ${description} 源目录不存在: ${srcDir}`);
    return false;
  }
  if (DRY_RUN) {
    log(`📋  将复制 ${description} → ${destDir}`);
    return true;
  }

  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectoryRecursive(srcPath, destPath, `${description}/${entry.name}`);
      continue;
    }
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
  }
  log(`✓  ${description} 已安装到 ${destDir}`);
  return true;
}

log(`安装开始 (scope: ${ARGS.scope}${DRY_RUN ? ', dry-run' : ''})`);

copyDirectoryRecursive(SOURCE_SKILL_DIR, TARGET_SKILL_DIR, 'skill 目录');
copyFile(SOURCE_COMMAND, path.join(COMMANDS_DIR, 'init-vibe.md'), 'init-vibe 命令');

if (!DRY_RUN) {
  if (ARGS.scope === 'project') {
    log('安装完成！现在可以在当前项目中运行 /init-vibe 开始使用。');
  } else {
    log('安装完成！现在可以在任意项目中运行 /init-vibe 开始使用。');
  }
  log('');
  log('快速开始:');
  log('  1. cd your-project');
  log('  2. /init-vibe');
  log('  3. 开始开发，AI 自动按 L0-L3 分级执行');
}
