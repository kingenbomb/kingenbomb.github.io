import io
import sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
path = sys.argv[1]
soup = BeautifulSoup(io.open(path, encoding="utf-8", errors="replace").read(), "lxml")
side = soup.find("div", class_=lambda c: c and "text-sidebar-foreground" in c and "rounded-xl" in c)

scroll = side.find("div", class_=lambda c: c and "flex flex-col gap-2 overflow-auto" in c)
print("scroll children:", len(scroll.find_all(recursive=False)))
for ch in scroll.find_all(recursive=False)[:8]:
    print("=== <{} .{}>".format(ch.name, " ".join(ch.get("class", []))[:100]))
    print(ch.decode()[:900].replace("\n", " "))
    print()
