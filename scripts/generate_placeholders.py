"""Generate temporary JPG banner and icon assets for the MkDocs preview.

Run from the repository root: python scripts/generate_placeholders.py
Requires Pillow (pip install Pillow).
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)

def font(size):
    for candidate in ("DejaVuSans.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"):
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            pass
    return ImageFont.load_default()

def banner(label):
    image = Image.new("RGB", (1600, 400), "#f4f5f2")
    draw = ImageDraw.Draw(image)
    draw.rectangle((10, 10, 1590, 390), outline="#4d8b31", width=5)
    f = font(54)
    box = draw.textbbox((0, 0), label, font=f)
    draw.text(((1600 - (box[2] - box[0])) / 2, (400 - (box[3] - box[1])) / 2 - box[1]), label, fill="#4d8b31", font=f)
    image.save(OUT / f"banner-{label.lower().replace(' ', '-')}.jpg", "JPEG", quality=88, optimize=True)

for name in ("Home", "Store", "Library", "Tools", "Blogs"):
    banner(name)

icon = Image.new("RGB", (128, 128), "#4d8b31")
draw = ImageDraw.Draw(icon)
draw.rectangle((3, 3, 124, 124), outline="#ffffff", width=4)
f = font(44)
box = draw.textbbox((0, 0), "TT", font=f)
draw.text(((128 - (box[2] - box[0])) / 2, (128 - (box[3] - box[1])) / 2 - box[1]), "TT", fill="#ffffff", font=f)
icon.save(OUT / "theotown-icon.png", "PNG", optimize=True)

# Generic 2:1 fallback thumbnail for catalog entries without artwork.
placeholder = Image.new("RGB", (800, 400), "#f4f5f2")
pdraw = ImageDraw.Draw(placeholder)
pdraw.rectangle((8, 8, 792, 392), outline="#4d8b31", width=5)
pfont = font(34)
label = "Content thumbnail"
box = pdraw.textbbox((0, 0), label, font=pfont)
pdraw.text(((800 - (box[2] - box[0])) / 2, (400 - (box[3] - box[1])) / 2 - box[1]), label, fill="#4d8b31", font=pfont)
placeholder.save(OUT / "placeholder.jpg", "JPEG", quality=88, optimize=True)
