import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
});

test('navigation, consent controls, and keyboard focus remain operable', async ({ page }, testInfo) => {
  await page.goto('/');

  const banner = page.getByRole('region', { name: 'Privacy choices' });
  await expect(banner).toBeVisible();
  await page.getByRole('button', { name: 'Preferences' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('button', { name: 'Reject optional' }).click();
  await expect(banner).toBeHidden();

  if (testInfo.project.name === 'desktop') {
    await page.getByText('Services', { exact: true }).first().click();
    await expect(
      page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'View all services' }),
    ).toBeVisible();
  } else {
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  }

  await page.keyboard.press('Escape');
  const keyboardTarget = page.locator('header a').first();
  await keyboardTarget.focus();
  await expect(keyboardTarget).toBeFocused();
  await expect(keyboardTarget).toBeVisible();
});

test('service discovery presents separate education and exact booking actions', async ({ page }) => {
  await page.goto('/services/');
  await page.getByRole('button', { name: 'Reject optional' }).click();

  const directAction = page.locator('[data-booking-mode="direct"]').first();
  await expect(directAction).toBeVisible();
  await expect(directAction).toHaveAttribute(
    'href',
    /https:\/\/houseofrose\.glossgenius\.com\/book\?service_token=.+/,
  );
  await expect(directAction).not.toHaveAttribute(
    'href',
    'https://houseofrose.glossgenius.com/services',
  );
  await expect(page.getByRole('link', { name: /Learn about/i }).first()).toBeVisible();
});

test('service detail keeps exact booking visible without horizontal overflow', async ({ page }, testInfo) => {
  await page.goto('/services/biorepeel/');
  await page.getByRole('button', { name: 'Reject optional' }).click();

  const actions = page.locator('[data-booking-service="biorepeel"]');
  await expect(actions.first()).toHaveAttribute('data-booking-mode', 'direct');
  await expect(actions.first()).toHaveAttribute(
    'href',
    /https:\/\/houseofrose\.glossgenius\.com\/book\?service_token=.+/,
  );

  if (testInfo.project.name !== 'desktop') {
    await expect(page.locator('.service-mobile-booking')).toBeVisible();
  }

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
