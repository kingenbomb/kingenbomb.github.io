// Dump the markup + styles of whatever element holds a given text (used for the free category grid).
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
for (let i = 0; i < Number(opt.scroll || 6); i++) {
  await page.mouse.wheel(0, 1500);
  await page.waitForTimeout(300);
}
await page.waitForTimeout(1000);

const out = await page.evaluate(needle => {
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  const hits = [];
  while ((node = walk.nextNode())) {
    if (node.textContent.trim().toUpperCase() === needle.toUpperCase()) hits.push(node.parentElement);
  }
  const el = hits[0];
  if (!el) return { hits: 0 };
  // climb to the card-ish ancestor
  let card = el;
  for (let i = 0; i < 6 && card.parentElement; i++) {
    const p = card.parentElement;
    if (p.children.length > 1) break;
    card = p;
  }
  const cs = getComputedStyle(card);
  const grid = card.parentElement;
  const gcs = grid ? getComputedStyle(grid) : null;
  return {
    hits: hits.length,
    cardHTML: card.outerHTML.slice(0, 6000),
    cardStyles: {
      display: cs.display, width: cs.width, height: cs.height, padding: cs.padding,
      borderRadius: cs.borderRadius, background: cs.backgroundColor, border: cs.border,
      className: card.className
    },
    gridStyles: gcs && {
      display: gcs.display, gridTemplateColumns: gcs.gridTemplateColumns, gap: gcs.gap,
      className: grid.className, width: gcs.width
    },
    siblings: grid ? grid.children.length : 0,
    firstChildsHTML: grid ? Array.from(grid.children).slice(0, 2).map(c => c.outerHTML.slice(0, 1200)) : []
  };
}, opt.text || 'ANIMATIONS');

fs.writeFileSync(path.join(dir, 'probe.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify({ hits: out.hits, cardStyles: out.cardStyles, gridStyles: out.gridStyles, siblings: out.siblings }, null, 2));
await browser.close();
