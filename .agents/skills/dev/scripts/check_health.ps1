# PowerShell script to verify development environment health for Trang Suc project
param(
    [string]$BackendUrl = "http://127.0.0.1:5000/api/products",
    [string]$FrontendUrl = "http://localhost:5173"
)

Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "   Trang Suc Project - Dev Health Checker" -ForegroundColor Cyan
Write-Host "===============================================`n" -ForegroundColor Cyan

$allPassed = $true

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..\..\..")

# 1. Check Python Venv
Write-Host "[1/5] Checking Python Virtual Environment..." -NoNewline
$venvPython = Join-Path $projectRoot "venv\Scripts\python.exe"
if (Test-Path $venvPython) {
    Write-Host " [OK]" -ForegroundColor Green
    Write-Host "      Path: $venvPython" -ForegroundColor Gray
} else {
    Write-Host " [WARNING] venv python not found at expected path." -ForegroundColor Yellow
}

# 2. Check Node & Frontend Dependencies
Write-Host "[2/5] Checking Frontend node_modules..." -NoNewline
$frontendModules = Join-Path $projectRoot "frontend\node_modules"
if (Test-Path $frontendModules) {
    Write-Host " [OK]" -ForegroundColor Green
} else {
    Write-Host " [WARNING] frontend/node_modules not found. Run 'npm install' in frontend/" -ForegroundColor Yellow
}

# 3. Check MySQL Port (3306)
Write-Host "[3/5] Checking MySQL Service (port 3306)..." -NoNewline
try {
    $tcp = New-Object System.Net.Sockets.TcpClient
    $connect = $tcp.BeginConnect("127.0.0.1", 3306, $null, $null)
    $success = $connect.AsyncWaitHandle.WaitOne(1500, $false)
    if ($success -and $tcp.Connected) {
        $tcp.EndConnect($connect)
        Write-Host " [OK] Connected to 127.0.0.1:3306" -ForegroundColor Green
    } else {
        Write-Host " [ERROR] Cannot connect to MySQL port 3306. Ensure MySQL server (XAMPP/MySQL) is running." -ForegroundColor Red
        $allPassed = $false
    }
    $tcp.Close()
} catch {
    Write-Host " [ERROR] $_" -ForegroundColor Red
    $allPassed = $false
}

# 4. Check Flask Backend (port 5000)
Write-Host "[4/5] Checking Flask Backend ($BackendUrl)..." -NoNewline
try {
    $backendRes = Invoke-RestMethod -Uri $BackendUrl -Method Get -TimeoutSec 3 -ErrorAction Stop
    Write-Host " [OK] Running (Status 200)" -ForegroundColor Green
} catch {
    Write-Host " [OFFLINE] Backend not responding on 5000. Start with: .\venv\Scripts\python.exe app.py" -ForegroundColor Yellow
}

# 5. Check Vite Frontend (port 5173)
Write-Host "[5/5] Checking Vite Frontend ($FrontendUrl)..." -NoNewline
try {
    $frontendRes = Invoke-WebRequest -Uri $FrontendUrl -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    Write-Host " [OK] Running (Status $($frontendRes.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host " [OFFLINE] Frontend not responding on 5173. Start in frontend/: npm run dev" -ForegroundColor Yellow
}

Write-Host "`n===============================================" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host "   Health Check Complete!" -ForegroundColor Green
} else {
    Write-Host "   Check completed with warnings/errors above." -ForegroundColor Yellow
}
Write-Host "===============================================`n" -ForegroundColor Cyan
