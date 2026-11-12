import io
import sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
path = sys.argv[1]
soup = BeautifulSoup(io.open(path, encoding="utf-8", errors="replace").read(), "lxml")

lnk = soup.find("a", href="/docs/introduction")
print("intro link found:", bool(lnk))
if lnk:
    anc = lnk
    chain = []
    for _ in range(8):
        anc = anc.parent
        if anc is None:
            break
        chain.append((anc.name, " ".join(anc.get("class", []))[:150], len(anc.find_all("a"))))
    for c in chain:
        print(c)

print("--- top-level body children ---")
body = soup.body
for ch in body.find_all(recursive=False):
    print(ch.name, " ".join(ch.get("class", []))[:120], len(ch.find_all("a")))
