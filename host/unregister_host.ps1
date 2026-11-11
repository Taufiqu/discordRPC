# Unregister Script for Discord RPC Native Messaging Host
$ErrorActionPreference = "Continue"

$registryKeys = @(
    "HKCU:\Software\Google\Chrome\NativeMessagingHosts\com.discordrpc.bridge",
    "HKCU:\Software\Microsoft\Edge\NativeMessagingHosts\com.discordrpc.bridge",
    "HKCU:\Software\BraveSoftware\Brave-Browser\NativeMessagingHosts\com.discordrpc.bridge",
    "HKCU:\Software\Mozilla\NativeMessagingHosts\com.discordrpc.bridge"
)

Write-Host "Unregistering Discord RPC Native Messaging Host from Windows Registry..." -ForegroundColor Cyan

foreach ($key in $registryKeys) {
    if (Test-Path $key) {
        Remove-Item -Path $key -Recurse -Force
        Write-Host "[OK] Removed: $key" -ForegroundColor Green
    }
}

Write-Host "`n✨ Native Messaging Host successfully unregistered!" -ForegroundColor Cyan
