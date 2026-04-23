import { expect, test } from "@playwright/test";

test("header data-header-state transitions from over-hero to scrolled", async ({
  page,
}) => {
  await page.goto("/");

  const header = page.locator("header.lux-header");
  await expect(header).toBeVisible();

  await expect(header).toHaveAttribute("data-header-state", "over-hero");

  await page.mouse.wheel(0, 1400);

  await expect(header).toHaveAttribute("data-header-state", "scrolled");
});
