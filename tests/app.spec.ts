import { test, expect } from '@playwright/test';

test.describe('Kinetic Atelier App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load and show dashboard by default', async ({ page }) => {
    // Wait for AppLayout to be registered
    await page.waitForFunction(() => customElements.get('app-layout') !== undefined);

    // Check if dashboard content is visible (checking for specific text)
    await expect(page.locator('body')).toContainText('Precision Vitality.', { timeout: 15000 });
  });

  test('should navigate to Exercise Log', async ({ page }) => {
    await page.waitForFunction(() => customElements.get('app-layout') !== undefined);

    // Click the sidebar link
    await page.click('a[href="#exercise-log"]');

    // Verify URL
    await expect(page).toHaveURL(/#exercise-log/);

    // Verify View content
    await expect(page.locator('body')).toContainText('Exercise Log');
  });
});
