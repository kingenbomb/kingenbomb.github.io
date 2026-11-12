"""Fold the scraped marketing pages into src/pro/data/site-content.json."""
import io
import json
import os
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = r"D:\mm\reactbits-splittext-clone"
raw = json.load(io.open(os.path.join(ROOT, "RECON", "pro", "site-content.json"), encoding="utf-8"))

META = {
    "about": {
        "title": "About",
        "headline": "The premium React UI library you'll actually ship with",
        "desc": "React Bits Pro is the premium animated React and Next.js component library: 230 components, 300 "
                "pre-built page blocks, 300 app UI blocks, 15 full landing-page templates and an agent kit.",
    },
    "license": {"title": "License Agreement", "headline": "License Agreement", "desc": "The terms that come with a React Bits Pro licence."},
    "privacy": {"title": "Privacy Policy", "headline": "Privacy Policy", "desc": "What this site collects and how it is handled."},
    "roadmap": {"title": "Roadmap", "headline": "Roadmap", "desc": "What is coming next in React Bits Pro, month by month."},
    "changelog": {"title": "Changelog", "headline": "Changelog", "desc": "Everything that shipped in React Bits Pro, newest first."},
    "affiliate": {"title": "Affiliates", "headline": "Affiliates", "desc": "Earn on every referral to React Bits Pro."},
}

# Pages whose live layout is a card grid: the flat extractor loses them, so they stay external.
SKIP = {"testimonials", "use-cases", "compare", "alternatives"}

data = {}
for key, blocks in raw.items():
    if key in SKIP:
        continue
    meta = META.get(key, {"title": key.title(), "headline": key.title(), "desc": ""})
    cleaned = []
    for block in blocks:
        if block["type"] == "h1":
            continue
        text = (block.get("text") or "").strip()
        if block["type"] == "p" and (not text or text.lower() in {"react bits pro", "back to top"}):
            continue
        cleaned.append(block)
    # drop a leading paragraph that just repeats the headline
    if cleaned and cleaned[0]["type"] == "p" and cleaned[0].get("text", "").startswith(meta["headline"][:20]):
        cleaned = cleaned[1:]
    data[key] = {**meta, "blocks": cleaned}
    counts = {}
    for b in cleaned:
        counts[b["type"]] = counts.get(b["type"], 0) + 1
    print(key, counts)

out_path = os.path.join(ROOT, "src", "pro", "data", "site-content.json")
json.dump(data, io.open(out_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("wrote", out_path, round(os.path.getsize(out_path) / 1024), "KB")
