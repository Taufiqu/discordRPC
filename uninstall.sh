#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  🧹 YouTube Music Discord Rich Presence - Host Uninstaller"
echo "=========================================================="

INSTALL_DIR="$HOME/.local/share/discordRPC"

if [ -f "$INSTALL_DIR/unregister_host.sh" ]; then
  chmod +x "$INSTALL_DIR/unregister_host.sh"
  (cd "$INSTALL_DIR" && ./unregister_host.sh)
fi

# Also unregister from local repo if running locally
if [ -f "host/unregister_host.sh" ]; then
  chmod +x "host/unregister_host.sh"
  ./host/unregister_host.sh
fi

if [ -d "$INSTALL_DIR" ]; then
  echo "🗑️ Removing host files from $INSTALL_DIR..."
  rm -rf "$INSTALL_DIR"
fi

echo ""
echo "✨ Native Messaging Host has been completely removed!"
