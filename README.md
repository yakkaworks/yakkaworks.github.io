# Yakka Works — website source

This branch contains the in-progress MkDocs Material rebuild of the Yakka Works website.

> **Preview branch:** `y2k-dev`  
> **Status:** scaffold and visual preview. The content pages have intentionally not been migrated yet.

## Scope of this branch

The rebuild starts with the site structure, brand system, navigation indexes, legal-page placeholders, and a debug page. Store, library, tools, blog articles, and other substantive content will be brought over in a later, separately reviewed step.

The current build keeps the existing MkDocs plugins:

- Search
- Static i18n
- Awesome Pages
- Blog
- Redirects

The GitHub Actions workflow runs a strict MkDocs build on development branches. Deployment remains restricted to the existing live deployment branch; pushing to `y2k-dev` does not publish this preview as the production website.

## Run locally

Requirements: Git and Python 3.9 or newer.

### Windows

From the repository root, run:

```bat
dev-tool\install.bat
dev-tool\serve.bat
```

### Linux

From the repository root, run:

```bash
bash dev-tool/install.sh
bash dev-tool/serve.sh
```

The preview is served at [http://127.0.0.1:8000/](http://127.0.0.1:8000/). Press Ctrl+C in the terminal to stop it.

For Termux/PRoot, use `bash dev-tool/serve-termux.sh`. The helper scripts create a project-local `.venv`; they do not install MkDocs into the system Python.

## Development commands

All user-facing command wrappers live in `dev-tool/`. Their implementation files live in `dev-tool/scripts/`.

| Command | Windows | Linux | Purpose |
| --- | --- | --- | --- |
| Install | `dev-tool\install.bat` | `bash dev-tool/install.sh` | Create/update the local Python environment |
| Preview | `dev-tool\serve.bat` | `bash dev-tool/serve.sh` | Start the local live-reload server |
| Update | `dev-tool\update.bat` | `bash dev-tool/update.sh` | Pull the configured upstream (when present) and upgrade dependencies |
| Pull | `dev-tool\pull.bat` | `bash dev-tool/pull.sh` | Compatibility alias for update |
| Push | `dev-tool\push.bat` | `bash dev-tool/push.sh` | Run a strict build, then push only to `y2k-dev` |
| Sync live | `dev-tool\sync.bat` | `bash dev-tool/sync.sh` | Clone/update `mkdocs-site-live` separately in `live-sync/` |

The push command refuses protected branches and never force-pushes. It checks the site with `mkdocs build --strict` before committing or pushing.

## Project layout

```text
.
├── LICENSE                 # Repository's existing root license
├── README.md               # Branch overview and quick start
├── mkdocs.yml              # MkDocs, theme, plugin, and brand configuration
├── requirements.txt        # Python dependencies
├── docs/
│   ├── assets/
│   │   ├── css/             # Yakka Works theme styling
│   │   ├── fonts/           # Body, header, and display typefaces
│   │   ├── img/             # Cover and light/dark background variants
│   │   ├── js/              # Small site-side scripts
│   │   └── logo/            # Logo and favicon assets
│   ├── index.md             # Indonesian homepage placeholder
│   ├── index.en.md          # English homepage placeholder
│   ├── store/               # Store index only for now
│   ├── library/             # Library index only for now
│   ├── tools/               # Tools index only for now
│   ├── blogs/               # Blog index only for now
│   ├── debug.md             # Theme and build diagnostics
│   └── *.md                 # Legal-page placeholders
├── dev-tool/
│   ├── *.bat / *.sh         # Windows and Linux command wrappers
│   ├── scripts/             # Shared PowerShell and Bash implementations
│   └── readmes/             # Human and AI maintenance notes
├── hooks/                   # MkDocs build hooks
└── overrides/               # Material theme template overrides
```

## Branding and metadata

- Primary brand green: `#4d8b31`.
- Action/CTA orange: `#ff8427`; use it sparingly.
- Supporting colours are muted pastel greens, mint, lilac, peach, and soft yellow.
- `body.ttf`, `header.ttf`, and `display.ttf` are loaded locally from `docs/assets/fonts/`.
- `docs/assets/img/cover.jpg` is the site-wide social preview image.
- Background files use `background-[a][b].jpg`: `a` is theme (`l` light, `d` dark) and `b` is orientation (`l` landscape, `p` portrait).
- Theme assets must live under `docs/assets/`: MkDocs publishes files from `docs_dir` (currently `docs/`) and does not serve arbitrary files from the repository root.
- The SEO description is generated from the first rendered paragraph of each page. The title format is `[page title] - Yakka Works`.

## Content and language conventions

The i18n plugin uses suffix-based pages. Keep Indonesian and English pages paired:

- `index.md` — default Indonesian page
- `index.en.md` — English counterpart

Use `.pages` files for Awesome Pages ordering and titles. Avoid adding real content pages until the content-migration stage is agreed.

Legal pages in this preview are placeholders, not a final legal review. The repository-level `LICENSE` file is retained at the project root.

## Before pushing

Run the local preview and check both language versions, light/dark palettes, portrait/mobile layout, navigation, footer links, and metadata. Then run:

```bash
.venv/bin/python -m mkdocs build --strict
```

On Windows, use `.venv\Scripts\python.exe -m mkdocs build --strict`.

See `dev-tool/readmes/for-yakka.md` for the beginner-friendly maintenance guide and `dev-tool/readmes/ai-instruct.md` for AI-agent rules.
