# PowerShell script to run automated tests and linting
param(
    [switch]$IncludeUI = $false
)

$rootDir = Resolve-Path (Join-Path $PSScriptRoot "..\..\..\..")
$frontendDir = Join-Path $rootDir "frontend"

Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "   Trang Suc Project - Test Runner" -ForegroundColor Cyan
Write-Host "===============================================`n" -ForegroundColor Cyan

# 1. Run Oxlint on frontend
Write-Host ">>> [1/3] Running Frontend Linter (Oxlint)..." -ForegroundColor Yellow
Push-Location $frontendDir
try {
    npm run lint
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Frontend Lint: PASSED`n" -ForegroundColor Green
    } else {
        Write-Host "Frontend Lint: FAILED with issues`n" -ForegroundColor Red
    }
} finally {
    Pop-Location
}

# 2. Check Backend API sanity
Write-Host ">>> [2/3] Checking Backend Endpoints..." -ForegroundColor Yellow
$endpoints = @(
    "http://127.0.0.1:5000/api/products",
    "http://127.0.0.1:5000/api/categories"
)

$backendOk = $true
foreach ($url in $endpoints) {
    try {
        $res = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 3 -ErrorAction Stop
        Write-Host "  GET $url -> Status OK" -ForegroundColor Green
    } catch {
        Write-Host "  GET $url -> FAILED ($_)" -ForegroundColor Red
        $backendOk = $false
    }
}

# 3. Optional Puppeteer UI Test
if ($IncludeUI) {
    Write-Host "`n>>> [3/3] Running Puppeteer UI Test..." -ForegroundColor Yellow
    Push-Location $frontendDir
    try {
        node test_ui_puppeteer.js
    } finally {
        Pop-Location
    }
} else {
    Write-Host "`n>>> [3/3] UI Puppeteer test skipped (use -IncludeUI to run)." -ForegroundColor Gray
}

Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "   Testing Finished" -ForegroundColor Cyan
Write-Host "===============================================`n" -ForegroundColor Cyan
