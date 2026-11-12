import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e).slice(0, 160)));
page.on('console', m => {
  if (m.type() === 'error') errors.push(m.text().slice(0, 140));
});

await page.goto('http://localhost:4321/#/pro/docs/components', { waitUntil: 'load' });
await page.waitForTimeout(1200);

async function query(text) {
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(500);
  const input = page.locator('input[placeholder*="搜索"]');
  await input.fill(text);
  await page.waitForTimeout(700);
  const rows = await page.evaluate(() => {
    const items = [...document.querySelectorAll('[role="dialog"] li button')];
    return items.slice(0, 6).map(node => ({
      type: node.querySelector('span')?.textContent?.trim(),
      title: node.querySelectorAll('span span')[0]?.textContent?.trim(),
      meta: node.querySelectorAll('span span')[1]?.textContent?.trim()?.slice(0, 46),
    }));
  });
  const status = await page.evaluate(() => document.querySelector('[role="dialog"] li') ? 'results' : document.querySelector('[role="dialog"]')?.innerText?.slice(0, 60));
  console.log(`\n[${text}] ${status}`);
  rows.forEach(row => console.log('  ', (row.type || '').padEnd(16), (row.title || '').padEnd(26), row.meta || ''));
  return rows;
}

for (const text of ['光标', '渐变', '粒子', '定价', 'cursor', 'gradient', 'hero', '模板', '3D', '不存在的词']) {
  await query(text);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
}

// keyboard flow: open, type, arrow down, enter
await page.keyboard.press('Control+k');
await page.waitForTimeout(400);
await page.locator('input[placeholder*="搜索"]').fill('光标');
await page.waitForTimeout(600);
await page.keyboard.press('ArrowDown');
await page.keyboard.press('Enter');
await page.waitForTimeout(1200);
console.log('\nafter Enter, url =', page.url());

// components page inline filter with chinese
await page.goto('http://localhost:4321/#/pro/docs/components?q=' + encodeURIComponent('光标'), { waitUntil: 'load' });
await page.waitForTimeout(1200);
const count = await page.evaluate(() => document.querySelectorAll('a[href*="/pro/docs/components/"]').length);
console.log('catalogue ?q=光标 ->', count, 'cards');

await page.goto('http://localhost:4321/#/pro/docs/components?q=gradient', { waitUntil: 'load' });
await page.waitForTimeout(1200);
const count2 = await page.evaluate(() => document.querySelectorAll('a[href*="/pro/docs/components/"]').length);
console.log('catalogue ?q=gradient ->', count2, 'cards');

console.log('\nerrors:', errors.slice(0, 4));
await browser.close();
