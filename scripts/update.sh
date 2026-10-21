#!/usr/bin/env bash
set -Eeuo pipefail
. "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/_common.sh"
trap 'yw_handle_error "$?" "$BASH_COMMAND"' ERR

cd "$YW_PROJECT_ROOT"
if [[ -e "$YW_PROJECT_ROOT/.git" ]] && command -v git >/dev/null 2>&1; then
    if upstream="$(git -C "$YW_PROJECT_ROOT" rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null)" && [[ -n "$upstream" ]]; then
        yw_step "Pulling latest changes from $upstream"
        git -C "$YW_PROJECT_ROOT" pull --ff-only
    else
        yw_warn 'No upstream branch is configured; skipping git pull.'
    fi
elif [[ -e "$YW_PROJECT_ROOT/.git" ]]; then
    yw_warn 'Git was not found; skipping git pull.'
else
    yw_warn 'This folder is not a Git repository yet; skipping git pull.'
fi

yw_install_env --upgrade
yw_print_versions
printf '\nDone. Run ./serve.sh to preview the site, or add content to docs/.\n'
