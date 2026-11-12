import io
import sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
soup = BeautifulSoup(io.open(sys.argv[1], encoding="utf-8", errors="replace").read(), "lxml")
side = soup.find("div", class_=lambda c: c and "text-sidebar-foreground" in c and "rounded-xl" in c)
g = side.find_all("div", attrs={"data-sidebar": "group"})[2]
li = g.find("li")
print(li.decode()[:2000])
print("\n=== card ===")
card = soup.find("a", href=lambda h: h and h.startswith("/docs/components/") and "rounded-xl" in " ".join(h and "" for _ in []) )
card = None
for a in soup.find_all("a", href=True):
    if a["href"].startswith("/docs/components/") and "rounded-xl" in " ".join(a.get("class", [])):
        card = a
        break
print(card.decode()[:2500] if card else "no card")
