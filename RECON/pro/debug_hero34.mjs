import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e).slice(0, 200)));

for (const port of [4321, 5173]) {
  const url = `http://localhost:${port}/#/pro/docs/blocks/hero-section/hero-34`;
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  const info = await page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent?.trim(),
    figures: document.querySelectorAll('figure').length,
    boxes: document.querySelectorAll('.aspect-\\[16\\/9\\]').length,
    body: document.body.innerText.replace(/\s+/g, ' ').slice(0, 120),
  }));
  console.log(port, JSON.stringify(info));
}
console.log('errors', errors.slice(0, 3));
await browser.close();
