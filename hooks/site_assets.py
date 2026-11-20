"""Prepare supplied site artwork and copy the site's JSON catalog into the build.

The original artwork archive lives in dev-tool/readmes/Website's.zip. The
standard-library ZIP reader copies images unchanged before MkDocs builds.
"""
from pathlib import Path
import shutil
import zipfile

ROOT = Path(__file__).resolve().parents[1]
ASSET_ARCHIVE = ROOT / "dev-tool" / "readmes" / "Website's.zip"
IMAGE_DIR = ROOT / "docs" / "assets" / "img"

# Archive filename -> stable website filename.
IMAGE_FILES = {
    "background_dl.jpg": "background-dl.jpg",
    "background_dp.jpg": "background-dp.jpg",
    "background_ll.jpg": "background-ll.jpg",
    "background_lp.jpg": "background-lp.jpg",
    "banner-home.jpg": "banner-home.jpg",
    "banner-store.jpg": "banner-store.jpg",
    "banner-library.jpg": "banner-library.jpg",
    "banner-tools.jpg": "banner-tools.jpg",
    "banner-blogs.jpg": "banner-blogs.jpg",
    "content-cards-placeholders.jpg": "content-cards-placeholders.jpg",
    "cover.jpg": "cover.jpg",
    "icon-kustom.png": "icon-kustom.png",
    "icon-map.png": "icon-map.png",
    "icon-misc.png": "icon-misc.png",
    "icon-plugin.png": "icon-plugin.png",
    "icon-theotown.png": "theotown-icon.png",
    "icon-tut.png": "icon-tut.png",
    "icon-webexclusive.png": "icon-webexclusive.png",
}


def on_pre_build(config, **kwargs):
    if not ASSET_ARCHIVE.is_file():
        raise FileNotFoundError(f"Site artwork archive not found: {ASSET_ARCHIVE}")

    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(ASSET_ARCHIVE) as archive:
        available = set(archive.namelist())
        missing = [f"Website's/{name}" for name in IMAGE_FILES if f"Website's/{name}" not in available]
        if missing:
            raise FileNotFoundError("Missing artwork in Website's.zip: " + ", ".join(missing))

        for source_name, target_name in IMAGE_FILES.items():
            with archive.open(f"Website's/{source_name}") as source:
                with (IMAGE_DIR / target_name).open("wb") as target:
                    shutil.copyfileobj(source, target)


def on_post_build(config, **kwargs):
    source = ROOT / "webdata"
    target = Path(config["site_dir"]) / "webdata"
    if source.exists():
        if target.exists():
            shutil.rmtree(target)
        shutil.copytree(source, target)
