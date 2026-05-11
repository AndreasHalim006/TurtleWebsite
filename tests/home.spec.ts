import { expect, test, type ConsoleMessage } from '@playwright/test';

test('home page renders the cinematic scroll module without console errors', async ({ page }) => {
  const messages: ConsoleMessage[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      messages.push(message);
    }
  });

  await page.goto('./', { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveTitle(/ARISTURTLE \| Formula Student Electric & Driverless/i);
  await expect(page.locator('[data-cinematic-scroll]')).toBeVisible();
  await expect(page.locator('.aristurtle-wordmark')).toBeVisible();
  await expect(page.locator('[data-masked-img="1"]')).toHaveCount(1);
  await expect(page.locator('[data-masked-img="2"]')).toHaveCount(1);
  await expect(page.locator('[data-masked-img="3"]')).toHaveCount(1);
  await expect(page.locator('[data-masked-img="4"]')).toHaveCount(1);
  await expect(page.locator('[data-slide="1"]')).toContainText('RHEA MONOCOQUE');
  await expect(page.locator('[data-slide="2"]')).toContainText('BUILT BY SUBTEAMS');
  await expect(page.locator('[data-slide="3"]')).toContainText('NEXT LAP FORWARD');
  await expect(page.locator('[data-slide="4"]')).toContainText('BACK THE TEAM');
  await expect(page.getByText('FROM 2013')).toBeVisible();
  await expect(page.getByRole('navigation', { name: /Primary/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Explore Aristurtle/i })).toBeVisible();

  expect(messages.map((message) => message.text())).toEqual([]);
});

test('home page cinematic module is visible on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-cinematic-scroll]')).toBeVisible();
  await expect(page.locator('[data-slide]')).toHaveCount(4);
  await expect(page.getByText('FROM 2013')).toBeVisible();
  await expect(page.getByRole('link', { name: /Explore Aristurtle/i })).toBeVisible();
});
