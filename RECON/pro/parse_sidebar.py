import io
import sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
path = sys.argv[1]
soup = BeautifulSoup(io.open(path, encoding="utf-8", errors="replace").read(), "lxml")

side = soup.find("div", class_=lambda c: c and "text-sidebar-foreground" in c and "rounded-xl" in c)
print("sidebar len:", len(side.decode()) if side else None)

# print top-level children of the scroll region
def dump(el, depth=0, maxdepth=3):
    for ch in el.find_all(recursive=False):
        cls = " ".join(ch.get("class", []))[:110]
        txt = ch.get_text(" ", strip=True)[:70]
        print("  " * depth + f"<{ch.name} .{cls}> links={len(ch.find_all('a'))} :: {txt}")
        if depth + 1 < maxdepth:
            dump(ch, depth + 1, maxdepth)

dump(side, 0, 3)
