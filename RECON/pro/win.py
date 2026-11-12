"""Print a window of a text file around a needle, plus optional regex capture."""
import io
import re
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
path = sys.argv[1]
needle = sys.argv[2]
radius = int(sys.argv[3]) if len(sys.argv) > 3 else 2000
regex = sys.argv[4] if len(sys.argv) > 4 else None

s = io.open(path, encoding="utf-8", errors="replace").read()
print("len", len(s))
if regex:
    hits = re.findall(regex, s)
    print("regex hits", len(hits))
    for h in hits[:30]:
        print("  ", h)

i = s.find(needle)
print("first hit at", i)
if i >= 0:
    print(s[max(0, i - radius): i + radius])
