import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const detail = JSON.parse(readFileSync(new URL('../../src/pro/data/pro-detail.json', import.meta.url), 'utf8'));
const picks = [];
for (const kind of ['blocks', 'appUi']) {
  for (const cat of detail[kind]) {
    const last = cat.variants[cat.variants.length - 1];
    picks.push([kind, cat.slug, last.slug]);
  }
}
const sample = picks.filter((_, i) => i % 7 === 0).slice(0, 40);

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
let issues = 0;
for (const [kind, cat, variant] of sample) {
  const prefix = kind === 'blocks' ? 'blocks' : 'app-ui';
  const url = `http://localhost:5173/#/pro/docs/${prefix}/${cat}/${variant}`;
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  const metrics = await page.evaluate(() => {
    const box = document.querySelector('figure .aspect-\\[16\\/9\\]');
    if (!box) return { ok: false, spill: -999 };
    const rect = box.getBoundingClientRect();
    let spill = 0;
    box.querySelectorAll('*').forEach(node => {
      const r = node.getBoundingClientRect();
      spill = Math.max(spill, Math.round(r.right - rect.right), Math.round(rect.left - r.left));
    });
    return { ok: box.scrollWidth - box.clientWidth === 0, spill };
  });
  if (!metrics.ok || metrics.spill > 2) {
    issues += 1;
    console.log('ISSUE', cat, variant, JSON.stringify(metrics));
  }
}
console.log(`dev-mode checked ${sample.length} variant pages, issues: ${issues}`);
await browser.close();
