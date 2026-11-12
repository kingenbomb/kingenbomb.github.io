import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5173/#/rsuite', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('text=React Suite Clone', { timeout: 90000 });
await page.waitForTimeout(2000);

const info = await page.evaluate(() => {
  const out = [];
  for (const a of document.querySelectorAll('a')) {
    const cls = a.className || '';
    if (typeof cls === 'string' && cls.includes('bg-[#1c1f23]')) {
      const cs = getComputedStyle(a);
      out.push({
        text: a.textContent.trim().slice(0, 30),
        color: cs.color,
        bg: cs.backgroundColor,
        fontSize: cs.fontSize,
        visible: a.offsetWidth > 0 && a.offsetHeight > 0,
        w: a.offsetWidth,
        h: a.offsetHeight,
      });
    }
  }
  const root = getComputedStyle(document.documentElement);
  return { buttons: out, cw: root.getPropertyValue('--color-white').trim() };
});

console.log(JSON.stringify(info, null, 2));
await browser.close();
