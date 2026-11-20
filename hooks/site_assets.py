"""Generate preview assets and copy the site's JSON catalog into the build."""
from pathlib import Path
import shutil
import runpy

ROOT = Path(__file__).resolve().parents[1]

def on_pre_build(config, **kwargs):
    generator = ROOT / "scripts" / "generate_placeholders.py"
    if generator.exists():
        runpy.run_path(str(generator), run_name="__main__")

def on_post_build(config, **kwargs):
    source = ROOT / "webdata"
    target = Path(config["site_dir"]) / "webdata"
    if source.exists():
        if target.exists():
            shutil.rmtree(target)
        shutil.copytree(source, target)
