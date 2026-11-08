// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Portfolio site', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has a meaningful title and main heading', async ({ page }) => {
    await expect(page).toHaveTitle(/Ayelet Shakovitzky/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ayelet Shakovitzky');
  });

  test('shows every main section', async ({ page }) => {
    for (const name of ['About', 'Experience', 'Projects', 'Skills', "Let's talk"]) {
      await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
    }
    await expect(
      page.getByRole('heading', { level: 2, name: /Test automation/ })
    ).toBeVisible();
  });

  test('lists the four projects with technology tags', async ({ page }) => {
    const cards = page.locator('#projects article.card');
    await expect(cards).toHaveCount(4);
    for (const card of await cards.all()) {
      await expect(card.getByRole('heading', { level: 3 })).toBeVisible();
      expect(await card.locator('.tags li').count()).toBeGreaterThan(0);
    }
  });

  test('navigation links scroll to their sections', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Covered on desktop; mobile nav is the same links');
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/#projects$/);
    await expect(page.locator('#projects')).toBeInViewport();
  });

  test('CV can be downloaded as a PDF', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('link', { name: /download cv/i }).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
  });

  test('CV file is served as a real PDF', async ({ request }) => {
    const res = await request.get('/assets/Ayelet_Shakovitzky_CV.pdf');
    expect(res.ok()).toBeTruthy();
    const body = await res.body();
    expect(body.subarray(0, 4).toString()).toBe('%PDF');
  });

  test('contact email link is a valid mailto', async ({ page }) => {
    const href = await page.locator('#email-link').getAttribute('href');
    expect(href).toMatch(/^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}$/i);
  });

  test('external links open safely in a new tab', async ({ page }) => {
    const external = page.locator('a[target="_blank"]');
    expect(await external.count()).toBeGreaterThan(0);
    for (const link of await external.all()) {
      await expect(link).toHaveAttribute('rel', /noopener/);
      await expect(link).toHaveAttribute('href', /^https:\/\//);
    }
  });

  test('has no horizontal scrolling', async ({ page }) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('basic accessibility: lang, skip link, image alts, one h1', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main');
    await expect(page.locator('h1')).toHaveCount(1);
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    expect(imagesWithoutAlt).toBe(0);
  });

  test('footer shows the current year', async ({ page }) => {
    await expect(page.locator('#year')).toHaveText(String(new Date().getFullYear()));
  });
});
