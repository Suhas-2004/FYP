# ICLAS - Intelligent Corporate & Leadership Advisory System Launcher
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting ICLAS - Intelligent Corporate Advisory System" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Start Backend Server
Write-Host "[1/2] Starting Node.js Express Backend on http://127.0.0.1:8000 ..." -ForegroundColor Green
$backendProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/backend'; npm run dev" -PassThru

Start-Sleep -Seconds 2

# Start Frontend Dev Server
Write-Host "[2/2] Starting React Vite Frontend on http://localhost:5173 ..." -ForegroundColor Green
$frontendProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/frontend'; npm run dev" -PassThru

Write-Host ""
Write-Host ">>> Both servers launched successfully!" -ForegroundColor Cyan
Write-Host ">>> Frontend UI: http://localhost:5173" -ForegroundColor Yellow
Write-Host ">>> Backend API: http://127.0.0.1:8000" -ForegroundColor Yellow

