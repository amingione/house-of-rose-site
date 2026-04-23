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

test("mobile header remains sticky with compact nav trigger", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const trigger = page.locator("button[data-mobile-nav-trigger]");
  await expect(trigger).toBeVisible();

  await page.mouse.wheel(0, 1200);
  await expect(page.locator("header.lux-header")).toHaveAttribute(
    "data-header-size",
    "compact",
  );
});
