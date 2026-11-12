import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
await page.goto('http://localhost:4321/#/pro/docs/components', { waitUntil: 'load' });
await page.waitForTimeout(1000);

// empty state with suggestions
await page.keyboard.press('Control+k');
await page.waitForTimeout(900);
await page.screenshot({ path: 'shots/search-idle.png' });
console.log('idle:', (await page.locator('[role="dialog"]').innerText()).replace(/\n+/g, ' | ').slice(0, 220));

// chinese query
await page.locator('input[placeholder*="搜索"]').fill('光标');
await page.waitForTimeout(800);
const first = await page.evaluate(() => {
  const row = document.querySelector('[role="dialog"] li button');
  return row ? [...row.querySelectorAll('span')].map(s => s.textContent.trim()).filter(Boolean).join(' || ') : '';
});
console.log('first row:', first.slice(0, 200));
await page.screenshot({ path: 'shots/search-chinese.png' });

// english query
await page.locator('input[placeholder*="搜索"]').fill('pricing table');
await page.waitForTimeout(800);
console.log('multiword:', await page.evaluate(() => [...document.querySelectorAll('[role="dialog"] li button')].slice(0, 4).map(b => b.innerText.replace(/\n/g, ' / ')).join(' | ')));
await page.screenshot({ path: 'shots/search-english.png' });

await browser.close();
