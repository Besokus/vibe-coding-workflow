#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = process.cwd();
const sourceSkillDir = path.join(root, 'skills', 'vibe-coding-workflow');
const projectSkillDir = path.join(root, '.claude', 'skills', 'vibe-coding-workflow');
const sourceSkillFile = path.join(sourceSkillDir, 'SKILL.md');

function fail(message) {
  console.error(`[validate:skills] ${message}`);
  process.exitCode = 1;
}

function hashFile(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function walkFiles(baseDir) {
  const files = [];
  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        files.push(path.relative(baseDir, fullPath).replace(/\\/g, '/'));
      }
    }
  }
  walk(baseDir);
  return files.sort();
}

if (!fs.existsSync(sourceSkillDir)) {
  fail(`missing source skill directory: ${sourceSkillDir}`);
  process.exit(process.exitCode || 1);
}

if (!fs.existsSync(sourceSkillFile)) {
  fail(`missing SKILL.md: ${sourceSkillFile}`);
  process.exit(process.exitCode || 1);
}

const skillContent = fs.readFileSync(sourceSkillFile, 'utf8');
const frontmatterMatch = skillContent.match(/^---\n([\s\S]*?)\n---/);
if (!frontmatterMatch) {
  fail('SKILL.md frontmatter missing');
} else {
  const frontmatter = frontmatterMatch[1];
  if (!/^name:\s*.+$/m.test(frontmatter)) {
    fail('frontmatter missing "name"');
  }
  if (!/^description:\s*[\s\S]+$/m.test(frontmatter)) {
    fail('frontmatter missing "description"');
  }
}

const linkRegex = /\[[^\]]+\]\(([^)]+)\)/g;
let linkMatch = linkRegex.exec(skillContent);
while (linkMatch) {
  const target = linkMatch[1];
  if (!target.startsWith('http://') && !target.startsWith('https://') && !target.startsWith('#')) {
    const resolved = path.resolve(sourceSkillDir, target);
    if (!fs.existsSync(resolved)) {
      fail(`broken relative link in SKILL.md: ${target}`);
    }
  }
  linkMatch = linkRegex.exec(skillContent);
}

const sourceFiles = walkFiles(sourceSkillDir);
if (!fs.existsSync(projectSkillDir)) {
  fail(`missing project mirror directory: ${projectSkillDir}`);
} else {
  const projectFiles = walkFiles(projectSkillDir);

  if (sourceFiles.join('\n') !== projectFiles.join('\n')) {
    fail('project mirror file list differs from source skill directory');
  } else {
    for (const relativePath of sourceFiles) {
      const sourcePath = path.join(sourceSkillDir, relativePath);
      const projectPath = path.join(projectSkillDir, relativePath);
      if (hashFile(sourcePath) !== hashFile(projectPath)) {
        fail(`project mirror content mismatch: ${relativePath}`);
      }
    }
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}
console.log('[validate:skills] ok');
