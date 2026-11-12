// Interaction test for the Pro docs pages: search, sort, filters, section switcher, card counts.
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = 'http://localhost:5173';
const SHOTS = 'RECON/pro/shots';
fs.mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('console', msg => {
  if (msg.type() === 'error') errors.push(msg.text().slice(0, 200));
});

const countCards = () =>
  page.evaluate(() => {
    const a = document.querySelectorAll('main a[class*="rounded-xl"]').length;
    const tpl = document.querySelectorAll('main div[class*="rounded-xl"][class*="overflow-hidden"]').length;
    const li = document.querySelectorAll('main ul > li[class*="rounded-xl"]').length;
    return { anchors: a, templates: tpl, agentCards: li };
  });

// ---------- components ----------
await page.goto(`${BASE}/#/pro/docs/components`, { waitUntil: 'load' });
await page.waitForTimeout(1800);
console.log('components total:', await countCards());

await page.fill('input[aria-label="Search components..."]', 'glitch');
await page.waitForTimeout(400);
console.log('search "glitch":', await countCards(), 'counter:', await page.textContent('main p.tabular-nums'));

await page.fill('input[aria-label="Search components..."]', '');
await page.waitForTimeout(300);
await page.click('button[role="radio"]:has-text("A–Z")');
await page.waitForTimeout(400);
console.log('after A–Z, first names:', await page.evaluate(() =>
  Array.from(document.querySelectorAll('main h3')).slice(0, 3).map(h => h.textContent)
));

await page.click('button[role="radio"]:has-text("Text")');
await page.waitForTimeout(400);
console.log('filter Text:', await countCards());

await page.click('button[role="radio"]:has-text("Z–A")');
await page.waitForTimeout(300);
console.log('Z–A first:', await page.evaluate(() =>
  Array.from(document.querySelectorAll('main h3')).slice(0, 2).map(h => h.textContent)
));

// sidebar deep link
await page.goto(`${BASE}/#/pro/docs/components?q=aurora`, { waitUntil: 'load' });
await page.waitForTimeout(1200);
console.log('deep link ?q=aurora:', await countCards(), 'input value:', await page.inputValue('input[aria-label="Search components..."]'));

// section switcher
await page.click('aside button[aria-expanded]');
await page.waitForTimeout(300);
console.log('switcher items:', await page.evaluate(() =>
  Array.from(document.querySelectorAll('aside a')).filter(a => /Agent Kit|Application UI|Blocks|Templates/.test(a.textContent)).slice(0, 4).map(a => a.textContent.trim())
));
await page.keyboard.press('Escape');
await page.screenshot({ path: `${SHOTS}/pro-components-list.png` });

// ---------- templates ----------
await page.goto(`${BASE}/#/pro/docs/templates`, { waitUntil: 'load' });
await page.waitForTimeout(1500);
console.log('templates:', await countCards());
console.log('template buttons:', await page.evaluate(() =>
  Array.from(document.querySelectorAll('main a')).filter(a => /Buy Template|Or Unlock All|Live Preview|View Details/.test(a.textContent)).slice(0, 4).map(a => a.textContent.trim())
));

// ---------- agent kit ----------
await page.goto(`${BASE}/#/pro/docs/agent-kit`, { waitUntil: 'load' });
await page.waitForTimeout(1500);
console.log('agent kit cards:', await countCards());
await page.click('button[role="radio"]:has-text("Prompts")');
await page.waitForTimeout(400);
console.log('filter Prompts:', await countCards());

// ---------- /pro redirect ----------
await page.goto(`${BASE}/#/pro`, { waitUntil: 'load' });
await page.waitForTimeout(1200);
console.log('/pro ->', page.url());

console.log('\nconsole errors:', errors.length ? errors.slice(0, 8) : 'none');
await browser.close();
