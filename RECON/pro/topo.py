import io
import re
import sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
soup = BeautifulSoup(io.open(sys.argv[1], encoding="utf-8", errors="replace").read(), "lxml")

# topology of main: print nested structure for the first 3 levels under main
main = soup.find("main")
def walk(el, depth=0, maxdepth=4, maxkids=6):
    if depth > maxdepth:
        return
    for ch in el.find_all(recursive=False)[:maxkids]:
        if ch.name in ("script", "style"):
            continue
        cls = " ".join(ch.get("class", []))[:80]
        txt = ch.get_text(" ", strip=True)[:60]
        print("  " * depth + f"<{ch.name} .{cls}> kids={len(ch.find_all(recursive=False))} cards={len(ch.select('a[class*=rounded-xl]'))} :: {txt}")
        walk(ch, depth + 1, maxdepth, maxkids)

walk(main, 0, 3, 8)
print("\n=== group heading candidates ===")
for el in soup.find_all(string=re.compile(r"^(Text|Backgrounds|3D & Shaders|Cursor Effects|UI & Cards)$")):
    p = el.parent
    print("TEXT", el.strip(), "| parent", p.name, " ".join(p.get("class", []))[:100])
    g = p
    for _ in range(4):
        g = g.parent
        if g is None:
            break
        if g.select("a[class*=rounded-xl]"):
            print("   ancestor with cards:", g.name, " ".join(g.get("class", []))[:120], "cards", len(g.select("a[class*=rounded-xl]")))
            break
