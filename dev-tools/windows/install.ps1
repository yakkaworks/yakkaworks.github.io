. "$PSScriptRoot\_common.ps1"
try {
    Set-Location $ProjectRoot
    Install-Env
    Write-Step 'Installed versions'
    & $VenvPython -m pip list --format=columns | Select-String -Pattern '^(mkdocs|mkdocs-material|mkdocs-static-i18n|mkdocs-awesome-pages-plugin|mkdocs-redirects) '
    Write-Host ''
    Write-Host 'Done. Run dev-tools\windows\serve.cmd to preview the dev branch.' -ForegroundColor Green
} catch {
    Show-Failure $_
    exit 1
}
