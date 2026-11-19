# Strict build check, then commit and push to the y2k-dev branch ONLY.
# Production and the previous site branch are protected; this script never force-pushes.
param(
    [string]$Message
)

. "$PSScriptRoot\_common.ps1"

$Branch    = 'y2k-dev'
$RemoteUrl = 'https://github.com/yakkaworks/yakkaworks.github.io.git'
$Protected = @('main', 'master', 'web-live', 'mkdocs-site', 'mkdocs-site-live')

try {
    Set-Location $ProjectRoot
    Assert-Tool git 'Install Git for Windows from https://git-scm.com/download/win'
    Ensure-Env

    if ($Protected -contains $Branch) {
        throw "Safety check: '$Branch' is a protected branch name."
    }

    Write-Step 'Strict build check (broken links and warnings stop the push)'
    & $VenvPython -m mkdocs build --strict
    Assert-LastOk 'mkdocs build --strict (fix the problems above, nothing was pushed)'

    Write-Step 'Preparing git'
    if (-not (Test-Path (Join-Path $ProjectRoot '.git'))) {
        git init
        Assert-LastOk 'git init'
    }

    $remotes = @(git remote)
    if ($remotes -notcontains 'origin') {
        git remote add origin $RemoteUrl
        Assert-LastOk 'git remote add'
    } else {
        $current = (git remote get-url origin)
        $plain   = $RemoteUrl -replace '\.git$', ''
        if ($current -ne $RemoteUrl -and $current -ne $plain) {
            throw "Remote 'origin' points to $current, expected $RemoteUrl. Fix it with: git remote set-url origin $RemoteUrl"
        }
    }

    $name  = (git config user.name)
    $email = (git config user.email)
    if (-not $name -or -not $email) {
        throw 'Git does not know who you are yet. Run: git config --global user.name "Your Name"  and  git config --global user.email "you@example.com"'
    }

    git rev-parse --verify HEAD 2>$null | Out-Null
    $hasCommits = ($LASTEXITCODE -eq 0)

    if (-not $hasCommits) {
        git symbolic-ref HEAD "refs/heads/$Branch"
        Assert-LastOk 'Creating the branch'
    }

    $onBranch = (git symbolic-ref --short HEAD)
    if ($onBranch -ne $Branch) {
        throw "You are on '$onBranch'. This script only pushes '$Branch'. Run: git checkout $Branch"
    }

    $remoteHas = (git ls-remote --heads origin $Branch)
    Assert-LastOk 'Contacting GitHub (check your login / internet)'
    if (-not $hasCommits -and $remoteHas) {
        throw "origin already has '$Branch' but this folder has no commits yet. Clone that branch instead of pushing over it."
    }

    git add -A
    Assert-LastOk 'git add'
    $pending = git status --porcelain
    if ($pending) {
        if (-not $Message) {
            $default = 'Update Yakka Works site ' + (Get-Date -Format 'yyyy-MM-dd HH:mm')
            $typed   = Read-Host "Commit message [$default]"
            if ($typed) { $Message = $typed } else { $Message = $default }
        }
        git commit -m $Message
        Assert-LastOk 'git commit'
    } else {
        Write-Host 'No file changes to commit.'
    }

    Write-Step "Pushing to origin/$Branch"
    git push -u origin "${Branch}:${Branch}"
    Assert-LastOk 'git push'

    Write-Host ''
    Write-Host "Pushed. Build check runs on GitHub: https://github.com/yakkaworks/yakkaworks.github.io/actions" -ForegroundColor Green
    Write-Host "The live site is unchanged; deployment remains restricted to mkdocs-site-live." -ForegroundColor Green
}
catch {
    Show-Failure $_
    exit 1
}
