import { test, expect } from '@playwright/test';

test.describe('Kinetic Atelier App', () => {
  test('should load and show dashboard by default', async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

    await page.goto('/');

    // Check if #root contains anything
    const root = page.locator('#root');
    await expect(root).toBeVisible();

    const dashboard = page.locator('dashboard-view');
    await expect(dashboard).toBeAttached({ timeout: 10000 });

    const html = await page.content();
    console.log('Full Page content:', html);
  });
});
