import { expect, test } from '@playwright/test';

test('temporarily hidden shop has no public navigation or sitemap entry', async ({ page, request }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'Shop', exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Jane Iredale', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open cart' })).toHaveCount(0);

  await page.goto('/sitemap/');
  await expect(page.getByRole('link', { name: 'Shop', exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Jane Iredale Products', exact: true })).toHaveCount(0);

  const xmlResponse = await request.get('/sitemap.xml');
  expect(xmlResponse.ok()).toBe(true);
  expect(await xmlResponse.text()).not.toContain('/shop/');
});
