import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const specs = JSON.parse(readFileSync(new URL('../../src/pro/data/live-specs.json', import.meta.url), 'utf8'));
const facts = JSON.parse(readFileSync(new URL('./preview-facts.json', import.meta.url), 'utf8'));

const seen = new Set();
const pick = [];
for (const [slug, spec] of Object.entries(specs)) {
  if (!seen.has(spec.pattern)) {
    seen.add(spec.pattern);
    pick.push(slug);
  }
}

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const rows = [];
  for (const slug of pick) {
    await page.goto(`http://localhost:4321/#/pro/docs/components/${slug}`, { waitUntil: 'load' });
    await page.waitForTimeout(1400);
    const stat = await page.evaluate(() => {
      const box = document.querySelector('figure .aspect-\\[16\\/9\\]');
      const canvas = box?.querySelector('canvas');
      if (!canvas) {
        // DOM patterns: approximate by counting painted child boxes with a background color
        const kids = box ? box.querySelectorAll('div,span,p') : [];
        let painted = 0;
        kids.forEach(node => {
          const style = getComputedStyle(node);
          if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') painted += 1;
        });
        return { kind: 'dom', painted };
      }
      const ctx = canvas.getContext('2d');
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let sum = 0;
      let bright = 0;
      let n = 0;
      for (let i = 0; i < data.length; i += 4) {
        const l = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
        sum += l;
        if (l > 0.62) bright += 1;
        n += 1;
      }
      return { kind: 'canvas', luma: +(sum / n).toFixed(3), bright: +(bright / n).toFixed(3) };
    });
    const ref = facts[slug] || {};
    rows.push({ slug, pattern: specs[slug].pattern, ours: stat, ref: { luma: ref.luma, bright: ref.bright } });
  }
  console.log('slug'.padEnd(18), 'pattern'.padEnd(16), 'ours'.padEnd(26), 'official');
  for (const row of rows) {
    console.log(
      row.slug.padEnd(18),
      row.pattern.padEnd(16),
      JSON.stringify(row.ours).padEnd(26),
      JSON.stringify(row.ref)
    );
  }
  await browser.close();
})();


