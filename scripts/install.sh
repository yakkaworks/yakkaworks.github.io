#!/usr/bin/env bash
set -Eeuo pipefail
. "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/_common.sh"
trap 'yw_handle_error "$?" "$BASH_COMMAND"' ERR

cd "$YW_PROJECT_ROOT"
if ! command -v git >/dev/null 2>&1; then
    yw_warn 'Git was not found. Install Git before using push.sh or pull.sh (Linux Mint: sudo apt install git; Ubuntu PRoot: apt install git as root).'
fi

yw_install_env
yw_print_versions
printf '\nDone. Next: ./serve.sh to preview the site locally.\n'
