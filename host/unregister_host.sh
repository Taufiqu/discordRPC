#!/usr/bin/env bash
set -e

echo "==> Unregistering Discord RPC Native Messaging Host..."

FIREFOX_FILE="$HOME/.mozilla/native-messaging-hosts/com.discordrpc.bridge.json"
if [ -f "$FIREFOX_FILE" ]; then
  rm -f "$FIREFOX_FILE"
  echo "[OK] Removed Firefox host manifest: $FIREFOX_FILE"
fi

declare -A BROWSERS=(
  ["Google Chrome"]="$HOME/.config/google-chrome/NativeMessagingHosts/com.discordrpc.bridge.json"
  ["Chromium"]="$HOME/.config/chromium/NativeMessagingHosts/com.discordrpc.bridge.json"
  ["Brave Browser"]="$HOME/.config/BraveSoftware/Brave-Browser/NativeMessagingHosts/com.discordrpc.bridge.json"
  ["Microsoft Edge"]="$HOME/.config/microsoft-edge/NativeMessagingHosts/com.discordrpc.bridge.json"
)

for browser in "${!BROWSERS[@]}"; do
  manifest_path="${BROWSERS[$browser]}"
  if [ -f "$manifest_path" ]; then
    rm -f "$manifest_path"
    echo "[OK] Removed $browser host manifest: $manifest_path"
  fi
done

echo ""
echo "✨ Native Messaging Host successfully unregistered!"
