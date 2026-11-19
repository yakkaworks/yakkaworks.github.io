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


## Latest header/search and document-end layout (2026-11-19)

The owner clarified the required hierarchy with two screenshots and a text sketch. The header must have three distinct rows: brand controls, full-width neutral Material search, then left-aligned brand-coloured custom navigation. The previous screenshot had search detached/floating and the navigation in the wrong hierarchy.

- `overrides/partials/header.html`: brand row with Yakka Works logo/name on the left, native Material palette/language controls on the right, and a separate search row beneath. The root header keeps both `yw-header` and `md-header` classes so Material's search state selectors still work.
- Material's own `partials/search.html` is included unchanged in the search row. Scoped `.yw-search-row` CSS makes the native input always visible and full-width, uses a neutral light/dark surface, and keeps the Material result panel/dropdown. `docs/assets/js/y2k-clock.js` opens the native search state on focus/input, closes it on outside click/Escape, and preserves the `/` shortcut.
- `overrides/partials/navigation.html`: independent custom navigation, rendered through the normal-flow `tabs` block in `overrides/main.html`. It uses localized Home/Store/Library/Tools/Blog links. Nav bar itself is 800px, left aligned, and brand coloured.
- `overrides/main.html`: adds a document-end signature inside `.yw-page`, with translated thanks-for-reading text plus Saweria/Patreon support links and `[ EOF ]` marker.
- `overrides/partials/footer.html`: removed the old global support banner. The global footer now contains brand/contact, legal, social and credits only.
- `docs/assets/css/y2k.css`: three-row structure, 800px neutral search row and navigation, document signature styling. Brand green `#4d8b31`, CTA orange `#ff8427`, and local font files are retained.
- `docs/assets/js/y2k-clock.js`: generated Blog plugin pages also receive the same document-end thanks/support signature when the script wraps their content.
- Updated `dev-tool/readmes/for-yakka.md` and `dev-tool/readmes/ai-instruct.md` to document the new source of truth.
- Files changed: `overrides/partials/header.html`, `overrides/partials/navigation.html`, `overrides/main.html`, `overrides/partials/footer.html`, `docs/assets/css/y2k.css`, `docs/assets/js/y2k-clock.js`, `dev-tool/readmes/for-yakka.md`, `dev-tool/readmes/ai-instruct.md`, this context bank.
- Latest code commit: `f12fa9676301af12cb1f5ca17e8768bd3559b79d`; strict GitHub Actions build passed in run `44468534968`. The two maintainer-guide updates and context-bank update are documentation-only. No local browser verification.
- Next: verify GitHub Actions strict build; owner should check search field at desktop/mobile, search results open/close, palette/language controls, nav alignment, and document-end signature.
- **Responses since this snapshot: 0.**


## Latest header spacing and dark backdrop adjustment (2026-11-19)

The owner reviewed the three-row header and requested: remove vertical gaps between brand/search/navigation, compact the brand bar, and make the city background visibly dark (not neutral-solid) in dark mode.

- `docs/assets/css/y2k.css`: brand bar is now 56px desktop / 54px mobile; search row and nav have no vertical margins between them. Both are centered at 800px max width and use a 0.5rem mobile gutter. Search row is a neutral-coloured wrapper around Material's native search field. Main document retains its separate top breathing room below the nav.
- Dark mode `body::after` now uses background-dl.jpg / background-dp.jpg with an 80% neutral green-black overlay. Light mode retains the lighter city image treatment.
- `dev-tool/readmes/for-yakka.md` and `dev-tool/readmes/ai-instruct.md` updated to record these rules and correct the earlier obsolete note saying dark mode should be a solid colour.
- Main code commit: `f7c21441bf0e4850955e75fb2f5c264432ccf986`; strict GitHub Actions build passed in run `44469876390`. Maintainer-guide update commit `2ffa0c267db8363e5422e8d5241ab5f202cf438e` also passed in run `44469968267`. The latest context-bank-only update is queued/in progress in run `44470030794`. No production deployment.
- Next: strict GitHub Actions build, then owner to inspect exact zero-gap header alignment and dark city image in browser.
- **Responses since this snapshot: 0.**


## Owner web-editor changes and repair (2026-11-19)

The owner pulled commit `761d2eff602cd9bc027db27c7ccb4feca1991363` locally and reported a Jinja template error. Reviewed the four web-editor commits between `9ebb28a` and `761d2ef` and preserved their intended edits:

- `overrides/partials/header.html`: retained class order `md-header yw-header` (functionally equivalent to the previous order).
- `overrides/main.html`: retained removal of the thanks-for-reading text and `[ EOF ]` marker. The owner left the support links in the document signature. Fixed the missing `{% endif %}` closing `{% if config.extra.donate %}` before closing the signature.
- `overrides/partials/footer.html`: retained the owner's decision to put Social & Contact before Legal.
- `docs/assets/css/y2k.css`: repaired invalid declarations to `max-width: 800px;` and `margin: 0.5rem 0;`, preserving the owner's chosen values/left alignment. Removed stray whitespace.
- Root cause of the preview crash: `overrides/main.html` had an unclosed Jinja `if`, confirmed by failed Actions runs `44471298271` and `44471947628`. CSS declarations were malformed too, but were not the cause of the Jinja template exception.
- Repair commits: `e34e768` (Jinja endif) and `66ec7f6` (CSS syntax). Strict GitHub Actions build passed for `66ec7f6` in run `44472498118`.
- Updated this guide and AI rules to reflect current owner decisions; no local browser verification. No production deploy.
- Next: owner can pull latest `y2k-dev`, restart preview, and check that the support strip renders and the header width/margin match the intended web edits.
- **Responses since this snapshot: 0.**


## Latest header flex alignment adjustment (2026-11-19)

The owner asked whether a flex-column layout would align the brand and search rows. Inspection showed their latest pushed CSS had `display: flex:` / `flex: column;` syntax, and a later `.yw-header.md-header { display: block !important; }` rule overrode the earlier `.yw-header` declaration.

- Committed an effective later override in `docs/assets/css/y2k.css` targeting `.yw-header.md-header`: `display:flex !important`, `flex-direction:column`, `align-items:stretch`, `justify-content:flex-start`, width `min(800px, calc(100% - 1rem))`, max-width 800px, and left-aligned `margin:0.5rem 0` on desktop.
- Set `.yw-header__brand-row` and `.yw-search-row` to 100% width with zero margin; set `.yw-header__brand-inner` and search inner wrappers to 100% width/max-width none and border-box. This removes the few-pixel width discrepancy between brand and search rows.
- Mobile override gives the header a 0.5rem gutter on both sides.
- Commit: `6b881b5ebc9de80e4efd0289dd82f67a18bb1a33`. Build status: pending when this note was written. No local visual verification.
- Next: confirm strict GitHub Actions build, then owner can pull `y2k-dev` and preview. Main uncertainty to visually check: left alignment of the header as requested, and whether its right edge lines up with the 800px nav/main/footer at desktop width.
- **Responses since this snapshot: 0.**


## Header centering follow-up (2026-11-19)

- Owner reported that the brand/search header was left-aligned while the 800px navigation and main document were centered.
- Root cause: effective `.yw-header.md-header` rule used `margin: 0.5rem 0`, which explicitly sets both horizontal margins to zero. The mobile rule already has symmetric 0.5rem gutters.
- Changed only desktop/effective rule to `margin: 0.5rem auto`; width remains `min(800px, calc(100% - 1rem))`, so it should center at the same 800px maximum width as nav/main/footer. Flex column and equal-width inner rows remain unchanged.
- Commit: `95e0ffbf11bcdb419af5e60f172e53f30c30650d`. Build status: pending. No local visual verification.
- Next: check strict CI, then owner can pull and verify header left/right edges align with navigation and document.
- **Responses since this snapshot: 0.**
