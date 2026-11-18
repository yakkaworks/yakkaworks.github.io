# Notes for Yakka — Learning MkDocs & the Yakka Works site

> Personal working notes for understanding, maintaining, and gradually redesigning this site. This is a learning document, not a substitute for the official MkDocs documentation.

## 1. The mental model

MkDocs is a static-site generator. It takes source files and turns them into a folder of ready-to-serve HTML, CSS, JavaScript, images, and other assets.

The basic pipeline is:

`Markdown + YAML config + plugins/hooks + theme templates + assets → HTML site`

In this repository:

- **MkDocs** coordinates the build.
- **Material for MkDocs** supplies the theme, navigation/search infrastructure, accessibility behavior, and many UI integrations.
- **Plugins** extend the build (search, translations, blog, automatic navigation, redirects).
- **Hooks** run Python code at defined points in the build.
- **Jinja templates** determine the HTML structure.
- **CSS** determines presentation.
- **JavaScript** adds browser-side interactions.
- **GitHub Actions** checks/builds/deploys the generated site.

A useful distinction: MkDocs does not run a traditional server-side application for each visitor. The build happens ahead of time; visitors receive static files.

## 2. Important repository paths

| Path | Purpose |
|---|---|
| `mkdocs.yml` | Main site configuration: theme, plugins, extensions, paths, metadata |
| `requirements.txt` | Python package dependencies and version ranges |
| `docs/` | Published source content and static assets |
| `docs/**/*.md` | Pages written in Markdown |
| `docs/.pages` and nested `.pages` | Navigation labels/order for Awesome Pages |
| `docs/assets/css/extra.css` | Existing brand styles and local font declarations |
| `docs/assets/css/portal.css` | New Y2K portal overrides |
| `docs/assets/fonts/` | Locally hosted fonts |
| `docs/assets/img/` | Shared images/backgrounds |
| `docs/assets/js/` | Browser-side scripts |
| `overrides/` | Custom Material Jinja templates (configured as `theme.custom_dir`) |
| `overrides/main.html` | Custom page content frame |
| `overrides/partials/header.html` | Custom portal header/search/navigation |
| `overrides/partials/footer.html` | Custom portal footer |
| `hooks/` | Python build hooks |
| `templates/` | Reusable Markdown starters; not published as pages |
| `scripts/` | Existing cross-platform project scripts |
| `dev-tools/windows/` | Windows command set specifically for `y2k-portal-dev` |
| `site/` | Generated output; do not edit by hand or commit |
| `.venv/` | Local Python environment; do not commit |

The configured paths are explicit in `mkdocs.yml`:

- `docs_dir: docs`
- `site_dir: site`
- `theme.name: material`
- `theme.custom_dir: overrides`

## 3. How a Markdown page becomes a web page

1. Put a `.md` file inside `docs/`.
2. MkDocs reads the file and its optional YAML front matter.
3. Markdown extensions convert Markdown features into HTML.
4. Plugins can transform pages, add navigation, generate blog pages, translate pages, or create redirects.
5. MkDocs/Material renders the page through Jinja templates.
6. CSS and JavaScript are copied/referenced as configured.
7. The final output is written to `site/`.

For a simple content edit, you normally only need to edit a Markdown file. For a layout change, edit a template. For a visual change, edit CSS. For a new interactive browser feature, JavaScript may be appropriate.

## 4. Configuration: `mkdocs.yml`

YAML is indentation-sensitive. Use spaces, not tabs. A nested setting belongs under its parent key.

Important sections in this project:

- `site_name`, `site_description`, `site_url`: site metadata.
- `docs_dir`, `site_dir`: source and output directories.
- `hooks`: Python hooks loaded during builds.
- `theme`: Material configuration and custom template directory.
- `markdown_extensions`: Markdown syntax/features.
- `plugins`: search, i18n, Awesome Pages, blog, redirects.
- `extra_css`: CSS files loaded by generated pages.
- `extra_javascript`: browser scripts.
- `extra`: custom values exposed to templates as `config.extra`.

Do not add a `nav:` block casually. This site intentionally uses Awesome Pages and `.pages` files to build navigation. See `docs/.pages` and the section-level `.pages` files.

## 5. Content and navigation

- Indonesian is the default language: `page.md`.
- English translation: `page.en.md`.
- The i18n plugin builds the English version below `/en/`.
- New Markdown files in the content folders can be discovered automatically.
- `.pages` files control labels and ordering; they are not ordinary content pages.
- Root legal pages are excluded from normal navigation through `not_in_nav` in `mkdocs.yml`.

When linking to shared assets from bilingual pages, prefer root-relative paths such as `/webdata/img/example.jpg` where appropriate. Relative paths can accidentally resolve under `/en/`.

## 6. Theme templates: Jinja and Material

A theme template is not a Markdown page. It is a Jinja template that produces HTML.

Material ships a template hierarchy. The custom directory overrides matching template paths while missing templates can still come from Material. This is why `overrides/` can contain only the pieces we want to replace.

Current custom templates:

- `overrides/main.html` extends Material's `base.html`, suppresses the default tabs block, and replaces the main content block.
- `overrides/partials/header.html` creates the portal header and uses Material's search partial.
- `overrides/partials/footer.html` creates the custom footer using values from `config.extra`.

Jinja basics worth learning:

- `{{ value }}` prints a value.
- `{% if condition %} ... {% endif %}` is conditional output.
- `{% for item in items %} ... {% endfor %}` repeats markup.
- `{% include "partials/example.html" %}` includes another template.
- `{% extends "base.html" %}` inherits a parent template.
- `{% block content %} ... {% endblock %}` replaces a named parent block.

Important: when overriding Material templates, preserve the partials and data attributes required by Material's JavaScript. A template can look correct but silently break search, palette switching, feedback, comments, or other features if its expected markup is removed.

The custom templates intentionally keep Material's search UI, page actions, tags, source-file information, feedback, and comments partials. If a Material feature stops working after a template change, compare the override with the matching template from the exact installed Material version.

## 7. CSS: the preferred customization layer

The redesign is primarily CSS-driven.

- `extra.css` retains the local font declarations and existing project styles.
- `portal.css` is the newer portal-specific layer, loaded after `extra.css`.
- CSS variables centralize colors, borders, surfaces, spacing-related values, and widths.
- Material exposes many CSS variables beginning with `--md-`.
- Site-specific classes use the `yw-` prefix.

When changing a style, first inspect whether the element already has a class or Material variable you can override. Prefer a targeted selector over broad global selectors. Avoid adding JavaScript for something CSS can do reliably.

The visual direction is a structured Y2K-inspired web portal:

- Primary green: `#4D8B31`.
- Main portal width: approximately 850px.
- Body typography: 16px baseline.
- Crisp borders, square corners, hard offset shadows.
- Light and dark color schemes.
- Responsive layout without default floating/collage elements.

The current CSS references four optional backgrounds in `docs/assets/img/`:

- `background-ll.jpg`: landscape, light mode.
- `background-ld.jpg`: landscape, dark mode.
- `background-pl.jpg`: portrait, light mode.
- `background-pd.jpg`: portrait, dark mode.

Those assets must exist before the background treatment can be considered complete. The current homepage still contains existing content and structure; its styling is being adapted rather than its information architecture being replaced wholesale.

## 8. Plugins and hooks in this project

The current configuration uses:

- `search`: builds the local search index.
- `i18n` (`mkdocs-static-i18n`): Indonesian/English page variants.
- `awesome-pages`: navigation from `.pages` files.
- `blog`: blog posts, categories, archives, and pagination.
- `redirects`: old URL redirects.

The Python hooks include:

- `hooks/year.py`: supplies the current year to templates.
- `hooks/plugin_order.py`: important compatibility ordering for i18n and the Material blog plugin.

Do not remove or reorder these casually. The README explains why the plugin-order hook is load-bearing.

## 9. Local development on Windows

The new branch-specific commands are in `dev-tools/windows/`. They resolve the repository root two levels above that folder, so they do not depend on a fixed drive or clone directory.

From PowerShell, run:

```powershell
.dev-toolswindowsserve.ps1
```

Or double-click/use the matching `.cmd` wrappers:

| Command | Purpose |
|---|---|
| `serve.cmd` | Install missing dependencies, then run live preview |
| `install.cmd` | Create/reinstall the local Python environment |
| `update.cmd` | Pull the current branch if it has an upstream, then upgrade dependencies |
| `push.cmd` | Strict build, commit, and push to `y2k-portal-dev` only |
| `sync.cmd` | Clone/update `mkdocs-site-live` in a separate `live-sync/` folder |

Preview address: <http://127.0.0.1:8000/>. Stop the server with Ctrl+C.

Python 3.9+ and Git for Windows are required. The scripts create a repository-local `.venv/`; dependencies are installed from `requirements.txt`.

## 10. Useful MkDocs commands

Run these from the repository root with the local Python environment:

```powershell
# Preview with live reload
..venvScriptspython.exe -m mkdocs serve

# Build the static site
..venvScriptspython.exe -m mkdocs build

# Strict build: warnings are errors (used before pushing)
..venvScriptspython.exe -m mkdocs build --strict

# Show installed package versions
..venvScriptspython.exe -m pip list
```

The generated site is in `site/`. Inspect it locally; do not edit its files because the next build overwrites them.

## 11. Debugging checklist

When a page is missing:

1. Is the Markdown file under `docs/`?
2. Is the filename correct for the language (`.md` or `.en.md`)?
3. Is a `.pages` file excluding or misnaming it?
4. Does `not_in_nav` intentionally exclude it?
5. Did the i18n plugin build the expected language variant?

When a template is not being used:

1. Is `theme.custom_dir: overrides` still configured?
2. Is the override path identical to the Material template path?
3. Does the custom template extend/include the correct parent/partials?
4. Is the template syntax valid Jinja?

When CSS does not apply:

1. Check browser DevTools: is `portal.css` loaded?
2. Check the asset URL and browser console for 404s.
3. Check whether a more specific Material selector overrides it.
4. Inspect computed styles before adding `!important`.
5. Hard-refresh after changes if the browser cached the stylesheet.

When a build fails:

1. Read the first meaningful traceback/error, not only the final summary.
2. Check YAML indentation and Jinja syntax.
3. Run `mkdocs build --strict`.
4. Check plugin compatibility and pinned dependency versions.
5. Avoid changing multiple unrelated layers at once.

## 12. Safe workflow and branch roles

This redesign lives on `y2k-portal-dev`.

- `main`: legacy/archive; do not use for this work.
- `web-live`: old static website archive; leave untouched.
- `mkdocs-site`: existing MkDocs development/source branch; leave untouched during this redesign.
- `mkdocs-site-live`: production branch; do not push directly.
- `y2k-portal-dev`: this redesign's development branch.

The new Windows push command refuses to run unless the checked-out branch is exactly `y2k-portal-dev`. It performs `mkdocs build --strict` before committing and never force-pushes.

Do not merge or deploy until the local build and rendered pages have been reviewed.

## 13. What to learn next

A practical learning order:

1. Markdown and YAML.
2. MkDocs configuration and directory structure.
3. Plugins and Markdown extensions.
4. Jinja inheritance, blocks, loops, conditionals, and includes.
5. CSS cascade, specificity, variables, grid, flexbox, and media queries.
6. Material's template structure and JavaScript expectations.
7. Python hooks and build lifecycle.
8. Git branches, commits, pull requests, and deployment.

Useful official references:

- [MkDocs documentation](https://www.mkdocs.org/)
- [MkDocs configuration](https://www.mkdocs.org/user-guide/configuration/)
- [Writing your docs](https://www.mkdocs.org/user-guide/writing-your-docs/)
- [MkDocs Material documentation](https://squidfunk.github.io/mkdocs-material/)
- [Material customisation](https://squidfunk.github.io/mkdocs-material/customization/)
- [Jinja template designer documentation](https://jinja.palletsprojects.com/en/stable/templates/)

---

**Learning reminder:** make one small change, preview it, inspect the generated result, and then make the next change. Understanding the pipeline is more valuable than accumulating overrides you cannot explain.
