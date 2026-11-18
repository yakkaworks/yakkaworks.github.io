@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1" %*
set "EXITCODE=%ERRORLEVEL%"
echo.
pause
exit /b %EXITCODE%
