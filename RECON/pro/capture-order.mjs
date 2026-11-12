// Capture the real "Newest" ordering of every free category page.
// The grid is virtualised, so we scroll in steps and collect card keys as they mount.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const CATS = ['text-animations', 'animations', 'components', 'backgrounds', 'micro'];
const out = {};

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

async function collect() {
  return page.evaluate(() => {
    const seen = [];
    for (const card of document.querySelectorAll('a.browse-card')) {
      const key = card.getAttribute('data-item-key') || card.getAttribute('href');
      if (key && !seen.includes(key)) seen.push(key);
    }
    return seen;
  });
}

for (const cat of CATS) {
  await page.goto(`https://reactbits.dev/c/${cat}`, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(3500);

  // switch to newest if the chip exists
  const clicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, [role="tab"], [role="radio"]'));
    const target = buttons.find(b => /^\s*Newest\s*$/i.test(b.textContent || ''));
    if (!target) return false;
    target.click();
    return true;
  });
  await page.waitForTimeout(1200);

  const order = [];
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  for (let i = 0; i < 220; i++) {
    for (const key of await collect()) if (!order.includes(key)) order.push(key);
    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(180);
    const after = await page.evaluate(() => window.scrollY);
    const height = await page.evaluate(() => document.body.scrollHeight);
    if (after === before && after + 1000 >= height) {
      for (const key of await collect()) if (!order.includes(key)) order.push(key);
      break;
    }
  }
  out[cat] = { clicked, order, total: order.length };
  console.log(cat, 'clickedNewest=', clicked, 'captured=', order.length);
}

fs.mkdirSync(path.join('RECON', 'pro'), { recursive: true });
fs.writeFileSync(path.join('RECON', 'pro', 'free-order.json'), JSON.stringify(out, null, 1));
console.log('written');
await browser.close();
