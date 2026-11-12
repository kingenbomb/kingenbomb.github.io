import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

for f in ["pro-docs-components.html", "pro-docs-blocks.html", "pro-docs-appui.html",
          "pro-docs-templates.html", "pro-docs-agentkit.html"]:
    h = io.open(f, encoding="utf-8").read()
    print("==", f, len(h))
    print("  next_f pushes:", len(re.findall(r"__next_f\.push", h)))
    print("  img tags:", len(re.findall(r"<img", h)), " video:", h.count("<video"))
    descs = re.findall(r'"description":"(.{0,120})', h)
    print("  desc samples:", descs[:3])
    print("  'staggered' occurrences:", h.lower().count("staggered"))
