# AI agent instructions — Yakka Works website

These instructions apply to coding agents and assistants working in this repository.

## Read first

Before making changes, read:

1. The root `README.md` for the project map and branch workflow.
2. `dev-tool/readmes/for-yakka.md` for the maintainer's preferred practical workflow.
3. `dev-tool/readmes/ai-context-bank.md` for the latest shared project state.
4. `dev-tool/readmes/content-layout.md` for content-card and detail-page authoring rules.
5. The relevant source files and the current Git branch before editing.

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
- Every published Markdown page should have a `date: dd-mm-yy` front-matter field (for example, `20-11-26`). Display that page publication/creation date at the far-right of the document metadata bar as `dd/mmm/yyyy`; preserve an ISO `datetime` value in the rendered `<time>`.
- JSON `date` fields are metadata for chronological sorting only. Never use JSON content dates as page-header dates or render them inside content cards.
- The Blog index uses Material's `blog.html` container and a JavaScript-generated document frame. Its header date must come from the index Markdown front matter, exposed through head metadata for `y2k-clock.js`; never derive the header date from JSON catalog entries.

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

## Shared context bank maintenance — mandatory

Maintain `dev-tool/readmes/ai-context-bank.md` as a compact current-state handoff, not a chronological log.

- Update the bank after every **5 user-facing assistant responses** in the work sequence. Count responses shown to the owner; do not count tool calls, internal reasoning, or progress operations.
- Also update it after a major milestone or handoff when the current state materially changes; five responses is the maximum interval, not a reason to delay an important update.
- Each update should capture only durable current context: completed work since the prior snapshot, important files/systems changed, branch and latest commit when known, build/test status, open risks, and the next concrete action.
- Periodically **collapse and rewrite** the bank. Remove resolved issue logs, superseded implementations, obsolete measurements, old commit-by-commit history, and completed task notes. Replace stale or contradictory status rather than appending another snapshot.
- Preserve only decisions and constraints that still affect future work, current branch/build state, and genuinely open actions. Put durable procedures and agent rules in this instruction file instead of the bank.
- Keep the bank short enough to scan quickly. Do not turn it into an archive.
- Use Jakarta time (WIB, UTC+7) for timestamps, in exactly this format: `(yyyy-mm-dd hh-mm (Jakarta time))`, using a 24-hour clock. If the exact time is unknown, record the date only; never guess the time.
- If an agent cannot update the repository, provide the exact proposed bank update to the owner and state that it was not saved. Reset the response counter after a successful bank update.

## Markdown image paths and bilingual routes

- Use **page-relative URLs** for internal assets in Markdown and HTML, including shared artwork copied to `site/assets/img/`. Do not use site-root-relative URLs such as `/assets/img/banner-tools.jpg`; these can fail to load on English routes.
- Calculate the relative path from each page's published URL to the asset directory. For example, a page at `/en/store/` uses `../../assets/img/example.jpg`, while a nested page at `/en/store/items/example/` uses `../../../../assets/img/example.jpg`. Do not assume one relative prefix works for every route depth.
- Apply the same rule to other internal asset directories, such as `webdata/img/`; keep external URLs unchanged.
- `hooks/site_assets.py` copies the root `webdata/` directory into the site output. Its page hooks temporarily normalize relative `webdata/img/` references for MkDocs link validation, then rewrite rendered HTML back to route-relative URLs. Preserve this behavior; do not replace the final relative URLs with root-relative ones.
- When adding or editing image references, inspect all affected language variants and verify the generated URL resolves from each actual page route. A successful strict build alone does not verify that the image file exists at the requested URL.

## Communication style

Report completed work in a concise TL;DR. Distinguish clearly between changes actually committed, checks actually run, and recommendations that still need owner review. Flag uncertain assumptions rather than inventing answers.

## Owner pull-and-preview command — mandatory after every change

After **every** response that changes repository files (code, CSS, templates, config, docs), the agent must end its output with a short **Reminders** line telling the owner to pull the latest `y2k-dev` and restart the preview, using exactly this Windows command:

```bat
cd /d "D:\yakkaworks-site\y2k-dev-mkdocs-git" && git pull --ff-only origin y2k-dev && dev-tool\serve.bat
```

Rules:

- Only say this after the change has actually been committed **and pushed** to `y2k-dev`. If the agent could not push, say so plainly and give the owner the patch or exact edits to apply instead; do not tell the owner to pull changes that are not on GitHub yet.
- Do not shorten, reword, or change the path or branch in the command. If the local folder path or branch ever changes, update this section and `for-yakka.md` in the same commit.
- If the preview server is already running, remind the owner to stop it with Ctrl+C first, then run the command.
- `--ff-only` is intentional: if the pull fails because of local edits or diverged history, the owner should report the error rather than force anything.


## Custom layout maintenance

- The visible navigation is authored in `overrides/partials/header.html`, directly after the brand header. Do not depend on Material's `nav.items` / automatic tabs renderer for the primary links; it previously failed to render in the custom layout.
- `overrides/main.html` intentionally empties the Material tabs block to prevent a duplicate navigation row.
- Navigation destinations must remain paired for Indonesian and English builds. Keep the current route active state for each section.
- Navigation, main document, and footer share an 800px desktop maximum width and use a 0.5rem mobile side gutter.
- Navigation is normal-flow only; never set it to sticky or fixed.
- Dark mode uses the dark city image variants background-dl.jpg / background-dp.jpg with a strong neutral green-black overlay. Preserve this darkened city backdrop; do not replace it with a plain solid colour unless explicitly requested.
- The owner is now editing presentation details directly on GitHub. Inspect and preserve those edits before making further changes. Current owner preferences: social links column before legal links; header max-width 900px with 0.5rem vertical margin; thanks text and EOF marker omitted.
- Preserve the exact brand colours: primary `#4d8b31`, CTA `#ff8427`. Derive supporting pastel colours from them, and continue using the local Body/Header/Display TTFs.


## Header, search and navigation source of truth

- `overrides/partials/header.html` owns the first two header rows: branded logo/name with Material palette and language controls, followed by the always-visible full-width native Material search row.
- Keep Material's `partials/search.html` markup intact. Do not replace its input or result templates with a homemade search implementation. Do not place `.md-search` inside the header controls flex group.
- The native Material search parent must retain the `.md-header` class so Material's checked-toggle selectors and search-result behavior continue working. Adapt the search inner form/overlay/output through scoped CSS in `.yw-search-row`, not broad selectors.
- `overrides/partials/navigation.html` owns the explicit Home/Store/Library/Tools/Blog links and localized labels.
- `overrides/main.html` renders that custom nav via the normal-flow `tabs` block. Keep it separate from the header partial.
- `docs/assets/css/y2k.css` must set the full `.yw-nav` bar itself to the same 900px width as the search row, `.md-main__inner`, and `.yw-footer`; links are left-aligned and the bar has a visible brand-derived background.
- Keep the nav in normal document flow, never sticky/fixed.
- Donation links belong in `.yw-page__signature` at the end of the document. The owner has removed the thanks-for-reading sentence and `[ EOF ]` marker; preserve that preference unless asked to restore them. The global footer must not repeat a support banner.


## Header row spacing and background treatment

- Header row order: compact brand/control bar, neutral full-width Material search row, then custom navigation.
- Remove vertical margins between these three rows. They are meant to touch without gaps.
- Brand row target height: 56px desktop and 54px mobile.
- Search and navigation widths match the 800px document/footer column, with a 0.5rem mobile gutter.
- The search wrapper may be a custom neutral-coloured div, but the Material search partial/input/results remain native.
- Dark mode keeps the city background image with a strong dark overlay; use the landscape/portrait dark variants.


## Latest nav tab styling

- Keep the brand row bottom border visible and keep the neutral search row's existing appearance.
- There must be no vertical gap between brand row, search row, and nav row. The parent header has no bottom margin; nav has no top margin.
- Nav outer background is the exact brand green `#4d8b31`, with a green-shade top border. Individual inactive tabs use a darker green shade. The active tab uses an orange `#ff8427` top border; do not use a bottom underline for active state.
- Avoid changing the search row when adjusting nav colours or borders.


## Blog signature and search width hotfix

- `docs/assets/js/y2k-clock.js` is the source of the JS-generated Blog document frame. It must append only the support links to `.yw-page__signature`; do not add the old star/thanks sentence or `[ EOF ]` marker. Declare `isEnglish` from `document.documentElement.lang` before using it.
- `docs/assets/js/blog-layout-cleanup.js` is a post-load compatibility cleanup for stale cached Blog scripts. It removes legacy `.yw-page__thanks` and `.yw-page__eof` elements only on `/blogs/` routes.
- Both scripts are listed in `mkdocs.yml` after the main style script. Keep the cleanup script loaded after `y2k-clock.js`.
- Search alignment: all wrappers from `.yw-search-row` down through `.md-search__form` must fill 100% of the 900px header, with no default horizontal margin or padding. Keep Material's search partial and result engine unchanged.
- The current shared layout width is **900px**, not the older 800px values in historical notes; mobile uses a 0.5rem gutter.


## Artwork and image assets

- The source-of-truth artwork files live directly in `docs/assets/img/`. The supplied `dev-tool/readmes/Website's.zip` is a transfer archive only: extract its files into this folder, verify them, and delete the ZIP. Do not make builds depend on the archive.
- `hooks/site_assets.py` validates the tracked artwork set and copies it byte-for-byte into `site/assets/img/` during `on_post_build`. Keep the source assets in `docs/`; do not add image resizing, cropping, placeholder generation, or Pillow.
- Stable artwork names: `background-dl.jpg`, `background-dp.jpg`, `background-ll.jpg`, `background-lp.jpg`; `banner-home.jpg`, `banner-store.jpg`, `banner-library.jpg`, `banner-tools.jpg`, `banner-blogs.jpg`; `content-cards-placeholders.jpg`; and `cover.jpg`.
- Category icons are `icon-kustom.png`, `icon-map.png`, `icon-misc.png`, `icon-plugin.png`, `theotown-icon.png`, `icon-tut.png`, and `icon-webexclusive.png`. The archive's `icon-theotown.png` is stored as `theotown-icon.png` to preserve the established website filename.
- Keep category icons crisp with `image-rendering: pixelated` on `.yw-nav-card img`; do not apply that to photographic banners or card thumbnails.
- Use `content-cards-placeholders.jpg` for example article/content thumbnails. The content-grid renderer uses it when a JSON item has no thumbnail or its image fails to load.
- Individual TheoTown plugin thumbnails/previews are a separate asset set: copy only verified matching image files from `mkdocs-site`'s `docs/webdata/img/` into `webdata/img/`. Keep their original filenames; update both localized detail-page lead images and both JSON catalogue `thumbnail` values to the same `/webdata/img/<filename>` URL. Do not copy general site artwork or unrelated content from that branch.
- Internal image references in Markdown must be page-relative, with the `../` depth calculated from each page's published URL. Do not use `/assets/...` root-relative asset URLs; verify the relative path separately for every language variant and route depth.
