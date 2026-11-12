// Flatten the three public prose pages (/docs/introduction, /docs/installation, /docs/mcp)
// into a block list our own DocPage can render.
import { chromium } from 'playwright';
import fs from 'node:fs';

const PAGES = [
  ['introduction', 'https://pro.reactbits.dev/docs/introduction'],
  ['installation', 'https://pro.reactbits.dev/docs/installation'],
  ['mcp', 'https://pro.reactbits.dev/docs/mcp'],
];

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
const out = {};

for (const [key, url] of PAGES) {
  await page.goto(url, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(2500);
  const blocks = await page.evaluate(() => {
    const norm = s => (s || '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
    const skip = new Set(['SCRIPT', 'STYLE', 'SVG', 'NAV', 'BUTTON']);
    const result = [];

    const walk = el => {
      for (const node of el.children) {
        if (skip.has(node.tagName)) continue;
        const tag = node.tagName.toLowerCase();
        const role = node.getAttribute('role');
        if (role === 'tablist') {
          const bar = node.parentElement;
          const panels = Array.from(bar.querySelectorAll('[role="tabpanel"]'));
          const tabs = Array.from(node.querySelectorAll('[role="tab"]')).map(t => ({ label: t.innerText.trim(), controls: t.getAttribute('aria-controls') }));
          if (panels.length) {
            result.push({
              type: 'tabs',
              tabs: tabs.map((t, i) => ({ label: t.label, blocks: [] })),
            });
            // walk panels individually into the last tabs block
            const tabBlock = result[result.length - 1];
            panels.forEach((panel, i) => {
              if (!tabBlock.tabs[i]) tabBlock.tabs[i] = { label: `Tab ${i + 1}`, blocks: [] };
              const inner = [];
              const sub = node2 => {
                for (const c of node2.children) format(c, inner);
              };
              sub(panel);
              tabBlock.tabs[i].blocks = inner;
            });
            continue;
          }
        }
        format(node, result);
      }
    };

    const format = (node, bucket) => {
      if (skip.has(node.tagName)) return;
      const tag = node.tagName.toLowerCase();
      if (/^h[1-3]$/.test(tag)) {
        bucket.push({ type: tag, text: norm(node.innerText) });
        return;
      }
      if (tag === 'p') {
        const link = node.querySelector('a[href]');
        bucket.push({ type: 'p', text: norm(node.innerText), href: link?.getAttribute('href') || null });
        return;
      }
      if (tag === 'ul' || tag === 'ol') {
        const items = Array.from(node.children)
          .filter(li => li.tagName === 'LI')
          .map(li => norm(li.innerText));
        if (items.length) bucket.push({ type: 'list', ordered: tag === 'ol', items });
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
      if (node.children.length) walk(node);
      else if (norm(node.innerText)) bucket.push({ type: 'p', text: norm(node.innerText) });
    };

    const main = document.querySelector('main');
    walk(main);
    return result;
  });
  out[key] = blocks;
  const counts = blocks.reduce((acc, b) => ((acc[b.type] = (acc[b.type] || 0) + 1), acc), {});
  console.log(key, JSON.stringify(counts));
}

fs.writeFileSync('RECON/pro/docs-content.json', JSON.stringify(out, null, 1));
await browser.close();
console.log('written RECON/pro/docs-content.json');
