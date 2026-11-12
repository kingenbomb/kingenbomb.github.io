import glob
import io
import os
import sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

for path in sorted(glob.glob("dom/free-*/*.html")):
    if not path.endswith("body.html"):
        continue
    soup = BeautifulSoup(io.open(path, encoding="utf-8", errors="replace").read(), "lxml")
    cards = soup.select("a.browse-card")
    vids = soup.find_all("video")
    print(os.path.dirname(path), "cards:", len(cards), "videos:", len(vids), "bytes:", os.path.getsize(path))
    if cards:
        print("   first card href:", cards[0].get("href"))
