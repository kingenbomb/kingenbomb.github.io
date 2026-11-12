import { chromium } from 'playwright';

const cases = [
  ['blocks', 'hero-section', 'hero-1'],
  ['blocks', 'pricing', 'pricing-3'],
  ['blocks', 'faq', 'faq-2'],
  ['blocks', 'navigation', 'navigation-1'],
  ['blocks', 'footer', 'footer-1'],
  ['blocks', 'stats', 'stats-1'],
  ['blocks', '404', '404-1'],
  ['blocks', 'profile', 'profile-1'],
  ['blocks', 'how-it-works', 'how-it-works-1'],
  ['blocks', 'auth', 'auth-1'],
  ['app-ui', 'ai-chat', 'ai-chat-1'],
  ['app-ui', 'data-table', 'data-table-1'],
  ['app-ui', 'dashboard', 'dashboard-1'],
  ['app-ui', 'app-shell', 'app-shell-1'],
  ['app-ui', 'card', 'card-1'],
  ['app-ui', 'settings-form', 'settings-form-1'],
  ['app-ui', 'kanban', 'kanban-1'],
  ['app-ui', 'app-dialog', 'app-dialog-1'],
];

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e).slice(0, 160)));
page.on('console', m => {
  if (m.type() === 'error') errors.push(m.text().slice(0, 140));
});

for (const [kind, cat, variant] of cases) {
  await page.goto(`http://localhost:4321/#/pro/docs/${kind === 'blocks' ? 'blocks' : 'app-ui'}/${cat}/${variant}`, {
    waitUntil: 'load',
  });
  await page.waitForTimeout(900);
  const info = await page.evaluate(() => {
    const box = document.querySelector('figure .aspect-\\[16\\/9\\]');
    const text = box?.innerText?.replace(/\s+/g, ' ').trim() || '';
    return {
      nodes: box?.querySelectorAll('*').length || 0,
      text: text.slice(0, 52),
      overflow: box ? box.scrollWidth - box.clientWidth : null,
    };
  });
  await page.getByRole('button', { name: 'Code', exact: true }).click();
  await page.waitForTimeout(500);
  const code = await page.evaluate(() => {
    const pre = document.querySelector('figure pre code');
    return pre?.textContent?.trim().slice(0, 40) || '';
  });
  console.log(`${kind}/${cat}/${variant}`.padEnd(34), JSON.stringify(info), '| code:', code.length);
}
console.log('ERRORS', errors.slice(0, 4));
await browser.close();
