// Generic prose/section extractor for the marketing pages behind the footer + sidebar links.
import { chromium } from 'playwright';
import fs from 'node:fs';

const PAGES = [
  ['about', 'https://pro.reactbits.dev/about'],
  ['license', 'https://pro.reactbits.dev/license'],
  ['privacy', 'https://pro.reactbits.dev/privacy'],
  ['roadmap', 'https://pro.reactbits.dev/roadmap'],
  ['changelog', 'https://pro.reactbits.dev/changelog'],
  ['testimonials', 'https://pro.reactbits.dev/testimonials'],
  ['use-cases', 'https://pro.reactbits.dev/use-cases'],
  ['compare', 'https://pro.reactbits.dev/compare'],
  ['alternatives', 'https://pro.reactbits.dev/alternatives'],
  ['affiliate', 'https://pro.reactbits.dev/affiliate'],
];

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
const out = {};

for (const [key, url] of PAGES) {
  await page.goto(url, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(2200);
  const blocks = await page.evaluate(() => {
    const norm = s => (s || '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
    const skipTags = new Set(['SCRIPT', 'STYLE', 'SVG', 'NAV', 'BUTTON', 'FOOTER', 'HEADER', 'ASIDE']);
    const result = [];
    const root = document.querySelector('main') || document.body;

    const format = (node, bucket) => {
      if (skipTags.has(node.tagName)) return;
      if (node.getAttribute('role') === 'navigation') return;
      const tag = node.tagName.toLowerCase();
      if (/^h[1-4]$/.test(tag)) {
        const text = norm(node.innerText);
        if (text) bucket.push({ type: tag === 'h4' ? 'h3' : tag, text });
        return;
      }
      if (tag === 'p') {
        const text = norm(node.innerText);
        if (text) bucket.push({ type: 'p', text });
        return;
      }
      if (tag === 'pre') {
        const code = node.innerText.replace(/\s+$/, '');
        if (code) bucket.push({ type: 'code', text: code });
        return;
      }
      if (tag === 'table') {
        const rows = Array.from(node.querySelectorAll('tr')).map(tr =>
          Array.from(tr.children).map(td => norm(td.innerText)),
        );
        if (rows.length) bucket.push({ type: 'table', rows });
        return;
      }
      if (tag === 'ul' || tag === 'ol') {
        const items = Array.from(node.children)
          .filter(li => li.tagName === 'LI')
          .map(li => norm(li.innerText));
        if (items.length) bucket.push({ type: 'list', ordered: tag === 'ol', items });
        return;
      }
      for (const child of node.children) format(child, bucket);
    };

    format(root, result);

    // collapse duplicates produced by nested wrappers
    const seen = new Set();
    return result.filter(block => {
      const key = `${block.type}:${block.text || (block.items || []).join('|')}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  });
  out[key] = blocks;
  const counts = blocks.reduce((acc, b) => ((acc[b.type] = (acc[b.type] || 0) + 1), acc), {});
  console.log(key, JSON.stringify(counts));
}

fs.writeFileSync('RECON/pro/site-content.json', JSON.stringify(out, null, 1));
await browser.close();
console.log('written RECON/pro/site-content.json');
