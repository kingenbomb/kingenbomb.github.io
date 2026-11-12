"""Per-variant layout specs for blocks and app-ui, driven by the published stills."""
import io
import json
import os
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = r"D:\mm\reactbits-splittext-clone"
detail = json.load(io.open(os.path.join(ROOT, "src", "pro", "data", "pro-detail.json"), encoding="utf-8"))
facts = json.load(io.open(os.path.join(ROOT, "RECON", "pro", "still-facts.json"), encoding="utf-8"))

BLOCK_MAP = {
    "hero-section": "hero",
    "features": "features",
    "bento": "features",
    "social-proof": "cards",
    "contact": "form",
    "footer": "footer",
    "comparison": "table",
    "navigation": "nav",
    "auth": "auth",
    "cta": "hero",
    "faq": "faq",
    "pricing": "pricing",
    "stats": "stats",
    "404": "notFound",
    "profile": "profile",
    "about": "hero",
    "waitlist": "form",
    "showcase": "cards",
    "how-it-works": "steps",
    "download": "hero",
    "blog": "cards",
    "ecommerce": "cards",
}

APPUI_MAP = {
    "ai-chat": "chat",
    "prompt-input": "chat",
    "agent-activity": "steps",
    "tool-calls": "table",
    "agent-approval": "dialog",
    "agent-plan": "steps",
    "ai-usage": "dashboard",
    "app-shell": "shell",
    "card": "cards",
    "onboarding": "steps",
    "kanban": "shell",
    "wizard": "form",
    "comments": "chat",
    "scheduling": "table",
    "app-sidebar": "shell",
    "command-menu": "dialog",
    "data-table": "table",
    "dashboard": "dashboard",
    "app-dialog": "dialog",
    "notifications": "cards",
    "integrations": "cards",
    "editor": "shell",
    "settings-form": "form",
    "analytics": "dashboard",
    "list": "table",
    "forms": "form",
    "filtering": "table",
    "feedback": "dialog",
    "support": "chat",
    "billing": "dashboard",
    "chat": "chat",
    "file-manager": "shell",
    "monitoring": "dashboard",
    "navbar": "nav",
    "mobile": "shell",
    "empty-state": "dialog",
    "paywall": "dialog",
    "authentication": "auth",
}

ACCENTS = ["#8b5cf6", "#22d3ee", "#f472b6", "#a3e635", "#fb923c", "#38bdf8", "#c084fc", "#34d399"]


def hx(rgb):
    return "#%02x%02x%02x" % tuple(max(0, min(255, int(round(c)))) for c in rgb)


def rgb(color):
    color = color.lstrip("#")
    return [int(color[i:i + 2], 16) for i in (0, 2, 4)]


def lum(color):
    r, g, b = rgb(color)
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255


def blend(a, b, t):
    ra, ga, ba = rgb(a)
    rb, gb, bb = rgb(b)
    return hx((ra + (rb - ra) * t, ga + (gb - ga) * t, ba + (bb - ba) * t))


def sat(color):
    r, g, b = rgb(color)
    mx = max(r, g, b)
    return 0 if mx == 0 else (mx - min(r, g, b)) / mx


def palette_for(slug, index):
    fact = facts.get(slug) or {}
    colors = [c["hex"] for c in fact.get("palette", [])] or ["#0a0a0a", "#141414", "#f4f4f5"]
    bg = min(colors, key=lum)
    if lum(bg) > 0.2:
        bg = "#0a0a0a"
    brightest = max(colors, key=lum)
    fg = brightest if lum(brightest) > 0.55 else "#f4f4f5"
    panel = blend(bg, "#ffffff", 0.05)
    line = blend(bg, fg, 0.13)
    muted = blend(bg, fg, 0.52)
    ranked = sorted(colors, key=lambda c: -(sat(c) * (0.35 + lum(c))))
    accent = ranked[0] if ranked and sat(ranked[0]) > 0.28 else ACCENTS[index % len(ACCENTS)]
    if lum(accent) < 0.45:
        accent = blend(accent, "#ffffff", 0.45)
    accent2 = ACCENTS[(index + 3) % len(ACCENTS)]
    return {"bg": bg, "panel": panel, "line": line, "muted": muted, "fg": fg, "a1": accent, "a2": accent2}


specs = {}
index = 0
for kind, mapping in (("blocks", BLOCK_MAP), ("appUi", APPUI_MAP)):
    for cat in detail[kind]:
        layout = mapping.get(cat["slug"], "cards")
        for variant in cat["variants"]:
            specs[variant["slug"]] = {
                "kind": "layout",
                "pattern": layout,
                "category": cat["slug"],
                "categoryName": cat["name"],
                "palette": palette_for(variant["slug"], index),
                "label": variant["name"],
                "desc": variant["description"],
                "seed": index + 1,
            }
            index += 1

out = os.path.join(ROOT, "src", "pro", "data", "block-specs.json")
json.dump(specs, io.open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

counts = {}
for spec in specs.values():
    counts[spec["pattern"]] = counts.get(spec["pattern"], 0) + 1
print("variant specs:", len(specs))
for pattern, count in sorted(counts.items(), key=lambda kv: -kv[1]):
    print(f"  {pattern:12s} {count}")
print("wrote", out, round(os.path.getsize(out) / 1024), "KB")
