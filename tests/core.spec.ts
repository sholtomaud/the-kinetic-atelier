import { test, expect } from '@playwright/test';

test.describe('BaseComponent', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render custom element', async ({ page }) => {
    const rendered = await page.evaluate(() => {
      class TestComp extends HTMLElement {
          connectedCallback() { this.innerHTML = '<div id="test">Hello</div>'; }
      }
      customElements.define('test-comp', TestComp);
      const el = document.createElement('test-comp');
      document.body.appendChild(el);
      return !!document.querySelector('#test');
    });
    expect(rendered).toBe(true);
  });
});
