<#
.SYNOPSIS
    Install Vibe Coding Workflow for Claude Code
.DESCRIPTION
    Copies SKILL.md to ~/.claude/skills/vibe-coding-workflow/
    Copies init-vibe.md to ~/.claude/commands/
.PARAMETER DryRun
    Show what would be installed without copying
.EXAMPLE
    .\install.ps1
    .\install.ps1 -DryRun
#>

param(
    [switch]$DryRun
)

$SourceDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ClaudeDir = "$env:USERPROFILE\.claude"

$Files = @(
    @{
        Source = "$SourceDir\.claude\skills\vibe-coding-workflow\SKILL.md"
        Dest = "$ClaudeDir\skills\vibe-coding-workflow\SKILL.md"
        Name = "SKILL.md"
    },
    @{
        Source = "$SourceDir\.claude\commands\init-vibe.md"
        Dest = "$ClaudeDir\commands\init-vibe.md"
        Name = "init-vibe 命令"
    }
)

Write-Host "[vibe-coding-workflow] 安装开始" -ForegroundColor Cyan
if ($DryRun) {
    Write-Host "[vibe-coding-workflow] DRY-RUN 模式，不会写入文件" -ForegroundColor Yellow
}

$AllOk = $true
foreach ($File in $Files) {
    if (-not (Test-Path $File.Source)) {
        Write-Host "[vibe-coding-workflow] ⚠ $($File.Name) 源文件不存在: $($File.Source)" -ForegroundColor Yellow
        $AllOk = $false
        continue
    }

    if ($DryRun) {
        Write-Host "[vibe-coding-workflow] 📋 将复制 $($File.Name) → $($File.Dest)" -ForegroundColor Cyan
    } else {
        $DestDir = Split-Path -Parent $File.Dest
        New-Item -ItemType Directory -Path $DestDir -Force | Out-Null
        Copy-Item -Path $File.Source -Destination $File.Dest -Force
        Write-Host "[vibe-coding-workflow] ✓ $($File.Name) 已安装到 $($File.Dest)" -ForegroundColor Green
    }
}

if (-not $DryRun -and $AllOk) {
    Write-Host ""
    Write-Host "[vibe-coding-workflow] 安装完成！现在可以在任意项目中运行 /init-vibe 开始使用。" -ForegroundColor Green
    Write-Host "[vibe-coding-workflow]" -ForegroundColor Green
    Write-Host "[vibe-coding-workflow] 快速开始:" -ForegroundColor Green
    Write-Host "[vibe-coding-workflow]   1. cd your-project" -ForegroundColor Green
    Write-Host "[vibe-coding-workflow]   2. /init-vibe" -ForegroundColor Green
    Write-Host "[vibe-coding-workflow]   3. 开始开发，AI 自动按 L0-L3 分级执行" -ForegroundColor Green
}
