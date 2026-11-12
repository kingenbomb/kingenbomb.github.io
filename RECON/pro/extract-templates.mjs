// Pull the public content of all 15 template detail pages into one JSON.
import { chromium } from 'playwright';
import fs from 'node:fs';

const manifest = JSON.parse(fs.readFileSync('RECON/pro/pro-manifest.json', 'utf8'));
const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const out = {};

for (const tpl of manifest.templates) {
  const url = `https://pro.reactbits.dev/docs/templates/${tpl.slug}`;
  await page.goto(url, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(2200);
  const data = await page.evaluate(() => {
    const norm = s => (s || '').replace(/\s+/g, ' ').trim();
    const headingBy = re => Array.from(document.querySelectorAll('h2,h3')).find(h => re.test(h.textContent));
    const listAfter = re => {
      const h = headingBy(re);
      let n = h?.nextElementSibling;
      if (!n) return [];
      if (n.tagName === 'UL') return Array.from(n.querySelectorAll('li')).map(li => norm(li.textContent));
      const ul = n.querySelector('ul');
      return ul ? Array.from(ul.querySelectorAll('li')).map(li => norm(li.textContent)) : [];
    };
    const chips = (() => {
      const h = headingBy(/Built With/i);
      const box = h?.nextElementSibling;
      return box ? Array.from(box.children).map(c => norm(c.textContent)).filter(Boolean) : [];
    })();
    const h1 = document.querySelector('main h1');
    const about = (() => {
      const h = headingBy(/About this template/i);
      let n = h?.nextElementSibling;
      while (n && n.tagName !== 'P') n = n.nextElementSibling;
      return norm(n?.textContent);
    })();
    const video = document.querySelector('main video');
    return {
      h1: norm(h1?.textContent),
      tagline: norm(h1?.nextElementSibling?.textContent),
      builtWith: chips,
      about,
      features: listAfter(/Special Features/i),
      sections: listAfter(/Included Sections/i),
      video: video?.getAttribute('src') || video?.querySelector('source')?.getAttribute('src') || null,
    };
  });
  out[tpl.slug] = data;
  console.log(tpl.slug, '| chips', data.builtWith.length, '| features', data.features.length, '| sections', data.sections.length, '| about', data.about.length);
}

fs.writeFileSync('RECON/pro/template-detail.json', JSON.stringify(out, null, 1));
await browser.close();
console.log('written RECON/pro/template-detail.json');
