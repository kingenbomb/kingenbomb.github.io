import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = {};
for (let i = 0; i < args.length; i += 2) opt[args[i].replace(/^--/, '')] = args[i + 1];

const url = opt.url;
const outDir = opt.out;
const label = opt.label || 'page';
const channel = opt.channel || 'msedge';

if (!url || !outDir) {
  console.error('usage: node probe.mjs --url <url> --out <dir> --label <name> [--channel msedge]');
  process.exit(1);
}

fs.mkdirSync(path.join(outDir, 'screenshots'), { recursive: true });

const consoleMsgs = [];
const pageErrors = [];
const netFailures = [];

const browser = await chromium.launch({ channel });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('console', m => consoleMsgs.push({ type: m.type(), text: m.text().slice(0, 500) }));
page.on('pageerror', e => pageErrors.push(String(e).slice(0, 500)));
page.on('requestfailed', r => netFailures.push({ url: r.url().slice(0, 200), err: r.failure()?.errorText }));

try {
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(1500);

  const info = await page.evaluate(() => ({
    title: document.title,
    chars: document.querySelectorAll('.split-char').length,
    words: document.querySelectorAll('.split-word').length,
    lines: document.querySelectorAll('.split-line').length,
    h1: (document.querySelector('h1') || {}).textContent || ''
  }));

  await page.screenshot({ path: path.join(outDir, 'screenshots', `${label}-1440.png`) });

  await page.waitForTimeout(4500);
  const after = await page.evaluate(() => ({
    toasts: document.querySelectorAll('[data-sonner-toast]').length,
    visibleChars: Array.from(document.querySelectorAll('.split-char')).filter(el => {
      const s = getComputedStyle(el);
      return parseFloat(s.opacity) > 0.9;
    }).length
  }));
  await page.screenshot({ path: path.join(outDir, 'screenshots', `${label}-1440-after.png`) });

  let hover = null;
  const charCount = await page.locator('.split-char').count();
  if (charCount > 0) {
    const first = page.locator('.split-char').first();
    const box = await first.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(500);
      hover = await page.evaluate(() => {
        const el = document.querySelector('.split-char');
        const s = el ? getComputedStyle(el) : null;
        return s ? { transform: s.transform, translate: el.style.translate, opacity: s.opacity } : null;
      });
    }
  }

  const report = {
    url,
    label,
    title: info.title,
    h1: info.h1,
    split: { chars: info.chars, words: info.words, lines: info.lines },
    after: { toasts: after.toasts, visibleChars: after.visibleChars },
    hover,
    consoleErrors: consoleMsgs.filter(m => m.type === 'error'),
    consoleWarnings: consoleMsgs.filter(m => m.type === 'warning').length,
    consoleTotal: consoleMsgs.length,
    pageErrors,
    netFailures
  };

  fs.writeFileSync(path.join(outDir, `${label}-report.json`), JSON.stringify(report, null, 2));
  console.log(
    JSON.stringify(
      {
        title: info.title,
        split: report.split,
        toastsAfter: after.toasts,
        visibleChars: after.visibleChars,
        hoverTranslate: hover?.translate || null,
        pageErrors: pageErrors.length,
        consoleErrors: report.consoleErrors.length,
        consoleTotal: consoleMsgs.length
      },
      null,
      2
    )
  );
} finally {
  await browser.close();
}
