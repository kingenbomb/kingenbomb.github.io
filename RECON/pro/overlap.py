import glob
import io
import json
import os
import re

src = io.open(r"D:\mm\reactbits-splittext-clone\src\registry.jsx", encoding="utf-8").read()
free = re.findall(r"slug: '([a-z0-9-]+)'", src)
fslugs = set(free)
pro = json.load(io.open(r"D:\mm\reactbits-splittext-clone\RECON\pro\pro-manifest.json", encoding="utf-8"))["components"]
pslugs = [c["slug"] for c in pro]
ov = [s for s in pslugs if s in fslugs]
print("free slugs:", len(free), "unique:", len(fslugs))
print("pro:", len(pslugs), "overlap by slug:", len(ov))
print("pro-only:", len(pslugs) - len(ov))
codes = glob.glob(r"D:\mm\reactbits-splittext-clone\src\constants\code\**\*.js", recursive=True)
print("code files:", len(codes))
print("sample:", [os.path.basename(c) for c in codes[:4]])
print("\npro-only slugs (first 40):")
rest = [s for s in pslugs if s not in fslugs]
print(rest[:40])
print("\nfree-only count:", len(fslugs - set(pslugs)))
