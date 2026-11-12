import io
import sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
s = BeautifulSoup(io.open(sys.argv[1], encoding="utf-8", errors="replace").read(), "lxml")
needle = sys.argv[2]
a = s.find("a", href=lambda h: h and needle in h)
print("anchor:", a)
node = a
for i in range(8):
    node = node.parent
    if node is None:
        break
    cls = " ".join(node.get("class", []))
    print(f"[{i}] <{node.name} .{cls[:100]}> imgs={len(node.find_all('img'))} text={node.get_text(' ', strip=True)[:120]}")
    if "rounded-xl" in cls and len(node.find_all("img")) == 1:
        print("---- CARD ----")
        print(node.decode()[:3000])
        break
