<#
.SYNOPSIS
    Install Vibe Coding Workflow for Claude Code
.DESCRIPTION
    Copies skill folder to ~/.claude/skills/vibe-coding-workflow/
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

$SkillSourceDir = "$SourceDir\skills\vibe-coding-workflow"
$SkillDestDir = "$ClaudeDir\skills\vibe-coding-workflow"
$CommandSource = "$SourceDir\commands\init-vibe.md"
$CommandDest = "$ClaudeDir\commands\init-vibe.md"

Write-Host "[vibe-coding-workflow] Install start" -ForegroundColor Cyan
if ($DryRun) {
    Write-Host "[vibe-coding-workflow] DRY-RUN mode, no files will be written" -ForegroundColor Yellow
}

$AllOk = $true

if (-not (Test-Path $SkillSourceDir)) {
    Write-Host "[vibe-coding-workflow] WARN missing skill source directory: $SkillSourceDir" -ForegroundColor Yellow
    $AllOk = $false
} elseif ($DryRun) {
    Write-Host "[vibe-coding-workflow] COPY skill directory -> $SkillDestDir" -ForegroundColor Cyan
} else {
    New-Item -ItemType Directory -Path $SkillDestDir -Force | Out-Null
    Copy-Item -Path "$SkillSourceDir\*" -Destination $SkillDestDir -Recurse -Force
    Write-Host "[vibe-coding-workflow] OK installed skill directory to $SkillDestDir" -ForegroundColor Green
}

if (-not (Test-Path $CommandSource)) {
    Write-Host "[vibe-coding-workflow] WARN missing command source file: $CommandSource" -ForegroundColor Yellow
    $AllOk = $false
} elseif ($DryRun) {
    Write-Host "[vibe-coding-workflow] COPY init-vibe command -> $CommandDest" -ForegroundColor Cyan
} else {
    $CommandDestDir = Split-Path -Parent $CommandDest
    New-Item -ItemType Directory -Path $CommandDestDir -Force | Out-Null
    Copy-Item -Path $CommandSource -Destination $CommandDest -Force
    Write-Host "[vibe-coding-workflow] OK installed init-vibe command to $CommandDest" -ForegroundColor Green
}

if (-not $DryRun -and $AllOk) {
    Write-Host ""
    Write-Host "[vibe-coding-workflow] Install completed. You can now run /init-vibe in your project." -ForegroundColor Green
    Write-Host "[vibe-coding-workflow] Quick start:" -ForegroundColor Green
    Write-Host "[vibe-coding-workflow]   1. cd your-project" -ForegroundColor Green
    Write-Host "[vibe-coding-workflow]   2. /init-vibe" -ForegroundColor Green
}
