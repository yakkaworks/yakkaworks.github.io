# AI Working Notes — Yakka Works MkDocs Redesign

This file is the durable instruction/context note for AI assistants working in this repository. Read it before modifying files.

## Repository and branch

- Repository: `yakkaworks/yakkaworks.github.io`
- Current redesign branch: `y2k-portal-dev`
- Base branch: `mkdocs-site`
- Existing branches that must remain untouched unless Yakka explicitly says otherwise:
  - `main`
  - `web-live`
  - `mkdocs-site`
  - `mkdocs-site-live`
- Never push this redesign to any branch other than `y2k-portal-dev`.
- Never force-push.
- Do not merge or deploy without explicit user approval.
- Before GitHub writes, verify the target branch. Create a separate development branch before making changes if the requested branch does not already exist.

## User's intent and design direction

The site is a **Y2K-inspired retro web portal**, not a Neocities collage and not a desktop-environment simulation.

Design constraints:
- Primary brand green: `#4D8B31`.
- Portal content width: approximately 800–850px (currently 850px).
- Typography baseline: 16px.
- Crisp 1px borders, square corners, hard offset shadows.
- Light and dark themes.
- Background assets may vary by orientation and color scheme.
- No floating elements by default.
- Bootstrap-like modules, dialogs, popups, and modals are acceptable when a feature calls for them.
- The visual reference is the structured web portal; desktop/file-manager/media-player/IRC references are optional inspiration for isolated components only.

## Architecture decision

Yakka explicitly chose to replace Material's main templates with custom templates while retaining Material as the underlying framework and preserving its functionality/plugins.

Use:
- MkDocs for build and content pipeline.
- Material for MkDocs for framework behavior, plugins, search/palette infrastructure, and existing integrations.
- Custom Jinja templates in `overrides/` for page structure.
- CSS as the primary customization layer.
- Existing Material JavaScript unless there is a demonstrated need for custom JS.
- Custom JavaScript only for behavior that cannot be achieved cleanly with CSS or existing Material functionality.

Do not rewrite Material's JavaScript or replace plugins just to change appearance. When overriding a Material partial, preserve required data attributes, IDs, toggle controls, and partial includes.

## Current important paths

- `mkdocs.yml`: configuration.
- `requirements.txt`: dependency version ranges.
- `docs/`: published Markdown and static assets.
- `docs/assets/css/extra.css`: local fonts and existing styles.
- `docs/assets/css/portal.css`: new Y2K portal styles; loaded after extra.css.
- `docs/assets/fonts/`: local fonts.
- `docs/assets/img/`: images and expected background assets.
- `docs/assets/js/`: existing browser-side scripts.
- `overrides/main.html`: custom main content template, extends Material base.
- `overrides/partials/header.html`: custom portal header.
- `overrides/partials/footer.html`: custom portal footer.
- `hooks/year.py` and `hooks/plugin_order.py`: build hooks; plugin-order hook is load-bearing.
- `dev-tools/windows/`: new branch-specific Windows PowerShell scripts and CMD wrappers.
- `scripts/` and root-level `.bat`/`.sh` files: existing commands; do not repurpose for this branch.
- `site/`: generated output; never hand-edit.

## Current MkDocs configuration facts

- `docs_dir: docs`
- `site_dir: site`
- `theme.name: material`
- `theme.custom_dir: overrides`
- Indonesian is default; English source pages use `.en.md`.
- Navigation is driven by Awesome Pages `.pages` files; no top-level `nav:` is intentionally configured.
- Plugins include search, static i18n, Awesome Pages, Material blog, and redirects.
- Markdown extensions include admonition, footnotes, pymdownx details/superfences/highlight and others.
- CSS load order includes `extra.css` then `portal.css`.
- Current Python dependency ranges are in `requirements.txt`; do not casually unpin or upgrade them.
- `hooks/plugin_order.py` exists to handle i18n/Material blog plugin ordering. Do not remove it without testing.

## Current custom template behavior

- `overrides/main.html` extends `base.html`.
- It suppresses Material's default tabs block because custom portal navigation is in the header partial.
- It provides a metadata strip, content body, and EOF closing strip.
- It retains Material's tags, actions, source-file, feedback, and comments partials.
- `overrides/partials/header.html` creates a brand bar, search launcher, and navigation based on `nav.items`; it includes Material's search partial.
- `overrides/partials/footer.html` uses `config.extra.brand`, `config.extra.socials`, and `config.extra.donate` values.
- Check the exact installed Material version's upstream templates before changing overrides. Do not assume template blocks or partial signatures are stable across versions.

## Known incomplete / unverified work

- Four optional background files are referenced by CSS but were not present in `docs/assets/img/` at last inspection:
  - `background-ll.jpg`
  - `background-ld.jpg`
  - `background-pl.jpg`
  - `background-pd.jpg`
- Homepage content has not been fully rewritten; existing information architecture/content should be preserved unless Yakka asks for a redesign.
- A CSS pass was added to adapt homepage modules, but no browser screenshot review was performed.
- The template/CSS changes were committed to `y2k-portal-dev`, but a local `mkdocs build --strict` and browser validation were not performed at that point.
- Do not report the redesign as build-verified until an actual build succeeds.

## Collaboration rules

1. Yakka is learning MkDocs. Explain meaningful changes and why they work; avoid treating the repo as a black box.
2. Prefer small, reviewable changes. Explain which layer is being changed: config, content, plugin/hook, template, CSS, or JS.
3. Do not make broad architectural changes without asking first.
4. Do not overwrite existing root-level scripts. New branch-specific Windows commands belong in `dev-tools/windows/`.
5. Before editing a file, inspect its current contents on the target branch.
6. After writing, fetch/read back the changed file(s) and verify the branch.
7. If possible, run strict build and inspect the generated output before claiming success.
8. Do not invent successful tests, previews, deployments, or CI results.
9. Avoid unnecessary dependencies. CSS-first is the agreed approach.
10. Keep secrets, tokens, and local Cloudflare files out of the public repository.

## Windows command set

New command folder: `dev-tools/windows/`.

The scripts must resolve the repository root from two levels above `$PSScriptRoot`, not from a fixed local path. They must work whether the user clones to `D:\yakkaworks-site\mkdocs-dev\` or another directory.

The branch-specific push script must:
- target only `y2k-portal-dev`;
- verify the current checked-out branch is `y2k-portal-dev`;
- verify the origin URL belongs to this repository;
- run `mkdocs build --strict` before committing;
- never force-push;
- refuse protected branch names (`main`, `master`, `web-live`, `mkdocs-site`, `mkdocs-site-live`).

## Expected next tasks

1. User clones `y2k-portal-dev` into a new local folder.
2. Run `dev-tools/windows/serve.cmd` and confirm the project builds/serves.
3. Fix actual template/CSS errors revealed by the build/browser, not hypothetical ones.
4. Review responsive layout, navigation, search, palette, page actions, feedback/comments.
5. Add the four background images only when Yakka provides/selects them.
6. Continue redesign section-by-section while retaining content and plugin behavior.
