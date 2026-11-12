"""Clean the scraped prose pages into src/pro/data/docs-content.json.

The raw walk of the live DOM leaves a few artefacts behind (stat numbers rendered in their own
<div>, step counters, button labels). This pass folds them into place and drops the noise.
"""
import io
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = r"D:\mm\reactbits-splittext-clone"
raw = json.load(io.open(os.path.join(ROOT, "RECON", "pro", "docs-content.json"), encoding="utf-8"))

NOISE = {
    "all plans", "login", "sign in", "sign in to continue", "free", "copy", "copied",
    "new", "popular", "lifetime", "annual", "recommended", "preview", "code",
    "pro & ultimate", "starter", "pro", "ultimate", "every plan",
}

PAGE_META = {
    "introduction": {
        "title": "Introduction",
        "desc": "The interfaces people remember take weeks to build. React Bits Pro gives you the pieces, "
                "the tooling to assemble them, and the instructions your AI agent needs to do it for you.",
    },
    "installation": {
        "title": "Installation",
        "desc": "Add your license key once, register the two registries, and every component, block, "
                "Application UI section and Agent Kit file is a single command away.",
    },
    "mcp": {
        "title": "MCP Server",
        "desc": "The shadcn MCP server lets your AI assistant read the React Bits Pro registries directly.",
    },
}


def clean(blocks):
    out = []
    i = 0
    while i < len(blocks):
        block = dict(blocks[i])
        text = (block.get("text") or "").strip()
        low = text.lower()
        kind = block["type"]

        if kind == "h1":
            i += 1
            continue  # the page header is rendered from PAGE_META

        if kind == "p":
            # stat card: "230" followed by "Animated components"
            nxt = blocks[i + 1] if i + 1 < len(blocks) else None
            if re.fullmatch(r"[\d,+]+", text) and nxt and nxt["type"] == "p" and 0 < len(nxt["text"]) < 40:
                digits = text.replace(",", "").replace("+", "")
                if digits.isdigit() and int(digits) <= 9:
                    out.append({"type": "step", "label": nxt["text"]})
                else:
                    out.append({"type": "stat", "value": text, "label": nxt["text"]})
                i += 2
                continue
            # step counter + chip labels + duplicate lead paragraphs
            if re.fullmatch(r"\d{1,2}", text) or low in NOISE:
                i += 1
                continue
            if not text:
                i += 1
                continue
            item = {"type": "p", "text": text}
            if block.get("href"):
                item["href"] = block["href"]
            out.append(item)
            i += 1
            continue

        if kind == "p" and not text:
            i += 1
            continue

        if kind == "code":
            out.append({"type": "code", "text": block["text"].strip("\n")})
            i += 1
            continue

        out.append(block)
        i += 1

    # drop a leading paragraph that just repeats the meta description
    if out and out[0]["type"] == "p":
        out = out[1:]
    return out


data = {}
for key, blocks in raw.items():
    cleaned = clean(blocks)
    data[key] = {**PAGE_META.get(key, {"title": key, "desc": ""}), "blocks": cleaned}
    counts = {}
    for b in cleaned:
        counts[b["type"]] = counts.get(b["type"], 0) + 1
    print(key, counts)

out_path = os.path.join(ROOT, "src", "pro", "data", "docs-content.json")
json.dump(data, io.open(out_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("wrote", out_path, round(os.path.getsize(out_path) / 1024), "KB")
