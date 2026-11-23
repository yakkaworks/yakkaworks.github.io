# AI shared context bank

> Single compact handoff for the next agent. This is current project state, not a chronological log.

## TL;DR

As of **2026-11-23**: Yakka Works is rebuilding its site with MkDocs Material on the `y2k-dev` branch. The custom Yakka Works layout, suffix-based Indonesian/English pages, and 900px desktop content column remain in place. The TheoTown store migration is complete: 39 catalogue items, 78 bilingual detail pages, and both localized JSON catalogues are populated. No production deployment has been made.

## Current content state

- TheoTown detail pages: `docs/store/items/<slug>.md` and matching `.en.md` files; routes are `/store/items/<slug>/` and `/en/store/items/<slug>/`.
- Catalogue data: `webdata/json/data_theotown.json` and `webdata/json/en/data_theotown.json` contain 39 entries each.
- Library examples: four bilingual detail-page pairs under `docs/library/articles/`; Blog examples: three bilingual pairs under `docs/blogs/articles/`.
- The temporary content-data source and generated staging files were deleted after migration. Use the detail pages and JSON catalogues as the current content source.
- Product release/update dates remain catalogue metadata; published Markdown pages retain their own `date: dd-mm-yy` front matter.

## Content presentation

- Store cards use thumbnail, title, muted latest-version/date metadata, divider, and inline Download Latest / Details links. Store descriptions are not shown on cards.
- Library, Tools, and Blogs use square-thumbnail forum-style list rows with title, date, and a clamped short description.
- `docs/assets/js/content-grids.js` renders the Store cards and Library/Tools/Blog lists; `docs/assets/css/content-grids.css` owns their styling.
- `docs/assets/js/content-details.js` normalizes Store, Library, and Blog detail-page presentation. Store pages use thumbnail, title, latest-version/date metadata, optional notices, one description paragraph, requirements, downloads, and credits/links. Library and Blog pages receive a localized AI crawler notice at the end.
- `dev-tool/readmes/content-layout.md` is the shared human/AI authoring specification. Read it before creating or restructuring content pages.
- Credits & Links must omit email addresses, the Yakka Works website link, and commission information. Preserve other relevant credits and external project links.
- Strict build status after the content-layout change: not yet verified. Do not claim it passed until run locally or confirmed through GitHub Actions.

## Durable site decisions

- Work on `y2k-dev` only; do not merge or deploy to `mkdocs-site-live` unless the owner explicitly asks.
- Keep the current three-row header, custom navigation, document frame/signature and footer. Desktop shared width is 900px; mobile uses a 0.5rem gutter.
- Preserve brand green `#4d8b31`, CTA orange `#ff8427`, local Body/Header/Display fonts, Material search, and current i18n configuration.
- Every published Markdown page needs `date: dd-mm-yy` front matter. Shared image links must be site-root-relative (for example, `/assets/img/cover.jpg`) so English and nested routes resolve.
- Keep content ordering in `.pages` files; `/store/items/*.md` remains excluded from navigation and is reached through the store content cards.
- Legal pages remain drafts. Do not add unnecessary dependencies or change deployment workflows.
