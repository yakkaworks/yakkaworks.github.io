# Sync the live branch into an isolated live-sync folder. The MkDocs source is untouched.
$ErrorActionPreference = 'Stop'

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$LiveBranch = 'weblive'
$LiveRemote = 'https://github.com/yakkaworks/yakkaworks.github.io.git'
$LiveDir = Join-Path $ProjectRoot 'live-sync'

try {
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        throw "Git was not found. Install Git from https://git-scm.com/download/win and retry."
    }

    Write-Host "`n==> Syncing origin/$LiveBranch into live-sync/" -ForegroundColor Green

    if (-not (Test-Path $LiveDir)) {
        & git clone --single-branch --branch $LiveBranch $LiveRemote $LiveDir
        if ($LASTEXITCODE -ne 0) { throw "git clone failed (exit code $LASTEXITCODE). Check internet access and that the '$LiveBranch' branch exists." }
        Write-Host "`nLive branch cloned to: $LiveDir" -ForegroundColor Green
        exit 0
    }

    if (-not (Test-Path (Join-Path $LiveDir '.git'))) {
        throw "'$LiveDir' already exists but is not a Git repository. Move it aside and retry."
    }

    $CurrentRemote = (& git -C $LiveDir remote get-url origin 2>$null | Out-String).Trim()
    if ($LASTEXITCODE -ne 0) { throw 'Could not read the origin remote in live-sync/. Check the repository configuration.' }
    $LiveRemoteWithoutGitSuffix = $LiveRemote -replace '\.git$', ''
    $AllowedRemotes = @(
        $LiveRemote
        $LiveRemoteWithoutGitSuffix
        'git@github.com:yakkaworks/yakkaworks.github.io.git'
        'ssh://git@github.com/yakkaworks/yakkaworks.github.io.git'
    )
    if ($CurrentRemote -notin $AllowedRemotes) {
        throw "The origin in live-sync/ points to '$CurrentRemote', not the expected Yakka Works repository. Fix it manually before syncing."
    }

    $CurrentBranch = (& git -C $LiveDir symbolic-ref --short HEAD 2>$null | Out-String).Trim()
    if ($LASTEXITCODE -ne 0 -or $CurrentBranch -ne $LiveBranch) {
        throw "live-sync/ is on '$CurrentBranch', not '$LiveBranch'. Switch it manually before syncing."
    }

    $Status = (& git -C $LiveDir status --porcelain --untracked-files=all | Out-String).Trim()
    if ($LASTEXITCODE -ne 0) { throw 'Could not check live-sync/ status.' }
    if ($Status) {
        throw 'live-sync/ has local changes or untracked files. Commit, stash, or remove them before syncing; this script will not overwrite them.'
    }

    & git -C $LiveDir pull --ff-only origin $LiveBranch
    if ($LASTEXITCODE -ne 0) { throw "git pull --ff-only failed (exit code $LASTEXITCODE). No force update was attempted." }

    Write-Host "`nSync complete. Local live branch: $LiveDir" -ForegroundColor Green
}
catch {
    Write-Host "`nERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
