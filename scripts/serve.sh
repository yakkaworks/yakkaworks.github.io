#!/usr/bin/env bash
set -Eeuo pipefail
. "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/_common.sh"
trap 'yw_handle_error "$?" "$BASH_COMMAND"' ERR

HOST="${MKDOCS_HOST:-127.0.0.1}"
PORT="${MKDOCS_PORT:-8000}"
[[ "$PORT" =~ ^[0-9]{1,5}$ ]] || yw_die "MKDOCS_PORT must be a port number; got '$PORT'."
(( PORT >= 1 && PORT <= 65535 )) || yw_die 'MKDOCS_PORT must be between 1 and 65535.'

cd "$YW_PROJECT_ROOT"
yw_ensure_env

if [[ "${YW_TERMUX_LAUNCH:-0}" == '1' ]]; then
    yw_step "Starting MkDocs for Termux/PRoot at http://${HOST}:${PORT}/ (Ctrl+C to stop)"
    printf 'Open that address in your Android browser. The server stays in this terminal.\n'
else
    yw_step "Starting local preview at http://${HOST}:${PORT}/ (Ctrl+C to stop)"
    printf 'Open that address in your browser. The server stays in this terminal.\n'
fi

# Do not use --open: a graphical browser is not guaranteed in Linux/PRoot shells.
exec "$YW_VENV_PYTHON" -m mkdocs serve --dev-addr "${HOST}:${PORT}"
