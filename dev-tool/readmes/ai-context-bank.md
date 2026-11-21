# AI shared context bank

> Single compact handoff for the next agent. This is current project state, not a chronological log.

## TL;DR

As of **2026-11-21**: Yakka Works is rebuilding its site with MkDocs Material on the `y2k-dev` branch. The custom Yakka Works layout, suffix-based Indonesian/English pages, and 900px desktop content column remain in place. The TheoTown store migration requested by the owner is complete: **39 catalogue items, 78 bilingual detail pages**, and both localized JSON catalogues have been populated from the new README-folder source data. No production deployment has been made.

## Current project state

- TheoTown detail pages: `docs/store/items/<slug>.md` and matching `.en.md` files; routes are `/store/items/<slug>/` and `/en/store/items/<slug>/`.
- Catalogue data: `webdata/json/data_theotown.json` and `webdata/json/en/data_theotown.json` each contain 39 entries. Store index pages already render these through `docs/assets/js/content-grids.js`.
- The temporary `dev-tool/readmes/content-data.md` source and generated staging file were deleted after processing, as instructed. Use the detail pages and JSON catalogues as the current site content.
- Page front matter dates are `21-11-26`; product release/update dates remain catalogue metadata.
- All 39 TheoTown catalogue items now have a matching preview image sourced from `mkdocs-site/docs/webdata/img/`. Detail-page lead images and both localized catalogue thumbnails use the corresponding `/webdata/img/<filename>` path.
- Source metadata was preserved without guessing missing values. Blank platform support is shown as unspecified; Cube UI has no category or diamond price in the source; Bordered Intercity Connection has no direct download URL.
- The Indonesia Transport Pack source lists version `8.4.5p`, while supplied files are named `EXP_843` and `EXP_842`; its page flags this mismatch instead of claiming the files match.
- Minimum-version shorthand is normalized per the source instruction: `1985` → `1.9.85` and `11255` → `1.12.55`. Diamond prices are identified as in-game store prices, separate from website downloads.

## Build and artwork state

- The supplied artwork ZIP contained exactly 18 files (11 JPG and 7 PNG), all under `Website's/`. They were CRC/signature checked and extracted into `docs/assets/img/`; the transfer archive was deleted afterward.
- `hooks/site_assets.py` now validates the tracked artwork set and copies it byte-for-byte into `site/assets/img/`. The preview no longer depends on an archive or temporary JPG fallback.
- The 39 TheoTown product preview images have been copied from `mkdocs-site/docs/webdata/img/` into `webdata/img/`; the bilingual detail pages and both JSON catalogues now reference those images. This is separate from general website artwork.
- The extraction workflow runs `mkdocs build --strict` before committing the asset migration; do not claim visual/browser verification unless separately performed.
## Durable site decisions

- Work on `y2k-dev` only; do not merge or deploy to `mkdocs-site-live` unless the owner explicitly asks.
- Keep the current three-row header, custom navigation, document frame/signature and footer. Desktop shared width is 900px; mobile uses a 0.5rem gutter.
- Preserve brand green `#4d8b31`, CTA orange `#ff8427`, local Body/Header/Display fonts, Material search, and current i18n configuration.
- Every published Markdown page needs `date: dd-mm-yy` front matter. Shared image links must be site-root-relative (for example, `/assets/img/cover.jpg`) so English and nested routes resolve.
- Keep content ordering in `.pages` files; `/store/items/*.md` remains excluded from navigation and is reached through the store content cards.
- Legal pages remain drafts. Do not add unnecessary dependencies or change deployment workflows.
