"""Turn the captured live card order into slug order for the clone, and diff against the registry."""
import io
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = r"D:\mm\reactbits-splittext-clone"
order = json.load(io.open(os.path.join(ROOT, "RECON", "pro", "free-order-raw.json"), encoding="utf-8"))
reg = json.load(io.open(os.path.join(ROOT, "RECON", "pro", "registry.json"), encoding="utf-8"))


def norm(text):
    return re.sub(r"[^a-z0-9]", "", text.lower())


by_cat = {c["slug"]: c for c in reg}
out = {}
for cat, payload in order.items():
    slugs = {norm(i["slug"]): i["slug"] for i in by_cat[cat]["items"]}
    names = {norm(i["name"]): i["slug"] for i in by_cat[cat]["items"]}
    live = []
    unknown = []
    for key in payload["order"]:
        leaf = key.split("/")[-1]
        slug = slugs.get(norm(leaf)) or names.get(norm(leaf))
        if slug:
            if slug not in live:
                live.append(slug)
        else:
            unknown.append(leaf)
    missing = [i["slug"] for i in by_cat[cat]["items"] if i["slug"] not in live]
    out[cat] = live
    print(f"{cat:16s} live={len(live):3d} registry={len(by_cat[cat]['items']):3d} missing_from_live={missing} unknown_live={unknown}")

json.dump(out, io.open(os.path.join(ROOT, "src", "data", "free-order-raw.json"), "w", encoding="utf-8"), indent=0)
print("wrote src/data/free-order-raw.json")
