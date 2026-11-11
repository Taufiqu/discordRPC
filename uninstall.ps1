# Windows One-Liner Uninstaller for YouTube Music Discord RPC Host
$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  🧹 YouTube Music Discord Rich Presence - Host Uninstaller" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$installDir = Join-Path $env:LOCALAPPDATA "discordRPC"

# Unregister registry keys
$unregScript = Join-Path $installDir "unregister_host.ps1"
if (Test-Path $unregScript) {
    & powershell.exe -ExecutionPolicy Bypass -File $unregScript
} else {
    # Fallback to direct registry removal
    $registryKeys = @(
        "HKCU:\Software\Google\Chrome\NativeMessagingHosts\com.discordrpc.bridge",
        "HKCU:\Software\Microsoft\Edge\NativeMessagingHosts\com.discordrpc.bridge",
        "HKCU:\Software\BraveSoftware\Brave-Browser\NativeMessagingHosts\com.discordrpc.bridge",
        "HKCU:\Software\Mozilla\NativeMessagingHosts\com.discordrpc.bridge"
    )
    foreach ($key in $registryKeys) {
        if (Test-Path $key) {
            Remove-Item -Path $key -Recurse -Force
            Write-Host "[OK] Removed: $key" -ForegroundColor Green
        }
    }
}

# Remove directory
if (Test-Path $installDir) {
    Write-Host "`n🗑️ Removing host files from $installDir..." -ForegroundColor Cyan
    Remove-Item -Path $installDir -Recurse -Force
}

Write-Host "`n✨ Native Messaging Host has been completely removed!" -ForegroundColor Green
