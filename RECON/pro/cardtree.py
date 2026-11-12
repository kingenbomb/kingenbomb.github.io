import io
import sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def tree(el, depth=0, maxdepth=5):
    if depth > maxdepth:
        return
    for ch in el.find_all(recursive=False):
        if ch.name in ("script", "style", "svg"):
            print("  " * depth + f"<{ch.name} (svg)>")
            continue
        cls = " ".join(ch.get("class", []))
        extra = ""
        if ch.name == "img":
            extra = f' src={ch.get("src", "")[:60]}'
        if ch.name == "video":
            extra = f' src={ch.get("src", "")[:80]} poster={str(ch.get("poster"))[:40]}'
        print("  " * depth + f"<{ch.name} .{cls}>{extra}")
        if ch.name not in ("img", "video"):
            tree(ch, depth + 1, maxdepth)


for label, selector in [("pro-blocks", "a[class*=rounded-xl]"), ("pro-templates", "div[class*=rounded-xl][class*=overflow-hidden]"),
                        ("pro-agentkit", "div[class*=rounded-xl][class*=flex-col]")]:
    s = BeautifulSoup(io.open(f"dom/{label}/main.html", encoding="utf-8", errors="replace").read(), "lxml")
    el = s.select_one(selector)
    print("#########", label, selector)
    tree(el)
    print()
