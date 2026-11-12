// Dump every catalog card on a page: href, text lines, media attrs, and raw HTML (trimmed).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = {};
for (let i = 0; i < args.length; i += 2) opt[args[i].replace(/^--/, '')] = args[i + 1];
const dir = path.join(opt.out, opt.label);
fs.mkdirSync(dir, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(opt.url, { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(4000);
const scrolls = Number(opt.scroll || 10);
for (let i = 0; i < scrolls; i++) {
  await page.mouse.wheel(0, 1600);
  await page.waitForTimeout(260);
}
await page.waitForTimeout(1200);

const res = await page.evaluate(prefix => {
  const cards = Array.from(document.querySelectorAll(`a[href*="${prefix}"]`)).filter(a =>
    /rounded-xl|browse-card/.test(a.className || '')
  );
  const uniq = [];
  const seen = new Set();
  for (const a of cards) {
    const h = a.getAttribute('href');
    if (seen.has(h)) continue;
    seen.add(h);
    uniq.push({
      href: h,
      text: a.innerText.split('\n').map(t => t.trim()).filter(Boolean),
      imgs: Array.from(a.querySelectorAll('img')).map(i => i.getAttribute('src')),
      videos: Array.from(a.querySelectorAll('video')).map(v => ({ src: v.getAttribute('src') || v.currentSrc, poster: v.getAttribute('poster') })),
      sources: Array.from(a.querySelectorAll('source')).map(s => s.getAttribute('src')),
      html: a.outerHTML.length > 4000 ? a.outerHTML.slice(0, 4000) : a.outerHTML
    });
  }
  // group headings inside main before cards
  const heads = Array.from(document.querySelectorAll('main h2')).map(h => ({
    text: h.innerText.trim().slice(0, 80),
    cls: h.className.slice(0, 80),
    parent: h.parentElement.className.slice(0, 120)
  }));
  const chips = Array.from(document.querySelectorAll('main button, main [role="tab"], main [role="radio"]'))
    .map(b => b.innerText.trim().replace(/\s+/g, ' '))
    .filter(Boolean)
    .slice(0, 60);
  return { cards: uniq, heads: heads.slice(0, 40), chips, mainHTML: (document.querySelector('main')?.outerHTML || '').slice(0, 30000) };
}, opt.href || '/docs/');

fs.writeFileSync(path.join(dir, 'catalog.json'), JSON.stringify(res.cards, null, 2));
fs.writeFileSync(path.join(dir, 'catalog-main.html'), res.mainHTML);
fs.writeFileSync(path.join(dir, 'heads.json'), JSON.stringify(res.heads, null, 2));
fs.writeFileSync(path.join(dir, 'chips.json'), JSON.stringify(res.chips, null, 2));
console.log(JSON.stringify({ cards: res.cards.length, heads: res.heads.slice(0, 8), chips: res.chips.slice(0, 12), sample: res.cards[0]?.text }, null, 2));
await browser.close();
