# AI shared context bank

> Compact handoff state for the next AI agent. This file is maintained in the repository, not tied to a single chat session.

## Current snapshot

- **Project:** Yakka Works website, MkDocs Material rebuild.
- **Working branch:** `y2k-dev`.
- **Current phase:** branded theme and tooling scaffold; the owner is reviewing the first local preview.
- **Content scope:** homepage/category indexes, legal placeholders, and debug page only. Do not import old store/library/tools/blog article pages without a direct request.
- **Plugins retained:** search, static i18n, Awesome Pages, Blog, Redirects.
- **Build workflow:** GitHub Actions strict build passed after the asset-path fix; deployment remains restricted to `mkdocs-site-live`.
- **Design:** Yakka Works identity; primary green `#4d8b31`; CTA orange `#ff8427` used sparingly; supporting colours are soft pastel tones.
- **Fonts:** `body.ttf`, `header.ttf`, `display.ttf`; display currently duplicates header.ttf as a temporary placeholder.
- **Published assets:** CSS, JS, fonts, logos, cover, and background images live under `docs/assets/` because MkDocs publishes files from `docs_dir: docs`.
- **Metadata:** title suffix `- Yakka Works`; first rendered paragraph supplies the description; Open Graph and X/Twitter tags use `/assets/img/cover.jpg`.
- **Local helpers:** wrappers in `dev-tool/`; implementations in `dev-tool/scripts/`; maintainer/AI notes in `dev-tool/readmes/`.
- **Root licence:** existing repository `LICENSE` retained at project root.

## Latest work summary

On 2026-11-19, the owner tested the preview from `D:/yakkaworks-site/y2k-dev-mkdocs/`. The screenshot showed an unstyled Material layout; the browser log returned 404 for `/assets/css/y2k.css`, `/assets/js/y2k-clock.js`, and logo assets. Cause: static assets had been stored outside `docs_dir`.

Fixed by moving all 17 theme assets into `docs/assets/` while preserving the output URL structure. Updated `README.md` and this handoff guide so the published asset location is documented correctly. Removed the old repository-root `assets/` copies to avoid duplicate sources of truth.

- **Asset fix commit:** `f4c9972d86382e4d8478bd6f57749e5d02472248`.
- **Strict build:** passed in GitHub Actions run `44457897566`.
- **Documentation follow-up:** commit `426a2983bb83ff09438a12ab98dcf0c1b35c54f9`; its strict build passed in run `44458077733`.
- **Deployment:** skipped as intended; no production publishing occurred.

Earlier, the custom metadata template was guarded for 404 pages without a page object. The guarded template passed strict build before the asset move.

The original scaffold commit was `ccf9d4e848e5e4292e23a8b1cff501b4312f2294`.

## Open items

1. Owner should pull the latest `y2k-dev` commit locally, restart the preview, and verify CSS, JS, fonts and logo return successfully.
2. Check both languages, light/dark modes, and desktop/mobile layouts visually.
3. The local log also showed `/en/sitemap.xml` returning 404; this is separate from the theme-asset failure and should be investigated only if it persists after refresh.
4. Material for MkDocs prints a separate notice about future MkDocs 2.0 compatibility. The current pinned MkDocs 1.6.1 + Material 9.7.7 stack builds; do not migrate frameworks without explicit project review.
5. Review legal placeholders before treating them as official policies.
6. Replace temporary cover-based backgrounds with proper light/dark and landscape/portrait variants when available.
7. Begin substantive content migration only after explicit authorisation.

## Agent update format

Keep this snapshot concise and accurate. Include changed paths, commit/branch state, strict-build result, and next steps. Never claim local visual inspection unless it actually happened.

The context-update cadence is every five user-facing assistant responses. **Responses since this snapshot: 0.**
