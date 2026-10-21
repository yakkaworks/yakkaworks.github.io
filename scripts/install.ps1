# Manual (re)install of the environment. You normally never need this:
# serve.bat, push.bat and pull.bat set the environment up by themselves.
. "$PSScriptRoot\_common.ps1"

try {
    Set-Location $ProjectRoot

    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Warn 'Git was not found. Install it from https://git-scm.com/download/win before using push.bat.'
    }

    Install-Env

    Write-Step 'Installed versions'
    & $VenvPython -m pip list --format=columns | Select-String -Pattern '^(mkdocs|mkdocs-material|mkdocs-static-i18n|mkdocs-awesome-pages-plugin|mkdocs-redirects) '

    Write-Host ''
    Write-Host 'Done. Next: serve.bat to preview the site locally.' -ForegroundColor Green
}
catch {
    Show-Failure $_
    exit 1
}
