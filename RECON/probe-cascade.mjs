import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5173/#/rsuite', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('text=React Suite Clone', { timeout: 90000 });
await page.waitForTimeout(2000);

const out = await page.evaluate(() => {
  const layerPath = node => {
    const parts = [];
    let r = node.parentRule;
    while (r) {
      if (r.constructor.name === 'CSSLayerBlockRule') parts.unshift('@layer ' + r.name);
      else if (r instanceof CSSMediaRule) parts.unshift('@media');
      r = r.parentRule;
    }
    return parts.join(' > ') || '(unlayered)';
  };

  const probes = [];
  const blackBtn = [...document.querySelectorAll('a')].find(a => String(a.className).includes('bg-[#1c1f23]'));
  const blueLink = [...document.querySelectorAll('a')].find(a => String(a.className).includes('text-blue-600'));
  probes.push(['blackBtn', blackBtn], ['blueLink', blueLink]);

  const results = [];
  for (const [name, el] of probes) {
    if (!el) {
      results.push({ name, note: 'not found' });
      continue;
    }
    const hits = [];
    for (const sheet of document.styleSheets) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      const walk = (list) => {
        for (const r of list) {
          if (r.cssRules) walk(r.cssRules);
          if (r.selectorText) {
            for (const sel of r.selectorText.split(',')) {
              const s = sel.trim();
              try {
                if (el.matches(s) && /(^|[;{]\s*)color\s*:/.test(r.cssText)) {
                  const m = r.cssText.match(/color\s*:\s*([^;}]+)/);
                  hits.push(`${layerPath(r)} | ${s} => ${m ? m[1].trim() : '?'}`);
                }
              } catch {}
            }
          }
        }
      };
      walk(rules);
    }
    results.push({ name, cls: String(el.className).slice(0, 80), computed: getComputedStyle(el).color, hits });
  }
  return results;
});

console.log(JSON.stringify(out, null, 2));
await browser.close();
