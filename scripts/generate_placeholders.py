"""Create temporary preview assets from the repository's existing artwork.

Run from the repository root: python scripts/generate_placeholders.py
Requires Pillow (pip install Pillow).
"""
from pathlib import Path
import shutil

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
IMG_DIR = ROOT / "docs" / "assets" / "img"
LOGO_DIR = ROOT / "docs" / "assets" / "logo"
IMG_DIR.mkdir(parents=True, exist_ok=True)

# Reuse the existing light desktop background as the common banner source.
# The other background variants remain untouched.
BACKGROUND = IMG_DIR / "background-ll.jpg"
LOGO_PNG = LOGO_DIR / "logo-128.png"


def save_crop(source: Image.Image, destination: Path, size: tuple[int, int]) -> None:
    """Center-crop an image to the target aspect ratio, then resize it."""
    cropped = ImageOps.fit(
        source.convert("RGB"),
        size,
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5),
    )
    cropped.save(destination, "JPEG", quality=90, optimize=True)


if not BACKGROUND.is_file():
    raise FileNotFoundError(f"Banner source image not found: {BACKGROUND}")

with Image.open(BACKGROUND) as source:
    # 4:1 hero banners used by the home, store, library, tools, and blog pages.
    for name in ("home", "store", "library", "tools", "blogs"):
        save_crop(source, IMG_DIR / f"banner-{name}.jpg", (1600, 400))

    # The catalogue's generic artwork fallback uses a 2:1 aspect ratio.
    save_crop(source, IMG_DIR / "placeholder.jpg", (800, 400))

if not LOGO_PNG.is_file():
    raise FileNotFoundError(f"Raster logo companion not found: {LOGO_PNG}")

# logo-128.png is the repository's existing PNG rendering of logo.svg.
# Copy it as the temporary TheoTown icon until the proper game icon is ready.
shutil.copy2(LOGO_PNG, IMG_DIR / "theotown-icon.png")
