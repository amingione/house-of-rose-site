import { expect, test } from "@playwright/test";

test("header transitions from transparent to solid and shrinks after hero scroll", async ({
  page,
}) => {
  await page.goto("/");

  const header = page.locator("header.lux-header");
  await expect(header).toBeVisible();

  const before = await header.getAttribute("data-header-state");
  expect(before).toBe("over-hero");

  await page.mouse.wheel(0, 1400);

  const after = await header.getAttribute("data-header-state");
  expect(after).toBe("scrolled");
});
