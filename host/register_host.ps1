# Auto Registration Script for Discord RPC Native Messaging Host
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$manifestChromium = Join-Path $scriptDir "manifests\com.discordrpc.bridge.json"
$manifestFirefox = Join-Path $scriptDir "manifests\com.discordrpc.bridge.firefox.json"
$batPath = Join-Path $scriptDir "host.bat"

# Update absolute path inside JSON manifests dynamically
Write-Host "Updating manifest paths to: $batPath" -ForegroundColor Cyan

# Update Chromium manifest
$chromiumJson = Get-Content $manifestChromium -Raw | ConvertFrom-Json
$chromiumJson.path = $batPath
$chromiumJson | ConvertTo-Json -Depth 5 | Set-Content $manifestChromium

# Update Firefox manifest
$firefoxJson = Get-Content $manifestFirefox -Raw | ConvertFrom-Json
$firefoxJson.path = $batPath
$firefoxJson | ConvertTo-Json -Depth 5 | Set-Content $manifestFirefox

# Registry targets for HKCU
$targets = @(
    @{ Name = "Google Chrome"; Path = "HKCU:\Software\Google\Chrome\NativeMessagingHosts\com.discordrpc.bridge"; Manifest = $manifestChromium },
    @{ Name = "Microsoft Edge"; Path = "HKCU:\Software\Microsoft\Edge\NativeMessagingHosts\com.discordrpc.bridge"; Manifest = $manifestChromium },
    @{ Name = "Brave Browser"; Path = "HKCU:\Software\BraveSoftware\Brave-Browser\NativeMessagingHosts\com.discordrpc.bridge"; Manifest = $manifestChromium },
    @{ Name = "Mozilla Firefox"; Path = "HKCU:\Software\Mozilla\NativeMessagingHosts\com.discordrpc.bridge"; Manifest = $manifestFirefox }
)

Write-Host "`nRegistering Native Messaging Host to Windows Registry..." -ForegroundColor Green

foreach ($target in $targets) {
    try {
        if (!(Test-Path $target.Path)) {
            New-Item -Path $target.Path -Force | Out-Null
        }
        Set-ItemProperty -Path $target.Path -Name "(default)" -Value $target.Manifest | Out-Null
        Write-Host "[OK] Registered for $($target.Name)" -ForegroundColor Green
    } catch {
        Write-Host "[WARN] Could not register for $($target.Name): $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host "`nNative Messaging Host successfully registered for all target browsers!" -ForegroundColor Cyan
