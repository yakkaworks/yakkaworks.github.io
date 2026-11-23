"""Copy tracked artwork and the JSON catalog into the completed MkDocs site."""
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]

# Stable website filenames in docs/assets/img/.
ASSET_FILES = (
    "background-dl.jpg",
    "background-dp.jpg",
    "background-ll.jpg",
    "background-lp.jpg",
    "banner-home.jpg",
    "banner-store.jpg",
    "banner-library.jpg",
    "banner-tools.jpg",
    "banner-blogs.jpg",
    "content-cards-placeholders.jpg",
    "cover.jpg",
    "icon-kustom.png",
    "icon-map.png",
    "icon-misc.png",
    "icon-plugin.png",
    "theotown-icon.png",
    "icon-tut.png",
    "icon-webexclusive.png",
)


def on_post_build(config, **kwargs):
    # Source artwork is tracked in docs/; copy byte-for-byte into the
    # output root so site-root-relative URLs work on every language route.
    source_dir = ROOT / "docs" / "assets" / "img"
    missing = [name for name in ASSET_FILES if not (source_dir / name).is_file()]
    if missing:
        raise FileNotFoundError(
            "Missing tracked site artwork in docs/assets/img/: "
            + ", ".join(missing)
        )

    image_dir = Path(config["site_dir"]) / "assets" / "img"
    image_dir.mkdir(parents=True, exist_ok=True)
    for name in ASSET_FILES:
        shutil.copy2(source_dir / name, image_dir / name)

    source = ROOT / "webdata"
    target = Path(config["site_dir"]) / "webdata"
    if source.exists():
        if target.exists():
            shutil.rmtree(target)
        shutil.copytree(source, target)

# Keep source Markdown page-relative while allowing MkDocs' source-tree link
# validator to recognize shared images stored outside docs/. The rendered HTML
# is converted back to a route-relative URL after the page has been rendered.
def on_page_markdown(markdown, **kwargs):
    return re.sub(
        r'(["\'(])(?:\.\./)+webdata/img/',
        r'\1/webdata/img/',
        markdown,
    )


def on_post_page(output, page, **kwargs):
    depth = len([part for part in page.url.strip("/").split("/") if part])
    relative = "../" * depth + "webdata/img/"
    return re.sub(
        r'(["\'(])/webdata/img/',
        lambda match: match.group(1) + relative,
        output,
    )
