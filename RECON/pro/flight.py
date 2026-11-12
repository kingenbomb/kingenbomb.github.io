"""Reconstruct the Next.js App Router RSC flight payload from a saved HTML page."""
import io
import json
import re
import sys


def reconstruct(path):
    h = io.open(path, encoding="utf-8", errors="replace").read()
    chunks = []
    for m in re.finditer(r'self\.__next_f\.push\(\[1,("(?:[^"\\]|\\.)*")\]\)', h):
        chunks.append(json.loads(m.group(1)))
    return "".join(chunks)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    src = sys.argv[1]
    payload = reconstruct(src)
    out = sys.argv[2] if len(sys.argv) > 2 else src + ".flight.txt"
    io.open(out, "w", encoding="utf-8").write(payload)
    print("payload chars:", len(payload), "->", out)
    # show module ids present
    ids = re.findall(r"(?m)^([0-9a-f]+):", payload)
    print("row ids:", len(ids), ids[:10])


if __name__ == "__main__":
    main()
