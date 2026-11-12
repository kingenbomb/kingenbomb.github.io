import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const specs = JSON.parse(readFileSync(new URL('../../src/pro/data/live-specs.json', import.meta.url), 'utf8'));
const blockSpecs = JSON.parse(readFileSync(new URL('../../src/pro/data/block-specs.json', import.meta.url), 'utf8'));
const detail = JSON.parse(readFileSync(new URL('../../src/pro/data/pro-detail.json', import.meta.url), 'utf8'));

const pages = [];
for (const slug of Object.keys(specs)) pages.push({ url: `#/pro/docs/components/${slug}`, kind: 'component', id: slug });
for (const kind of ['blocks', 'appUi']) {
  const prefix = kind === 'blocks' ? 'blocks' : 'app-ui';
  for (const cat of detail[kind]) {
    for (const variant of cat.variants) {
      pages.push({ url: `#/pro/docs/${prefix}/${cat.slug}/${variant.slug}`, kind: 'variant', id: variant.slug });
    }
  }
}

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e).slice(0, 140)));
page.on('console', m => {
  if (m.type() === 'error') errors.push(m.text().slice(0, 120));
});

const failures = [];
let done = 0;
for (const item of pages) {
  await page.goto(`http://localhost:4321/${item.url}`, { waitUntil: 'load' });
  await page.waitForTimeout(420);
  const ok = await page.evaluate(() => {
    const box = document.querySelector('figure .aspect-\\[16\\/9\\]');
    if (!box) return { ok: false, why: 'no preview box' };
    const canvas = box.querySelector('canvas');
    const nodes = box.querySelectorAll('*').length;
    if (canvas) return { ok: true, kind: 'canvas', nodes };
    if (nodes > 6) return { ok: true, kind: 'dom', nodes };
    return { ok: false, why: `sparse dom (${nodes})` };
  });
  if (!ok.ok) failures.push({ id: item.id, ...ok });
  done += 1;
  if (done % 100 === 0) console.log(`...${done}/${pages.length}`);
}

console.log(`checked ${pages.length} pages, failures ${failures.length}`);
if (failures.length) console.log(JSON.stringify(failures.slice(0, 12), null, 1));
console.log(`console/page errors: ${errors.length}`);
if (errors.length) console.log(errors.slice(0, 6));
await browser.close();
