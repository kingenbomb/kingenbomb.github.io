import io

p = r"D:\mm\reactbits-splittext-clone\src\pro\live\PatternPreview.jsx"
s = io.open(p, encoding="utf-8").read()
before = s

s = s.replace(
    "export default function PatternPreview({ spec, name, description, animated, slug }) {",
    "export default function PatternPreview({ spec, name, description, capture, slug, unit = 'component' }) {",
)
s = s.replace(
    "          animated ? (\n            <img\n              src={animated}",
    "          capture ? (\n            <img\n              src={capture}",
)
s = s.replace("alt={`${name} official animated capture`}", "alt={`${name} official capture`}")
s = s.replace(
    "              No official capture was published for this component.",
    "              No official capture was published for this {unit}.",
)
s = s.replace(
    """            My own implementation, written from the official capture — the paid source is not reproduced.
            {metaDesc ? ` ${metaDesc}` : ''}""",
    """            {spec.kind === 'layout'
              ? 'My own layout, rebuilt from the official capture — the paid source is not reproduced.'
              : 'My own implementation, written from the official capture — the paid source is not reproduced.'}
            {metaDesc ? ` ${metaDesc}` : ''}""",
)
s = s.replace(
    """            Pattern source for <code className="font-mono">{spec.pattern}.jsx</code> ({slug}), MIT + Commons
            Clause, © David Haz.""",
    """            Source of <code className="font-mono">{spec.pattern}.jsx</code> (
            {spec.kind === 'layout' ? 'layout' : 'pattern'} for {slug}), MIT + Commons Clause, © David Haz.""",
)
assert s != before, "no replacement applied"
io.open(p, "w", encoding="utf-8").write(s)
print("patched", len(s))
