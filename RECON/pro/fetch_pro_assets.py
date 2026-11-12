"""Download React Bits Pro preview assets used by the docs catalog pages.

- components/: one dark still per component (previews/components/<slug>-dark.webp)
- agent-kit/: one hero still per agent-kit item (library/showcase/<name>-hero.webp)
- templates/: preview mp4 transcoded to a small webm + webp poster
"""
import io
import json
import os
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor

import requests

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = r"D:\mm\reactbits-splittext-clone"
PUB = os.path.join(ROOT, "public", "assets", "pro")
TMP = os.path.join(ROOT, "RECON", "pro", "tmp")
os.makedirs(os.path.join(PUB, "components"), exist_ok=True)
os.makedirs(os.path.join(PUB, "agent-kit"), exist_ok=True)
os.makedirs(os.path.join(PUB, "templates"), exist_ok=True)
os.makedirs(TMP, exist_ok=True)

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) clone-recon"}
manifest = json.load(io.open(os.path.join(ROOT, "RECON", "pro", "pro-manifest.json"), encoding="utf-8"))


def get(url, dest, tries=4):
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return ("skip", dest)
    for _ in range(tries):
        try:
            r = requests.get(url, headers=UA, timeout=40)
            if r.status_code == 200 and r.content:
                with open(dest, "wb") as fh:
                    fh.write(r.content)
                return ("ok", len(r.content))
            if r.status_code == 404:
                return ("404", 0)
        except Exception:
            pass
    return ("fail", 0)


# ---- components ----
comp_jobs = []
for item in manifest["components"]:
    slug = item["slug"]
    url = f"https://pro.reactbits.dev/previews/components/{slug}-dark.webp"
    dest = os.path.join(PUB, "components", f"{slug}-dark.webp")
    comp_jobs.append((url, dest))

with ThreadPoolExecutor(max_workers=8) as ex:
    results = list(ex.map(lambda j: get(*j), comp_jobs))
ok = sum(1 for r in results if r[0] in ("ok", "skip"))
print("components:", ok, "/", len(comp_jobs), "fails:", [j[1] for j, r in zip(comp_jobs, results) if r[0] not in ("ok", "skip")][:10])

# ---- agent kit ----
dump = io.open(os.path.join(ROOT, "RECON", "pro", "dom", "pro-agentkit", "main.html"), encoding="utf-8").read()
urls = sorted(set(re.findall(r"url=%2Flibrary%2Fshowcase%2F([a-z0-9-]+\.webp)", dump)))
print("agent-kit images found:", len(urls))
ak_jobs = [(f"https://pro.reactbits.dev/library/showcase/{n}", os.path.join(PUB, "agent-kit", n)) for n in urls]
with ThreadPoolExecutor(max_workers=6) as ex:
    ak_res = list(ex.map(lambda j: get(*j), ak_jobs))
print("agent-kit:", sum(1 for r in ak_res if r[0] in ("ok", "skip")), "/", len(ak_jobs))

# ---- templates ----
tpl_jobs = []
for item in manifest["templates"]:
    slug = item["slug"]
    src = os.path.join(TMP, f"{slug}.mp4")
    tpl_jobs.append((item["videoUrl"], src))

with ThreadPoolExecutor(max_workers=4) as ex:
    tpl_res = list(ex.map(lambda j: get(*j), tpl_jobs))
print("template mp4:", sum(1 for r in tpl_res if r[0] in ("ok", "skip")), "/", len(tpl_jobs))

FFMPEG = r"C:\Users\zack_\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1-full_build\bin\ffmpeg.exe"
for item in manifest["templates"]:
    slug = item["slug"]
    src = os.path.join(TMP, f"{slug}.mp4")
    out_webm = os.path.join(PUB, "templates", f"{slug}.webm")
    out_poster = os.path.join(PUB, "templates", f"{slug}.webp")
    if not os.path.exists(src):
        continue
    if not os.path.exists(out_webm):
        subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", src, "-an",
                        "-vf", "scale=960:-2", "-c:v", "libvpx-vp9", "-crf", "40", "-b:v", "0",
                        "-row-mt", "1", "-cpu-used", "4", out_webm], check=False)
    if not os.path.exists(out_poster):
        subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-ss", "0.6", "-i", src, "-frames:v", "1",
                        "-vf", "scale=960:-2", out_poster], check=False)
    print("tpl", slug, os.path.getsize(out_webm) if os.path.exists(out_webm) else 0,
          os.path.getsize(out_poster) if os.path.exists(out_poster) else 0)
