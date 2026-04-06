import { test, expect } from '@playwright/test';

test.describe('Kinetic Atelier App', () => {
  test('should load and show dashboard by default', async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

    await page.goto('/');

    // Wait for AppLayout to be registered and rendered
    await page.waitForFunction(() => customElements.get('app-layout') !== undefined);

    // Check if #root has children
    const root = page.locator('#root');
    await expect(root.locator('app-layout')).toBeAttached({ timeout: 10000 });

    // Wait for DashboardView to be rendered inside AppRouter
    const dashboard = page.locator('dashboard-view');
    await expect(dashboard).toBeAttached({ timeout: 10000 });
  });
});
