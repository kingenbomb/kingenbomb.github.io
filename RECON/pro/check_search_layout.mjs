import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'msedge' });
const errors = [];

// mobile: nav fits, search icon opens the dialog
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on('pageerror', e => errors.push(String(e).slice(0, 150)));
await mobile.goto('http://localhost:4321/#/pro/docs/components', { waitUntil: 'load' });
await mobile.waitForTimeout(1200);
const nav = await mobile.evaluate(() => {
  const bar = document.querySelector('nav');
  const buttons = [...bar.querySelectorAll('button')].map(b => b.getAttribute('aria-label') || b.innerText.trim().slice(0, 12));
  return { height: Math.round(bar.getBoundingClientRect().height), overflow: bar.scrollWidth - bar.clientWidth, buttons };
});
console.log('mobile nav', JSON.stringify(nav));
await mobile.locator('nav button[title*="Search"]').click();
await mobile.waitForTimeout(700);
const dialog = await mobile.evaluate(() => {
  const d = document.querySelector('[role="dialog"]');
  if (!d) return { open: false };
  const panel = d.querySelector('div');
  const r = panel.getBoundingClientRect();
  return { open: true, w: Math.round(r.width), h: Math.round(r.height), focused: document.activeElement?.tagName };
});
console.log('mobile dialog', JSON.stringify(dialog));
await mobile.screenshot({ path: 'shots/search-mobile.png' });

// desktop geometry
const desktop = await browser.newPage({ viewport: { width: 1440, height: 950 } });
await desktop.goto('http://localhost:4321/#/pro/docs/blocks', { waitUntil: 'load' });
await desktop.waitForTimeout(1200);
await desktop.keyboard.press('Control+k');
await desktop.waitForTimeout(800);
const geo = await desktop.evaluate(() => {
  const panel = document.querySelector('[role="dialog"] > div');
  const r = panel.getBoundingClientRect();
  return { top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) };
});
console.log('desktop panel', JSON.stringify(geo));
console.log('errors', errors.slice(0, 3));
await browser.close();
