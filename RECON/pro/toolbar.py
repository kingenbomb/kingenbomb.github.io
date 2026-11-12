import io
import sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
soup = BeautifulSoup(io.open(sys.argv[1], encoding="utf-8", errors="replace").read(), "lxml")
main = soup.find("main")
root = main.find("div", recursive=False)
inner = root.find("div", recursive=False).find("div", recursive=False).find("div", recursive=False)
for i, ch in enumerate(inner.find_all(recursive=False)):
    print(f"--- child {i}: <{ch.name} .{' '.join(ch.get('class', []))}>")
    print(ch.decode()[:2500].replace("\n", " "))
    print()
