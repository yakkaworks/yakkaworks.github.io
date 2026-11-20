# AI shared context bank

> Single compact handoff for the next agent. This file is a current-state summary, not a chronological changelog.

## TL;DR

As of **2026-11-20**: Yakka Works uses MkDocs Material with custom overrides. Active branch: `y2k-dev`; latest commit: `c34dd6e2947eb12465057794fa8233fdb9241e5b`. The site has a three-row header, custom navigation, centered document layout and footer, currently targeting a 900px desktop width. Page dates come from Markdown front matter. Supplied artwork is extracted from `dev-tool/readmes/Website's.zip` into generated site output; do not add Pillow or regenerate placeholders. Shared image references in Markdown must use site-root-relative `/assets/img/...` URLs so locale and nested English routes resolve correctly. `y2k-dev` is build-only; no production deployment. Latest image-path changes have not yet been locally/visually verified. Legal pages remain drafts; do not migrate old content without explicit approval.

## Current rules and decisions

- Keep MkDocs Material's rendering, search, palette and i18n systems; implement the custom visual structure through the existing overrides and assets.
- Preserve the current three-row header, 900px shared layout width, custom navigation, document frame/signature and footer. Inspect the current implementation before changing it; do not revive older layouts from historical notes.
- Markdown front matter is the source of truth for page dates. New pages should include a publication/creation date using the established `date: dd-mm-yy` format.
- Artwork source: `dev-tool/readmes/Website's.zip`. The build hook copies images into the generated `site/assets/img/` output. Do not change this to pre-build writes into tracked `docs/` assets.
- Do not add Pillow or regenerate artwork with Python. Reuse the closest supplied image; use `content-cards-placeholders.jpg` for example/missing content thumbnails. Keep category icons pixelated.
- Production deployment is restricted to `mkdocs-site-live`; development branches such as `y2k-dev` should only run strict builds.
- Do not claim browser/visual verification unless it was actually performed. A passing CI build does not prove visual correctness.
- When a change is pushed, include this owner pull-and-preview command in the response:
  ```bat
  cd /d "D:\\yakkaworks-site\\y2k-dev-mkdocs-git" && git pull --ff-only origin y2k-dev && dev-tool\\serve.bat
  ```

## Current status / next actions

- Branch: `y2k-dev`
- Latest commit: `c34dd6e2947eb12465057794fa8233fdb9241e5b` — English index image references changed to `/assets/img/...`; previous build-time HTML path rewriting removed.
- Build/test: not run for this change. Owner visual review is still required, especially across nested English routes.
- No production deployment.
- Keep legal pages as drafts. Any substantive migration of legacy content needs explicit owner approval.
