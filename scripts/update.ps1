# Pull / update: gets the latest from GitHub (if this folder is linked), sets up
# the environment if it is missing, and upgrades the Python packages within the
# version ranges pinned in requirements.txt. Safe to run any time.
# pull.bat and update.bat both run this script.
. "$PSScriptRoot\_common.ps1"

try {
    Set-Location $ProjectRoot

    if ((Test-Path (Join-Path $ProjectRoot '.git')) -and (Get-Command git -ErrorAction SilentlyContinue)) {
        $upstream = git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>$null
        if ($LASTEXITCODE -eq 0 -and $upstream) {
            Write-Step "Pulling latest changes from $upstream"
            git pull --ff-only
            Assert-LastOk 'git pull'
        } else {
            Write-Warn 'No upstream branch yet (nothing pushed from here), skipping git pull.'
        }
    } else {
        Write-Warn 'Not a git repository yet, skipping git pull.'
    }

    # Create the environment if needed, then bring packages up to date.
    Install-Env -Upgrade

    Write-Step 'Installed versions'
    & $VenvPython -m pip list --format=columns | Select-String -Pattern '^(mkdocs|mkdocs-material|mkdocs-static-i18n|mkdocs-awesome-pages-plugin|mkdocs-redirects) '

    Write-Host ''
    Write-Host 'Done. Run serve.bat to preview, or just add content.' -ForegroundColor Green
}
catch {
    Show-Failure $_
    exit 1
}
