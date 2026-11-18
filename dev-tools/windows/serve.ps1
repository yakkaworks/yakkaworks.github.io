# Local live-reload preview at http://127.0.0.1:8000/ (Ctrl+C to stop).
. "$PSScriptRoot\_common.ps1"
try {
    Set-Location $ProjectRoot
    Ensure-Env
    Write-Step 'Starting the y2k-portal-dev preview at http://127.0.0.1:8000/'
    & $VenvPython -m mkdocs serve --dev-addr 127.0.0.1:8000 --open
    Assert-LastOk 'MkDocs development server'
} catch {
    Show-Failure $_
    exit 1
}
