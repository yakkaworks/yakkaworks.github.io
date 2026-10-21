YAKKA WORKS — MKDOCS PROJECT QUICK REFERENCE
Updated: 21 October 2026
Site: https://yakkaworks.github.io/

======================================================================
1. THE EVERYDAY COMMANDS
======================================================================

WINDOWS — double-click the .bat files in the project root

  serve.bat       Start the local preview at http://127.0.0.1:8000/
                  Opens the browser. Press Ctrl+C in the terminal to stop.
  pull.bat        Pull the current Git branch (if an upstream is set), then
                  update the Python packages. Same function as update.bat.
  update.bat      Same as pull.bat.
  install.bat     Install or repair the project Python environment manually.
                  Usually unnecessary: serve/pull/push set it up automatically.
  push.bat        Strict-build, stage changes, make a commit, and push to
                  the development branch mkdocs-site. Does NOT publish the site.
  sync.bat        Clone/update the production source branch in live-sync/.
                  It does not modify the project files in the current folder.

LINUX MINT — run commands from the project directory

  bash serve.sh   Start the local preview at http://127.0.0.1:8000/.
  bash pull.sh    Pull (if an upstream is configured) and update packages.
  bash update.sh  Same function as pull.sh.
  bash install.sh Install/repair the Python environment manually.
  bash push.sh    Strict-build, commit, and push to mkdocs-site; does not deploy.
  bash sync.sh    Clone/update the production source into live-sync/.

Ubuntu inside Termux/PRoot:
  bash serve-termux.sh
  Then open http://127.0.0.1:8000/ in Android's browser. Ctrl+C stops it.
  Keep the project inside Ubuntu's Linux filesystem (for example ~/MkDocs),
  not /sdcard or /storage/emulated/0.

Linux prerequisites (install once):
  sudo apt update
  sudo apt install git python3 python3-venv

Inside Ubuntu/PRoot as root, omit sudo:
  apt update && apt install git python3 python3-venv

======================================================================
2. WHAT EACH SCRIPT DOES
======================================================================

Root-level .bat and .sh files are launchers. The actual implementations live
under scripts/:

  install.bat / install.sh
    Calls scripts/install.ps1 or scripts/install.sh. Creates .venv if needed
    and installs the packages pinned/ranged in requirements.txt.

  pull.bat / pull.sh
  update.bat / update.sh
    Both names run scripts/update.ps1 or scripts/update.sh. If this folder is a
    Git checkout with an upstream branch, it uses a fast-forward-only pull.
    Then it creates/repairs .venv and updates packages. In a ZIP extraction or
    checkout with no upstream, it skips the Git pull and only sets up packages.

  serve.bat / serve.sh
    Calls scripts/serve.ps1 or scripts/serve.sh. Starts MkDocs' live-reload
    server. It does not publish anything. Stop it with Ctrl+C.

  serve-termux.sh
    Uses the same Linux serve implementation but avoids opening a desktop
    browser and binds to 127.0.0.1 by default for access from Android itself.

  push.bat / push.sh
    Calls scripts/push.ps1 or scripts/push.sh. Runs `mkdocs build --strict`
    first; if the build fails or emits strict-build warnings, it stops before
    staging or pushing. It then stages all non-ignored changes, commits them
    (asks for a message if needed), and pushes only to mkdocs-site. It never
    force-pushes. Review `git status` before running because all non-ignored
    project changes can be included in the commit.

  sync.bat / sync.sh
    Calls scripts/sync.ps1 or scripts/sync.sh. The first run clones the branch
    configured in the script into live-sync/; later runs use fast-forward-only
    pulls. It refuses to overwrite local edits or untracked files in live-sync/.
    It is a separate copy, not a merge into the current source tree.

  scripts/_common.ps1 and scripts/_common.sh
    Shared helpers used by other scripts. Do not run these directly.

IMPORTANT BRANCH NOTE:
  The current GitHub branch setup is:
    mkdocs-site       Development/source branch; push scripts target this.
    mkdocs-site-live  Production branch; GitHub Actions builds and deploys it.
    web-live          Legacy website archive; keep for reference/recovery.
    main              Existing archive/history branch.

  The live workflow is configured in .github/workflows/build.yml. A successful
  push to mkdocs-site only runs a strict build check. To publish changes, review
  them and merge a pull request from mkdocs-site into mkdocs-site-live. The
  production branch must stay configured to deploy through GitHub Actions.

  Sync target: scripts/sync.ps1 and scripts/sync.sh are configured to sync
  mkdocs-site-live into live-sync/. If you intentionally want the OLD static
  website archive instead, clone web-live separately. Do not use old instructions
  referring to the misspelled/nonexistent branch name `weblive`.

======================================================================
3. FIRST RUN, SETTINGS, AND TROUBLESHOOTING
======================================================================

  Python environment
    Scripts use a project-local .venv. Packages are installed into that folder,
    not globally. .venv/ and the generated site/ folder are ignored by Git.
    First-time package installation needs an internet connection.

  Preview address / port
    Default: http://127.0.0.1:8000/
    Linux: MKDOCS_PORT=8001 bash serve.sh
    Linux host override: MKDOCS_HOST=127.0.0.1 MKDOCS_PORT=8001 bash serve.sh
    For Termux/PRoot, use serve-termux.sh and open the address on Android.

  Git identity (required for push)
    git config --global user.name "Your Name"
    git config --global user.email "you@example.com"

  Build errors
    Fix every error/warning reported by the strict build before pushing. Broken
    navigation entries often come from a .pages file referencing a filename or
    directory that does not exist. With localized pages, the English file often
    ends in .en.md; use the appropriate Awesome Pages rest/glob syntax when needed.

  Secrets
    This is a public repository. Never add API tokens, passwords, .env files,
    Cloudflare .dev.vars, or other secrets. Cloudflare working files are intended
    to stay outside this repository. Check `git status` before every push.

======================================================================
4. WHERE THINGS GO
======================================================================

  docs/index.md                  Indonesian homepage
  docs/index.en.md               English homepage
  docs/store/                    Store index, commissions, products, maps
  docs/library/                  Tutorials and reference material
  docs/tools/                    Tools index and individual tools
  docs/blogs/posts/              Blog posts (date and slug in front matter)
  docs/assets/css/               Custom CSS
  docs/assets/js/                Custom JavaScript, including the commission estimator and JSON Uni Tool
  docs/assets/fonts/             Local fonts and licenses
  docs/assets/logo/              Logo and favicon assets
  docs/assets/img/cover.jpg      Reusable homepage/contact cover image
  docs/webdata/img/<slug>.jpg    Store thumbnails and other site images
  docs/.pages and nested .pages  Sidebar/tab order and titles
  mkdocs.yml                     MkDocs, theme, language and plugin configuration
  requirements.txt               Python/MkDocs dependencies
  hooks/                         Build hooks; plugin_order.py is important for blog/i18n
  templates/                     Starter templates; not published as pages
  site/                          Generated output; do not edit manually
  live-sync/                     Separate synced production-source checkout

CONTENT NOTES:
  - Indonesian is the default language. Create English translations as sibling
    files using the `.en.md` suffix, for example about.md and about.en.md.
  - Store thumbnails use slug-based JPG names, e.g. docs/webdata/img/just-stairs.jpg.
  - Blog posts belong under docs/blogs/posts/ and need `date:` and `slug:` front
    matter. The slug forms part of the permanent URL, so choose it deliberately.
  - Store/tutorial starter templates are in templates/; copy them into docs/ and
    rename them before filling them in.
  - `mkdocs build --strict` validates/builds the site. Do not manually edit site/.


LATEST CONTENT UPDATE (21 OCT 2026)
-----------------------------------
Store tables
  TheoTown plugin tables now combine the thumbnail and product title into a
  single first column. The 4:1 image sits above the title to reduce horizontal
  table width on mobile. Images remain under docs/webdata/img/<slug>.jpg.

Blog
  A bilingual post titled "Migrasi Yakka Works ke MkDocs" / "Yakka Works Has
  Migrated to MkDocs" was added under docs/blogs/mkdocs-migration/. It covers
  the accessibility reason for the migration, the Library's gradual tutorial
  rollout, and clearer commissions plus the estimator.


JSON UNI TOOL
-------------
  Location: docs/tools/json-uni-tool/
  Features: validate, format, minify, remove // and /* */ comments, copy and
  download results. Accepts pasted text, .json files, plugin.manifest files,
  and plugin ZIPs containing a file named plugin.manifest. ZIP handling loads
  JSZip from jsDelivr when needed, so an internet connection is needed for ZIP
  uploads. The file contents are processed in the browser and are not uploaded
  to Yakka Works by this tool. Input files are limited to 25 MB.

  Note: comments are not part of standard JSON. Remove comments before using
  Format or Minify on JSON that contains comments. Removing comments does not
  repair other JSON syntax errors or trailing commas.

## Store image paths

Store thumbnails and product-detail images use root-relative paths such as `/webdata/img/just-stairs.jpg`. Do not use `../webdata/img/...` or `../../webdata/img/...`: the English site is served below `/en/`, so relative paths resolve to a nonexistent `/en/webdata/img/` location. Root-relative paths work in both language builds and on the root-domain local preview.
