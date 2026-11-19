# AI shared context bank

> Compact handoff state for the next AI agent. Keep this concise and refresh it every five user-facing assistant responses.

## Current snapshot

- **Project:** Yakka Works website, MkDocs Material rebuild.
- **Working branch:** `y2k-dev`.
- **Current phase:** custom Yakka Works document-window layout preview; owner should review locally.
- **Content scope:** homepage/category indexes, legal placeholders, and debug page only. Do not import old content pages without direct authorisation.
- **Plugins retained:** search, static i18n, Awesome Pages, Blog, Redirects.
- **Build/deploy:** strict GitHub Actions build on dev branches; deployment only on `mkdocs-site-live`.
- **Brand:** primary `#4d8b31`; sparing CTA orange `#ff8427`; soft pastel supporting palette.
- **Fonts/assets:** body/header/display TTFs; theme assets published from `docs/assets/`.
- **Metadata:** title suffix `- Yakka Works`; first rendered paragraph is the description; OG and X cards use `/assets/img/cover.jpg`.
- **Local helpers:** wrappers in `dev-tool/`; scripts in `dev-tool/scripts/`; human and AI guides in `dev-tool/readmes/`.
- **Root licence:** existing `LICENSE` remains at root.

## Latest work (2026-11-19)

The owner shared a target layout reference and clarified that MkDocs Material must remain the underlying engine, while the visible page layout should follow the supplied standalone HTML template:

- A custom, non-sticky Yakka Works brand/header bar with Material palette/language controls and native Material search.
- A separate custom non-sticky navigation row beneath it.
- A centered, narrow, square-cornered document frame with a metadata strip, article content, and Markdown-sourced page date (never a live clock in the date strip).
- Existing Yakka Works brand colours, typefaces, cover/background imagery, and custom three-column footer remain.
- Material's native back-to-top feature is retained but styled as a fixed bottom-right button.
- Hide Material's default header/tabs/sidebar presentation while retaining Material content rendering, search, palette and i18n systems.
- Blog-generated content that bypasses the normal content partial is wrapped client-side into the same document frame.

### Changed files

- `overrides/main.html`: custom header/tabs blocks, hide sidebars, document wrapper, per-page metadata.
- `overrides/partials/header.html`: brand controls and native Material search.
- `overrides/partials/tabs.html`: custom navigation based on Material's own tabs-item renderer.
- `overrides/partials/content.html`: native Material content pipeline without nested frame.
- `docs/assets/css/y2k.css`: custom header/nav/frame, responsive layout, fixed bottom-right back-to-top button, active nav styling.
- `docs/assets/js/y2k-clock.js`: removed live date display; adds '/' search shortcut and wraps blog-plugin pages that bypass the normal frame.

### Commits and build status

- Layout commit: `0663dee457bf99c9af8466fad834e126fa63f336` — strict build passed in run `44462234581`.
- Blog/nav fix commit: `628f5aedbda527856e488e2ba5aa5c12a3738113` — strict build passed in run `44462342640`.
- Final navigation semantics/active-state polish: `a698ab1ea11a049ec6c6b6b573dd1ecbd9594593` — awaiting its own CI run at the time of this update.
- No production deployment occurred.
- The owner has not yet confirmed the new layout visually. Do not claim local visual verification.

## Open items

1. Pull the latest `y2k-dev` and review homepage, blog index, a dated blog post, legal page, both languages, light/dark modes, and mobile layout.
2. Confirm the nav is not sticky and the back-to-top button sits at bottom right.
3. Confirm blog index and generated blog posts both use the document frame; verify dates come from Markdown front matter.
4. Verify the new nav polish strict-build run.
5. Investigate `/en/sitemap.xml` 404 only if it persists.
6. Legal pages remain drafts; substantive content migration requires explicit approval.

## Agent update cadence

After every five user-facing assistant responses, refresh this file with a short TL;DR of completed work, changed paths, branch/commit state, build status, and next actions. **Responses since this snapshot: 0.**
