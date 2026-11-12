import io
import re
import sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
s = BeautifulSoup(io.open(sys.argv[1], encoding="utf-8", errors="replace").read(), "lxml")

print("tabs:", [t.get_text(" ", strip=True) for t in s.select('[role="tab"]')])
print("iframes:", [(f.get("src"), f.get("title")) for f in s.find_all("iframe")])
print("videos:", [(v.get("src"), v.get("poster")) for v in s.find_all("video")][:5])
print("imgs:", [i.get("src") for i in s.find_all("img")][:6])
print("code blocks:", len(s.select("pre")), "shiki:", len(s.select(".shiki")))
for pre in s.select("pre")[:2]:
    print("---- PRE ----")
    print(pre.get_text()[:600])
print("\nbuttons:", [b.get_text(" ", strip=True)[:40] for b in s.find_all("button")][:14])
print("\nheadings:", [(h.name, h.get_text(" ", strip=True)[:50]) for h in s.find_all(["h1", "h2", "h3"])][:12])
