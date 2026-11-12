// Save the full outerHTML of <main>, <aside>, <header> for a page, so parsing can happen offline.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = {};
for (let i = 0; i < args.length; i += 2) opt[args[i].replace(/^--/, '')] = args[i + 1];
const dir = path.join(opt.out, opt.label);
fs.mkdirSync(dir, { recursive: true });

const browser = await chromium.launch({ channel: opt.channel || 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(opt.url, { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(4000);
const scrolls = Number(opt.scroll || 12);
for (let i = 0; i < scrolls; i++) {
  await page.mouse.wheel(0, 1700);
  await page.waitForTimeout(280);
}
await page.waitForTimeout(1500);
if (opt.top) await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);

const out = await page.evaluate(() => {
  const g = sel => document.querySelector(sel)?.outerHTML || '';
  return {
    url: location.href,
    title: document.title,
    main: g('main'),
    body: document.body.outerHTML,
    aside: g('aside'),
    header: g('header'),
    nav: g('nav'),
    bodyClasses: document.body.className,
    htmlAttrs: Array.from(document.documentElement.attributes).map(a => [a.name, a.value]),
    cssHrefs: Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.getAttribute('href')),
    videos: Array.from(document.querySelectorAll('video')).map(v => ({
      src: v.getAttribute('src') || v.currentSrc, poster: v.getAttribute('poster')
    }))
  };
});

fs.writeFileSync(path.join(dir, 'main.html'), out.main);
fs.writeFileSync(path.join(dir, 'body.html'), out.body);
fs.writeFileSync(path.join(dir, 'aside.html'), out.aside);
fs.writeFileSync(path.join(dir, 'header.html'), out.header);
fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify({
  url: out.url, title: out.title, bodyClasses: out.bodyClasses,
  htmlAttrs: out.htmlAttrs, cssHrefs: out.cssHrefs, videos: out.videos
}, null, 2));
console.log(JSON.stringify({
  title: out.title, mainLen: out.main.length, asideLen: out.aside.length,
  headerLen: out.header.length, videos: out.videos.length
}, null, 2));
await browser.close();

