# AI shared context bank

> Single compact handoff for the next agent. This is current project state, not a chronological log.

## TL;DR

As of **2026-11-25**: Yakka Works is rebuilding its site with MkDocs Material on the `y2k-dev` branch. The custom Yakka Works layout, suffix-based Indonesian/English pages, and 900px desktop content column remain in place. The TheoTown store contains 48 catalogue items, including five restored map entries, with 96 bilingual detail pages and both localized JSON catalogues populated. The Kustom catalogue contains NEETscape v3 and v4. The production branch is `y2k-live`; this deployment task is promoting the verified development tree.

## Current content state

- TheoTown detail pages: `docs/store/items/<slug>.md` and matching `.en.md` files; routes are `/store/items/<slug>/` and `/en/store/items/<slug>/`.
- Catalogue data: `webdata/json/data_theotown.json` and `webdata/json/en/data_theotown.json` contain 48 entries each, including Papua, Java, Kalimantan, Sulawesi, and Sumatera maps. The latest plugin additions are Aria UI, Panelki UI, i3pt UI, and Road Vehicle as Bus.
- Library migration completed on `y2k-dev`: 60 Indonesian and 60 English article pages are under `docs/library/articles/`, including introductory pages and explicitly under-construction tutorials. Blog migration completed with five Indonesian and four English articles under `docs/blogs/articles/`; the Indonesian-only `situs-baru` post has no English counterpart in the source. All 68 Library/Blog source images are stored in the shared root `webdata/img/` directory (29 SVGs added; 39 identical existing assets reused), and local image references are adjusted by `hooks/site_assets.py` for each published route. Both MkDocs source branches (`mkdocs-site` and `mkdocs-site-live`) had identical Library/Blog content at migration time. The localized JSON catalogues are `webdata/json/data_library.json`, `webdata/json/en/data_library.json`, `webdata/json/data_blogs.json`, and `webdata/json/en/data_blogs.json`.
- The temporary content-data source and generated staging files were deleted after migration. Use the detail pages and JSON catalogues as the current content source.
- The five TheoTown map entries and their ten bilingual detail pages were restored after an accidental deletion in the NEETscape commit. Their thumbnail files (`map-papua.jpg`, `map-java.jpg`, `map-kalimantan.jpg`, `map-sulawesi.jpg`, `map-sumatera.jpg`) are still expected separately in `webdata/img/`.
- The Kustom catalogue now contains NEETscape v3 and v4 in both languages; the generic `kustom-example` placeholder is excluded from both catalogues. NEETscape v4 uses `webdata/img/kustom-neetscapev4.jpg` as its preview and links to `http://lynk.id/yakkaworks/4dvlp0w1er36`.
- Product release/update dates remain catalogue metadata; published Markdown pages retain their own `date: dd-mm-yy` front matter.

## Commission pages

- `docs/store/commissions.md` and `docs/store/commissions.en.md` now contain matching service sections, localized pricing (IDR-only / USD-only), anchor navigation, map services, rejection troubleshooting, and terms. The full-plugin packages are priced at Rp100.000 / $9.99 for basic buildings and Rp80.000 / $7.99 for basic vehicles; add-ons remain listed separately. The revision policy is capped at three in-scope requests.
- The commission estimator is not present in `y2k-dev`. The public site's existing estimator only covers full-plugin packages/add-ons and would need a separate update to estimate the new services; it was not added or changed in this page-only task.

## Content presentation

- Store cards use thumbnail, title, muted latest-version/date metadata, divider, and inline Download Latest / Details links. Store descriptions are not shown on cards.
- Library, Tools, and Blogs use square-thumbnail forum-style list rows with title, date, and a clamped short description.
- `docs/assets/js/content-grids.js` renders the Store cards and Library/Tools/Blog lists; `docs/assets/css/content-grids.css` owns their styling. Library filters must match the explicit `category` field, not free-text descriptions, to avoid false matches.
- `docs/assets/js/content-details.js` normalizes Store, Library, and Blog detail-page presentation. Store pages use thumbnail, title, latest-version/date metadata, optional notices, one description paragraph, requirements, downloads, and credits/links. Library and Blog pages receive a localized AI crawler notice at the end.
- `dev-tool/readmes/content-layout.md` is the shared human/AI authoring specification. Read it before creating or restructuring content pages.
- Credits & Links must omit email addresses, the Yakka Works website link, and commission information. Preserve other relevant credits and external project links.
- GitHub Actions strict builds were failing on two commission-page issues: incorrect relative links to the root license pages and unresolved English section anchors. These have been corrected; the latest `y2k-dev` strict build passed on commit `de47d421af88411c60d815f600a0f5671bfd91fb`. The Library image migration also now places unique SVGs in the shared root `webdata/img/` directory so `hooks/site_assets.py` does not discard them.

## Durable site decisions

- Keep development/content work on `y2k-dev`. `y2k-live` is the production branch and must only be updated when the owner explicitly requests publication. `mkdocs-site-live` is legacy.
- Keep the current three-row header, custom navigation, document frame/signature and footer. Desktop shared width is 900px; mobile uses a 0.5rem gutter.
- Preserve brand green `#4d8b31`, CTA orange `#ff8427`, local Body/Header/Display fonts, Material search, and current i18n configuration.
- Every published Markdown page needs `date: dd-mm-yy` front matter. Internal asset links must be page-relative, with the `../` depth calculated from each page's published URL. Existing Store detail-page image references (39 bilingual pairs / 78 pages) and both TheoTown JSON catalogues have been corrected. The English Store index and homepage were corrected; the Indonesian Store index already used relative asset paths. English Library, Tools, and Blogs index banner URLs must use `../../assets/img/...` from `/en/<section>/`; their Indonesian counterparts use `../assets/img/...`. The remaining Indonesian and English Store pages were checked for root-relative asset links. `hooks/site_assets.py` normalizes `webdata/img/` paths for MkDocs link validation, then restores route-relative URLs in rendered HTML.
- Keep content ordering in `.pages` files; `/store/items/*.md` remains excluded from navigation and is reached through the store content cards.
- Legal pages remain drafts. Do not add unnecessary dependencies or change deployment workflows.
