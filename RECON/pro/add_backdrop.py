"""Give the canvas patterns a soft tinted backdrop.

The official captures are rarely flat black: most sit on a subtle gradient. Ours looked
emptier than the originals (measured mean luma 0.002 vs 0.146 on draggable-grid), so each
pattern now washes an accent-tinted radial gradient over its background before drawing.
"""
import io
import os
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE = r"D:\mm\reactbits-splittext-clone\src\pro\live\patterns"
TARGETS = [
    "dotField.jsx",
    "particleLines.jsx",
    "ribbons.jsx",
    "rings.jsx",
    "perspectiveGrid.jsx",
    "cursorTrail.jsx",
    "ditherNoise.jsx",
    "maskReveal.jsx",
    "glitchBars.jsx",
    "wireGlobe.jsx",
]

SNIPPET = """{indent}const wash = ctx.createRadialGradient(w * 0.5, h * 0.42, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.72);
{indent}wash.addColorStop(0, palette.a1);
{indent}wash.addColorStop(1, 'transparent');
{indent}ctx.globalAlpha = 0.16;
{indent}ctx.fillStyle = wash;
{indent}ctx.fillRect(0, 0, w, h);
{indent}ctx.globalAlpha = 1;

"""

for name in TARGETS:
    path = os.path.join(BASE, name)
    lines = io.open(path, encoding="utf-8").read().split("\n")
    if any("const wash" in line for line in lines):
        print("already patched", name)
        continue
    for i, line in enumerate(lines):
        if "fillRect(0, 0, w, h);" in line:
            indent = line[: len(line) - len(line.lstrip())]
            block = SNIPPET.format(indent=indent).split("\n")
            lines[i + 1 : i + 1] = block[:-1]
            io.open(path, "w", encoding="utf-8").write("\n".join(lines))
            print("patched", name, "at line", i + 1)
            break
    else:
        print("NOT FOUND in", name)
