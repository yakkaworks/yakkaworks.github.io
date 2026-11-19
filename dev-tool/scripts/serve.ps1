# Local live-reload preview at http://127.0.0.1:8000/ (Ctrl+C to stop).
# Sets up the environment first if this is a fresh copy of the project.
. "$PSScriptRoot\_common.ps1"

try {
    Set-Location $ProjectRoot
    Ensure-Env

    Write-Step 'Starting preview server at http://127.0.0.1:8000/  (Ctrl+C to stop)'
    & $VenvPython -m mkdocs serve --dev-addr 127.0.0.1:8000 --open
}
catch {
    Show-Failure $_
    exit 1
}
