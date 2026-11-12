"""Turn preview-facts.json into per-component live specs for our own implementations.

Each of the 230 components gets: a pattern (one of the hand-written React patterns in
src/pro/live/patterns/), a palette sampled from the official capture, and density/speed
derived from how bright and how busy that capture is.
"""
import io
import json
import os
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = r"D:\mm\reactbits-splittext-clone"
manifest = json.load(io.open(os.path.join(ROOT, "RECON", "pro", "pro-manifest.json"), encoding="utf-8"))
facts = json.load(io.open(os.path.join(ROOT, "RECON", "pro", "preview-facts.json"), encoding="utf-8"))

FALLBACK_ACCENTS = ["#6a4bff", "#22d3ee", "#f472b6", "#a3e635", "#fb923c", "#38bdf8", "#c084fc", "#34d399"]


def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def luminance(h):
    r, g, b = hex_to_rgb(h)
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255


def saturation(h):
    r, g, b = hex_to_rgb(h)
    mx, mn = max(r, g, b), min(r, g, b)
    return 0 if mx == 0 else (mx - mn) / mx


def pick_palette(fact, seed):
    colors = [c["hex"] for c in (fact or {}).get("palette", [])]
    if not colors:
        colors = ["#080808", "#111111", "#ffffff"]
    dark = min(colors, key=luminance)
    bright = max(colors, key=luminance)
    saturated = sorted(colors, key=lambda c: -saturation(c) * (0.3 + luminance(c)))
    accent = saturated[0] if saturated and saturation(saturated[0]) > 0.25 else None
    accent2 = saturated[1] if len(saturated) > 1 and saturation(saturated[1]) > 0.25 else None
    if not accent:
        accent = FALLBACK_ACCENTS[seed % len(FALLBACK_ACCENTS)]
        accent2 = FALLBACK_ACCENTS[(seed + 3) % len(FALLBACK_ACCENTS)]
    if not accent2 or accent2 == accent:
        accent2 = FALLBACK_ACCENTS[(FALLBACK_ACCENTS.index(accent) + 2) % len(FALLBACK_ACCENTS)] if accent in FALLBACK_ACCENTS else "#ffffff"
    fg = bright if luminance(bright) > 0.6 else "#f4f4f5"
    bg = dark if luminance(dark) < 0.16 else "#0a0a0a"
    return {"bg": bg, "fg": fg, "a1": lift(accent), "a2": lift(accent2)}


def lift(hex_color, target=0.62):
    """Captures are dark, so sampled accents are often dim. Pull them up to stay legible."""
    if luminance(hex_color) >= target:
        return hex_color
    r, g, b = hex_to_rgb(hex_color)
    if max(r, g, b) < 30:  # essentially black — needs saturation too
        r, g, b = (r + 60, g + 70, b + 130)
    scale = 1.0
    while scale < 6:
        nr, ng, nb = min(255, int(r * scale)), min(255, int(g * scale)), min(255, int(b * scale))
        if luminance("#%02x%02x%02x" % (nr, ng, nb)) >= target:
            return "#%02x%02x%02x" % (nr, ng, nb)
        scale += 0.15
    return "#c7b3ff"


RULES = [
    # Backgrounds / 3D: shape words only. Order matters — specific ideas first.
    ("wireGlobe", ["globe", "sphere", "planet", "constellation"]),
    ("barChart", ["chart", "graph", "analytics", "dashboard", "metric", "stats", "gauge"]),
    ("glitchBars", ["glitch", "rgb", "chroma", "interference", "fault", "corrupt"]),
    ("ditherNoise", ["dither", "pixel", "mosaic", "noise", "ascii", "bayer", "halftone", "sprite"]),
    ("maskReveal", ["reveal", "mask", "flip", "blend", "glass", "curtain", "lenticular"]),
    ("rings", ["ring", "circle", "vortex", "spiral", "halo", "orbit", "radial", "ripple", "pulse", "helix"]),
    ("gradientBlobs", ["blob", "gradient", "glow", "aurora", "nebula", "liquid", "smoke", "fog", "droplet", "ink", "pond"]),
    ("ribbons", ["ribbon", "filament", "thread", "strand", "beam", "ray", "wave", "current", "flow", "stream", "iris"]),
    ("perspectiveGrid", ["grid", "perspective", "tunnel", "portal", "warp", "speed", "passage", "dome", "floor", "horizon"]),
    ("marqueeStrip", ["marquee", "carousel", "ticker", "slider", "strip", "reel", "rail", "gallery", "album", "sheet"]),
    ("cardStack", ["card", "deck", "stack", "panel", "tile", "device", "dolly", "tumble"]),
    ("dotField", ["dot", "dust", "star", "spark", "ember", "snow", "field", "lattice", "hex", "voxel"]),
    ("particleLines", ["particle", "network", "mesh", "swarm", "cloud"]),
]

# Text components are typography first: only these words move them off the text pattern.
TEXT_RULES = [
    ("glitchBars", ["glitch", "corrupt"]),
    ("ditherNoise", ["ascii", "pixel"]),
    ("marqueeStrip", ["marquee", "scroll", "speeding", "bending", "lottery", "ticker"]),
]

CURSOR_RULES = [
    ("cardStack", ["pill", "snapshot"]),
    ("ditherNoise", ["dither", "ascii", "pixel"]),
    ("ribbons", ["ribbon"]),
]

CARD_RULES = [
    ("barChart", ["graph", "chart", "stats", "data"]),
    ("maskReveal", ["comparison", "preview", "swap", "slider"]),
    ("rings", ["circle", "preloader", "flow"]),
    ("marqueeStrip", ["carousel", "reel", "rail", "list", "gallery"]),
    ("dotField", ["grid"]),
]

GROUP_DEFAULT = {
    "Text": "splitText",
    "Backgrounds": "dotField",
    "3D & Shaders": "ribbons",
    "Cursor Effects": "cursorTrail",
    "UI & Cards": "cardStack",
}

GROUP_RULES = {
    "Text": TEXT_RULES,
    "Cursor Effects": CURSOR_RULES,
    "UI & Cards": CARD_RULES,
    "Backgrounds": RULES,
    "3D & Shaders": RULES,
}

# Hand-placed choices where the name alone tells you what it should look like.
OVERRIDES = {
    "globe": "wireGlobe",
    "circles": "rings",
    "vortex": "rings",
    "preloader": "rings",
    "simple-graph": "barChart",
    "credit-card": "cardStack",
    "device": "cardStack",
    "comparison-slider": "maskReveal",
    "shader-reveal": "maskReveal",
    "neon-reveal": "maskReveal",
    "pixelate-hover": "ditherNoise",
    "mosaic": "ditherNoise",
    "dither-wave": "ditherNoise",
    "ascii-ripple": "ditherNoise",
    "glitter-warp": "perspectiveGrid",
    "lightspeed": "perspectiveGrid",
    "perspective-grid": "perspectiveGrid",
    "hyperspace": "perspectiveGrid",
    "chroma-waves": "glitchBars",
    "liquid-swap": "maskReveal",
    "ai-blob": "gradientBlobs",
    "gradient-blob": "gradientBlobs",
    "light-droplets": "gradientBlobs",
    "radial-liquid": "gradientBlobs",
    "interference-ribbons": "ribbons",
    "luminous-filaments": "ribbons",
    "chroma-current": "ribbons",
    "spectral-drape": "dotField",
    "horizon-bloom": "dotField",
    "cloud-atlas": "particleLines",
    "photon-knot": "rings",
    "nexus-rays": "ribbons",
    "axial-beam": "ribbons",
    "prismatic-slats": "perspectiveGrid",
    "hexagonal-vault": "dotField",
    "voxel-arc": "dotField",
}


def choose(comp):
    slug = comp["slug"]
    if slug in OVERRIDES:
        return OVERRIDES[slug], "override"
    group = comp.get("group")
    haystack = " ".join(
        [slug, comp["name"].lower(), (comp.get("description") or "").lower(), " ".join(comp.get("tags") or [])]
    )
    for pattern, words in GROUP_RULES.get(group, RULES):
        for word in words:
            if word in haystack:
                return pattern, f"keyword:{word}"
    return GROUP_DEFAULT.get(group, "dotField"), "group"


specs = {}
for index, comp in enumerate(manifest["components"]):
    fact = facts.get(comp["slug"])
    pattern, reason = choose(comp)
    density = 0.5
    speed = 0.4
    if fact:
        density = round(min(0.95, max(0.2, 0.18 + fact["bright"] * 2.2 + fact["contrast"] * 1.4)), 2)
        speed = round(min(0.95, max(0.12, 0.12 + fact["motion"] * 0.55)), 2)
    specs[comp["slug"]] = {
        "pattern": pattern,
        "palette": pick_palette(fact, index),
        "density": density,
        "speed": speed,
        "seed": index + 1,
        "label": comp["name"].upper(),
        "why": reason,
    }

out = os.path.join(ROOT, "src", "pro", "data", "live-specs.json")
json.dump(specs, io.open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

counts = {}
for spec in specs.values():
    counts[spec["pattern"]] = counts.get(spec["pattern"], 0) + 1
print("specs:", len(specs))
for pattern, count in sorted(counts.items(), key=lambda kv: -kv[1]):
    print(f"  {pattern:16s} {count}")
print("wrote", out)
