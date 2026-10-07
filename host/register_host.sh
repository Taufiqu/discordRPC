#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOST_SH="$SCRIPT_DIR/host.sh"
MANIFEST_DIR="$SCRIPT_DIR/manifests"
MANIFEST_CHROMIUM="$MANIFEST_DIR/com.discordrpc.bridge.json"
MANIFEST_FIREFOX="$MANIFEST_DIR/com.discordrpc.bridge.firefox.json"

chmod +x "$HOST_SH"

echo "==> Registering Discord RPC Native Messaging Host for Linux..."
echo "Host script path: $HOST_SH"

# Ensure node dependencies are installed
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
  echo "==> Installing npm dependencies in $SCRIPT_DIR..."
  (cd "$SCRIPT_DIR" && npm install)
fi

# Dynamically update JSON manifest paths
node -e "
const fs = require('fs');
const hostSh = process.argv[1];

function updateManifest(file) {
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.path = hostSh;
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  }
}

updateManifest('$MANIFEST_CHROMIUM');
updateManifest('$MANIFEST_FIREFOX');
" "$HOST_SH"

echo "[OK] Updated JSON manifest paths."

# 1. Register for Mozilla Firefox
FIREFOX_DIR="$HOME/.mozilla/native-messaging-hosts"
mkdir -p "$FIREFOX_DIR"
cp "$MANIFEST_FIREFOX" "$FIREFOX_DIR/com.discordrpc.bridge.json"
echo "[OK] Registered for Firefox: $FIREFOX_DIR/com.discordrpc.bridge.json"

# 2. Register for Chromium-based browsers
declare -A BROWSERS=(
  ["Google Chrome"]="$HOME/.config/google-chrome/NativeMessagingHosts"
  ["Chromium"]="$HOME/.config/chromium/NativeMessagingHosts"
  ["Brave Browser"]="$HOME/.config/BraveSoftware/Brave-Browser/NativeMessagingHosts"
  ["Microsoft Edge"]="$HOME/.config/microsoft-edge/NativeMessagingHosts"
)

for browser in "${!BROWSERS[@]}"; do
  target_dir="${BROWSERS[$browser]}"
  parent_dir="$(dirname "$target_dir")"
  if [ -d "$parent_dir" ]; then
    mkdir -p "$target_dir"
    cp "$MANIFEST_CHROMIUM" "$target_dir/com.discordrpc.bridge.json"
    echo "[OK] Registered for $browser: $target_dir/com.discordrpc.bridge.json"
  fi
done

echo ""
echo "🎉 Native Messaging Host successfully registered!"
