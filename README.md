# Yakka Works site (MkDocs)

Source of <https://yakkaworks.github.io/>. Built with MkDocs + Material.
Indonesian is the default language, English lives under `/en/`.

Local folder: `D:\yakkaworks-site\mkdocs\`
Working branch: `mkdocs-site` (never `main` or `weblive` from the push script)

> `D:\yakkaworks-site\cloudflare\` sits **outside** this repo on purpose.
> Workers scripts, `.dev.vars` and tokens must never end up in a public repo.

## Daily workflow

On Windows, nothing needs to be set up by hand. On a fresh copy of the project
(new PC, new unzip, new clone), double-click `pull.bat` or `serve.bat`: the Python
environment and packages are created automatically the first time.

| Want to... | Windows (double-click) |
| --- | --- |
| Get latest from the current Git branch + set up / update everything | `pull.bat` (same as `update.bat`) |
| Sync the live `weblive` branch into a separate local copy | `sync.bat` |
| Preview locally at http://127.0.0.1:8000/ | `serve.bat` |
| Check build, commit, push to `mkdocs-site` | `push.bat` |
| Reinstall the environment (rarely needed) | `install.bat` |

Day to day: add or edit Markdown files, check them with `serve.bat` (or `serve.sh` on
Linux), then push when ready.

### Linux Mint and Ubuntu in Termux/PRoot

The Bash scripts provide the same workflow on Linux. They create a project-local
`.venv`, so packages are not installed into the operating system's Python.
Python 3.9+, `python3-venv`, and Git (needed for pull/push) are required.

On Linux Mint, install prerequisites once:

```bash
sudo apt update
sudo apt install git python3 python3-venv
```

Then run a script from the project directory:

| Want to... | Command |
| --- | --- |
| Preview at http://127.0.0.1:8000/ | `bash serve.sh` |
| Get latest from the current Git branch + update packages | `bash pull.sh` (same as `bash update.sh`) |
| Sync the live `weblive` branch into a separate local copy | `bash sync.sh` |
| Strict build, commit, and push to `mkdocs-site` | `bash push.sh` or `bash push.sh "Commit message"` |
| Install/reinstall the environment | `bash install.sh` |

For Ubuntu running inside Termux/PRoot, run these commands **inside the Ubuntu
shell**, not in the Termux host shell. If the Ubuntu environment is running as
root (common with PRoot), omit `sudo`; otherwise, prefix the `apt` commands with
`sudo`:

```bash
apt update
apt install git python3 python3-venv
bash serve-termux.sh
```

`serve-termux.sh` starts the server without trying to launch a desktop browser;
open `http://127.0.0.1:8000/` in Android's browser. Stop it with Ctrl+C. You can
change the port with `MKDOCS_PORT=8001 bash serve-termux.sh` if port 8000 is busy.

**PRoot note:** keep the project in Ubuntu's own Linux filesystem (for example,
`~/yakkaworks-mkdocs`), not under shared Android storage such as `/sdcard` or
`/storage/emulated/0`. Shared storage may not support the permissions and symlinks
needed by Python virtual environments. If a script is not marked executable after
extracting the ZIP, using `bash script.sh` as shown above avoids that issue.

`push.bat` and `push.sh` run `mkdocs build --strict` first. If a link is broken
or the build warns, nothing is pushed. They never force-push and refuse to push
to `main`/`weblive`.


### Syncing the live branch to your computer

Run `sync.bat` on Windows or `bash sync.sh` on Linux Mint / Ubuntu in Termux/PRoot.
The first run clones the GitHub `weblive` branch into `live-sync/` inside this project;
subsequent runs fetch and fast-forward that separate copy. This is a **one-way live-to-local
sync** and does not change the MkDocs source files in the project root. `live-sync/` is
ignored by the main repository so it will not be included in normal site commits.

For safety, sync stops if `live-sync/` contains local edits/untracked files, points to a
different remote, or cannot fast-forward. Commit/stash/remove local edits in `live-sync/`
before retrying. The script never force-resets or force-pushes. Git must be installed and
GitHub access must be available; private-repository authentication may be required if the
repository's visibility changes.

## Adding content

Just drop Markdown files in the right folder. No edit to `mkdocs.yml` needed.

| Folder | Goes to | Notes |
| --- | --- | --- |
| `docs/store/` | Toko / Store | One page per product + one row in `store/index.md` |
| `docs/library/` | Pustaka / Library | Any subfolder becomes a sidebar section |
| `docs/tools/` | Alat / Tools | |
| `docs/blogs/posts/` | Blog | Needs `date:` and `slug:` in front matter |
| `docs/assets/` | Reused files | css, fonts, logo, shared images |
| `docs/webdata/img/<page>/` | One-off images | one subfolder per page |
| `docs/webdata/download/` | One-off downloads | keep files small (see below) |

Starter files are in `templates/` (product, tutorial, blog post). They are
outside `docs/` so they are never published.

### Languages

- `about.md` = Indonesian (default, served at `/about/`)
- `about.en.md` = English (served at `/en/about/`)
- No `.en.md` yet? The Indonesian page is shown under `/en/` until you add one.
- The blog is Indonesian only.

### Sidebar order and titles

There is no `nav:` in `mkdocs.yml` on purpose. The five top tabs come from
`docs/.pages`, and each section folder has a `.pages` file with its title
(`store/.pages` = `title: Toko`, and so on). Pages sort by filename. To control
order or give a nicer title to a subfolder, put a `.pages` file in it:

```yaml
title: Tips & Trik
nav:
  - ...
```

Heads up: in the English build the files are `x.en.md`, so inside a `.pages`
`nav:` list use `...` (rest) rather than naming files, or the English build will
fail with "Nav entry not found".

Root pages (about, terms, privacy, cookie, license, source, 404) are kept out of
the tabs by `not_in_nav` in `mkdocs.yml`. A NEW root page needs one line added
there if you don't want it to appear as a tab.

### Blog posts

```markdown
---
date: 2026-10-04
slug: judul-singkat
categories:
  - Pengumuman
---

# Judul

Ringkasan yang tampil di daftar.

<!-- more -->

Isi lengkap.
```

URL: `/blogs/2026/10/04/judul-singkat/`. Always set `slug`, otherwise renaming
the title changes the URL.

## Fonts and logo

Already in place:

- `docs/assets/fonts/head.ttf`: M PLUS Code Latin (variable, headings and tabs)
- `docs/assets/fonts/body.ttf` and `body-bold.ttf`: Rounded M+ 1c Regular and Bold
  (body text). Both are trimmed to the same 308 Latin characters; the originals are
  ~3.4 MB each. Characters outside that set (for example Japanese) fall back to the
  system font. If you add characters to one file, trim the other to the same set.
- `docs/assets/fonts/OFL-RoundedMplus1c.txt`: the font license (SIL OFL 1.1).
- `docs/assets/logo/`: `logo.svg` (used by the site), `logo-128.png` (favicon),
  `logo-256.png`, `logo.ico` (not used by the site; 270 KB single-size icon).

The orange SVG logo is transparent in the header; no white tile is applied.
The static homepage layout, brand links, responsive panels, and neutral footer are
styled in `docs/assets/css/extra.css`. `docs/assets/img/cover.jpg` is a low-resolution
crop of the provided design reference and can be replaced with original cover artwork
if that asset becomes available.

## Footer, socials, address

All in `extra:` at the bottom of `mkdocs.yml`. The donate banner (Saweria / Patreon) is `extra.donate`; delete that block to hide it. The year in "Copyright 2020-20xx"
updates itself (`hooks/year.py`).

## Large files

Git is bad at big binaries (GitHub warns at 50 MB, blocks at 100 MB, and every
version stays in history forever). Keep `webdata/download/` for small files.
For anything chunky use GitHub Releases or Cloudflare R2 and link to it.

## How deployment works

`.github/workflows/build.yml`:

- push to `mkdocs-site` or `main`: strict build check only, nothing is published
- push to `weblive`: build + publish to GitHub Pages

So your habit stays the same: merge into `weblive` when ready, that's the live site.

## Going live (one time)

Today `weblive` holds the old static site and Pages serves it straight from the
branch. The new site shares **no history** with it, so a plain merge will refuse.
Do these in order:

1. **Pages source.** Repo Settings > Pages > Build and deployment > Source: **GitHub Actions**.
   (This is the moment the live site switches. Do it right before step 3.)
2. **Allow `weblive` to deploy.** Settings > Environments > `github-pages` >
   Deployment branches > add `weblive`. Otherwise the deploy job is rejected.
3. **Replace `weblive` with the new site.** Back up the old one first:

   ```powershell
   git fetch origin
   git branch weblive-old origin/weblive
   git push origin weblive-old
   git checkout -B weblive origin/mkdocs-site
   git push --force-with-lease origin weblive
   ```

   This is the only force-push in the whole flow, and it is manual on purpose.
   The old site stays recoverable on `weblive-old`.
4. Watch the Actions tab. When it's green, the new site is live.
5. (Optional) Make `main` match too: same idea, `main-old` backup, then reset `main`
   to `mkdocs-site`, so your merge-main-into-weblive habit works again. After that,
   work on `main` (or keep `mkdocs-site`), and merge into `weblive` to publish.

Alternative to step 3 if you want to keep the old files in `weblive`'s history:
`git merge origin/mkdocs-site --allow-unrelated-histories` and resolve the
conflicts. The old HTML files would stay in the tree but are not published
(only the MkDocs `site/` output is). It's messier, so I'd go with step 3.

Old URLs `license.html`, `privacy.html` and `terms.html` redirect to the new pages.
Other old URLs are not redirected. Add more under `redirects` in `mkdocs.yml`.

## Notes

- **`hooks/plugin_order.py` is load-bearing.** static-i18n and the Material blog
  plugin don't cooperate out of the box (posts silently vanish). That small hook
  fixes the order. Versions are pinned so it keeps working; if you ever bump
  Material or static-i18n and the blog disappears, that hook is the first suspect.
- **MkDocs 2.0.** Material prints a scary warning about it. `requirements.txt`
  pins `mkdocs<2`, so you stay on 1.x. A drop-in continuation called ProperDocs
  exists if MkDocs 1.x ever stops being installable.
- **Theme status.** Material for MkDocs is in maintenance mode: critical fixes
  and security updates only, announced until November 2026. Versions are pinned in
  `requirements.txt`, so the build stays reproducible, but plan a look at
  Zensical (the successor) later.
- **AdSense / analytics.** `ads.txt` already has your publisher ID. The AdSense
  script and any analytics are **not** installed on this new site yet. The privacy
  and cookie pages describe them (copied from your old policy), so either add the
  scripts or edit those pages to match. EEA/UK traffic needs a Google-certified
  consent banner for AdSense.
- **Public repo.** Everything pushed here, including the address in `mkdocs.yml`,
  stays in git history even after you delete it.
- `ai.txt` is informational only. `robots.txt` is permissive. `sitemap.xml` is
  generated automatically on every build.


## Content migration from the live website

The Store keeps the recovered TheoTown plugin catalogue and organizes it for future data additions. Synthetic thumbnail artwork has been removed; final media can be added under `docs/webdata/img/` with slug-based filenames and referenced from the table/detail pages when ready. Kustom and Minecraft currently have no catalog entries, so no fictional items are listed.

## Legal pages and link validation

The License, Privacy Policy, and Terms pages were synchronized against the current public Yakka Works website (effective 6 September 2026). Indonesian pages are translations of the current English source pages. The Cookie Policy was aligned with the privacy statements available on the live site; it is not presented as a direct copy of a separate live cookie page.

Store, Library, and Blog index links target their `index.md` files so MkDocs can validate nested directory pages. Category anchors use explicit IDs, independent of the configured heading separator.


### Store guide navigation

The TheoTown plugin and map installation guides are flat bilingual Markdown pages (`theotown-plugin-installation.md` / `.en.md` and `theotown-map-installation.md` / `.en.md`). They are intentionally linked from the Store section descriptions, not listed as explicit entries in `store/.pages`: the same `.pages` file is used during both language builds, while `mkdocs-static-i18n` suffixes translated source filenames. Listing only the unsuffixed filename causes `NavEntryNotFound` during the English build. With `use_directory_urls: true`, the guides still publish at `/store/theotown-plugin-installation/` and `/store/theotown-map-installation/`.

### Multilingual Awesome Pages navigation

In folders with localized index pages (`index.md` and `index.en.md`), `.pages` should not name `index.md` directly. Use `- ... | index.*md` so `mkdocs-static-i18n` can resolve the correct language-specific index during both builds. This applies to the Store, Library, and Blogs sections.

## Commission and tutorial updates

- TheoTown plugin and map installation guides live under `docs/library/theotown-tutorials/`.
- Commission terms and package rates are maintained in `docs/store/commissions/`.
- The live estimate calculator is in `docs/tools/commission-price-estimator/`, with shared behaviour in `docs/assets/js/commission-estimator.js`. It provides a non-binding estimate using the published package and add-on prices.


### MkDocs Awesome Pages navigation note

`docs/library/theotown-tutorials/.pages` lists `installing-plugins.md` and `installing-maps.md` explicitly because these are Markdown files in the same directory, not subdirectories. The English translations use the static-i18n suffix convention (`.en.md`); navigation references use the default expected filename without the language suffix.

## Getting Started tutorial index

The Library's Getting Started with TheoTown Plugins page is now a categorized tutorial index. Existing plugin/map installation guides link to the general TheoTown tutorials section. Other listed topics are intentionally plain list entries until their articles are authored, so the index doesn't link to missing pages or create empty placeholder articles. Lua, Fun/function, and shader tutorials are explicitly noted as unavailable while the author is still learning those areas.

## TheoTown tutorial scaffolding

The plugin-development Getting Started index now links to short individual topic pages in Indonesian and English. Each topic has `index.md` and `index.en.md` under a category folder, and each category uses a `.pages` file that references real topic directories. These are intentionally short descriptions, not completed tutorials. The Installation overview links to the separate step-by-step guides in General TheoTown Tutorials.


## Discord directory blog

Added `docs/blogs/discord-server-directory/` in Indonesian and English. It converts the visible server-list portion of the forum post into collapsible article sections. Forum-only hidden/source blocks and login/member notice are not reproduced. Invite URLs and names are transcribed from the provided post and have not been individually verified.

## Store product thumbnails

The original Store thumbnail JPGs are now included under `docs/webdata/img/`, with filenames normalized to product slugs (for example, `just-stairs.jpg`, `generic-road-train.jpg`, and `warehouse-shed-pack.jpg`). The source files were provided in `thumb.zip`; the images were copied without re-encoding. Both Indonesian and English Store indexes use these images, and each TheoTown plugin detail page displays the same artwork above its title. Store table images use a 4:1 presentation at 9rem × 2.25rem; detail-page thumbnails are responsive with the same aspect ratio and 0.25rem corners.
