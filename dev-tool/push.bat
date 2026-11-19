@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\push.ps1" %*
echo.
pause
