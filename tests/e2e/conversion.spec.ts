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
    await expect(
      page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Treatments' }),
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

test('service discovery separates treatment education from the contact pathway', async ({ page }) => {
  await page.goto('/services/');
  await page.getByRole('button', { name: 'Reject optional' }).click();

  await expect(page.getByRole('heading', { name: 'A moving line, lost fullness, uneven color, and rough texture call for different treatments.' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Explore Skin & Device Treatments/i })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Contact House of Rose' })).toHaveAttribute('href', '/contact/');
  await expect(page.locator('[data-booking-mode="direct"]')).toHaveCount(0);
});

test('service detail keeps education and contact actions visible without horizontal overflow', async ({ page }) => {
  await page.goto('/services/biorepeel/');
  await page.getByRole('button', { name: 'Reject optional' }).click();

  await expect(page.getByRole('heading', { name: 'What happens during BioRePeel.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download pre-care guide' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Contact House of Rose' })).toHaveAttribute('href', '/contact/');
  await expect(page.locator('[data-booking-service="biorepeel"]')).toHaveCount(0);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
