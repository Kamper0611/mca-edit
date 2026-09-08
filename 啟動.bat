@echo off
cd /d "%~dp0"
if exist "%~dp0start.bat" (
    call "%~dp0start.bat"
) else (
    echo [ERROR] start.bat not found in %~dp0
    pause
)
