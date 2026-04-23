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

  const header = page.locator("header.lux-header");
  const trigger = page.locator("button[data-mobile-nav-trigger]");

  await expect(trigger).toBeVisible();

  await page.mouse.wheel(0, 1200);

  await expect(header).toHaveAttribute("data-header-state", "scrolled");
  await expect(header).toHaveAttribute("data-header-size", "compact");
  await expect(trigger).toBeVisible();
});

test("mobile drawer opens as a modal and resets on desktop resize", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const trigger = page.locator("button[data-mobile-nav-trigger]");
  const drawer = page.locator("[data-mobile-nav-drawer]");
  const panel = page.locator("[data-mobile-nav-panel]");
  const desktopNav = page.locator(".lux-desktop-nav");

  await expect(drawer).toHaveAttribute("role", "dialog");
  await expect(drawer).toHaveAttribute("aria-modal", "true");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toHaveAttribute("aria-label", "Open menu");

  await trigger.click();

  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(trigger).toHaveAttribute("aria-label", "Close menu");
  await expect(drawer).toBeVisible();
  await expect(panel).toBeVisible();
  await expect(panel).toBeFocused();

  await page.keyboard.press("Escape");

  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toHaveAttribute("aria-label", "Open menu");
  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await expect(drawer).toBeVisible();

  await page.setViewportSize({ width: 1024, height: 900 });

  await expect(desktopNav).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(drawer).toBeHidden();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});
