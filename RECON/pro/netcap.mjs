// Network + DOM capture for a page. Saves JSON bodies, screenshots, and a DOM summary.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = {};
for (let i = 0; i < args.length; i += 2) opt[args[i].replace(/^--/, '')] = args[i + 1];

const url = opt.url;
const outDir = opt.out || 'netcap';
const label = opt.label || 'page';
const wait = Number(opt.wait || 6000);
if (!url) {
  console.error('usage: node netcap.mjs --url <url> --out <dir> --label <name>');
  process.exit(1);
}

const dir = path.join(outDir, label);
fs.mkdirSync(dir, { recursive: true });

const browser = await chromium.launch({ channel: opt.channel || 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const requests = [];
page.on('response', async res => {
  const req = res.request();
  const u = res.url();
  const ct = (res.headers()['content-type'] || '').toLowerCase();
  const rec = { url: u, status: res.status(), type: req.resourceType(), ct };
  requests.push(rec);
  if (ct.includes('json') && res.status() === 200) {
    try {
      const body = await res.text();
      const name = u.replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 180);
      fs.writeFileSync(path.join(dir, `${name}.json`), body);
      rec.saved = `${name}.json`;
      rec.bytes = body.length;
    } catch (e) {
      rec.saveError = String(e).slice(0, 200);
    }
  }
});

const consoleMsgs = [];
page.on('console', m => consoleMsgs.push({ type: m.type(), text: m.text().slice(0, 300) }));
page.on('pageerror', e => consoleMsgs.push({ type: 'pageerror', text: String(e).slice(0, 300) }));

await page.goto(url, { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(wait);
await page.screenshot({ path: path.join(dir, 'viewport.png') });
await page.screenshot({ path: path.join(dir, 'full.png'), fullPage: true });

const dom = await page.evaluate(() => {
  const pick = sel => Array.from(document.querySelectorAll(sel)).slice(0, 40).map(el => ({
    tag: el.tagName.toLowerCase(),
    cls: (el.className || '').toString().slice(0, 120),
    text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120),
    href: el.getAttribute('href') || undefined
  }));
  const counts = {};
  for (const sel of ['img', 'video', 'a[href^="/docs/"]', 'article', 'main', 'section', 'canvas', '[data-radix-scroll-area-viewport]']) {
    counts[sel] = document.querySelectorAll(sel).length;
  }
  return {
    title: document.title,
    counts,
    h1: pick('h1'),
    h2: pick('h2'),
    h3: pick('h3'),
    imgs: Array.from(document.querySelectorAll('img')).slice(0, 20).map(i => i.currentSrc || i.src),
    videos: Array.from(document.querySelectorAll('video source, video')).slice(0, 20).map(v => v.currentSrc || v.src),
    bodyLen: document.body.innerText.length,
    bodyHead: document.body.innerText.slice(0, 3000)
  };
});

fs.writeFileSync(path.join(dir, 'requests.json'), JSON.stringify(requests, null, 2));
fs.writeFileSync(path.join(dir, 'dom.json'), JSON.stringify(dom, null, 2));
fs.writeFileSync(path.join(dir, 'console.json'), JSON.stringify(consoleMsgs, null, 2));

console.log(JSON.stringify({
  title: dom.title,
  counts: dom.counts,
  jsonSaved: requests.filter(r => r.saved).map(r => r.saved),
  bodyLen: dom.bodyLen,
  errors: consoleMsgs.filter(m => m.type === 'error' || m.type === 'pageerror').length
}, null, 2));

await browser.close();
