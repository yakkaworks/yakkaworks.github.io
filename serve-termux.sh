#!/usr/bin/env bash
set -Eeuo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# PRoot shares Android's network stack. Loopback keeps the preview local to this
# device and avoids exposing the development server to the Wi-Fi network.
export YW_TERMUX_LAUNCH=1
export MKDOCS_HOST="${MKDOCS_HOST:-127.0.0.1}"
exec bash "$SCRIPT_DIR/scripts/serve.sh" "$@"
