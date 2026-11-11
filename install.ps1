# Windows One-Liner Installer for YouTube Music Discord RPC Host
$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  🎵 YouTube Music Discord Rich Presence - Host Installer" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check Node.js and npm
try {
    $nodeVersion = node -v
    $npmVersion = npm -v
    Write-Host "✅ Found Node.js: $nodeVersion and npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "`n❌ Error: Node.js is not installed or not found in system PATH." -ForegroundColor Red
    Write-Host "👉 Please download and install Node.js (v18+) from: https://nodejs.org/" -ForegroundColor Yellow
    Exit 1
}

# 2. Setup install directory
$installDir = Join-Path $env:LOCALAPPDATA "discordRPC"
Write-Host "`n📁 Installing host bridge to: $installDir" -ForegroundColor Cyan

if (-not (Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
}

# 3. Download host files from GitHub repository
$zipUrl = "https://github.com/Taufiqu/discordRPC/archive/refs/heads/main.zip"
$tempZip = Join-Path $env:TEMP "discordRPC-main.zip"
$tempExtract = Join-Path $env:TEMP "discordRPC-extract"

Write-Host "⬇️ Downloading latest host bridge..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $zipUrl -OutFile $tempZip -UseBasicParsing

if (Test-Path $tempExtract) {
    Remove-Item -Path $tempExtract -Recurse -Force
}

Expand-Archive -Path $tempZip -DestinationPath $tempExtract -Force

# Copy host folder contents to install directory
$sourceHostDir = Join-Path $tempExtract "discordRPC-main\host\*"
Copy-Item -Path $sourceHostDir -Destination $installDir -Recurse -Force

# Clean temporary download files
Remove-Item -Path $tempZip -Force
Remove-Item -Path $tempExtract -Recurse -Force

# 4. Install npm dependencies
Write-Host "`n📦 Installing dependencies in $installDir..." -ForegroundColor Cyan
Push-Location $installDir
try {
    cmd.exe /c "npm install --omit=dev --silent"
} finally {
    Pop-Location
}

# 5. Register native messaging host in registry
Write-Host "`n⚙️ Registering Native Messaging Host to Windows Registry..." -ForegroundColor Cyan
$regScript = Join-Path $installDir "register_host.ps1"
& powershell.exe -ExecutionPolicy Bypass -File $regScript

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "🎉 Installation complete! The Discord RPC bridge is ready." -ForegroundColor Green
Write-Host "👉 Make sure Discord Desktop is open and your browser extension is installed." -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
