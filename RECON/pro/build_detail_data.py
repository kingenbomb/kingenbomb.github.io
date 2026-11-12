"""Build src/pro/data/pro-detail.json — everything the local Pro detail pages need.

Sources: pro-manifest.json (metadata + media paths), template-detail.json (scraped public
template copy), agentkit-images.json. Media paths are mapped onto public/assets/pro/showcase/.
"""
import io
import json
import os
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = r"D:\mm\reactbits-splittext-clone"
m = json.load(io.open(os.path.join(ROOT, "RECON", "pro", "pro-manifest.json"), encoding="utf-8"))
tpl_detail = json.load(io.open(os.path.join(ROOT, "RECON", "pro", "template-detail.json"), encoding="utf-8"))

SHOWCASE = "/assets/pro/showcase"
AK_FILES = os.path.join(ROOT, "public", "assets", "pro", "showcase")


def media_url(rel):
    """showcase/blocks/hero-1.webp -> /assets/pro/showcase/blocks/hero-1.webp"""
    if not rel:
        return None
    rel = rel.strip("/")
    if rel.startswith("showcase/"):
        rel = rel[len("showcase/"):]
    return f"{SHOWCASE}/{rel}"


def exists(url):
    if not url:
        return False
    path = os.path.join(ROOT, "public", url.lstrip("/").replace("/", os.sep))
    return os.path.exists(path)


components = []
for c in m["components"]:
    media = c.get("media") or {}
    animated = media_url(media.get("animated"))
    poster = media_url(media.get("poster"))
    components.append({
        "slug": c["slug"],
        "name": c["name"],
        "description": c["description"],
        "group": c["group"],
        "tags": c.get("tags") or [],
        "tier": c.get("tier"),
        "isNew": bool(c.get("isNew")),
        "codeVariants": c.get("variants") or [],
        "preview": f"/assets/pro/components/{c['slug']}-dark.webp",
        "animated": animated if exists(animated) else f"/assets/pro/components/{c['slug']}-dark.webp",
        "poster": poster if exists(poster) else f"/assets/pro/components/{c['slug']}-dark.webp",
    })

blocks = []
for b in m["blocks"]:
    variants = []
    for v in b.get("variants") or []:
        img = media_url(v.get("media"))
        variants.append({
            "slug": v["slug"],
            "name": v["name"],
            "description": v.get("description") or "",
            "isNew": bool(v.get("isNew")),
            "registryName": v.get("registryName"),
            "img": img if exists(img) else None,
        })
    blocks.append({
        "slug": b["slug"],
        "name": b["name"],
        "description": b["description"],
        "tier": b.get("tier"),
        "tags": b.get("tags") or [],
        "count": b.get("count"),
        "newCount": b.get("newCount") or 0,
        "variants": variants,
    })

app_ui = []
for a in m["appUi"]:
    variants = []
    for v in a.get("variants") or []:
        img = media_url(v.get("media"))
        variants.append({
            "slug": v["slug"],
            "name": v["name"],
            "description": v.get("description") or "",
            "isNew": bool(v.get("isNew")),
            "registryName": v.get("registryName"),
            "img": img if exists(img) else None,
        })
    app_ui.append({
        "slug": a["slug"],
        "name": a["name"],
        "description": a["description"],
        "category": a.get("category"),
        "tier": a.get("tier"),
        "tags": a.get("tags") or [],
        "count": a.get("count"),
        "newCount": a.get("newCount") or 0,
        "variants": variants,
    })

templates = []
for t in m["templates"]:
    extra = tpl_detail.get(t["slug"], {})
    templates.append({
        "slug": t["slug"],
        "name": t["name"],
        "description": t["description"],
        "tags": t.get("tags") or [],
        "tier": t.get("tier"),
        "isFree": bool(t.get("isFree")),
        "isNew": bool(t.get("isNew")),
        "video": f"/assets/pro/templates/{t['slug']}.webm",
        "poster": f"/assets/pro/templates/{t['slug']}.webp",
        "buyUrl": t.get("buyUrl"),
        "livePreviewUrl": t.get("livePreviewUrl"),
        "builtWith": extra.get("builtWith") or [],
        "about": extra.get("about") or "",
        "features": extra.get("features") or [],
        "sections": extra.get("sections") or [],
    })

agent_kit = []
ak_slugs = {a["slug"]: a for a in m["agentKit"]}
for a in m["agentKit"]:
    showcase = []
    for shot in a.get("showcase") or []:
        img = shot.get("image") or ""
        url = media_url(img)
        showcase.append({"title": shot.get("title") or "", "img": url if exists(url) else None})
    pairs = []
    for slug in a.get("pairsWith") or []:
        pairs.append(slug)
    agent_kit.append({
        "slug": a["slug"],
        "name": a["name"],
        "kind": a.get("kind"),
        "category": a.get("category"),
        "tier": a.get("tier"),
        "version": a.get("version"),
        "updated": a.get("updated"),
        "wordCount": a.get("wordCount"),
        "summary": a.get("summary"),
        "whenToUse": a.get("whenToUse"),
        "preview": a.get("preview"),
        "outline": a.get("outline") or [],
        "pairsWith": pairs,
        "tags": a.get("tags") or [],
        "cover": media_url(a.get("media")),
        "showcase": showcase,
    })

# agent-skill has no manifest entry of its own in agentKit (it lives in agentSkill)
skill = m["agentSkill"]
agent_kit.insert(0, {
    "slug": skill["slug"],
    "name": skill["name"],
    "kind": "setup",
    "category": skill.get("category"),
    "tier": skill.get("tier"),
    "version": None,
    "updated": None,
    "wordCount": None,
    "summary": skill.get("summary"),
    "whenToUse": "",
    "preview": "",
    "outline": [],
    "pairsWith": [],
    "tags": [],
    "cover": "/assets/pro/agent-kit/og.png",
    "showcase": [],
})

data = {
    "tiers": m["tiers"],
    "components": components,
    "blocks": blocks,
    "appUi": app_ui,
    "templates": templates,
    "agentKit": agent_kit,
}

out = os.path.join(ROOT, "src", "pro", "data", "pro-detail.json")
json.dump(data, io.open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("wrote", out, round(os.path.getsize(out) / 1024), "KB")
print("components", len(components), "blocks", len(blocks), "variants", sum(len(b["variants"]) for b in blocks),
      "appUi", len(app_ui), "variants", sum(len(a["variants"]) for a in app_ui),
      "templates", len(templates), "agentKit", len(agent_kit))
print("missing component animated:", sum(1 for c in components if "components/" in c["animated"]) )
print("block variants without img:", sum(1 for b in blocks for v in b["variants"] if not v["img"]))
print("appui variants without img:", sum(1 for a in app_ui for v in a["variants"] if not v["img"]))
print("template features sample:", templates[0]["name"], len(templates[0]["features"]), len(templates[0]["sections"]), templates[0]["builtWith"][:3])
print("ak showcase sample:", agent_kit[1]["name"], [s["img"] for s in agent_kit[1]["showcase"]])
