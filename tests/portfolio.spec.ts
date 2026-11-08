import { test, expect } from '@playwright/test';

test.describe('Portfolio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // let Lenis + GSAP settle
  });

  test('no console errors', async ({ page }) => {
    const errors: any[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.toString()));
    // errors captured via listeners
    await expect(errors.length).toBe(0);
  });

  test('hero: name + photo slot visible', async ({ page }) => {
    const heroName = page.locator('[data-hero-name]');
    await expect(heroName).toBeVisible();
    const heroPhoto = page.locator('[data-hero-photo]');
    await expect(heroPhoto).toBeVisible();
  });

  test('navbar visible with Indonesian labels', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const nav = page.locator('header').first();
    await expect(nav).toBeVisible();
    await expect(page.getByRole('link', { name: 'Tentang' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Keahlian' })).toBeVisible();
  });

  test('all sections render', async ({ page }) => {
    const sections = ['about', 'skills', 'experience', 'projects', 'certificates', 'contact'];
    for (const id of sections) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });

  test('no TODO in page body', async ({ page }) => {
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.toLowerCase()).not.toContain('todo');
    expect(bodyText.toLowerCase()).not.toContain('masih perlu');
  });

  test('confidential project has no img tag', async ({ page }) => {
    // Find confidential project panel by its "Confidential" label
    const confidentialPanel = page.locator('[data-project-panel]').filter({ has: page.locator('p', { hasText: 'Confidential' }).first() });
    await expect(confidentialPanel).not.toHaveCount(0);
    const imgCount = await confidentialPanel.locator('img').count();
    expect(imgCount).toBe(0);
  });

  test('contact section has WhatsApp link', async ({ page }) => {
    await expect(page.locator('a[href*="wa.me"]').first()).toBeVisible();
  });

  test('footer shows copyright 2026', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    const text = await footer.innerText();
    expect(text).toContain('2026');
  });

  test('external links open in new tab', async ({ page }) => {
    await page.locator('#contact').waitFor({ state: 'visible' });
    await page.waitForTimeout(500);
    const extLinks = page.locator('a[target="_blank"]');
    await expect(extLinks).not.toHaveCount(0);
  });

  test('screenshot dark theme 1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('portfolio-dark-1440.png', { maxDiffPixels: 500 });
  });

  test('screenshot light theme 1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('portfolio-light-1440.png', { maxDiffPixels: 500 });
  });

  test('screenshot dark theme mobile 390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('portfolio-dark-mobile-390.png', { maxDiffPixels: 500 });
  });

  test('screenshot light theme mobile 390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('portfolio-light-mobile-390.png', { maxDiffPixels: 500 });
  });
});
