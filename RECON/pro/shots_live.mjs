import { chromium } from 'playwright';

const shots = [
  ['component-live', 'http://localhost:4321/#/pro/docs/components/spectral-drape'],
  ['component-code', 'http://localhost:4321/#/pro/docs/components/globe', 'Code'],
  ['block-live', 'http://localhost:4321/#/pro/docs/blocks/hero-section/hero-1'],
  ['appui-live', 'http://localhost:4321/#/pro/docs/app-ui/dashboard/dashboard-1'],
];

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
for (const [name, url, tab] of shots) {
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  if (tab) {
    await page.getByRole('button', { name: tab, exact: true }).click();
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: `shots/live-${name}.png`, fullPage: false });
  console.log('saved', `shots/live-${name}.png`);
}
await browser.close();
