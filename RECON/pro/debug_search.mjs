import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('http://localhost:5173/#/pro/docs/components', { waitUntil: 'load' });
await page.waitForTimeout(1500);

for (const query of ['定价', '光标', '渐变', '模板']) {
  const rows = await page.evaluate(async q => {
    const mod = await import('/src/pro/search.js');
    return mod.searchAll(q, 8).map(r => `${r.type}:${r.title}(${r.score})`);
  }, query);
  console.log(query, '->', rows.join(', '));
}

const stats = await page.evaluate(async () => {
  const mod = await import('/src/pro/search.js');
  return { entries: mod.SEARCH_ENTRY_COUNT };
});
console.log('index size', stats.entries);
await browser.close();
