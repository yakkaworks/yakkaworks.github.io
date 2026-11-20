# AI shared context bank

> Single compact handoff for the next agent. This file is a current-state summary, not a chronological changelog.

## TL;DR

As of **(2026-11-20 22-15 (Jakarta time))**: Yakka Works is being rebuilt with **MkDocs Material retained as the underlying engine**, while custom overrides provide the Yakka Works presentation. Active branch: `y2k-dev`; latest known commit: `b7d93bfa1fb580a0526132d56fba61d32123b9db`. The custom site uses a three-row header (brand/controls, native Material search, custom navigation), a centered document layout, and a custom footer. Header, search, navigation, main content and footer share a **900px maximum width** with mobile gutters. Page publication dates come from each Markdown file's front matter, not content JSON or a live clock. The supplied artwork archive is `dev-tool/readmes/Website's.zip`; build hooks copy its images into the generated site. Pillow and the old placeholder-generation script have been removed; use supplied artwork and the content-card placeholder instead of generating replacement images. Category icons should retain pixelated/nearest-neighbour rendering. Strict GitHub Actions builds have passed for the latest implementation; `y2k-dev` is build-only and does not deploy production. Owner visual review is still required. Legal pages remain drafts; do not migrate old content without explicit approval.

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
- Latest known commit: `b7d93bfa1fb580a0526132d56fba61d32123b9db` — supplied category icons mapped into navigation cards.
- Latest implementation CI: strict build passed (run `44761468412`).
- No production deployment.
- Owner should pull and visually inspect desktop/mobile, light/dark modes, navigation, search, publication dates, and supplied artwork. Do not treat this review as complete until the owner confirms it.
- Keep legal pages as drafts. Any substantive migration of legacy content needs explicit owner approval.

## Context-bank maintenance instructions

- Periodically **collapse and rewrite** this file into one concise TL;DR/current-state summary. Do this after a substantial milestone or roughly every five user-facing responses; do not keep appending snapshots.
- Remove resolved-issue logs, superseded implementations, obsolete CSS/layout measurements, old commit-by-commit histories, and completed task notes. Retain only decisions and constraints that still affect future work, the latest relevant branch/commit/build state, and genuinely open actions.
- If a decision changes, replace the old decision rather than recording both versions. Preserve history only when it is necessary to explain a still-open risk.
- Keep the whole file short enough to serve as a handoff, not an archive. Put durable detailed guidance in the maintainer/AI instruction files where appropriate.
- Use **Jakarta time (WIB, UTC+7)** for every recorded timestamp, in exactly this format: `(yyyy-mm-dd hh-mm (Jakarta time))` using a 24-hour clock. Do not mix UTC/local timestamps or omit the timezone label. If the exact time is unknown, record the date only rather than guessing.
