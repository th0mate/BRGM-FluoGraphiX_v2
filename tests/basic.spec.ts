import { test, expect } from '@playwright/test';

test('Test simple pour valider la configuration Playwright', async ({ page }) => {
  await page.goto('https://example.com');

  const title = await page.title();
  expect(title).toBe('Example Domain');

  const heading = await page.locator('h1').textContent();
  expect(heading).toBe('Example Domain');
});
