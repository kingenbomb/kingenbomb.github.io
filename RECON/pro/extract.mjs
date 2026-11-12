// Structured extraction of a catalog/docs page: cards, sidebar, skeleton HTML, computed styles.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = {};
for (let i = 0; i < args.length; i += 2) opt[args[i].replace(/^--/, '')] = args[i + 1];
if (!opt.url) {
  console.error('usage: node extract.mjs --url <url> --out <dir> --label <name> [--wait ms] [--scroll N]');
  process.exit(1);
}
const dir = path.join(opt.out, opt.label);
fs.mkdirSync(dir, { recursive: true });

const browser = await chromium.launch({ channel: opt.channel || 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(opt.url, { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(Number(opt.wait || 5000));

// scroll to force lazy content
const scrolls = Number(opt.scroll || 12);
for (let i = 0; i < scrolls; i++) {
  await page.mouse.wheel(0, 2200);
  await page.waitForTimeout(350);
}
await page.waitForTimeout(1200);

const data = await page.evaluate(() => {
  const cs = el => {
    const s = getComputedStyle(el);
    return {
      display: s.display, position: s.position, gridTemplateColumns: s.gridTemplateColumns,
      gap: s.gap, padding: s.padding, margin: s.margin, background: s.backgroundColor,
      borderRadius: s.borderRadius, border: s.border, width: s.width, height: s.height,
      font: `${s.fontSize}/${s.lineHeight} ${s.fontWeight} ${s.fontFamily.slice(0, 60)}`,
      color: s.color, overflow: s.overflow, maxWidth: s.maxWidth
    };
  };
  const main = document.querySelector('main');
  // cards = anchors that contain an img and text
  const anchors = Array.from(document.querySelectorAll('a[href]'));
  const cards = anchors
    .filter(a => a.querySelector('img'))
    .map(a => {
      const img = a.querySelector('img');
      const texts = Array.from(a.querySelectorAll('*'))
        .filter(el => el.children.length === 0 && el.textContent.trim())
        .map(el => el.textContent.trim());
      return {
        href: a.getAttribute('href'),
        imgs: Array.from(a.querySelectorAll('img')).map(i => i.getAttribute('src') || i.currentSrc),
        texts: [...new Set(texts)].slice(0, 6),
        aria: a.getAttribute('aria-label'),
        title: a.getAttribute('title')
      };
    });
  // group headings between cards
  const headings = Array.from(document.querySelectorAll('main h2, main h3, main h4, main [class*="group"] > h2')).map(h => ({
    tag: h.tagName, text: h.textContent.trim().slice(0, 60)
  }));
  const skeleton = main ? main.outerHTML.slice(0, 24000) : '';
  const styleTargets = {};
  if (main) styleTargets.main = cs(main);
  const firstCard = document.querySelector('a[href] img')?.closest('a');
  if (firstCard) {
    styleTargets.card = cs(firstCard);
    styleTargets.cardParent = cs(firstCard.parentElement);
    styleTargets.cardImg = cs(firstCard.querySelector('img'));
    styleTargets.cardHTML = firstCard.outerHTML.slice(0, 3000);
  }
  const grid = firstCard?.parentElement;
  const gridParent = grid?.parentElement;
  const aside = document.querySelector('aside, nav[class*="sidebar"], [class*="Sidebar"]');
  const header = document.querySelector('header');
  const rootVars = {};
  const rootCS = getComputedStyle(document.documentElement);
  for (const name of ['--background', '--foreground', '--muted', '--muted-foreground', '--border', '--radius', '--primary', '--card', '--accent']) {
    rootVars[name] = rootCS.getPropertyValue(name).trim();
  }
  return {
    url: location.href,
    title: document.title,
    asideText: aside ? aside.innerText.slice(0, 8000) : null,
    asideHTML: aside ? aside.outerHTML.slice(0, 12000) : null,
    headerText: header ? header.innerText.slice(0, 2000) : null,
    headerHTML: header ? header.outerHTML.slice(0, 8000) : null,
    rootVars,
    bodyFont: getComputedStyle(document.body).fontFamily,
    text: document.body.innerText.slice(0, 12000),
    cards,
    headings,
    skeleton,
    styleTargets,
    bodyClass: document.body.className,
    rootTheme: document.documentElement.getAttribute('data-theme') || document.documentElement.className
  };
});

fs.writeFileSync(path.join(dir, 'cards.json'), JSON.stringify(data.cards, null, 2));
fs.writeFileSync(path.join(dir, 'styles.json'), JSON.stringify(data.styleTargets, null, 2));
fs.writeFileSync(path.join(dir, 'skeleton.html'), data.skeleton);
fs.writeFileSync(path.join(dir, 'aside.txt'), data.asideText || '');
fs.writeFileSync(path.join(dir, 'aside.html'), data.asideHTML || '');
fs.writeFileSync(path.join(dir, 'header.txt'), data.headerText || '');
fs.writeFileSync(path.join(dir, 'header.html'), data.headerHTML || '');
fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify({ rootVars: data.rootVars, bodyFont: data.bodyFont, title: data.title, url: data.url }, null, 2));
fs.writeFileSync(path.join(dir, 'text.txt'), data.text);
fs.writeFileSync(path.join(dir, 'headings.json'), JSON.stringify(data.headings, null, 2));
console.log(JSON.stringify({
  title: data.title, cards: data.cards.length, headings: data.headings.length,
  sampleCard: data.cards.slice(0, 3), theme: data.rootTheme
}, null, 2));
await browser.close();
