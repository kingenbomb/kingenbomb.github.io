import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('RECON/shots-merge', { recursive: true });

const BASE = process.argv[2] || 'http://localhost:5173/';
const targets = [
  { name: 'rb-home', hash: '#/', wait: '.sidebar-brand', shot: true },
  { name: 'rs-home', hash: '#/rsuite', wait: 'text=React Suite Clone', shot: true },
  { name: 'rs-button', hash: '#/rsuite/components/button', wait: '[data-page-id="button"]', shot: true },
  { name: 'rs-table', hash: '#/rsuite/components/table', wait: '[data-page-id="table"]', shot: false },
  { name: 'rs-404', hash: '#/rsuite/components/does-not-exist', wait: 'text=页面不存在', shot: false },
  { name: 'rb-back', hash: '#/text-animations/shiny-text', wait: '.page-header--component', shot: false },
];

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on('console', m => {
  if (m.type() === 'error') errors.push(`[console] ${m.text().slice(0, 300)}`);
});
page.on('pageerror', e => errors.push(`[pageerror] ${String(e).slice(0, 300)}`));

for (const t of targets) {
  errors.length = 0;
  try {
    await page.goto(BASE + t.hash, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector(t.wait, { timeout: 90000 });
    await page.waitForTimeout(2500);
    if (t.shot) {
      await page.screenshot({ path: `RECON/shots-merge/${t.name}.png`, fullPage: false });
    }
    const title = await page.title();
    const heading = await page
      .locator('h1, .sidebar-brand, header h1')
      .first()
      .innerText()
      .catch(() => '?');
    console.log(`OK   ${t.name.padEnd(10)} title="${title.slice(0, 40)}" heading="${heading.slice(0, 50)}"`);
  } catch (e) {
    console.log(`FAIL ${t.name.padEnd(10)} ${String(e).split('\n')[0].slice(0, 160)}`);
  }
  for (const err of errors.slice(0, 4)) console.log(`     err: ${err}`);
}

await browser.close();
console.log('done');
