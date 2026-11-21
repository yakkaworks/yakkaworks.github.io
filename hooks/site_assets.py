"""Copy supplied artwork and the JSON catalog into the completed MkDocs site."""
from pathlib import Path
import shutil
import zipfile

ROOT = Path(__file__).resolve().parents[1]
ASSET_ARCHIVE = ROOT / "dev-tool" / "readmes" / "Website's.zip"

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


def _copy_from_archive(image_dir):
    """Copy the complete, validated artwork set when the source archive exists."""
    with zipfile.ZipFile(ASSET_ARCHIVE) as archive:
        available = set(archive.namelist())
        missing = [
            f"Website's/{name}"
            for name in IMAGE_FILES
            if f"Website's/{name}" not in available
        ]
        if missing:
            raise FileNotFoundError(
                "Missing artwork in Website's.zip: " + ", ".join(missing)
            )

        for source_name, target_name in IMAGE_FILES.items():
            with archive.open(f"Website's/{source_name}") as source:
                with (image_dir / target_name).open("wb") as target:
                    shutil.copyfileobj(source, target)


def _copy_fallback_artwork(image_dir):
    """Use tracked image assets when the optional artwork ZIP is unavailable."""
    source_dir = ROOT / "docs" / "assets" / "img"
    cover = source_dir / "cover.jpg"
    if not cover.is_file():
        raise FileNotFoundError(
            "Neither the artwork archive nor docs/assets/img/cover.jpg is available."
        )

    missing_icons = []
    for target_name in IMAGE_FILES.values():
        destination = image_dir / target_name
        source = source_dir / target_name
        if destination.is_file():
            continue
        if source.is_file():
            shutil.copy2(source, destination)
        elif Path(target_name).suffix.lower() in {".jpg", ".jpeg"}:
            # The cover is an intentional, temporary fallback for missing photo assets.
            shutil.copy2(cover, destination)
        else:
            # Do not disguise a JPEG as a PNG or invent replacement pixel artwork.
            missing_icons.append(target_name)

    if missing_icons:
        print(
            "WARNING: Artwork archive is unavailable; these optional icon assets "
            "were not copied: " + ", ".join(missing_icons)
        )


def on_post_build(config, **kwargs):
    # Write into build output, not docs/, so a local preview never dirties source files.
    image_dir = Path(config["site_dir"]) / "assets" / "img"
    image_dir.mkdir(parents=True, exist_ok=True)

    if ASSET_ARCHIVE.is_file():
        _copy_from_archive(image_dir)
    else:
        print(
            "WARNING: Website's.zip is not present. Using tracked images and "
            "the cover image as a temporary JPG fallback."
        )
        _copy_fallback_artwork(image_dir)

    source = ROOT / "webdata"
    target = Path(config["site_dir"]) / "webdata"
    if source.exists():
        if target.exists():
            shutil.rmtree(target)
        shutil.copytree(source, target)
