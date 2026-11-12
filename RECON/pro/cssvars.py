import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
s = "".join(io.open(p, encoding="utf-8", errors="replace").read() for p in sys.argv[1:])

# find :root and .dark blocks that declare css vars
for m in re.finditer(r"(:root|\.dark)\s*\{([^}]*)\}", s):
    body = m.group(2)
    decls = re.findall(r"(--[a-z0-9-]+)\s*:\s*([^;]+);", body)
    if len(decls) > 5:
        print("===", m.group(1), len(decls))
        for k, v in decls:
            print(f"  {k}: {v.strip()}")
