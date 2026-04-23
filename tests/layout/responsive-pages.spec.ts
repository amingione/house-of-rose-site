import { expect, test, type Locator, type Page } from "@playwright/test";

const VIEWPORTS = [
  { name: "desktop", size: { width: 1440, height: 1200 } },
  { name: "mobile", size: { width: 390, height: 844 } },
] as const;

async function expectFullBleed(page: Page, locator: Locator) {
  const viewport = page.viewportSize();

  expect(viewport).not.toBeNull();

  const box = await locator.boundingBox();

  expect(box).not.toBeNull();

  if (!viewport || !box) {
    return;
  }

  expect(box.x).toBeGreaterThanOrEqual(-1);
  expect(box.x).toBeLessThanOrEqual(1);
  expect(box.width).toBeGreaterThanOrEqual(viewport.width - 1);
  expect(box.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(box.x + box.width).toBeGreaterThanOrEqual(viewport.width - 1);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
}

for (const viewport of VIEWPORTS) {
  test.describe(`responsive full-bleed layout (${viewport.name})`, () => {
    test.use({ viewport: viewport.size });

    test("home edge-to-edge sections reach the viewport bounds", async ({ page }) => {
      await page.goto("/");

      const hero = page.locator("section[data-section='home-hero']");
      const split = page.locator("section[data-section='home-split']");
      const fullImage = page.locator("section[data-section='home-full-image']");
      const servicePreview = page.locator("section[data-section='home-service-preview']");
      const experienceTeaser = page.locator(
        "section[data-section='home-experience-teaser']",
      );
      const contact = page.locator("section[data-section='home-contact']");

      await expect(hero).toBeVisible();
      await expect(split).toBeVisible();
      await expect(fullImage).toBeVisible();
      await expect(servicePreview).toBeVisible();
      await expect(experienceTeaser).toBeVisible();
      await expect(contact).toBeVisible();

      await expect(hero).toHaveCSS("border-radius", "0px");
      await expect(fullImage).toHaveCSS("border-radius", "0px");

      await expectFullBleed(page, hero);
      await expectFullBleed(page, split);
      await expectFullBleed(page, fullImage);
    });

    test("services hero reaches the viewport bounds", async ({ page }) => {
      await page.goto("/services");

      const hero = page.locator("main > section").first();

      await expect(hero).toBeVisible();
      await expect(hero).toHaveClass(/lux-hero/);
      await expect(hero).toHaveCSS("border-radius", "0px");
      await expectFullBleed(page, hero);
    });

    test("experience hero reaches the viewport bounds", async ({ page }) => {
      await page.goto("/experience");

      const hero = page.locator("main > section").first();

      await expect(hero).toBeVisible();
      await expect(hero).toHaveClass(/lux-hero/);
      await expect(hero).toHaveCSS("border-radius", "0px");
      await expectFullBleed(page, hero);
    });
  });
}
