import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('http://localhost:5173/#/pro/docs/components', { waitUntil: 'load' });
await page.waitForTimeout(1800);

const queries = ['光标', '环形', '光效', '卡片式', '圆环', '仪表盘', '对话框', '表格', '登录', '移动端', '不存在的词'];
for (const query of queries) {
  const rows = await page.evaluate(async q => {
    const mod = await import('/src/pro/search.js');
    return mod.searchAll(q, 4).map(r => `${r.title}(${r.score})`);
  }, query);
  console.log(query.padEnd(8), rows.length ? rows.join(', ') : '— nothing');
}
await browser.close();
