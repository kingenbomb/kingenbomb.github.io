import io
import re
import sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
s = BeautifulSoup(io.open(sys.argv[1], encoding="utf-8", errors="replace").read(), "lxml")
main = s.find("main")
def walk(el, depth=0, maxdepth=3, maxkids=7):
    if depth > maxdepth:
        return
    for ch in el.find_all(recursive=False)[:maxkids]:
        if ch.name in ("script", "style"):
            continue
        cls = " ".join(ch.get("class", []))[:70]
        print("  " * depth + f"<{ch.name} .{cls}> cards={len(ch.select('a.browse-card'))} :: {ch.get_text(' ', strip=True)[:70]}")
        walk(ch, depth + 1, maxdepth, maxkids)
walk(main, 0, 3, 6)
print("\n=== h1 ===")
for h in s.find_all("h1"):
    print(h.decode()[:600])
print("\n=== sort region ===")
for el in s.find_all(string=re.compile(r"^\s*A to Z\s*$")):
    node = el.parent
    print(node.decode()[:800])
    break
