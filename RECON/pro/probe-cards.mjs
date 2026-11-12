// Dump anchors matching an href prefix, plus their card markup and the parent grid styles.
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
await page.waitForTimeout(3500);
for (let i = 0; i < Number(opt.scroll || 8); i++) {
  await page.mouse.wheel(0, 1400);
  await page.waitForTimeout(280);
}
await page.waitForTimeout(1000);

const res = await page.evaluate(prefix => {
  const as = Array.from(document.querySelectorAll(`a[href*="${prefix}"]`));
  const first = as.find(a => a.querySelector('h3, [class*="name"], [class*="title"]')) || as[0];
  if (!first) return { count: 0 };
  const grid = first.parentElement;
  const gcs = getComputedStyle(grid);
  const cs = getComputedStyle(first);
  return {
    count: as.length,
    hrefs: as.slice(0, 8).map(a => a.getAttribute('href')),
    cardHTML: first.outerHTML.slice(0, 8000),
    cardStyles: {
      className: first.className, display: cs.display, width: cs.width, height: cs.height,
      padding: cs.padding, borderRadius: cs.borderRadius, background: cs.backgroundColor,
      border: cs.border, overflow: cs.overflow
    },
    gridStyles: {
      className: grid.className, display: gcs.display, gridTemplateColumns: gcs.gridTemplateColumns,
      gap: gcs.gap, width: gcs.width, padding: gcs.padding
    },
    gridChildren: grid.children.length,
    imgs: Array.from(document.querySelectorAll('img')).slice(0, 6).map(i => i.currentSrc || i.src),
    videos: Array.from(document.querySelectorAll('video')).slice(0, 6).map(v => ({ src: v.currentSrc || v.src, poster: v.poster }))
  };
}, opt.href || '/animations/');

fs.writeFileSync(path.join(dir, 'cards-probe.json'), JSON.stringify(res, null, 2));
console.log(JSON.stringify({ count: res.count, hrefs: res.hrefs, cardStyles: res.cardStyles, gridStyles: res.gridStyles, gridChildren: res.gridChildren, imgs: res.imgs, videos: res.videos }, null, 2));
await browser.close();
