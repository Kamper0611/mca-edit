# Minecraft MCA Entity Editor Launcher
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Minecraft MCA Entity Editor - Launcher (PowerShell)   " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path $PSScriptRoot

if (-not (Test-Path "package.json")) {
    Write-Host "[ERROR] package.json not found!" -ForegroundColor Red
    Write-Host "Please EXTRACT the zip archive completely before running!" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "[ERROR] Node.js is not installed on this system!" -ForegroundColor Red
    Write-Host "Please download Node.js (LTS) from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] First time setup: Installing dependencies (npm install)..." -ForegroundColor Green
    npm install
}

Write-Host "[INFO] Opening default browser at http://localhost:3000..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host "[INFO] Starting dev server (npm run dev)..." -ForegroundColor Green
npm run dev
