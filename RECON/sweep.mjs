import { chromium } from 'playwright';
import fs from 'node:fs';

const base = process.argv[2] || 'http://localhost:5173';
const categoryFilter = process.argv[3] || '';

const DIR_TO_CATEGORY = {
  TextAnimations: 'text-animations',
  Micro: 'micro',
  Animations: 'animations',
  Components: 'components',
  Backgrounds: 'backgrounds'
};

const registry = fs.readFileSync('src/registry.jsx', 'utf8');
const entryRe = /slug: '([a-z0-9-]+)',\s*name: '([^']+)',\s*demo: lazy\(\(\) => import\('\.\/demo\/([^/']+)\/([^/']+)Demo'\)\)/g;
const all = [...registry.matchAll(entryRe)].map(m => ({
  slug: m[1],
  name: m[2],
  dir: m[3],
  category: DIR_TO_CATEGORY[m[3]] || m[3],
  path: `/${DIR_TO_CATEGORY[m[3]] || m[3]}/${m[1]}`
}));

const routes = categoryFilter ? all.filter(r => r.category === categoryFilter) : all;
if (routes.length === 0) {
  console.error(`no routes found (registry entries parsed: ${all.length}, filter: '${categoryFilter}')`);
  process.exit(1);
}
console.log(`sweeping ${routes.length} routes against ${base}${categoryFilter ? ` [category: ${categoryFilter}]` : ''}`);

let browser = null;
let page = null;
let pageCount = 0;
const PAGES_PER_BROWSER = 15;

const launch = async () => {
  if (browser) await browser.close().catch(() => {});
  browser = await chromium.launch({ channel: 'msedge' });
  page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  pageCount = 0;
};

const runRoute = async route => {
  if (!browser || pageCount >= PAGES_PER_BROWSER) await launch();
  pageCount += 1;

  const consoleErrors = [];
  const pageErrors = [];
  const badResponses = [];
  const onConsole = m => {
    if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200));
  };
  const onPageError = e => pageErrors.push(String(e).slice(0, 200));
  const onResponse = r => {
    if (r.status() >= 400) badResponses.push(`${r.status()} ${r.url().slice(0, 150)}`);
  };
  page.on('console', onConsole);
  page.on('pageerror', onPageError);
  page.on('response', onResponse);

  let empty = false;
  try {
    await page.goto(`${base}/#${route.path}`, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(2600);
    const hasContent = await page.evaluate(() => document.querySelectorAll('main *').length > 5);
    if (!hasContent) empty = true;
  } catch (error) {
    pageErrors.push(`navigation: ${String(error).slice(0, 150)}`);
  }

  page.off('console', onConsole);
  page.off('pageerror', onPageError);
  page.off('response', onResponse);

  return { consoleErrors, pageErrors, badResponses, empty };
};

const failures = [];
let ok = 0;

for (const route of routes) {
  let result = await runRoute(route);

  if (result.empty) {
    console.log(`RETRY (empty) ${route.path}`);
    await launch();
    result = await runRoute(route);
    if (result.empty) result.pageErrors.push('page appears empty (after retry)');
  }

  if (result.consoleErrors.length || result.pageErrors.length || result.badResponses.length) {
    failures.push({ path: route.path, name: route.name, ...result, empty: undefined });
    console.log(`FAIL ${route.path}`);
  } else {
    ok += 1;
    console.log(`ok   ${route.path}`);
  }
}

if (browser) await browser.close().catch(() => {});

const reportName = categoryFilter ? `RECON/sweep-${categoryFilter}.json` : 'RECON/sweep-report.json';
fs.writeFileSync(reportName, JSON.stringify({ base, categoryFilter, total: routes.length, ok, failures }, null, 2));
console.log(`\n===== SUMMARY: ${ok}/${routes.length} ok, ${failures.length} failed =====`);
for (const failure of failures) {
  console.log(`${failure.path}`);
  for (const error of failure.consoleErrors) console.log(`   console: ${error}`);
  for (const error of failure.pageErrors) console.log(`   page: ${error}`);
  for (const error of failure.badResponses) console.log(`   http: ${error}`);
}
