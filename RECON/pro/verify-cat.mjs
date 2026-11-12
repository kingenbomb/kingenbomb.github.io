// Focused check of the free category browse pages.
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = 'http://localhost:5173';
const SHOTS = 'RECON/pro/shots';
fs.mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

for (const cat of ['animations', 'text-animations', 'backgrounds', 'micro', 'components']) {
  const errors = [];
  page.removeAllListeners('console');
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text().slice(0, 160));
  });
  await page.goto(`${BASE}/#/c/${cat}`, { waitUntil: 'load' });
  await page.waitForTimeout(2200);

  const info = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.cat-card'));
    const first = cards[0];
    const media = first?.querySelector('.cat-media');
    const poster = first?.querySelector('.cat-poster');
    const grid = document.querySelector('.cat-grid');
    const cols = grid ? getComputedStyle(grid).gridTemplateColumns.split(' ').length : 0;
    return {
      h1: document.querySelector('h1')?.textContent,
      lead: document.querySelector('.cat-lead')?.textContent?.slice(0, 70),
      cards: cards.length,
      cols,
      cardBox: first ? { w: Math.round(first.getBoundingClientRect().width), h: Math.round(first.getBoundingClientRect().height) } : null,
      mediaBox: media ? { w: Math.round(media.getBoundingClientRect().width), h: Math.round(media.getBoundingClientRect().height) } : null,
      posterOk: poster ? poster.naturalWidth > 0 : null,
      posterSrc: poster?.getAttribute('src'),
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      firstNames: cards.slice(0, 4).map(c => c.querySelector('.cat-name')?.textContent),
      promo: document.querySelector('.cat-promo h2')?.textContent,
      sortChips: Array.from(document.querySelectorAll('.cat-sort-btn')).map(b => b.textContent),
    };
  });

  console.log(`\n### ${cat}`, JSON.stringify(info));
  if (errors.length) console.log('   ERRORS:', errors.slice(0, 4));

  // hover the first card and see whether the video starts
  await page.hover('.cat-card');
  await page.waitForTimeout(1200);
  const hovered = await page.evaluate(() => {
    const v = document.querySelector('.cat-card video');
    return v ? { cls: v.className, paused: v.paused, readyState: v.readyState, w: v.videoWidth, src: v.getAttribute('src') } : null;
  });
  console.log('   hover video:', JSON.stringify(hovered));

  await page.screenshot({ path: `${SHOTS}/cat-${cat}.png` });
}

await browser.close();
console.log('\ndone');
