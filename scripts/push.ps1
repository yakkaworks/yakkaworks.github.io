# Strict build check, then commit and push to the mkdocs-site branch ONLY.
# main and weblive are protected: this script refuses to touch them and never force-pushes.
param(
    [string]$Message
)

. "$PSScriptRoot\_common.ps1"

$Branch    = 'mkdocs-site'
$RemoteUrl = 'https://github.com/yakkaworks/yakkaworks.github.io.git'
$Protected = @('main', 'master', 'weblive')

try {
    Set-Location $ProjectRoot
    Assert-Tool git 'Install Git for Windows from https://git-scm.com/download/win'
    Ensure-Env

    if ($Protected -contains $Branch) {
        throw "Safety check: '$Branch' is a protected branch name."
    }

    # 1. Build first. If this fails nothing gets pushed.
    Write-Step 'Strict build check (broken links and warnings stop the push)'
    & $VenvPython -m mkdocs build --strict
    Assert-LastOk 'mkdocs build --strict (fix the problems above, nothing was pushed)'

    # 2. Git setup
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

    # 3. Make sure we are on the right branch
    git rev-parse --verify HEAD 2>$null | Out-Null
    $hasCommits = ($LASTEXITCODE -eq 0)

    if (-not $hasCommits) {
        # Fresh repo: start a brand-new history on the mkdocs-site branch
        git symbolic-ref HEAD "refs/heads/$Branch"
        Assert-LastOk 'Creating the branch'
    }

    $onBranch = (git symbolic-ref --short HEAD)
    if ($onBranch -ne $Branch) {
        throw "You are on '$onBranch'. This script only pushes '$Branch'. Run: git checkout $Branch"
    }

    # 4. Don't clobber a remote branch this folder knows nothing about
    $remoteHas = (git ls-remote --heads origin $Branch)
    Assert-LastOk 'Contacting GitHub (check your login / internet)'
    if (-not $hasCommits -and $remoteHas) {
        throw "origin already has '$Branch' but this folder has no commits yet. Clone that branch instead of pushing over it."
    }

    # 5. Commit
    git add -A
    Assert-LastOk 'git add'
    $pending = git status --porcelain
    if ($pending) {
        if (-not $Message) {
            $default = 'Update site ' + (Get-Date -Format 'yyyy-MM-dd HH:mm')
            $typed   = Read-Host "Commit message [$default]"
            if ($typed) { $Message = $typed } else { $Message = $default }
        }
        git commit -m $Message
        Assert-LastOk 'git commit'
    } else {
        Write-Host 'No file changes to commit.'
    }

    # 6. Push (explicit refspec, no force)
    Write-Step "Pushing to origin/$Branch"
    git push -u origin "${Branch}:${Branch}"
    Assert-LastOk 'git push'

    Write-Host ''
    Write-Host "Pushed. Build check runs on GitHub: https://github.com/yakkaworks/yakkaworks.github.io/actions" -ForegroundColor Green
    Write-Host "The live site is unchanged until you merge into weblive (see README)." -ForegroundColor Green
}
catch {
    Show-Failure $_
    exit 1
}
