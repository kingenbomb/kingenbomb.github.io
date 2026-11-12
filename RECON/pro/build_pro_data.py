"""Build the Pro catalogue data files from the saved DOM dumps + pro-manifest.json.

Output: src/pro/data/pro-catalog.json (single file, imported by the pages)
"""
import io
import json
import os
import re
import sys

from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = r"D:\mm\reactbits-splittext-clone"
DOM = os.path.join(ROOT, "RECON", "pro", "dom")
OUT = os.path.join(ROOT, "src", "pro", "data")
os.makedirs(OUT, exist_ok=True)

manifest = json.load(io.open(os.path.join(ROOT, "RECON", "pro", "pro-manifest.json"), encoding="utf-8"))
mcomp = {c["slug"]: c for c in manifest["components"]}
mblocks = {c["slug"]: c for c in manifest["blocks"]}
mappui = {c["slug"]: c for c in manifest["appUi"]}
mtpl = {c["slug"]: c for c in manifest["templates"]}
mak = {c["slug"]: c for c in manifest["agentKit"]}


def soup(label):
    return BeautifulSoup(io.open(os.path.join(DOM, label, "body.html"), encoding="utf-8", errors="replace").read(), "lxml")


# ---------------------------------------------------------------- sidebar
def parse_sidebar(s):
    side = s.find("div", class_=lambda c: c and "text-sidebar-foreground" in c and "rounded-xl" in c)
    groups = []
    # fixed top block: title + count switch
    head = side.find("div", class_=lambda c: c and "shrink-0 space-y-2" in c)
    header = None
    if head:
        btn = head.find("button")
        txt = btn.get_text(" ", strip=True) if btn else ""
        m = re.match(r"(.+?)\s+(\d+)$", txt)
        header = {"name": m.group(1), "count": int(m.group(2))} if m else {"name": txt, "count": None}

    # Get Started block (sits outside the scroll area)
    for g in side.find_all("div", attrs={"data-sidebar": "group"}):
        label_el = g.find(attrs={"data-sidebar": "group-label"})
        label = label_el.get_text(" ", strip=True) if label_el else ""
        items = []
        for a in g.find_all("a", href=True):
            badge = None
            for sp in a.find_all("span"):
                t = sp.get_text(" ", strip=True)
                if t and re.search(r"(New|Updated|Free)$", t) and len(t) <= 10:
                    badge = t
            name = a.get_text(" ", strip=True)
            if badge:
                name = name[: -len(badge)].strip()
            items.append({"name": name, "href": a["href"], "badge": badge})
        if items:
            groups.append({"label": label, "items": items})
    return {"header": header, "groups": groups}


# ---------------------------------------------------------------- components
def parse_components(s):
    cards = []
    for a in s.select("a[class*=rounded-xl]"):
        if not a.get("href", "").startswith("/docs/components/"):
            continue
        slug = a["href"].split("?")[0].rstrip("/").split("/")[-1]
        name = a.find("h3").get_text(strip=True) if a.find("h3") else ""
        desc = a.find("p").get_text(strip=True) if a.find("p") else ""
        imgs = [i.get("src") for i in a.find_all("img")]
        dark = next((i for i in imgs if i and i.endswith("-dark.webp")), None)
        badge = a.find("span", string=re.compile(r"^\s*New\s*$"))
        cards.append({"slug": slug, "name": name, "description": desc,
                      "isNew": badge is not None, "img": dark})
    return cards


# ---------------------------------------------------------------- blocks / app ui
def parse_category_cards(s, base):
    cards = []
    for a in s.select("a[class*=rounded-xl]"):
        if not a.get("href", "").startswith(base):
            continue
        slug = a["href"].split("?")[0].rstrip("/").split("/")[-1]
        name = a.find("h3").get_text(strip=True) if a.find("h3") else ""
        desc = a.find("p").get_text(strip=True) if a.find("p") else ""
        n = None
        for sp in a.find_all("span"):
            t = sp.get_text(" ", strip=True)
            if t.endswith("variants"):
                digits = "".join(ch for ch in t.split("variant")[0] if ch.isdigit())
                n = int(digits) if digits else None
                break
        holder = a.find("div", attrs={"aria-hidden": "true"})
        preview = holder.decode_contents() if holder else ""
        cards.append({"slug": slug, "name": name, "description": desc, "count": n, "preview": preview})
    return cards


# ---------------------------------------------------------------- templates
def parse_templates(s):
    cards = []
    for el in s.select("div[class*=rounded-xl][class*=overflow-hidden]"):
        h3 = el.find("h3")
        if not h3:
            continue
        name = h3.get_text(strip=True)
        p = el.find("p")
        desc = p.get_text(strip=True) if p else ""
        vid = el.find("video")
        src = None
        if vid is not None:
            src = vid.get("src")
            if not src:
                src_el = vid.find("source")
                src = src_el.get("src") if src_el else None
        poster = vid.get("poster") if vid is not None else None
        links = [{"href": x.get("href"), "text": x.get_text(" ", strip=True)} for x in el.find_all("a", href=True)]
        is_new = bool(el.find("span", string=re.compile(r"^\s*New\s*$")))
        cards.append({"name": name, "description": desc, "video": src, "poster": poster,
                      "isNew": is_new, "links": links})
    return cards


# ---------------------------------------------------------------- agent kit
def parse_agentkit(s):
    cards = []
    for a in s.select('a[href*="/docs/agent-kit/"]'):
        if "before:absolute" not in " ".join(a.get("class", [])):
            continue
        card = a
        for _ in range(6):
            if card is None:
                break
            if "rounded-xl" in " ".join(card.get("class", [])):
                break
            card = card.parent
        if card is None:
            continue
        name_el = card.find(string=lambda t: t and t.strip())
        img = card.find("img")
        texts = [t.strip() for t in card.stripped_strings]
        cards.append({
            "href": a["href"],
            "name": texts[0] if texts else a.get_text(strip=True),
            "texts": texts[:6],
            "img": img.get("src") if img else None,
        })
    return cards


# ---------------------------------------------------------------- footer
def parse_footer(s):
    f = s.find("footer")
    if not f:
        return None
    cols = []
    for col in f.select("div"):
        links = [{"name": x.get_text(" ", strip=True), "href": x.get("href")} for x in col.find_all("a", href=True)]
        if links and len(col.find_all("a")) == len(col.find_all("a", recursive=True)):
            pass
    # simpler: group anchors by their nearest heading
    out = []
    for h in f.find_all(["h3", "h4", "p", "div"], recursive=True):
        pass
    return {"text": f.get_text(" | ", strip=True)[:800]}


pages = {}

# ---- components
s = soup("pro-components")
pages["components"] = {
    "sidebar": parse_sidebar(s),
    "cards": parse_components(s),
}

# ---- blocks
s = soup("pro-blocks")
pages["blocks"] = {"sidebar": parse_sidebar(s), "cards": parse_category_cards(s, "/docs/blocks/")}

# ---- app ui
s = soup("pro-appui")
pages["appui"] = {"sidebar": parse_sidebar(s), "cards": parse_category_cards(s, "/docs/app-ui/")}

# ---- templates
s = soup("pro-templates")
pages["templates"] = {"sidebar": parse_sidebar(s), "cards": parse_templates(s)}

# ---- agent kit
s = soup("pro-agentkit")
pages["agentkit"] = {"sidebar": parse_sidebar(s), "cards": parse_agentkit(s)}
pages["footer"] = parse_footer(s)

for k, v in pages.items():
    if isinstance(v, dict) and "cards" in v:
        print(k, "cards:", len(v["cards"]), "sidebar groups:", [(g["label"], len(g["items"])) for g in v["sidebar"]["groups"]])
        print("   sample:", json.dumps(v["cards"][0], ensure_ascii=False)[:300])
print("footer:", json.dumps(pages["footer"], ensure_ascii=False)[:300])

json.dump(pages, io.open(os.path.join(ROOT, "RECON", "pro", "pages.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
