import io
import os
import sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = r"D:\mm\reactbits-splittext-clone\RECON\pro\dom"
for label in ["pro-blocks", "pro-appui", "pro-templates", "pro-agentkit"]:
    path = os.path.join(ROOT, label, "main.html")
    s = BeautifulSoup(io.open(path, encoding="utf-8", errors="replace").read(), "lxml")
    main = s.find("main")
    root = main.find("div", recursive=False)
    inner = root.find("div", recursive=False).find("div", recursive=False).find("div", recursive=False)
    print("########", label)
    for i, ch in enumerate(inner.find_all(recursive=False)[:4]):
        t = ch.get_text(" ", strip=True)
        print(f"  [{i}] <{ch.name} .{' '.join(ch.get('class', []))[:60]}> :: {t[:400]}")
