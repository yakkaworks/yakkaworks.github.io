# MkDocs maintenance notes — for Yakka

This is the practical guide for maintaining the Yakka Works website while you're still getting comfortable with MkDocs. You do not need to memorise the whole framework: start the preview, edit a Markdown file, save it, and check the browser.

## 1. The basic workflow

1. Open the repository folder in your editor.
2. Run `dev-tool/serve.bat` on Windows or `bash dev-tool/serve.sh` on Linux.
3. Open `http://127.0.0.1:8000/` in your browser.
4. Edit a file inside `docs/`.
5. Save it and let MkDocs refresh the preview.
6. Check both Indonesian and English pages where a translation exists.
7. Stop the server with Ctrl+C.

The first run may take longer because the helper creates `.venv/` and installs the packages listed in `requirements.txt`.

## 2. Where things live

| Path | What it controls |
| --- | --- |
| `mkdocs.yml` | Site name, URL, plugins, language settings, theme and footer data |
| `docs/` | Pages visitors read |
| `docs/.pages` and nested `.pages` | Navigation names and ordering |
| `assets/css/y2k.css` | Colours, typography, layout and responsive styling |
| `assets/fonts/` | Local fonts used by the theme |
| `assets/img/` | Social cover and page background images |
| `assets/logo/` | Logo and favicon |
| `overrides/` | HTML templates that customise Material |
| `hooks/` | Small Python functions that run during a MkDocs build |
| `requirements.txt` | Python packages and version ranges |
| `dev-tool/` | Local install, preview, pull, push and sync helpers |

Do not edit generated files in `site/`; that folder is build output and is recreated.

## 3. Adding a page

For a new Indonesian page, create a Markdown file under `docs/`. For example:

```text
docs/about-project.md
```

Add a short first paragraph. The build uses that first paragraph as the page's search/social description automatically.

For an English translation, create the matching `.en.md` file:

```text
docs/about-project.md
docs/about-project.en.md
```

A simple page can look like this:

```markdown
---
title: Nama Halaman
---

# Nama Halaman

Tulis paragraf pembuka yang menjelaskan isi halaman secara langsung.

## Bagian berikutnya

Isi halaman di sini.
```

The title in the front matter controls the navigation/page title. The browser title is automatically formatted as `Nama Halaman - Yakka Works`.

## 4. Navigation

This project uses the Awesome Pages plugin instead of a manually maintained `nav:` list. Each folder may have a `.pages` file to control its title, order, and visibility. Check the existing `.pages` files before changing navigation.

Keep the paired language files together. The i18n plugin handles the language switcher.

## 5. Changing the design

Most visual changes belong in `assets/css/y2k.css`.

Main brand values:

- Green: `#4d8b31` — primary brand colour.
- Orange: `#ff8427` — important actions and CTAs only.
- Pastel support colours are defined as CSS variables near the top of the stylesheet.

Fonts:

- `body.ttf` — normal reading text.
- `header.ttf` — headings and navigation.
- `display.ttf` — larger display-style headings.

Background images:

- `background-ll.jpg`: light + landscape.
- `background-lp.jpg`: light + portrait.
- `background-dl.jpg`: dark + landscape.
- `background-dp.jpg`: dark + portrait.

All four background files are temporary copies of the current cover image. Replace them individually when proper variants are ready. `cover.jpg` is used for link previews and social cards.

## 6. Useful commands

| Task | Windows | Linux |
| --- | --- | --- |
| Install packages | `dev-tool\install.bat` | `bash dev-tool/install.sh` |
| Start preview | `dev-tool\serve.bat` | `bash dev-tool/serve.sh` |
| Update packages/source | `dev-tool\update.bat` | `bash dev-tool/update.sh` |
| Push the development branch | `dev-tool\push.bat` | `bash dev-tool/push.sh` |
| Sync the live branch separately | `dev-tool\sync.bat` | `bash dev-tool/sync.sh` |

The push helper performs a strict build first and only pushes to `y2k-dev`. Do not change that safety check casually. The live sync helper uses a separate `live-sync/` folder; it does not overwrite the current source tree.

## 7. Before publishing

A successful local preview is not the same as a successful production deployment. Before merging or publishing, check:

- Indonesian and English pages.
- Light mode, dark mode, and system mode.
- Desktop and phone-sized layouts.
- Navigation and footer links.
- Search and page titles/descriptions.
- The strict build: `python -m mkdocs build --strict`.

The GitHub Actions workflow also runs the strict build. Only the existing live deployment branch is configured to deploy the website.

## 8. A few MkDocs words

- **MkDocs:** turns Markdown files into a static website.
- **Material for MkDocs:** the theme and its built-in components.
- **Plugin:** adds functionality such as search, translations, blog pages, or navigation ordering.
- **Hook:** a small Python function called during the build.
- **Override:** a custom template that changes part of the theme's HTML.
- **Front matter:** the YAML block at the top of a Markdown file, usually used for its title and other page settings.
- **Build:** generate the static site into `site/`.
- **Serve:** run a local preview server with live reload.

When unsure, make one small change, preview it, and run a strict build before pushing.
