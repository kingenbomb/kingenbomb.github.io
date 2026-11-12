// Layout sanity: card size vs the live site, sidebar scrolling, mobile breakpoint, card links.
import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const browser = await chromium.launch({ channel: 'msedge' });

// --- desktop metrics on the components page
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(`${BASE}/#/pro/docs/components`, { waitUntil: 'load' });
await page.waitForTimeout(1600);

console.log('desktop:', JSON.stringify(await page.evaluate(() => {
  const card = document.querySelector('main a[class*="rounded-xl"]');
  const media = card?.querySelector('div[class*="aspect"]');
  const aside = document.querySelector('aside');
  const scroller = aside?.querySelector('.pro-scroll');
  const grid = document.querySelector('main .grid');
  return {
    card: card && { w: Math.round(card.getBoundingClientRect().width), h: Math.round(card.getBoundingClientRect().height) },
    media: media && { w: Math.round(media.getBoundingClientRect().width), h: Math.round(media.getBoundingClientRect().height) },
    gridCols: grid && getComputedStyle(grid).gridTemplateColumns,
    aside: aside && { h: Math.round(aside.getBoundingClientRect().height) },
    scroller: scroller && { scrollH: scroller.scrollHeight, clientH: scroller.clientHeight, overflowY: getComputedStyle(scroller).overflowY },
    bodyOverflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    footerCols: document.querySelectorAll('footer ul').length,
  };
})));

// scroll the sidebar to the bottom and make sure the last item is reachable
const scrolled = await page.evaluate(() => {
  const s = document.querySelector('aside .pro-scroll');
  if (!s) return null;
  s.scrollTop = s.scrollHeight;
  const last = s.querySelector('nav a:last-child');
  return last?.textContent?.trim();
});
console.log('sidebar last item after scroll:', scrolled);

// --- mobile
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(`${BASE}/#/pro/docs/components`, { waitUntil: 'load' });
await mobile.waitForTimeout(1500);
console.log('mobile:', JSON.stringify(await mobile.evaluate(() => ({
  asideVisible: !!document.querySelector('aside')?.getBoundingClientRect().width,
  asideWidth: document.querySelector('aside')?.getBoundingClientRect().width,
  gridCols: getComputedStyle(document.querySelector('main .grid')).gridTemplateColumns.split(' ').length,
  overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  h1: document.querySelector('h1')?.textContent,
}))));

await mobile.goto(`${BASE}/#/c/animations`, { waitUntil: 'load' });
await mobile.waitForTimeout(1200);
console.log('mobile cat:', JSON.stringify(await mobile.evaluate(() => ({
  cards: document.querySelectorAll('.cat-card').length,
  cols: getComputedStyle(document.querySelector('.cat-grid')).gridTemplateColumns.split(' ').length,
  overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
}))));

// --- card click navigates into the demo
await page.goto(`${BASE}/#/c/text-animations`, { waitUntil: 'load' });
await page.waitForTimeout(1200);
await page.click('.cat-card');
await page.waitForTimeout(1500);
console.log('after card click:', page.url(), '|', await page.textContent('h1'));

await browser.close();
