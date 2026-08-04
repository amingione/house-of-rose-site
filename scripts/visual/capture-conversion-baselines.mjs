import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const outputDirectory = path.resolve(
  process.env.VISUAL_BASELINE_DIR ?? 'artifacts/visual-baselines/2026-08-04',
);
const routes = [
  ['home', '/'],
  ['services', '/services/'],
  ['service-biorepeel', '/services/biorepeel/'],
  ['consultation', '/consultation/'],
  ['contact', '/contact/'],
  ['shop', '/shop/'],
];
const environments = [
  ['before-production', 'https://houseofrosefl.com'],
  ['after-local', 'http://127.0.0.1:4321'],
];

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch();

for (const [environmentName, baseUrl] of environments) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();

  for (const [name, route] of routes) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 45_000 });
    await page.waitForTimeout(1_200);

    for (const selector of [
      '#consent-reject',
      'button:has-text("Reject optional")',
      'button:has-text("Reject All")',
      'button:has-text("Reject")',
    ]) {
      const button = page.locator(selector).first();
      if (await button.isVisible().catch(() => false)) {
        await button.click().catch(() => undefined);
        break;
      }
    }

    await page.evaluate(async () => {
      const step = Math.max(500, window.innerHeight * 0.8);
      for (let top = 0; top < document.documentElement.scrollHeight; top += step) {
        window.scrollTo(0, top);
        await new Promise((resolve) => window.setTimeout(resolve, 50));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(250);

    await page.addStyleTag({
      content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}',
    });
    await page.screenshot({
      path: path.join(outputDirectory, `${environmentName}--${name}.png`),
      fullPage: true,
    });
  }

  await context.close();
}

await browser.close();
console.log(`Saved ${routes.length * environments.length} visual baselines to ${outputDirectory}`);
