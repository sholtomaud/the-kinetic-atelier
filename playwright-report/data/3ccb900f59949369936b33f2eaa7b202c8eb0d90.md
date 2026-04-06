# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Kinetic Atelier App >> should load and show dashboard by default
- Location: tests/app.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeAttached() failed

Locator: locator('dashboard-view')
Expected: attached
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeAttached" with timeout 10000ms
  - waiting for locator('dashboard-view')

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - complementary [ref=e5]:
    - generic [ref=e7]:
      - img [ref=e9]
      - generic [ref=e15]:
        - paragraph [ref=e16]: Kinetic Atelier
        - paragraph [ref=e17]: Elite Performance
    - navigation [ref=e18]:
      - link "Dashboard" [ref=e19] [cursor=pointer]:
        - /url: "#dashboard"
        - img [ref=e20]
        - generic [ref=e25]: Dashboard
      - link "Exercise Log" [ref=e26] [cursor=pointer]:
        - /url: "#exercise-log"
        - img [ref=e27]
        - generic [ref=e30]: Exercise Log
      - link "Nutrition" [ref=e31] [cursor=pointer]:
        - /url: "#nutrition"
        - img [ref=e32]
        - generic [ref=e35]: Nutrition
      - link "Workout Planner" [ref=e36] [cursor=pointer]:
        - /url: "#workout-planner"
        - img [ref=e37]
        - generic [ref=e39]: Workout Planner
    - generic [ref=e41]:
      - paragraph [ref=e42]: PRO PLAN
      - paragraph [ref=e43]: Unlock advanced biometrics & custom coach logic.
      - button "Upgrade to Pro" [ref=e44]
  - main [ref=e45]:
    - generic [ref=e46]:
      - generic [ref=e48]:
        - img [ref=e49]
        - textbox "Find routine..." [ref=e52]
      - generic [ref=e53]:
        - button [ref=e54]:
          - img [ref=e55]
        - button "Log Workout" [ref=e58]
        - img "User" [ref=e60]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.describe('Kinetic Atelier App', () => {
  4  |   test('should load and show dashboard by default', async ({ page }) => {
  5  |     page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  6  |     page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
  7  |
  8  |     await page.goto('/');
  9  |
  10 |     // Check if #root contains anything
  11 |     const root = page.locator('#root');
  12 |     await expect(root).toBeVisible();
  13 |
  14 |     const dashboard = page.locator('dashboard-view');
> 15 |     await expect(dashboard).toBeAttached({ timeout: 10000 });
     |                             ^ Error: expect(locator).toBeAttached() failed
  16 |
  17 |     const html = await page.content();
  18 |     console.log('Full Page content:', html);
  19 |   });
  20 | });
  21 |
```