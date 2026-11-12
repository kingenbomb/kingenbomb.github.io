import io
import sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
s = BeautifulSoup(io.open(sys.argv[1], encoding="utf-8", errors="replace").read(), "lxml")
main = s.find("main")
for el in main.find_all(["h1", "h2", "h3", "h4", "p", "li"]):
    t = el.get_text(" ", strip=True)
    if not t or len(t) > 220:
        t = t[:220] + "…"
    print(f"{el.name}: {t}")
