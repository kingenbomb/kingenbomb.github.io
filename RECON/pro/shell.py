import io
import sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
soup = BeautifulSoup(io.open(sys.argv[1], encoding="utf-8", errors="replace").read(), "lxml")
body = soup.body
wrap = body.find("div", class_=lambda c: c and "w-full flex justify-center" in c)
for i, ch in enumerate(wrap.find_all(recursive=False)):
    print(f"--- {i}: <{ch.name} .{' '.join(ch.get('class', []))[:100]}> links={len(ch.find_all('a'))} text={ch.get_text(' ', strip=True)[:80]}")
    if i < 2:
        print(ch.decode()[:4000].replace("\n", " ")[:4000])
        print()
