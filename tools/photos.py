# Converts every photo listed in data/events.json to assets/events/<entry-id>-<n>.webp (max 1200 px wide, 800 px tall)
# and writes src, w and h back into the JSON. Safe to re-run.
import json, os
from PIL import Image, ImageOps
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = "/workspace/portfolio-assets/events"
p = os.path.join(ROOT, "data/events.json")
d = json.load(open(p))
os.makedirs(os.path.join(ROOT, "assets/events"), exist_ok=True)
for ev in d["events"]:
    for i, ph in enumerate(ev["photos"], 1):
        out = f"assets/events/{ev['id']}-{i}.webp"
        dst = os.path.join(ROOT, out)
        if not os.path.exists(dst) or ph.get("src") != "/" + out:
            im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, ph["file"]))).convert("RGB")
            im.thumbnail((1200, 800), Image.LANCZOS)  # shown about 360 px tall, so 800 covers 2x screens
            im.save(dst, "WEBP", quality=72, method=6)
        im = Image.open(dst)
        ph["src"], ph["w"], ph["h"] = "/" + out, im.width, im.height
        print(out, im.size, os.path.getsize(dst) // 1024, "KB")
json.dump(d, open(p, "w"), indent=2, ensure_ascii=False)
