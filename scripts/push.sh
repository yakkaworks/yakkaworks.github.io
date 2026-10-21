#!/usr/bin/env bash
set -Eeuo pipefail
. "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/_common.sh"
trap 'yw_handle_error "$?" "$BASH_COMMAND"' ERR

BRANCH='mkdocs-site'
REMOTE_URL='https://github.com/yakkaworks/yakkaworks.github.io.git'
PROTECTED_BRANCHES=('main' 'master' 'web-live' 'mkdocs-site-live')
MESSAGE="${*:-}"

cd "$YW_PROJECT_ROOT"
yw_require_tool git 'Install Git using your distribution package manager (Linux Mint: sudo apt install git; Ubuntu PRoot: apt install git as root).'
yw_ensure_env

for protected in "${PROTECTED_BRANCHES[@]}"; do
    [[ "$BRANCH" != "$protected" ]] || yw_die "Safety check: '$BRANCH' is a protected branch name."
done

# 1. Build before touching Git so a broken site is never committed/pushed.
yw_step 'Strict build check (warnings and errors stop the push)'
"$YW_VENV_PYTHON" -m mkdocs build --strict

# 2. Initialize Git if this is a fresh project copy.
yw_step 'Preparing Git'
if ! git -C "$YW_PROJECT_ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    git -C "$YW_PROJECT_ROOT" init
fi

if ! git -C "$YW_PROJECT_ROOT" remote | grep -Fxq origin; then
    git -C "$YW_PROJECT_ROOT" remote add origin "$REMOTE_URL"
else
    current_remote="$(git -C "$YW_PROJECT_ROOT" remote get-url origin)"
    plain_remote="${REMOTE_URL%.git}"
    [[ "$current_remote" == "$REMOTE_URL" || "$current_remote" == "$plain_remote" ]] || yw_die "Remote 'origin' points to '$current_remote', expected '$REMOTE_URL'. Fix it with: git remote set-url origin $REMOTE_URL"
fi

name="$(git -C "$YW_PROJECT_ROOT" config user.name 2>/dev/null || true)"
email="$(git -C "$YW_PROJECT_ROOT" config user.email 2>/dev/null || true)"
if [[ -z "$name" || -z "$email" ]]; then
    yw_die 'Git identity is not configured. Run: git config --global user.name "Your Name" and git config --global user.email "you@example.com"'
fi

# 3. A fresh repository gets the expected branch name, but existing histories
# must already be checked out on that branch. Detached HEAD is also rejected.
has_commits=1
if git -C "$YW_PROJECT_ROOT" rev-parse --verify HEAD >/dev/null 2>&1; then
    current_branch="$(git -C "$YW_PROJECT_ROOT" symbolic-ref --short HEAD 2>/dev/null || true)"
else
    has_commits=0
    git -C "$YW_PROJECT_ROOT" symbolic-ref HEAD "refs/heads/$BRANCH"
    current_branch="$BRANCH"
fi
[[ "$current_branch" == "$BRANCH" ]] || yw_die "You are on '$current_branch'. This script only pushes '$BRANCH'. Switch with: git checkout $BRANCH"

# 4. Never overwrite a remote branch that a fresh local repository doesn't know.
if ! remote_refs="$(git -C "$YW_PROJECT_ROOT" ls-remote --heads origin "$BRANCH")"; then
    yw_die 'Could not contact GitHub. Check your internet connection and Git authentication.'
fi
if (( ! has_commits )) && [[ -n "$remote_refs" ]]; then
    yw_die "origin already has '$BRANCH' but this folder has no commits. Clone that branch instead of pushing over it."
fi

# 5. Commit only when there are changes.
git -C "$YW_PROJECT_ROOT" add -A
pending="$(git -C "$YW_PROJECT_ROOT" status --porcelain)"
if [[ -n "$pending" ]]; then
    if [[ -z "$MESSAGE" ]]; then
        default_message="Update site $(date '+%Y-%m-%d %H:%M')"
        if [[ -t 0 ]]; then
            read -r -p "Commit message [$default_message]: " typed_message
            MESSAGE="${typed_message:-$default_message}"
        else
            MESSAGE="$default_message"
        fi
    fi
    git -C "$YW_PROJECT_ROOT" commit -m "$MESSAGE"
elif (( ! has_commits )); then
    yw_die 'There are no files to commit in this new repository.'
else
    printf 'No file changes to commit.\n'
fi

# 6. Explicit refspec; no force-push.
yw_step "Pushing to origin/$BRANCH"
git -C "$YW_PROJECT_ROOT" push -u origin "${BRANCH}:${BRANCH}"
printf '\nPushed. Build check runs at: https://github.com/yakkaworks/yakkaworks.github.io/actions\n'
printf 'The live site is unchanged until changes are merged into mkdocs-site-live (see README.txt).\n'
