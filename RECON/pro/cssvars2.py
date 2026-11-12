import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
s = "".join(io.open(p, encoding="utf-8", errors="replace").read() for p in sys.argv[1:])
want = ("--background", "--foreground", "--muted", "--border", "--sidebar", "--primary", "--radius",
        "--card", "--accent", "--ring", "--input", "--popover", "--secondary", "--destructive", "--chart",
        "--font-sans", "--nav-height", "--spacing", "--container")
for m in re.finditer(r"(:root|\.dark|@theme[^{]*)\s*\{([^}]*)\}", s):
    decls = re.findall(r"(--[a-z0-9-]+)\s*:\s*([^;]+);", m.group(2))
    sel = m.group(1).strip()
    keep = [(k, v) for k, v in decls if k.startswith(want)]
    if keep:
        print("===", sel, f"({len(decls)} decls)")
        for k, v in keep:
            print(f"  {k}: {v.strip()}")
