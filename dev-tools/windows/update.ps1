# Update the current checkout (if it has an upstream) and upgrade packages.
. "$PSScriptRoot\_common.ps1"
try {
    Set-Location $ProjectRoot
    if ((Test-Path (Join-Path $ProjectRoot '.git')) -and (Get-Command git -ErrorAction SilentlyContinue)) {
        $branch = (& git branch --show-current 2>$null | Out-String).Trim()
        if ($LASTEXITCODE -ne 0 -or -not $branch) { throw 'Could not determine the current Git branch.' }
        if ($branch -ne 'y2k-portal-dev') { throw "Safety check: expected y2k-portal-dev, currently on '$branch'. Switch branches manually." }
        $upstream = (& git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>$null | Out-String).Trim()
        if ($LASTEXITCODE -eq 0 -and $upstream) {
            Write-Step "Pulling latest changes from $upstream"
            & git pull --ff-only
            Assert-LastOk 'git pull --ff-only'
        } else {
            Write-Warn 'No upstream is configured yet; skipping Git pull.'
        }
    } else {
        Write-Warn 'Not a Git checkout; skipping Git pull.'
    }
    Install-Env -Upgrade
    Write-Step 'Installed versions'
    & $VenvPython -m pip list --format=columns | Select-String -Pattern '^(mkdocs|mkdocs-material|mkdocs-static-i18n|mkdocs-awesome-pages-plugin|mkdocs-redirects) '
    Write-Host ''
    Write-Host 'Update complete.' -ForegroundColor Green
} catch {
    Show-Failure $_
    exit 1
}
