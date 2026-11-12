// Card extractor that works from headings: climb from each h3 to its card container.
// Also supports --selector for a direct element selector.
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
for (let i = 0; i < Number(opt.scroll || 10); i++) {
  await page.mouse.wheel(0, 1600);
  await page.waitForTimeout(260);
}
await page.waitForTimeout(1200);

const out = await page.evaluate(cfg => {
  const grab = el => ({
    text: el.innerText.split('\n').map(t => t.trim()).filter(Boolean),
    imgs: Array.from(el.querySelectorAll('img')).map(i => i.getAttribute('src')),
    videos: Array.from(el.querySelectorAll('video')).map(v => ({ src: v.getAttribute('src') || v.currentSrc, poster: v.getAttribute('poster'), cls: v.className.slice(0, 60) })),
    sources: Array.from(el.querySelectorAll('source')).map(s => s.getAttribute('src')),
    links: Array.from(el.querySelectorAll('a')).map(a => ({ href: a.getAttribute('href'), text: a.innerText.trim().slice(0, 40) })),
    className: (el.className || '').toString().slice(0, 200),
    tag: el.tagName.toLowerCase()
  });

  if (cfg.selector) {
    const els = Array.from(document.querySelectorAll(cfg.selector));
    return { mode: 'selector', items: els.map(el => ({ ...grab(el), html: el.outerHTML.slice(0, 4000) })) };
  }

  const heads = Array.from(document.querySelectorAll('main h3'));
  const seen = new Set();
  const items = [];
  for (const h of heads) {
    let el = h;
    let hops = 0;
    while (el.parentElement && hops < 6) {
      el = el.parentElement;
      hops++;
      const hasMedia = el.querySelector('img, video');
      const rounded = /rounded/.test(el.className || '');
      if ((hasMedia && rounded) || (hasMedia && hops >= 2) || (/card/.test(el.className || '') && hops >= 2)) break;
    }
    if (seen.has(el)) continue;
    seen.add(el);
    items.push({ ...grab(el), html: el.outerHTML.slice(0, 4000) });
  }
  return { mode: 'h3', items };
}, { selector: opt.selector || null });

fs.writeFileSync(path.join(dir, 'items.json'), JSON.stringify(out.items, null, 2));
console.log(JSON.stringify({
  mode: out.mode, n: out.items.length,
  sample: out.items[0] && {
    text: out.items[0].text.slice(0, 5),
    videos: out.items[0].videos,
    imgs: out.items[0].imgs,
    links: out.items[0].links.slice(0, 4),
    className: out.items[0].className
  }
}, null, 2));
await browser.close();
