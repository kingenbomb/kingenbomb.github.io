"""Dump visible text + link list from an SSR HTML page (stdlib only)."""
import io
import re
import sys
from html.parser import HTMLParser


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip = 0
        self.out = []
        self.links = []
        self.cur_href = None
        self.cur_text = []
        self.stack = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("script", "style", "noscript"):
            self.skip += 1
        if tag == "a":
            self.cur_href = a.get("href")
            self.cur_text = []
        if tag in ("h1", "h2", "h3", "h4"):
            self.out.append("\n" + "#" * int(tag[1]) + " ")

    def handle_endtag(self, tag):
        if tag in ("script", "style", "noscript") and self.skip:
            self.skip -= 1
        if tag == "a" and self.cur_href is not None:
            self.links.append((self.cur_href, " ".join("".join(self.cur_text).split())))
            self.cur_href = None
            self.cur_text = []

    def handle_data(self, data):
        if self.skip:
            return
        if self.cur_href is not None:
            self.cur_text.append(data)
        self.out.append(data)


def main(path, mode="text"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    raw = io.open(path, encoding="utf-8", errors="replace").read()
    p = P()
    p.feed(raw)
    if mode == "links":
        seen = set()
        for href, text in p.links:
            key = (href, text)
            if key in seen:
                continue
            seen.add(key)
            print(f"{href}\t{text}")
        return
    text = "".join(p.out)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n\s*\n+", "\n", text)
    print(text[: int(sys.argv[3]) if len(sys.argv) > 3 else 20000])


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else "text")
