"""Extract the Pro wordmark SVG from the saved nav markup into a React component."""
import io
import os
import re
import sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = r"D:\mm\reactbits-splittext-clone"
s = BeautifulSoup(io.open(os.path.join(ROOT, "RECON", "pro", "dom", "pro-components", "body.html"),
                          encoding="utf-8", errors="replace").read(), "lxml")
nav = s.find("nav", class_=lambda c: c and "border-b" in c)
svg = nav.find("svg")
print("svg bytes:", len(svg.decode()))
print("viewBox:", svg.get("viewbox"), "w/h:", svg.get("width"), svg.get("height"))
paths = svg.find_all("path")
print("paths:", len(paths))
out = os.path.join(ROOT, "src", "pro", "ProLogo.jsx")
with io.open(out, "w", encoding="utf-8") as fh:
    fh.write("// Official React Bits Pro wordmark, lifted verbatim from pro.reactbits.dev's nav SVG.\n")
    fh.write("export default function ProLogo({ className = 'h-6 w-auto' }) {\n")
    fh.write("  return (\n")
    fh.write("    <svg className={className} fill=\"none\" viewBox=\"0 0 760 111\" xmlns=\"http://www.w3.org/2000/svg\">\n")
    for p in paths:
        d = p.get("d")
        op = p.get("opacity")
        fh.write(f'      <path d="{d}" fill="currentColor"' + (f' opacity="{op}"' if op else "") + " />\n")
    fh.write("    </svg>\n  );\n}\n")
print("wrote", out, os.path.getsize(out))
