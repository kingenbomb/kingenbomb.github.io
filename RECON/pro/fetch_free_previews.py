"""Download the free-site hover preview clips + posters for every registry component.

The live site serves them at /assets/video/<slug without dashes>.webm|.webp.
"""
import io
import json
import os
import sys
from concurrent.futures import ThreadPoolExecutor

import requests

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = r"D:\mm\reactbits-splittext-clone"
OUT = os.path.join(ROOT, "public", "assets", "video")
os.makedirs(OUT, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) clone-recon"}

reg = json.load(io.open(os.path.join(ROOT, "RECON", "pro", "registry.json"), encoding="utf-8"))


def get(url, dest, tries=3):
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return ("skip", os.path.getsize(dest))
    for _ in range(tries):
        try:
            r = requests.get(url, headers=UA, timeout=45)
            if r.status_code == 200 and r.content:
                with open(dest, "wb") as fh:
                    fh.write(r.content)
                return ("ok", len(r.content))
            if r.status_code == 404:
                return ("404", 0)
        except Exception:
            pass
    return ("fail", 0)


jobs = []
for cat in reg:
    for item in cat["items"]:
        stem = item["slug"].replace("-", "")
        for ext in ("webm", "webp"):
            jobs.append((f"https://reactbits.dev/assets/video/{stem}.{ext}",
                         os.path.join(OUT, f"{stem}.{ext}")))

with ThreadPoolExecutor(max_workers=8) as ex:
    res = list(ex.map(lambda j: get(*j), jobs))

ok = [j for j, r in zip(jobs, res) if r[0] in ("ok", "skip")]
missing = [j[0] for j, r in zip(jobs, res) if r[0] == "404"]
failed = [j[0] for j, r in zip(jobs, res) if r[0] == "fail"]
print("downloaded/skipped:", len(ok), "/", len(jobs))
print("404:", len(missing))
for m in missing[:40]:
    print("   ", m)
print("failed:", len(failed))
for m in failed[:20]:
    print("   ", m)

# availability table
table = {}
for cat in reg:
    for item in cat["items"]:
        stem = item["slug"].replace("-", "")
        has_v = os.path.exists(os.path.join(OUT, f"{stem}.webm"))
        has_p = os.path.exists(os.path.join(OUT, f"{stem}.webp"))
        table[item["slug"]] = {"category": cat["slug"], "name": item["name"],
                               "webm": has_v, "poster": has_p,
                               "bytes": os.path.getsize(os.path.join(OUT, f"{stem}.webm")) if has_v else 0}
json.dump(table, io.open(os.path.join(ROOT, "RECON", "pro", "free-previews.json"), "w", encoding="utf-8"), indent=1)
total = sum(v["bytes"] for v in table.values())
print("total webm MB:", round(total / 1048576, 1))
print("without webm:", [k for k, v in table.items() if not v["webm"]])
