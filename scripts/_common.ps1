# Shared helpers for the Yakka Works MkDocs scripts.
# Keep this file ASCII-only (Windows PowerShell 5.1 reads BOM-less files as ANSI).

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$VenvDir     = Join-Path $ProjectRoot '.venv'
$VenvPython  = Join-Path $VenvDir 'Scripts\python.exe'

# Native commands (git, python) do not stop the script on failure by themselves,
# so every call is followed by Assert-LastOk.
$ErrorActionPreference = 'Continue'

function Write-Step([string]$Text) {
    Write-Host ''
    Write-Host "==> $Text" -ForegroundColor Green
}

function Write-Warn([string]$Text) {
    Write-Host "!!  $Text" -ForegroundColor Yellow
}

function Assert-LastOk([string]$What) {
    if ($LASTEXITCODE -ne 0) {
        throw "$What failed (exit code $LASTEXITCODE)."
    }
}

function Assert-Tool([string]$Name, [string]$Hint) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "'$Name' was not found. $Hint"
    }
}

function Find-Python {
    # Prefer the 'py' launcher; the plain 'python' command can be the Microsoft Store stub.
    if (Get-Command py -ErrorAction SilentlyContinue) {
        return @{ Exe = 'py'; Args = @('-3') }
    }
    if (Get-Command python -ErrorAction SilentlyContinue) {
        return @{ Exe = 'python'; Args = @() }
    }
    throw 'Python 3 was not found. Install it from https://www.python.org/downloads/ (tick "Add python.exe to PATH").'
}

# Creates .venv (if missing) and installs requirements.txt into it.
function Install-Env([switch]$Upgrade) {
    Write-Step 'Checking Python'
    $py = Find-Python
    $ok = & $py.Exe @($py.Args + @('-c', 'import sys; print(sys.version_info >= (3, 9))'))
    Assert-LastOk 'Python check'
    if ("$ok".Trim() -ne 'True') {
        throw 'Python 3.9 or newer is required.'
    }

    if (-not (Test-Path $VenvPython)) {
        Write-Step 'Creating virtual environment (.venv)'
        & $py.Exe @($py.Args + @('-m', 'venv', $VenvDir))
        Assert-LastOk 'Creating the virtual environment'
    }

    Write-Step 'Installing packages (first time can take a minute)'
    & $VenvPython -m pip install --upgrade pip
    Assert-LastOk 'Upgrading pip'
    $req = Join-Path $ProjectRoot 'requirements.txt'
    if ($Upgrade) {
        & $VenvPython -m pip install --upgrade -r $req
    } else {
        & $VenvPython -m pip install -r $req
    }
    Assert-LastOk 'Installing requirements'
}

# Makes sure the environment exists and works. Runs the install automatically when
# it does not, so a fresh copy of the project needs no manual setup step.
function Ensure-Env {
    if (-not (Test-Path $VenvPython)) {
        Write-Warn 'First run on this machine: setting up the environment automatically.'
        Install-Env
        return
    }
    & $VenvPython -c "import mkdocs, material, mkdocs_static_i18n, mkdocs_awesome_pages_plugin, mkdocs_redirects" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Warn 'Some packages are missing, reinstalling them.'
        Install-Env
    }
}

function Show-Failure($ErrorRecord) {
    Write-Host ''
    Write-Host "ERROR: $($ErrorRecord.Exception.Message)" -ForegroundColor Red
}
