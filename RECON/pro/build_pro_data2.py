"""Final Pro catalogue data for the clone: merges the parsed DOM cards with pro-manifest.json."""
import io
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = r"D:\mm\reactbits-splittext-clone"
pages = json.load(io.open(os.path.join(ROOT, "RECON", "pro", "pages.json"), encoding="utf-8"))
manifest = json.load(io.open(os.path.join(ROOT, "RECON", "pro", "pro-manifest.json"), encoding="utf-8"))
mcomp = {c["slug"]: c for c in manifest["components"]}
mblocks = {c["slug"]: c for c in manifest["blocks"]}
mappui = {c["slug"]: c for c in manifest["appUi"]}
mtpl = {c["slug"]: c for c in manifest["templates"]}
mak = {c["slug"]: c for c in manifest["agentKit"]}

AK_DIR = os.path.join(ROOT, "public", "assets", "pro", "agent-kit")
ak_files = sorted(os.listdir(AK_DIR))


def ak_image(slug, name):
    for f in ak_files:
        if f.startswith(slug + "-"):
            return f"/assets/pro/agent-kit/{f}"
    low = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    for f in ak_files:
        if f.startswith(low):
            return f"/assets/pro/agent-kit/{f}"
    return "/assets/pro/og.png"


def split_label(label):
    m = re.match(r"^(.*?)\s+(\d+)$", label)
    return (m.group(1), int(m.group(2))) if m else (label, None)


def sidebar(key, href_map=None):
    out = []
    for g in pages[key]["sidebar"]["groups"]:
        name, count = split_label(g["label"])
        items = []
        for it in g["items"]:
            href = it["href"]
            external = True
            if href_map:
                mapped = href_map(it, g)
                if mapped is not None:
                    href, external = mapped, False
            items.append({"name": it["name"], "href": href, "badge": it["badge"], "external": external})
        out.append({"label": name, "count": count, "items": items})
    return out


# ---- components ----
comp_cards = []
for c in pages["components"]["cards"]:
    m = mcomp.get(c["slug"], {})
    comp_cards.append({
        "slug": c["slug"],
        "name": c["name"],
        "description": c["description"],
        "group": m.get("group"),
        "isNew": bool(c["isNew"]),
        "img": f"/assets/pro/components/{c['slug']}-dark.webp",
        "href": m.get("href") or f"https://pro.reactbits.dev/docs/components/{c['slug']}",
    })

comp_groups = []
for g in ("Text", "Backgrounds", "3D & Shaders", "Cursor Effects", "UI & Cards"):
    comp_groups.append({"name": g, "count": sum(1 for c in comp_cards if c["group"] == g)})

# ---- blocks ----
block_cards = []
for c in pages["blocks"]["cards"]:
    m = mblocks.get(c["slug"], {})
    block_cards.append({
        "slug": c["slug"], "name": c["name"], "description": c["description"],
        "count": c["count"], "preview": c["preview"],
        "href": m.get("href") or f"https://pro.reactbits.dev/docs/blocks/{c['slug']}",
    })

# ---- app ui ----
appui_cards = []
for c in pages["appui"]["cards"]:
    m = mappui.get(c["slug"], {})
    appui_cards.append({
        "slug": c["slug"], "name": c["name"], "description": c["description"],
        "count": c["count"], "preview": c["preview"], "category": m.get("category"),
        "href": m.get("href") or f"https://pro.reactbits.dev/docs/app-ui/{c['slug']}",
    })

# ---- templates ----
tpl_cards = []
for c in pages["templates"]["cards"]:
    links = {x["text"]: x["href"] for x in c["links"]}
    detail = links.get("View Details", "")
    slug = detail.rstrip("/").split("/")[-1] if detail else re.sub(r"[^a-z0-9]+", "-", c["name"].lower())
    m = mtpl.get(slug, {})
    tpl_cards.append({
        "slug": slug, "name": c["name"], "description": c["description"],
        "isNew": bool(c["isNew"]),
        "isFree": bool(m.get("isFree")),
        "tier": m.get("tier"),
        "video": f"/assets/pro/templates/{slug}.webm",
        "poster": f"/assets/pro/templates/{slug}.webp",
        "liveUrl": links.get("Live Preview") or m.get("livePreviewUrl"),
        "buyUrl": next((v for k, v in links.items() if k.startswith("Buy Template")), None) or m.get("buyUrl"),
        "href": m.get("href") or f"https://pro.reactbits.dev/docs/templates/{slug}",
    })

# ---- agent kit ----
ak_imgs = {p["href"].rstrip("/").split("/")[-1]: p["img"] for p in
           json.load(io.open(os.path.join(ROOT, "RECON", "pro", "agentkit-images.json"), encoding="utf-8"))}
ak_cards = []
for c in pages["agentkit"]["cards"]:
    slug = c["href"].rstrip("/").split("/")[-1]
    m = mak.get(slug, {})
    kind = m.get("kind") or ("setup" if slug == "agent-skill" else None)
    ak_cards.append({
        "slug": slug, "name": c["name"],
        "summary": m.get("summary") or (c["texts"][1] if len(c["texts"]) > 1 else ""),
        "kind": kind, "category": m.get("category"),
        "tier": m.get("tier"),
        "img": "/assets/pro/agent-kit/" + ak_imgs.get(slug, "og.png"),
        "href": m.get("href") or f"https://pro.reactbits.dev{c['href']}",
    })

sections = {
    "components": {
        "key": "components",
        "title": "Components",
        "desc": "230 production-ready React components. Browse by category, search by name, or sort to find what you need.",
        "sorts": ["Newest", "A–Z", "Z–A"],
        "filters": [{"name": "All", "count": len(comp_cards)}, {"name": "New", "count": sum(1 for c in comp_cards if c["isNew"])}]
        + comp_groups,
        "search": "Search components...",
        "cards": comp_cards,
    },
    "blocks": {
        "key": "blocks",
        "title": "Blocks",
        "desc": "22 categories · 300 variants. Pre-built animated page sections. Drop in, customize, ship.",
        "sorts": ["Newest", "A–Z", "Most variants"],
        "filters": [],
        "showing": "Showing 22 of 22 categories",
        "cards": block_cards,
    },
    "app-ui": {
        "key": "app-ui",
        "title": "Application UI",
        "desc": "300 blocks across 38 categories. Production-ready interface sections built on one shared design system.",
        "sorts": [],
        "filters": [{"name": g, "count": sum(1 for c in appui_cards if c["category"] == g)} for g in
                    ("AI & Agents", "Navigation", "Data", "Forms", "Overlays", "Auth & Onboarding", "Workflows")],
        "showing": "Showing 38 of 38 categories",
        "cards": appui_cards,
    },
    "templates": {
        "key": "templates",
        "title": "Templates",
        "desc": "Production-ready landing page templates. Download the source code and customize to your needs.",
        "sorts": ["Newest", "A–Z", "Z–A"],
        "filters": [],
        "countLabel": "15 templates",
        "cards": tpl_cards,
    },
    "agent-kit": {
        "key": "agent-kit",
        "title": "Agent Kit",
        "desc": "Design skills, page prompts and full-page recipes you hand to your AI agent.",
        "sorts": [],
        "filters": [
            {"name": "All", "count": len(ak_cards)},
            {"name": "Skills", "count": sum(1 for c in ak_cards if c["kind"] == "skill")},
            {"name": "Prompts", "count": sum(1 for c in ak_cards if c["kind"] == "prompt")},
            {"name": "Recipes", "count": sum(1 for c in ak_cards if c["kind"] == "recipe")},
            {"name": "Setup", "count": sum(1 for c in ak_cards if c["kind"] == "setup")},
        ],
        "cards": ak_cards,
    },
}

# ---- sidebar per section ----
def common_map(it, g):
    href = it["href"]
    if href.startswith("/docs/components") or href.startswith("/docs/blocks") or href.startswith("/docs/app-ui") \
            or href.startswith("/docs/templates") or href.startswith("/docs/agent-kit"):
        return None
    return None


sidebars = {}
for key in ("components", "blocks", "appui", "templates", "agentkit"):
    sidebars[key] = sidebar(key)

# rewrite sidebars: keep original hrefs + external flag, the React side maps them.
data = {
    "nav": {
        "links": ["Library", "Resources", "Agents", "Pricing"],
        "signIn": "https://pro.reactbits.dev/login",
        "cta": "https://pro.reactbits.dev/#pricing",
        "ctaLabel": "Get Lifetime Access",
    },
    "sections": sections,
    "sidebars": sidebars,
    "footer": {
        "tagline": "Animated components, blocks, and templates for React. Pay once, ship stunning pages forever.",
        "email": "pro@reactbits.dev",
        "columns": [
            {"title": "Site", "links": [["Home", "/"], ["Builder (Beta)", "/builder"], ["Pricing", "/#pricing"],
                                        ["Testimonials", "/testimonials"], ["FAQs", "/faqs"], ["Roadmap", "/roadmap"],
                                        ["Changelog", "/changelog"], ["Free Components", "https://reactbits.dev"]]},
            {"title": "Docs", "links": [["Introduction", "/docs/introduction"], ["Installation", "/docs/installation"],
                                        ["MCP Server", "/docs/mcp"], ["Components", "/docs/components"],
                                        ["Blocks", "/docs/blocks"], ["Templates", "/docs/templates"]]},
            {"title": "Resources", "links": [["About", "/about"], ["Use cases", "/use-cases"], ["Comparisons", "/compare"],
                                             ["Alternatives", "/alternatives"], ["For AI agents", "/docs/agent-kit"]]},
            {"title": "Legal & Account", "links": [["Login", "/login"], ["Affiliate", "/affiliate"],
                                                   ["License", "/license"], ["Privacy", "/privacy"], ["Contact", "mailto:pro@reactbits.dev"]]},
        ],
        "copyright": "© 2026 pro.reactbits.dev. All rights reserved.",
    },
}

out = os.path.join(ROOT, "src", "pro", "data", "pro-catalog.json")
json.dump(data, io.open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("wrote", out, round(os.path.getsize(out) / 1024), "KB")
print("components:", len(comp_cards), "blocks:", len(block_cards), "appui:", len(appui_cards),
      "templates:", len(tpl_cards), "agentkit:", len(ak_cards))
print("new flags:", sum(1 for c in comp_cards if c["isNew"]))
print("filters:", [(f["name"], f["count"]) for f in sections["components"]["filters"]])
print("appui cats:", sorted({c["category"] for c in appui_cards}))
print("ak kinds:", [(c["name"], c["kind"], c["img"].split("/")[-1]) for c in ak_cards])
print("tpl sample:", json.dumps(tpl_cards[0], ensure_ascii=False)[:300])
