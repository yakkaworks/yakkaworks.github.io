# AI Context Share — Yakka Works MkDocs Portal

**Last updated:** 2026-11-18  
**Repository:** https://github.com/yakkaworks/yakkaworks.github.io  
**Working branch:** `y2k-portal-dev`  
**Base branch:** `mkdocs-site`

## Read first

For full working instructions and constraints, read:
- `notes-for-ai.md` — branch safety, architecture, design direction, current state, collaboration rules.
- `notes-for-yakka.md` — human-friendly explanation of MkDocs and this repository.

## Project summary

Yakka Works is redesigning its website as a custom MkDocs theme using Material for MkDocs underneath. The project is intentionally CSS-first and should preserve Material's useful search, palette, plugin, and page integrations.

The visual target is a structured Y2K-inspired retro web portal:
- green identity (`#4D8B31`);
- approximately 850px content width;
- 16px typography baseline;
- square modules, crisp borders, hard offset shadows;
- light/dark modes;
- responsive layout;
- no default floating/collage UI.

Do not turn the whole website into a desktop OS, file manager, IRC client, or Neocities collage. Those are optional inspirations for individual components only.

## Branch safety

All current redesign work belongs to `y2k-portal-dev`, created from `mkdocs-site`.

Do not modify or push to:
- `main`
- `web-live`
- `mkdocs-site`
- `mkdocs-site-live`

Never force-push, merge, or deploy without explicit approval.

## Main architecture

- MkDocs configuration: `mkdocs.yml`
- Content/static files: `docs/`
- Material custom templates: `overrides/`
- Existing fonts/brand CSS: `docs/assets/css/extra.css`
- Portal overrides: `docs/assets/css/portal.css`
- Python hooks: `hooks/`
- Requirements: `requirements.txt`

Custom templates:
- `overrides/main.html` extends Material `base.html`, suppresses default tabs, and supplies the page content frame.
- `overrides/partials/header.html` provides portal branding, search launcher, and nav.
- `overrides/partials/footer.html` provides copyright, brand/contact, socials, and legal links.

Material's existing partials for tags, actions, source info, feedback, comments, and search are intentionally retained. Preserve required markup and JS hooks when editing templates.

## MkDocs facts

- `docs_dir: docs`, `site_dir: site`.
- Theme: Material, custom templates: `overrides/`.
- Default language Indonesian; English source pages use `.en.md`.
- Awesome Pages `.pages` files control navigation; no `nav:` block is intentionally configured.
- Plugins: search, i18n, Awesome Pages, blog, redirects.
- `hooks/plugin_order.py` is important for i18n/Material blog compatibility.
- CSS is loaded in order: `extra.css`, then `portal.css`.

## Windows local workflow

New branch-specific commands are under `dev-tools/windows/`. They calculate the repository root relative to their own folder, so the local clone directory can be chosen freely.

- `serve.cmd`: create environment if needed and run live preview at http://127.0.0.1:8000/
- `install.cmd`: install/reinstall dependencies.
- `update.cmd`: update current branch and Python dependencies.
- `push.cmd`: strict build, commit, and push to `y2k-portal-dev` only.
- `sync.cmd`: clone/update production branch `mkdocs-site-live` into `live-sync/`.

Python 3.9+ and Git for Windows are needed. The scripts use a local `.venv/`.

## Current status / caveats

- First custom portal templates and CSS are committed to the dev branch.
- Homepage styling has a first pass; content/information architecture has not been comprehensively rewritten.
- CSS references four background images that are not present yet: `background-ll.jpg`, `background-ld.jpg`, `background-pl.jpg`, `background-pd.jpg`.
- No strict build or browser screenshot validation has yet been confirmed. Run the local build before assuming the templates are valid.
- Existing root scripts are legacy/current project tooling and should not be overwritten by the new branch-specific scripts.

## Immediate next step

After cloning `y2k-portal-dev`, run `dev-tools/windows/serve.cmd`. Fix any real build or runtime issues, then review the header, navigation, search, theme toggle, article layout, footer, and mobile behavior before expanding the redesign.
