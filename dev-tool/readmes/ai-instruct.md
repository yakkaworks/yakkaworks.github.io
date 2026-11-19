# AI agent instructions — Yakka Works website

These instructions apply to coding agents and assistants working in this repository.

## Read first

Before making changes, read:

1. The root `README.md` for the project map and branch workflow.
2. `dev-tool/readmes/for-yakka.md` for the maintainer's preferred practical workflow.
3. `dev-tool/readmes/ai-context-bank.md` for the latest shared project state.
4. The relevant source files and the current Git branch before editing.

Treat the repository files as the source of truth. Do not assume the previous conversation or an old summary reflects the current branch state.

## Project boundaries

- Work on `y2k-dev` unless the owner explicitly asks for another branch.
- This is a rebuild scaffold and preview, not a content migration.
- Do not copy old store, library, tool, blog, or other substantive content pages unless explicitly requested.
- Keep only the agreed indexes, legal pages/placeholders, and debug page until the content-migration stage.
- Preserve the root `LICENSE` file.
- Keep Windows and Linux helper commands inside `dev-tool/`; keep their implementation scripts in `dev-tool/scripts/`.
- Do not deploy or merge changes into the live branch unless the owner explicitly asks.
- Do not replace the Yakka Works identity with generic placeholder branding.

## Design tokens

- Primary brand green: `#4d8b31`.
- CTA/action orange: `#ff8427`; use sparingly.
- Supporting palette: muted pastel greens, mint, lilac, peach, and soft yellow.
- Use `body.ttf`, `header.ttf`, and `display.ttf` from `docs/assets/fonts/`.
- `docs/assets/img/cover.jpg` is the site-wide social cover.
- Background naming: `background-[a][b].jpg`, where `a=l/d` means light/dark and `b=l/p` means landscape/portrait.
- Page title format: `[page title] - Yakka Works`.
- Page meta description comes from the first rendered paragraph, via `hooks/meta_description.py`.

## Implementation expectations

- Keep the existing MkDocs plugins unless the owner specifically requests a change.
- Prefer small, maintainable changes over broad rewrites.
- Preserve bilingual page pairing and the suffix-based i18n setup.
- Keep navigation ordering in `.pages` files.
- Avoid adding unnecessary runtime dependencies.
- Do not silently change branch targets, deployment triggers, licensing, or public URLs.
- Update documentation when commands, paths, workflows, theme tokens, or project structure change.
- Never state that a build passed unless you ran it or verified the matching GitHub Actions run.
- Run `mkdocs build --strict` (or the equivalent venv command) after meaningful MkDocs/template/config changes.
- Review generated diffs and verify that no prohibited legacy content pages were copied.

## Shared context cadence — mandatory

Update `dev-tool/readmes/ai-context-bank.md` after every **5 user-facing assistant responses** in the work sequence. Count assistant responses shown to the user; do not count tool calls, internal reasoning, or progress tool operations.

Each update must be a compact TL;DR-style snapshot containing:

- What was completed since the previous snapshot.
- Important files or systems changed.
- Commit/branch state when known.
- Build/test result (passed, failed, or not run).
- Open issues, risks, and the next concrete step.

Keep the bank concise and useful to the next agent. Replace stale status rather than letting contradictory instructions accumulate; preserve a short dated history only when it helps explain an important decision. Reset the response counter to zero after updating it.

If an agent cannot write to the repository, it must provide the exact proposed context-bank update to the owner instead of pretending it was saved. Make an earlier update when a major handoff or state change occurs; the five-response rule is the maximum interval, not a reason to delay a critical update.

## Communication style

Report completed work in a concise TL;DR. Distinguish clearly between changes actually committed, checks actually run, and recommendations that still need owner review. Flag uncertain assumptions rather than inventing answers.


## Custom layout maintenance

- The visible navigation is authored in `overrides/partials/header.html`, directly after the brand header. Do not depend on Material's `nav.items` / automatic tabs renderer for the primary links; it previously failed to render in the custom layout.
- `overrides/main.html` intentionally empties the Material tabs block to prevent a duplicate navigation row.
- Navigation destinations must remain paired for Indonesian and English builds. Keep the current route active state for each section.
- Navigation, main document, and footer share an 800px desktop maximum width and use a 0.5rem mobile side gutter.
- Navigation is normal-flow only; never set it to sticky or fixed.
- Dark mode backdrop is intentionally a neutral solid dark colour; do not reintroduce the cover-image background in dark mode.
- Preserve the exact brand colours: primary `#4d8b31`, CTA `#ff8427`. Derive supporting pastel colours from them, and continue using the local Body/Header/Display TTFs.


## Header, search and navigation source of truth

- `overrides/partials/header.html` owns the custom Yakka Works brand header. Keep Material's native palette partial, language alternate partial, search toggle and search dialog here; do not replace these controls with decorative or nonfunctional HTML.
- `overrides/partials/navigation.html` owns the site's explicit Home/Store/Library/Tools/Blog links and localized labels.
- `overrides/main.html` renders that navigation via the `tabs` block. Do not move the nav back inside the header partial; the header block is outside Material's `.md-container`, while the tabs block is inside it.
- `docs/assets/css/y2k.css` must set the full `.yw-nav` bar itself to the same 800px width as `.md-main__inner` and `.yw-footer`; sizing only `.yw-nav__inner` leaves the background spanning the wrong area.
- Preserve Material's search dialog positioning. Do not set its `.md-search` element to `position: static` or put it inside a flex control group.
- Navigation remains in normal document flow, never sticky/fixed.
