// Confirm the CSS-skeleton previews resolve to their dark values, and check the home page links.
import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

await page.goto(`${BASE}/#/pro/docs/blocks`, { waitUntil: 'load' });
await page.waitForTimeout(1600);
console.log('block skeleton colors:', JSON.stringify(await page.evaluate(() => {
  const card = document.querySelector('main a[class*="rounded-xl"]');
  const nodes = Array.from(card.querySelectorAll('div[class*="bg-"]')).slice(0, 8);
  return nodes.map(n => ({
    cls: n.className.split(' ').filter(c => c.startsWith('bg-') || c.startsWith('dark:bg-')).join(' '),
    bg: getComputedStyle(n).backgroundColor,
  }));
}), null, 1));

await page.goto(`${BASE}/#/pro/docs/app-ui`, { waitUntil: 'load' });
await page.waitForTimeout(1400);
console.log('app-ui first card title:', await page.textContent('main a[class*="rounded-xl"] h3'));

await page.goto(`${BASE}/#/`, { waitUntil: 'load' });
await page.waitForTimeout(1200);
console.log('home sections:', await page.evaluate(() =>
  Array.from(document.querySelectorAll('.home-section-title')).map(h => h.textContent.replace(/\s+/g, ' ').trim())
));
console.log('catalog cards:', await page.evaluate(() =>
  Array.from(document.querySelectorAll('.home-section')).find(s => s.textContent.includes('Catalog pages'))
    ?.querySelectorAll('.home-card').length
));

await browser.close();
