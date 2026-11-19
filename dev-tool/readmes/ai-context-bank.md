# AI shared context bank

> Compact handoff state for the next AI agent. This file is maintained in the repository, not tied to a single chat session.

## Current snapshot

- **Project:** Yakka Works website, MkDocs Material rebuild.
- **Working branch:** `y2k-dev`.
- **Current phase:** branded theme and tooling scaffold; the owner has not yet checked the redesign locally.
- **Content scope:** homepage/category indexes, legal placeholders, and debug page only. Do not import old store/library/tools/blog article pages without a direct request.
- **Plugins retained:** search, static i18n, Awesome Pages, Blog, Redirects.
- **Build workflow:** GitHub Actions runs `mkdocs build --strict`; deployment is reserved for `mkdocs-site-live`.
- **Design:** Yakka Works identity; exact primary green `#4d8b31`; exact CTA orange `#ff8427` used sparingly; supporting colours are soft pastel tones.
- **Fonts:** `body.ttf`, `header.ttf`, `display.ttf`; display currently duplicates header.ttf as a temporary placeholder.
- **Metadata:** title suffix `- Yakka Works`; the first rendered paragraph supplies the description; Open Graph and X/Twitter tags use `assets/img/cover.jpg`.
- **Assets:** original logo and cover assets were reused from the existing MkDocs site. Four background image files are temporary copies of the cover.
- **Local helpers:** wrappers in `dev-tool/`; implementation scripts in `dev-tool/scripts/`; maintainer/AI notes in `dev-tool/readmes/`.
- **Root licence:** the existing repository `LICENSE` was restored at the root.

## Latest work summary

On 2026-11-19, the preview was branded as Yakka Works, the live logo/cover/font assets were copied in, and the Windows/Linux helpers plus their implementation scripts were moved under `dev-tool/`. The scripts now resolve the repository root correctly and the push helper targets only `y2k-dev`. Added the root README and the `for-yakka.md`, `ai-instruct.md`, and this shared context file.

The first theme-head build exposed a 404-page case with no page object. That was guarded in `overrides/main.html`. The corrected commit `bb728c9ae92d045731b869fc427e346259e8844e` passed GitHub Actions strict build run `44456154035`; the deployment job was skipped as intended. A later small adjustment keeps the requested exact green/orange brand tokens consistent in dark mode; its build is pending until the next Actions run.

The original scaffold commit was `ccf9d4e848e5e4292e23a8b1cff501b4312f2294`.

## Open items

1. Owner to inspect the redesign locally, including both languages, light/dark modes, and desktop/mobile layouts.
2. Re-run/check GitHub Actions after the latest design-token change.
3. Review the legal placeholders before treating them as official policies.
4. Replace the temporary cover-based background images with proper light/dark and landscape/portrait variants when available.
5. Begin content migration only after the owner explicitly authorises it.

## Agent update format

When updating this file, keep the top snapshot accurate and concise. Include changed paths, commit/branch status, strict-build result, and next steps. Never claim local visual inspection unless it was actually performed.

The context-update cadence is every five user-facing assistant responses. **Responses since this snapshot: 0.**
