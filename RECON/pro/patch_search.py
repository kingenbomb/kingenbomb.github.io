import io

p = r"D:\mm\reactbits-splittext-clone\src\pro\search.js"
s = io.open(p, encoding="utf-8").read()

old = """const push = entry => {
  entries.push({
    ...entry,
    zh: zhKeywords[entry.key] || [],"""
new = """const push = entry => {
  const zh = zhKeywords[entry.key] || { t: [], k: [], w: false };
  entries.push({
    ...entry,
    zh,
    zhKeywords: [...zh.t, ...zh.k],"""
assert old in s, "push block not found"
s = s.replace(old, new)

assert "    zh: entry.zh,\n" in s
s = s.replace("    zh: entry.zh,\n", "    zh: entry.zhKeywords,\n")

io.open(p, "w", encoding="utf-8").write(s)
print("ok", s.count("zhKeywords"))
