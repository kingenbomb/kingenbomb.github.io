"""Pair every agent-kit card with its showcase image, by walking the card containers in DOM order."""
import io
import json
import os
import re
import sys

from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = r"D:\mm\reactbits-splittext-clone"
s = BeautifulSoup(io.open(os.path.join(ROOT, "RECON", "pro", "dom", "pro-agentkit", "main.html"),
                          encoding="utf-8", errors="replace").read(), "lxml")

pairs = []
seen = set()
for card in s.select('div[class*="rounded-xl"]'):
    a = card.find("a", href=lambda h: h and "/docs/agent-kit/" in h)
    img = card.find("img")
    if not a or not img:
        continue
    href = a["href"]
    if href in seen:
        continue
    seen.add(href)
    src = img.get("src", "")
    m = re.search(r"url=([^&]+)", src)
    from urllib.parse import unquote
    raw = unquote(m.group(1)) if m else src
    pairs.append({"href": href, "name": a.get_text(" ", strip=True), "img": os.path.basename(raw)})

print(len(pairs))
for p in pairs:
    print(f"  {p['name']:26s} {p['href']:45s} {p['img']}")
json.dump(pairs, io.open(os.path.join(ROOT, "RECON", "pro", "agentkit-images.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
