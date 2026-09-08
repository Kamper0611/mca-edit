@echo off
setlocal
cd /d "%~dp0"

title Minecraft MCA Entity Editor

echo ========================================================
echo   Minecraft MCA Entity Editor - Launcher
echo ========================================================
echo.

:: 1. Check if extracted from ZIP
if not exist "package.json" goto ERR_NO_PACKAGE

:: 2. Check Node.js
where node >nul 2>nul
if errorlevel 1 goto ERR_NO_NODE

:: 3. Check npm
where npm >nul 2>nul
if errorlevel 1 goto ERR_NO_NPM

:: 4. Check dependencies (node_modules)
if not exist "node_modules\" goto DO_INSTALL
if not exist "node_modules\vite\" goto DO_INSTALL
goto START_APP

:DO_INSTALL
echo [INFO] First-time setup: Installing dependencies (npm install)...
echo [INFO] Please wait 1-2 minutes for installation to finish...
echo.
call npm install
if errorlevel 1 goto ERR_INSTALL_FAILED
echo.
echo [SUCCESS] Dependencies installed successfully!
echo.

:START_APP
echo [INFO] Starting Vite server at http://localhost:3000...
echo [INFO] Opening default browser...
echo.
echo ========================================================
echo   Server is running! Keep this window open.
echo   To stop the server, press Ctrl+C or close this window.
echo ========================================================
echo.

start http://localhost:3000

call npm run dev
if errorlevel 1 goto ERR_DEV_FAILED

echo.
echo Server closed.
pause
exit /b 0

:ERR_NO_PACKAGE
echo.
echo ========================================================
echo [ERROR] package.json not found in current folder!
echo.
echo [HINT] Did you double-click inside a .ZIP archive?
echo Please EXTRACT the zip folder completely first!
echo (Right-click the downloaded .zip -^> Extract All...)
echo Then open the extracted folder and run start.bat / 啟動.bat.
echo ========================================================
echo.
pause
exit /b 1

:ERR_NO_NODE
echo.
echo ========================================================
echo [ERROR] Node.js was not detected on this computer!
echo.
echo Please install Node.js (LTS version recommended) from:
echo https://nodejs.org/
echo.
echo After installation finishes, run this script again.
echo ========================================================
echo.
pause
exit /b 1

:ERR_NO_NPM
echo.
echo ========================================================
echo [ERROR] npm command was not found!
echo Please reinstall Node.js from https://nodejs.org/
echo ========================================================
echo.
pause
exit /b 1

:ERR_INSTALL_FAILED
echo.
echo ========================================================
echo [ERROR] "npm install" failed!
echo Please check your internet connection or run "npm install"
echo manually in Command Prompt.
echo ========================================================
echo.
pause
exit /b 1

:ERR_DEV_FAILED
echo.
echo ========================================================
echo [ERROR] Server encountered an error while running.
echo Please review the error log above.
echo ========================================================
echo.
pause
exit /b 1
