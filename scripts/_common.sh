# Shared helpers for the Yakka Works MkDocs shell scripts.
# Compatible with Bash on Linux Mint and Ubuntu running inside Termux/PRoot.

YW_SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
YW_PROJECT_ROOT="$(cd -- "$YW_SCRIPT_DIR/.." && pwd)"
YW_VENV_DIR="$YW_PROJECT_ROOT/.venv"
YW_VENV_PYTHON="$YW_VENV_DIR/bin/python"
YW_REQUIREMENTS="$YW_PROJECT_ROOT/requirements.txt"

# These scripts intentionally use a project-local virtual environment so they do
# not modify the system Python or conflict with PEP 668-managed distributions.

yw_step() {
    printf '\n==> %s\n' "$1"
}

yw_warn() {
    printf '!!  %s\n' "$1" >&2
}

yw_die() {
    printf 'ERROR: %s\n' "$1" >&2
    exit 1
}

yw_handle_error() {
    local status="$1"
    local command="$2"
    printf '\nERROR: command failed (exit code %s): %s\n' "$status" "$command" >&2
    exit "$status"
}

yw_require_tool() {
    local name="$1"
    local hint="$2"
    command -v "$name" >/dev/null 2>&1 || yw_die "$name was not found. $hint"
}

yw_find_python() {
    if [[ -n "${PYTHON:-}" ]]; then
        command -v "$PYTHON" >/dev/null 2>&1 || yw_die "PYTHON is set to '$PYTHON', but that command was not found."
        printf '%s\n' "$PYTHON"
    elif command -v python3 >/dev/null 2>&1; then
        command -v python3
    elif command -v python >/dev/null 2>&1; then
        command -v python
    else
        yw_die 'Python 3 was not found. Install Python 3 and the venv support package (Linux Mint: sudo apt install python3 python3-venv; Ubuntu PRoot: apt install python3 python3-venv as root).'
    fi
}

yw_check_python_version() {
    local python_bin="$1"
    local version_ok
    version_ok="$("$python_bin" -c 'import sys; print(int(sys.version_info >= (3, 9)))')" || yw_die 'Could not run Python. Check your Python installation.'
    [[ "$version_ok" == '1' ]] || yw_die 'Python 3.9 or newer is required.'
}

# Create the local environment (if missing) and install requirements.txt.
# Pass --upgrade to upgrade installed packages within the requirements ranges.
yw_install_env() {
    local upgrade=0
    if [[ "${1:-}" == '--upgrade' ]]; then
        upgrade=1
    fi

    yw_step 'Checking Python'
    local python_bin
    python_bin="$(yw_find_python)"
    yw_check_python_version "$python_bin"

    if [[ ! -x "$YW_VENV_PYTHON" ]]; then
        yw_step 'Creating virtual environment (.venv)'
        if ! "$python_bin" -m venv "$YW_VENV_DIR"; then
            printf '\nPython could not create a virtual environment. On Linux Mint, try:\n  sudo apt install python3-venv\nOn Ubuntu inside Termux/PRoot (as root), try:\n  apt update && apt install python3-venv\nThen rerun this script.\n' >&2
            return 1
        fi
    fi

    yw_step 'Installing packages (the first run may take a little while)'
    "$YW_VENV_PYTHON" -m pip install --upgrade pip
    if (( upgrade )); then
        "$YW_VENV_PYTHON" -m pip install --upgrade -r "$YW_REQUIREMENTS"
    else
        "$YW_VENV_PYTHON" -m pip install -r "$YW_REQUIREMENTS"
    fi
}

# Verify that the environment has all the Python modules this site needs.
# If it does not, use the normal installer to repair/update it.
yw_ensure_env() {
    if [[ ! -x "$YW_VENV_PYTHON" ]]; then
        yw_warn 'First run in this project copy: setting up the Python environment automatically.'
        yw_install_env
        return
    fi

    if ! "$YW_VENV_PYTHON" -c 'import mkdocs, material, mkdocs_static_i18n, mkdocs_awesome_pages_plugin, mkdocs_redirects' >/dev/null 2>&1; then
        yw_warn 'Some required packages are missing; reinstalling them into .venv.'
        yw_install_env
    fi
}

yw_print_versions() {
    yw_step 'Installed versions'
    "$YW_VENV_PYTHON" -m pip list --format=columns | grep -E '^(mkdocs|mkdocs-material|mkdocs-static-i18n|mkdocs-awesome-pages-plugin|mkdocs-redirects)[[:space:]]' || true
}
