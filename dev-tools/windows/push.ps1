# Strict build, commit, and push to y2k-portal-dev ONLY. Never force-push.
param([string]$Message)
. "$PSScriptRoot\_common.ps1"

$Branch = 'y2k-portal-dev'
$RemoteUrl = 'https://github.com/yakkaworks/yakkaworks.github.io.git'
$Protected = @('main', 'master', 'web-live', 'mkdocs-site', 'mkdocs-site-live')

try {
    Set-Location $ProjectRoot
    Assert-Tool git 'Install Git for Windows from https://git-scm.com/download/win.'
    if (-not (Test-Path (Join-Path $ProjectRoot '.git'))) { throw 'This folder is not a Git checkout. Clone y2k-portal-dev first.' }

    $currentBranch = (& git branch --show-current 2>$null | Out-String).Trim()
    if ($LASTEXITCODE -ne 0 -or -not $currentBranch) { throw 'Could not determine the current branch (detached HEAD?).' }
    if ($Protected -contains $currentBranch) { throw "Safety check: '$currentBranch' is protected." }
    if ($currentBranch -ne $Branch) { throw "This command only pushes '$Branch'. You are on '$currentBranch'. Switch branches manually." }

    $remotes = @(& git remote)
    if ($remotes -notcontains 'origin') { throw 'No origin remote is configured. Check your clone.' }
    $currentRemote = (& git remote get-url origin 2>$null | Out-String).Trim()
    $plainRemote = $RemoteUrl -replace '\.git$', ''
    if ($currentRemote -ne $RemoteUrl -and $currentRemote -ne $plainRemote -and
        $currentRemote -ne 'git@github.com:yakkaworks/yakkaworks.github.io.git' -and
        $currentRemote -ne 'ssh://git@github.com/yakkaworks/yakkaworks.github.io.git') {
        throw "origin points to '$currentRemote', not the expected Yakka Works repository."
    }

    Ensure-Env
    Write-Step 'Strict MkDocs build (warnings stop the push)'
    & $VenvPython -m mkdocs build --strict
    Assert-LastOk 'mkdocs build --strict; nothing was pushed'

    Write-Step "Checking remote branch origin/$Branch"
    & git ls-remote --exit-code --heads origin $Branch | Out-Null
    Assert-LastOk "Checking origin/$Branch"

    Write-Step 'Staging changes'
    & git add -A
    Assert-LastOk 'git add'
    $pending = (& git status --porcelain | Out-String).Trim()
    if ($pending) {
        if (-not $Message) {
            $default = 'Update portal ' + (Get-Date -Format 'yyyy-MM-dd HH:mm')
            $typed = Read-Host "Commit message [$default]"
            if ($typed) { $Message = $typed } else { $Message = $default }
        }
        & git commit -m $Message
        Assert-LastOk 'git commit'
    } else {
        Write-Host 'No uncommitted changes.'
    }

    Write-Step "Pushing to origin/$Branch (no force option)"
    & git push -u origin "${Branch}:${Branch}"
    Assert-LastOk 'git push'

    Write-Host ''
    Write-Host "Pushed to $Branch. This does not publish the live website." -ForegroundColor Green
} catch {
    Show-Failure $_
    exit 1
}
