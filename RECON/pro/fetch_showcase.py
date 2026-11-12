"""Download every showcase capture referenced by pro-manifest.json.

Base https://reactbits.dev/rbp (manifest.assets.baseUrl). A leading `showcase/` is stripped
so files land at public/assets/pro/showcase/<section>/<file>.webp.
"""
import io
import json
import os
import sys
from concurrent.futures import ThreadPoolExecutor

import requests

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = r"D:\mm\reactbits-splittext-clone"
DEST = os.path.join(ROOT, "public", "assets", "pro", "showcase")
BASE = "https://reactbits.dev/rbp"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) clone-recon"}

m = json.load(io.open(os.path.join(ROOT, "RECON", "pro", "pro-manifest.json"), encoding="utf-8"))

jobs = []
for block in m["blocks"]:
    for v in block.get("variants") or []:
        if v.get("media"):
            jobs.append(v["media"])
for app in m["appUi"]:
    for v in app.get("variants") or []:
        if v.get("media"):
            jobs.append(v["media"])
for comp in m["components"]:
    media = comp.get("media") or {}
    for key in ("animated", "poster"):
        if media.get(key):
            jobs.append(media[key])
for ak in m["agentKit"]:
    if ak.get("media"):
        jobs.append(ak["media"])
    for shot in ak.get("showcase") or []:
        if shot.get("image"):
            jobs.append(shot["image"])

jobs = sorted(set(jobs))
print("assets to fetch:", len(jobs))


def local_rel(rel):
    rel = rel.strip("/")
    return rel[len("showcase/"):] if rel.startswith("showcase/") else rel


def get(rel, tries=3):
    dest = os.path.join(DEST, local_rel(rel).replace("/", os.sep))
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return "skip"
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    url = f"{BASE}/{rel}"
    for _ in range(tries):
        try:
            r = requests.get(url, headers=UA, timeout=45)
            if r.status_code == 200 and r.content:
                with open(dest, "wb") as fh:
                    fh.write(r.content)
                return "ok"
            if r.status_code == 404:
                return "404"
        except Exception:
            pass
    return "fail"


with ThreadPoolExecutor(max_workers=10) as ex:
    results = list(ex.map(get, jobs))

from collections import Counter

print(Counter(results))
missing = [j for j, r in zip(jobs, results) if r not in ("ok", "skip")]
print("missing:", missing[:10])

total = sum(os.path.getsize(os.path.join(DEST, local_rel(j).replace("/", os.sep))) for j in jobs
            if os.path.exists(os.path.join(DEST, local_rel(j).replace("/", os.sep))))
print("on disk:", len(jobs), "files,", round(total / 1048576, 1), "MB")
