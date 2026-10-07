#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Find node binary across common environments (fnm, nvm, standard system paths)
NODE_BIN=""
if [ -x "$HOME/.local/share/fnm/aliases/default/bin/node" ]; then
  NODE_BIN="$HOME/.local/share/fnm/aliases/default/bin/node"
elif command -v node >/dev/null 2>&1; then
  NODE_BIN="$(command -v node)"
elif [ -x "$HOME/.nvm/current/bin/node" ]; then
  NODE_BIN="$HOME/.nvm/current/bin/node"
elif [ -x "/usr/bin/node" ]; then
  NODE_BIN="/usr/bin/node"
elif [ -x "/usr/local/bin/node" ]; then
  NODE_BIN="/usr/local/bin/node"
fi

if [ -z "$NODE_BIN" ] || [ ! -x "$NODE_BIN" ]; then
  echo "Node.js executable not found!" >&2
  exit 1
fi

exec "$NODE_BIN" "$DIR/src/index.js"
