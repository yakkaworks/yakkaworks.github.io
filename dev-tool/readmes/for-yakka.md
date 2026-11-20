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
| `docs/assets/css/y2k.css` | Colours, typography, layout and responsive styling |
| `docs/assets/fonts/` | Local fonts used by the theme |
| `docs/assets/img/` | Social cover and page background images |
| `docs/assets/logo/` | Logo and favicon |
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
date: 2026-11-20
---

# Nama Halaman

Tulis paragraf pembuka yang menjelaskan isi halaman secara langsung.

## Bagian berikutnya

Isi halaman di sini.
```

The title in the front matter controls the navigation/page title. The browser title is automatically formatted as `Nama Halaman - Yakka Works`.

The optional `date` field appears on the far-right side of the document header. Use an unquoted ISO date (`YYYY-MM-DD`); it is displayed as `dd/mmm/yyyy`, for example `20/Nov/2026`. Pages without a `date` field do not show a date.

## 4. Navigation

This project uses the Awesome Pages plugin instead of a manually maintained `nav:` list. Each folder may have a `.pages` file to control its title, order, and visibility. Check the existing `.pages` files before changing navigation.

Keep the paired language files together. The i18n plugin handles the language switcher.

## 5. Changing the design

Most visual changes belong in `docs/assets/css/y2k.css`.

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

After the AI assistant pushes a change, update and preview it on Windows with:

```bat
cd /d "D:\yakkaworks-site\y2k-dev-mkdocs-git" && git pull --ff-only origin y2k-dev && dev-tool\serve.bat
```

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


## 9. Custom site layout

The visible site layout is implemented with Material template overrides:

- `overrides/partials/header.html` contains the Yakka Works brand row, Material palette/language controls, and the full-width native Material search row.
- `overrides/partials/navigation.html` contains the custom primary navigation and localized labels.
- `overrides/main.html` keeps Material page rendering inside the Yakka Works document frame and adds the document-end support signature.
- `overrides/partials/footer.html` contains only the brand/address/email, legal links, social links, and credits.
- `docs/assets/css/y2k.css` controls the shared 900px search, navigation, main-content, and footer widths.

The primary navigation is a custom override in `overrides/partials/navigation.html`, rendered in the normal-flow Material tabs slot after the header. Update its Indonesian and English labels and keep destinations in sync with the indexes under `docs/`.

The navigation is in normal document flow. Do not make it sticky or fixed. Material's back-to-top control is a separate fixed bottom-right button.

Light mode uses the muted cover-image backdrop. Dark mode uses the dark city background variant (background-dl.jpg / background-dp.jpg) under a strong neutral green-black overlay, so the image is visible but subdued. Keep the brand green `#4d8b31` and action orange `#ff8427`; supporting surface and border colours should remain pale tints or darkened tints derived from those brand colours. Keep the supplied local font files.


## 10. Header, search and navigation overrides

The header and navigation are separate Material template regions:

- `overrides/partials/header.html` renders the Yakka Works brand bar and reuses Material's native palette, language selector, search toggle, and search dialog.
- `overrides/partials/navigation.html` renders the custom Home/Store/Library/Tools/Blog menu.
- `overrides/main.html` inserts the navigation partial through Material's `tabs` template block. This puts it after the header and before the main document, instead of embedding it in the header itself.
- `docs/assets/css/y2k.css` constrains the navigation bar, main document and footer to the same 900px width. On mobile they use a 0.5rem side gutter.

When updating navigation labels or URLs, edit `overrides/partials/navigation.html`. The English and Indonesian labels and route prefixes are handled there. Do not make this navigation sticky or fixed.


## 11. Header spacing and dark background

The header has three rows: the brand/control bar, the neutral Material search field, and the brand-coloured custom navigation. The current owner-edited header wrapper has an 900px maximum width and 0.5rem vertical margin; search and navigation share the 800px width and 0.5rem mobile gutter. Preserve the owner's latest spacing choices when adjusting the theme.

The search row is a neutral-coloured wrapper around Material's own search partial. Keep the native search input/results behaviour; only the wrapper and visual styling are custom.

In dark mode the city image remains as the page backdrop but is darkened by a neutral green-black overlay. The landscape and portrait variants are selected separately. Light mode retains the lighter city treatment. The current document signature contains the support links only; the owner removed the thanks text and EOF marker.


## 12. Navigation tab colours and row boundaries

The brand, search, and navigation rows touch with no vertical gaps. The brand row keeps its bottom border. The neutral Material search field is left visually unchanged. The nav bar uses the Yakka Works primary green `#4d8b31`; inactive tabs use a deeper green shade and the active tab has an orange `#ff8427` top border. The active indicator is on top, not bottom. Keep the whole nav, search, and main document aligned to the same 900px column.


## 13. Latest 900px width and Blog cleanup

The site column is now 900px wide on desktop. Brand/search header, search input, navigation, main document, and footer share that width. On mobile, use a 0.5rem gutter. The Material search input and all its wrappers are force-sized to 100% so the input edges align with the brand and navigation edges.

Blog pages use a small compatibility script to remove legacy thank-you and EOF elements left by stale cached scripts. The current Blog signature should contain support links only. The main Blog framing script also needs the language variable defined before rendering translated support text.
