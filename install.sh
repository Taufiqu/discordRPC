#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  🎵 YouTube Music Discord Rich Presence - Host Installer"
echo "=========================================================="

# 1. Check Node.js & npm prerequisite
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Error: Node.js is not installed or not in PATH."
  echo "👉 Please install Node.js (v18+) from https://nodejs.org/"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "❌ Error: npm is not installed or not in PATH."
  exit 1
fi

echo "✅ Found Node.js: $(node -v) and npm: $(npm -v)"

# 2. Setup install directory
INSTALL_DIR="$HOME/.local/share/discordRPC"
echo "📁 Installing host bridge to: $INSTALL_DIR"
mkdir -p "$INSTALL_DIR"

# 3. Download host files from GitHub
TMP_DIR="$(mktemp -d)"
echo "⬇️ Downloading latest host bridge..."
curl -fsSL https://github.com/Taufiqu/discordRPC/archive/refs/heads/main.tar.gz | tar -xz -C "$TMP_DIR"

# Copy host folder contents to install directory
cp -r "$TMP_DIR/discordRPC-main/host/"* "$INSTALL_DIR/"
rm -rf "$TMP_DIR"

# 4. Install npm dependencies
echo "📦 Installing dependencies in $INSTALL_DIR..."
(cd "$INSTALL_DIR" && npm install --omit=dev --silent)

# 5. Register native messaging manifests
echo "⚙️ Registering Native Messaging Host for supported browsers..."
chmod +x "$INSTALL_DIR/host.sh" "$INSTALL_DIR/register_host.sh" "$INSTALL_DIR/unregister_host.sh"
(cd "$INSTALL_DIR" && ./register_host.sh)

echo ""
echo "=========================================================="
echo "🎉 Installation complete! The Discord RPC bridge is ready."
echo "👉 Make sure Discord Desktop is open and your browser extension is installed."
echo "=========================================================="
