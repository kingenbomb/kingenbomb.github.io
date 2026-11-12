// Smoke-test the new Pro docs pages + free category browse pages in the running dev server.
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = 'http://localhost:5173';
const SHOTS = 'RECON/pro/shots';
fs.mkdirSync(SHOTS, { recursive: true });

const pages = [
  ['components', '/#/pro/docs/components'],
  ['blocks', '/#/pro/docs/blocks'],
  ['app-ui', '/#/pro/docs/app-ui'],
  ['templates', '/#/pro/docs/templates'],
  ['agent-kit', '/#/pro/docs/agent-kit'],
  ['cat-animations', '/#/c/animations'],
  ['cat-text', '/#/c/text-animations'],
];

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

for (const [name, path] of pages) {
  const errors = [];
  const failed = [];
  page.removeAllListeners('console');
  page.removeAllListeners('requestfailed');
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text().slice(0, 200));
  });
  page.on('requestfailed', req => failed.push(`${req.url().slice(0, 120)} ${req.failure()?.errorText}`));

  await page.goto(BASE + path, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2500);

  const info = await page.evaluate(() => {
    const q = sel => document.querySelector(sel);
    const qa = sel => document.querySelectorAll(sel);
    const style = (el, prop) => (el ? getComputedStyle(el)[prop] : null);
    const nav = q('nav');
    const sidebar = q('aside');
    const h1 = q('h1');
    const card = qa('a[class*="rounded-xl"]')[0] || qa('.cat-card')[0];
    const imgs = Array.from(qa('img')).slice(0, 4).map(i => ({
      src: i.currentSrc || i.src,
      w: i.naturalWidth,
      h: i.naturalHeight,
    }));
    const videos = Array.from(qa('video')).slice(0, 3).map(v => ({
      src: (v.currentSrc || v.src || '').split('/').pop(),
      poster: (v.poster || '').split('/').pop(),
      ready: v.readyState,
    }));
    return {
      title: document.title,
      h1: h1?.textContent?.trim(),
      navBg: style(nav, 'backgroundColor'),
      navH: nav?.getBoundingClientRect().height,
      sidebarW: sidebar?.getBoundingClientRect().width,
      sidebarTop: sidebar?.getBoundingClientRect().top,
      cardBg: style(card, 'backgroundColor'),
      cardRadius: style(card, 'borderRadius'),
      cardW: card?.getBoundingClientRect().width,
      cards: qa('a[class*="rounded-xl"]').length || qa('.cat-card').length,
      catCards: qa('.cat-card').length,
      sidebarLinks: qa('aside a').length,
      text: document.body.innerText.slice(0, 160).replace(/\s+/g, ' '),
      imgs,
      videos,
      h1Size: style(h1, 'fontSize'),
      font: style(document.body, 'fontFamily'),
    };
  });

  console.log(`\n### ${name} ${path}`);
  console.log(JSON.stringify(info, null, 1));
  if (errors.length) console.log('CONSOLE ERRORS:', errors.slice(0, 5));
  if (failed.length) console.log('REQ FAILED:', failed.slice(0, 6));

  await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: false });
}

await browser.close();
console.log('\nshots ->', SHOTS);
