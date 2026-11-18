# Shared helpers for the y2k-portal-dev Windows command set.
# Keep this file ASCII-only for Windows PowerShell 5.1 compatibility.

# This file lives in <repo>\dev-tools\windows\; repository root is two levels up.
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$VenvDir = Join-Path $ProjectRoot '.venv'
$VenvPython = Join-Path $VenvDir 'Scripts\python.exe'
$Requirements = Join-Path $ProjectRoot 'requirements.txt'
$ErrorActionPreference = 'Continue'

function Write-Step([string]$Text) {
    Write-Host ''
    Write-Host "==> $Text" -ForegroundColor Green
}
function Write-Warn([string]$Text) {
    Write-Host "!!  $Text" -ForegroundColor Yellow
}
function Assert-LastOk([string]$What) {
    if ($LASTEXITCODE -ne 0) { throw "$What failed (exit code $LASTEXITCODE)." }
}
function Assert-Tool([string]$Name, [string]$Hint) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) { throw "'$Name' was not found. $Hint" }
}
function Find-Python {
    if (Get-Command py -ErrorAction SilentlyContinue) { return @{ Exe = 'py'; Args = @('-3') } }
    if (Get-Command python -ErrorAction SilentlyContinue) { return @{ Exe = 'python'; Args = @() } }
    throw 'Python 3 was not found. Install it from https://www.python.org/downloads/ and enable Add Python to PATH.'
}
function Install-Env([switch]$Upgrade) {
    Write-Step 'Checking Python'
    $py = Find-Python
    $version = & $py.Exe @($py.Args + @('-c', 'import sys; print("%d.%d" % sys.version_info[:2])'))
    Assert-LastOk 'Python version check'
    $parts = "$version".Trim().Split('.')
    if ([int]$parts[0] -lt 3 -or ([int]$parts[0] -eq 3 -and [int]$parts[1] -lt 9)) {
        throw 'Python 3.9 or newer is required.'
    }
    if (-not (Test-Path $VenvPython)) {
        Write-Step 'Creating the project-local .venv'
        & $py.Exe @($py.Args + @('-m', 'venv', $VenvDir))
        Assert-LastOk 'Creating virtual environment'
    }
    Write-Step 'Installing Python dependencies'
    & $VenvPython -m pip install --upgrade pip
    Assert-LastOk 'Upgrading pip'
    if ($Upgrade) {
        & $VenvPython -m pip install --upgrade -r $Requirements
    } else {
        & $VenvPython -m pip install -r $Requirements
    }
    Assert-LastOk 'Installing requirements'
}
function Ensure-Env {
    if (-not (Test-Path $VenvPython)) {
        Write-Warn 'No local environment found. Setting it up now.'
        Install-Env
        return
    }
    & $VenvPython -c 'import mkdocs, material, mkdocs_static_i18n, mkdocs_awesome_pages_plugin, mkdocs_redirects' 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Warn 'The environment is incomplete. Reinstalling dependencies.'
        Install-Env
    }
}
function Show-Failure($ErrorRecord) {
    Write-Host ''
    Write-Host "ERROR: $($ErrorRecord.Exception.Message)" -ForegroundColor Red
}
