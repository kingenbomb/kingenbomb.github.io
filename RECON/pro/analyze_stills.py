"""Read the block / app-ui stills so the reimplemented layouts inherit their look.

Same numeric approach as analyze_previews.py, minus motion (these are single frames).
"""
import io
import json
import os
import sys

import numpy as np
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = r"D:\mm\reactbits-splittext-clone"
detail = json.load(io.open(os.path.join(ROOT, "src", "pro", "data", "pro-detail.json"), encoding="utf-8"))


def describe(path):
    img = Image.open(path).convert("RGB")
    small = np.asarray(img.resize((96, 54)), dtype=np.float32) / 255.0
    luma = 0.2126 * small[..., 0] + 0.7152 * small[..., 1] + 0.0722 * small[..., 2]
    flat = small.reshape(-1, 3)
    step = max(1, len(flat) // 6000)
    flat = flat[::step]
    quant = (flat * 31).round().astype(np.int32)
    keys, counts = np.unique(quant, axis=0, return_counts=True)
    order = np.argsort(-counts)[:6]
    palette = [
        {"hex": "#%02x%02x%02x" % tuple((keys[i] / 31.0 * 255).round().astype(int)), "share": round(float(counts[i]) / counts.sum(), 3)}
        for i in order
    ]
    return {
        "w": img.size[0],
        "h": img.size[1],
        "luma": round(float(luma.mean()), 3),
        "contrast": round(float(luma.std()), 3),
        "bright": round(float((luma > 0.72).mean()), 3),
        "saturation": round(float((small.max(axis=2) - small.min(axis=2)).mean()), 3),
        "palette": palette,
    }


facts = {}
for kind in ("blocks", "appUi"):
    for cat in detail[kind]:
        for variant in cat["variants"]:
            rel = (variant.get("img") or "").replace("/assets/pro/showcase/", "")
            if not rel:
                continue
            path = os.path.join(ROOT, "public", "assets", "pro", "showcase", rel.replace("/", os.sep))
            if not os.path.isfile(path):
                continue
            try:
                facts[variant["slug"]] = describe(path)
            except Exception as exc:  # noqa: BLE001
                print("skip", variant["slug"], exc)

out = os.path.join(ROOT, "RECON", "pro", "still-facts.json")
json.dump(facts, io.open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("analyzed", len(facts), "stills ->", out)
lum = [v["luma"] for v in facts.values()]
print("luma min/median/max", round(min(lum), 2), round(float(np.median(lum)), 2), round(max(lum), 2))
light = sum(1 for v in lum if v > 0.45)
print(f"light-looking: {light} / {len(lum)}")
