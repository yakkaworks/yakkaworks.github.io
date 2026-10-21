#!/usr/bin/env bash
set -Eeuo pipefail
. "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/_common.sh"
trap 'yw_handle_error "$?" "$BASH_COMMAND"' ERR

LIVE_BRANCH='weblive'
LIVE_REMOTE='https://github.com/yakkaworks/yakkaworks.github.io.git'
LIVE_DIR="$YW_PROJECT_ROOT/live-sync"

cd "$YW_PROJECT_ROOT"
yw_require_tool git 'Install Git using your distribution package manager (Linux Mint: sudo apt install git; Ubuntu PRoot: apt install git as root).'

yw_step "Syncing origin/$LIVE_BRANCH into live-sync/"
if [[ ! -e "$LIVE_DIR" ]]; then
    git clone --single-branch --branch "$LIVE_BRANCH" "$LIVE_REMOTE" "$LIVE_DIR"
    printf '\nLive branch cloned to: %s\n' "$LIVE_DIR"
    exit 0
fi

[[ -d "$LIVE_DIR" ]] || yw_die "'$LIVE_DIR' exists but is not a directory. Move it aside and retry."
git -C "$LIVE_DIR" rev-parse --is-inside-work-tree >/dev/null 2>&1 \
    || yw_die "'$LIVE_DIR' already exists but is not a Git repository. Move it aside and retry."

current_remote="$(git -C "$LIVE_DIR" remote get-url origin 2>/dev/null || true)"
case "$current_remote" in
    "$LIVE_REMOTE"|"${LIVE_REMOTE%.git}"|"git@github.com:yakkaworks/yakkaworks.github.io.git"|"ssh://git@github.com/yakkaworks/yakkaworks.github.io.git") ;;
    *) yw_die "The origin in live-sync/ points to '$current_remote', not the expected Yakka Works repository. Fix it manually before syncing." ;;
esac

current_branch="$(git -C "$LIVE_DIR" symbolic-ref --short HEAD 2>/dev/null || true)"
[[ "$current_branch" == "$LIVE_BRANCH" ]] \
    || yw_die "live-sync/ is on '$current_branch', not '$LIVE_BRANCH'. Switch it manually before syncing."

if [[ -n "$(git -C "$LIVE_DIR" status --porcelain --untracked-files=all)" ]]; then
    yw_die 'live-sync/ has local changes or untracked files. Commit, stash, or remove them before syncing; this script will not overwrite them.'
fi

git -C "$LIVE_DIR" pull --ff-only origin "$LIVE_BRANCH"
printf '\nSync complete. Local live branch: %s\n' "$LIVE_DIR"
