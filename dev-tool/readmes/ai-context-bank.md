# AI shared context bank

> Compact handoff state for the next AI agent. This file is maintained in the repository, not tied to a single chat session.

## Current snapshot

- **Project:** Yakka Works website, MkDocs Material rebuild.
- **Working branch:** `y2k-dev`.
- **Current phase:** fresh theme/scaffold preview; substantive content migration has not started.
- **Content scope:** homepage/category indexes, legal placeholders, and debug page only. Do not import old store/library/tools/blog article pages without a direct request.
- **Build workflow:** GitHub Actions runs `mkdocs build --strict`; deployment is reserved for `mkdocs-site-live`.
- **Plugins retained:** search, static i18n, Awesome Pages, Blog, Redirects.
- **Design:** Yakka Works identity; primary green `#4d8b31`; CTA orange `#ff8427` used sparingly; supporting colours are soft pastel tones.
- **Fonts:** `body.ttf`, `header.ttf`, `display.ttf`.
- **Metadata:** title suffix `- Yakka Works`; description generated from each page's first rendered paragraph.
- **Assets:** site cover and four theme/orientation background variants live in `assets/img/`; brand logo files live in `assets/logo/`.
- **Local helpers:** wrappers in `dev-tool/`; implementation scripts in `dev-tool/scripts/`; maintainer/AI notes in `dev-tool/readmes/`.

## Latest work summary

Initial scaffold was created on `y2k-dev` from the `mkdocs-site` base. The first scaffold commit was `ccf9d4e848e5e4292e23a8b1cff501b4312f2294`. Its GitHub Actions run (`44452237035`) completed successfully with a strict build.

The shared-context update cadence is every five user-facing assistant responses. **Responses since this snapshot: 0.**

## Open items

1. Owner has not yet checked the redesigned site locally.
2. Review the generated site in both languages, light/dark modes, and desktop/mobile layouts.
3. Review the draft legal placeholders before treating them as official policies.
4. Replace the temporary duplicated cover-based background images with proper light/dark and landscape/portrait variants when available.
5. Begin content migration only after the owner explicitly authorises it.

## Agent update format

When updating this file, keep the top snapshot accurate and concise. Include changed paths, commit/branch status, strict-build result, and next steps. Never claim local visual inspection unless it was actually performed.
