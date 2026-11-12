"""Extract the clone registry (categories -> items) and cross-check slugs against the live sitemap."""
import io
import re
import sys
import json
import xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

src = io.open(r"D:\mm\reactbits-splittext-clone\src\registry.jsx", encoding="utf-8").read()

# category blocks
cats = []
for m in re.finditer(r"\{\s*slug:\s*'([a-z-]+)',\s*name:\s*'([^']+)',\s*items:\s*\[", src):
    start = m.end()
    # find matching close of items array by bracket counting
    depth = 1
    i = start
    while i < len(src) and depth:
        if src[i] == "[":
            depth += 1
        elif src[i] == "]":
            depth -= 1
        i += 1
    body = src[start : i - 1]
    items = re.findall(r"slug:\s*'([a-z0-9-]+)',\s*name:\s*'([^']+)'", body)
    cats.append({"slug": m.group(1), "name": m.group(2), "items": [{"slug": s, "name": n} for s, n in items]})

total = sum(len(c["items"]) for c in cats)
print("categories:", [(c["slug"], len(c["items"])) for c in cats], "total:", total)

# sitemap
tree = ET.parse(r"D:\mm\reactbits-splittext-clone\RECON\pro\free-sitemap.xml")
urls = [el.text for el in tree.getroot().iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
live = set()
for u in urls:
    m = re.match(r"https://reactbits\.dev/([a-z-]+)/([a-z0-9-]+)$", u)
    if m and m.group(1) in {c["slug"] for c in cats}:
        live.add((m.group(1), m.group(2)))
print("live detail urls in sitemap:", len(live))

reg = {(c["slug"], it["slug"]) for c in cats for it in c["items"]}
print("in registry not live:", sorted(reg - live))
print("live not in registry:", sorted(live - reg))

json.dump(cats, io.open(r"D:\mm\reactbits-splittext-clone\RECON\pro\registry.json", "w", encoding="utf-8"), indent=1)
