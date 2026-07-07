import { expect, test, type ConsoleMessage } from '@playwright/test';

test('home page renders the cinematic scroll module without console errors', async ({ page }) => {
  const messages: ConsoleMessage[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      messages.push(message);
    }
  });

  await page.goto('./', { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveTitle(/ARISTURTLE \| Bespoke Engineering Excellence/i);
  await expect(page.locator('#journey-stage')).toBeAttached();
  await expect(page.locator('#hero')).toBeVisible();
  
  // Verify that the key journey stations exist
  await expect(page.locator('#station-about')).toBeAttached();
  await expect(page.locator('#station-mission')).toBeAttached();
  await expect(page.locator('#station-subsystems')).toBeAttached();
  await expect(page.locator('#station-history')).toBeAttached();
  await expect(page.locator('#station-sponsors')).toBeAttached();

  expect(messages.map((message) => message.text())).toEqual([]);
});

test('home page cinematic module is visible on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('#journey-stage')).toBeAttached();
  await expect(page.locator('#hero')).toBeVisible();
});
