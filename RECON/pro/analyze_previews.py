"""Read every component preview capture and describe it numerically.

No human eyes needed: palette, luminance, how much of the frame moves, and how much of the
canvas is covered. The result drives the palette + motion of our own reimplementations.
"""
import io
import json
import os
import sys

import numpy as np
from PIL import Image, ImageSequence

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = r"D:\mm\reactbits-splittext-clone"
manifest = json.load(io.open(os.path.join(ROOT, "RECON", "pro", "pro-manifest.json"), encoding="utf-8"))


def load_frames(path, limit=8):
    img = Image.open(path)
    frames = []
    for i, frame in enumerate(ImageSequence.Iterator(img)):
        if i >= limit:
            break
        frames.append(np.asarray(frame.convert("RGB").resize((80, 45)), dtype=np.float32) / 255.0)
    return frames, img.size, getattr(img, "n_frames", 1)


def palette(frames):
    arr = np.concatenate([f.reshape(-1, 3) for f in frames[:3]], axis=0)
    step = max(1, len(arr) // 6000)
    arr = arr[::step]
    quant = (arr * 31).round().astype(np.int32)
    keys, counts = np.unique(quant, axis=0, return_counts=True)
    order = np.argsort(-counts)[:6]
    out = []
    for idx in order:
        rgb = (keys[idx] / 31.0 * 255).round().astype(int)
        out.append({"hex": "#%02x%02x%02x" % tuple(rgb), "share": round(float(counts[idx]) / counts.sum(), 3)})
    return out


facts = {}
for comp in manifest["components"]:
    slug = comp["slug"]
    rel = ((comp.get("media") or {}).get("animated") or "").replace("showcase/", "")
    path = os.path.join(ROOT, "public", "assets", "pro", "showcase", rel.replace("/", os.sep))
    if not os.path.isfile(path):
        path = os.path.join(ROOT, "public", "assets", "pro", "components", f"{slug}-dark.webp")
    if not os.path.isfile(path):
        continue
    try:
        frames, size, n_frames = load_frames(path)
    except Exception as exc:  # noqa: BLE001
        print("skip", slug, exc)
        continue

    luma = np.array([0.2126 * f[..., 0] + 0.7152 * f[..., 1] + 0.0722 * f[..., 2] for f in frames])
    motion = 0.0
    if len(frames) > 1:
        diffs = [float(np.abs(frames[i] - frames[i - 1]).mean()) for i in range(1, len(frames))]
        motion = round(float(np.mean(diffs)) * 12, 3)  # scale to a readable 0..1-ish number

    sat = np.array([(f.max(axis=2) - f.min(axis=2)).mean() for f in frames])
    facts[slug] = {
        "w": size[0],
        "h": size[1],
        "frames": int(n_frames),
        "animated": bool(os.path.basename(path).count("-poster") == 0 and int(n_frames) > 1),
        "luma": round(float(luma.mean()), 3),
        "contrast": round(float(luma.std()), 3),
        "bright": round(float((luma > 0.62).mean()), 3),
        "saturation": round(float(sat.mean()), 3),
        "motion": motion,
        "palette": palette(frames),
    }

out = os.path.join(ROOT, "RECON", "pro", "preview-facts.json")
json.dump(facts, io.open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("analyzed", len(facts), "->", out)

sample = list(facts.items())[:3]
for slug, data in sample:
    print(slug, json.dumps({k: v for k, v in data.items() if k != "palette"}), [p["hex"] for p in data["palette"][:4]])

lumas = [v["luma"] for v in facts.values()]
motions = [v["motion"] for v in facts.values()]
print("luma range", round(min(lumas), 2), round(max(lumas), 2), "motion range", round(min(motions), 2), round(max(motions), 2))

