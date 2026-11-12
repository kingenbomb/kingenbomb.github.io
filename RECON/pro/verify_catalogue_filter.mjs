import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e).slice(0, 160)));

for (const q of ['', '光标', 'gradient', '粒子', 'pricing']) {
  const url = `http://localhost:4321/#/pro/docs/components${q ? `?q=${encodeURIComponent(q)}` : ''}`;
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  const info = await page.evaluate(() => {
    const grid = [...document.querySelectorAll('main .grid')].find(node => node.querySelector('a[href^="#"], a'));
    const cards = grid ? grid.querySelectorAll(':scope > a').length : 0;
    const counter = [...document.querySelectorAll('main p')].map(p => p.textContent.trim()).find(t => /component/.test(t)) || '';
    const empty = !!document.querySelector('main p')?.textContent?.includes('No results');
    return { cards, counter, empty };
  });
  console.log((q || '(none)').padEnd(10), JSON.stringify(info));
}
console.log('errors', errors.length);
await browser.close();
