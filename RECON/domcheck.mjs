import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'msedge' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on('pageerror', e => errs.push(String(e).slice(0, 300)));
p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 300)); });
await p.goto('http://localhost:4173/#/components/holo-card', { waitUntil: 'load' });
await p.waitForTimeout(3000);
const info = await p.evaluate(() => ({
  bodyLen: document.body.innerHTML.length,
  mainCount: document.querySelectorAll('main').length,
  mainChildren: document.querySelectorAll('main *').length,
  rootChildren: document.getElementById('root')?.children.length ?? -1,
  h1: document.querySelector('h1')?.textContent?.slice(0, 80) ?? null
}));
console.log(JSON.stringify(info, null, 2));
console.log('errors:', errs.length ? errs : 'none');
await b.close();
