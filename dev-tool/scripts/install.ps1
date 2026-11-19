# Manual (re)install of the environment. The preview and push helpers also set it up automatically.
. "$PSScriptRoot\_common.ps1"

try {
    Set-Location $ProjectRoot

    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Warn 'Git was not found. Install it from https://git-scm.com/download/win before using the Git helpers.'
    }

    Install-Env

    Write-Step 'Installed versions'
    & $VenvPython -m pip list --format=columns | Select-String -Pattern '^(mkdocs|mkdocs-material|mkdocs-static-i18n|mkdocs-awesome-pages-plugin|mkdocs-redirects) '

    Write-Host ''
    Write-Host 'Done. Next: dev-tool\serve.bat to preview the site locally.' -ForegroundColor Green
}
catch {
    Show-Failure $_
    exit 1
}
