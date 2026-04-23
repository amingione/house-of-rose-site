import { expect, test } from "@playwright/test";

test("home hero and full-bleed sections render without framed margins", async ({ page }) => {
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
  await expect(hero).toHaveCSS("margin-left", /-/);
  await expect(fullImage).toHaveCSS("margin-left", /-/);
});
