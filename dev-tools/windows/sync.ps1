# Clone/update production branch into a separate live-sync folder; never edits this checkout.
$ErrorActionPreference = 'Stop'
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$LiveBranch = 'mkdocs-site-live'
$LiveRemote = 'https://github.com/yakkaworks/yakkaworks.github.io.git'
$LiveDir = Join-Path $ProjectRoot 'live-sync'
try {
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Git was not found. Install Git for Windows and retry.' }
    Write-Host "`n==> Syncing origin/$LiveBranch into live-sync/" -ForegroundColor Green
    if (-not (Test-Path $LiveDir)) {
        & git clone --single-branch --branch $LiveBranch $LiveRemote $LiveDir
        if ($LASTEXITCODE -ne 0) { throw "git clone failed (exit code $LASTEXITCODE)." }
        Write-Host "Cloned production branch to $LiveDir" -ForegroundColor Green
        exit 0
    }
    if (-not (Test-Path (Join-Path $LiveDir '.git'))) { throw "'$LiveDir' exists but is not a Git repository." }
    $remote = (& git -C $LiveDir remote get-url origin 2>$null | Out-String).Trim()
    if ($LASTEXITCODE -ne 0) { throw 'Could not read live-sync origin.' }
    $plain = $LiveRemote -replace '\.git$', ''
    $allowed = @($LiveRemote, $plain, 'git@github.com:yakkaworks/yakkaworks.github.io.git', 'ssh://git@github.com/yakkaworks/yakkaworks.github.io.git')
    if ($remote -notin $allowed) { throw "live-sync origin is '$remote', not the expected repository." }
    $current = (& git -C $LiveDir branch --show-current 2>$null | Out-String).Trim()
    if ($LASTEXITCODE -ne 0 -or $current -ne $LiveBranch) { throw "live-sync is on '$current', expected '$LiveBranch'." }
    $status = (& git -C $LiveDir status --porcelain --untracked-files=all | Out-String).Trim()
    if ($LASTEXITCODE -ne 0) { throw 'Could not inspect live-sync status.' }
    if ($status) { throw 'live-sync has local changes/untracked files. Commit, stash, or remove them before syncing.' }
    & git -C $LiveDir pull --ff-only origin $LiveBranch
    if ($LASTEXITCODE -ne 0) { throw 'Fast-forward pull failed. No reset or force operation was attempted.' }
    Write-Host 'Production sync complete.' -ForegroundColor Green
} catch {
    Write-Host "`nERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
