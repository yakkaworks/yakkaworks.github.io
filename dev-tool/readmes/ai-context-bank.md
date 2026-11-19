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


## Latest adjustment (2026-11-19)

- Set the custom navigation inner width, main document column, and custom footer to a shared maximum width of **800px**.
- On viewports up to 700px, each uses a 0.5rem horizontal gutter (`calc(100% - 1rem)`).
- Main content now fills the 800px column rather than retaining the older 768px cap.
- Changed file: `docs/assets/css/y2k.css`.
- Commit: `596b926dc67a9a355feb7e985e0dc2f248d24d34`.
- Build: not yet verified after this CSS-only adjustment.
- Next: verify the latest strict GitHub Actions build, then owner should pull and inspect desktop/mobile alignment locally.
- **Responses since this snapshot: 0.**


## Latest navigation and background fix (2026-11-19)

The owner supplied a light-mode screenshot showing that the custom navigation row was missing entirely, while the top brand header and document/footer were visible. This was a template-rendering issue, not just a colour/spacing issue: the previous navigation was rendered via the Material tabs block and its `nav.items` loop, which did not appear in the preview.

- Moved the primary nav markup into `overrides/partials/header.html`, immediately after the brand header. It now uses explicit links for Home/Store/Library/Tools/Blog, Indonesian and English labels, and route-based active state.
- Emptied the Material `tabs` block in `overrides/main.html` to avoid duplicate tabs; Material search, palette, i18n, Markdown rendering, and page frame remain in use.
- Updated `docs/assets/css/y2k.css`: nav styling is in normal flow, uses a brand-derived dark green bar with readable links, keeps the 800px shared width and 0.5rem mobile gutter, and prevents the links from wrapping awkwardly on narrow screens (horizontal scroll when necessary).
- Dark mode `body::after` now uses a neutral solid dark background instead of the cover image. The light-mode cover background remains; `.md-container` is elevated above the background pseudo-element so the background can show consistently behind the page.
- Adjusted supporting light colours toward pale green/orange-derived pastels while preserving primary green `#4d8b31`, CTA orange `#ff8427`, and the local Body/Header/Display fonts.
- Updated `dev-tool/readmes/for-yakka.md` and `dev-tool/readmes/ai-instruct.md` with the new navigation and background rules.
- Commits: `abaafbe` (header/nav), `89a3093` (remove Material tabs block), `1513c1d` (CSS/nav/background), followed by guide updates `4f80e77` and `7067531`.
- Build status: strict GitHub Actions build passed in run `44465300784` (commit `05a2d1ebf6a5f53ac1fedbb9c2a7711985995fe8`); deployment was skipped as expected. No local browser verification has been performed by the agent.
- Next: owner should inspect both light/dark mode and navigation routes in desktop/mobile previews.
- **Responses since this snapshot: 0.**


## Latest header/navigation/search correction (2026-11-19)

The owner provided a fresh screenshot: the nav labels were visible but the bar background/width were wrong, and the search icon/control was missing.

- Added `overrides/partials/navigation.html` as an independent custom nav partial. It renders localized Home/Store/Library/Tools/Blog links with explicit route state.
- `overrides/main.html` now renders this partial through Material's normal-flow `tabs` block. The nav is no longer embedded in `header.html`; this separates it from the header block that lives outside `.md-container`.
- `overrides/partials/header.html` now contains only the Yakka Works brand plus Material's native palette control, i18n language alternate control, search toggle, and native search dialog. Search was moved out of the flex controls so Material's dialog positioning is not overridden.
- `docs/assets/css/y2k.css` now sets the **whole nav bar** to `min(800px, calc(100% - 1.5rem))`, with the same 800px max-width as main/footer and a 0.5rem mobile gutter. It has a visible brand-derived green background and localized active-link state. The native Material search overlay keeps its default positioning.
- Updated `dev-tool/readmes/for-yakka.md` and `dev-tool/readmes/ai-instruct.md` with the source-of-truth and maintenance rules.
- Files changed: `overrides/partials/navigation.html`, `overrides/partials/header.html`, `overrides/main.html`, `docs/assets/css/y2k.css`, `dev-tool/readmes/for-yakka.md`, `dev-tool/readmes/ai-instruct.md`, this context bank.
- Latest implementation commit: `69e73af3901395ba1766e31b43e525b50e45bbdf`; strict GitHub Actions run `44466560405` passed. Context-bank follow-up commit `5eee0e5428a66de077d494af3af6332b3b4744f5` also passed strict build in run `44466628844`. No local visual verification has been performed.
- Next: confirm strict build completion; owner should test Material search open/close and result navigation, palette switching, language switching, nav routes, and exact 800px alignment in both desktop and mobile viewports.
- **Responses since this snapshot: 0.**
