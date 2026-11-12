import io
import sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
soup = BeautifulSoup(io.open(sys.argv[1], encoding="utf-8", errors="replace").read(), "lxml")
needle = sys.argv[2] if len(sys.argv) > 2 else "Get Lifetime Access"
el = soup.find(string=lambda t: t and needle in t)
node = el.parent
for _ in range(10):
    if node is None:
        break
    cls = " ".join(node.get("class", []))
    print(f"<{node.name} .{cls[:110]}> links={len(node.find_all('a'))} len={len(node.decode())}")
    if node.name in ("header", "nav"):
        print("---- FOUND ----")
        print(node.decode()[:9000])
        break
    node = node.parent
