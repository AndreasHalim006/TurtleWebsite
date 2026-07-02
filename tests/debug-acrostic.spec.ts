import { test, expect } from '@playwright/test';

test('debug acrostic hover and log errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => {
    errors.push(`Page Error: ${err.message}\n${err.stack}`);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    } else {
      console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
    }
  });

  console.log('Navigating to homepage...');
  await page.goto('http://localhost:4322/TurtleWebsite/', { waitUntil: 'domcontentloaded' });

  // Wait for page load
  await page.waitForSelector('#journey-stage', { state: 'attached' });
  console.log('Page loaded. Simulating scroll to Subsystems station...');

  // Let's trigger state transitions to Subsystems (state index 3)
  // States: 0=hero, 1=about, 2=mission, 3=subsystems
  // We can trigger it by sending keydown event ArrowDown 3 times
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(6500); // Wait for transition duration (6s) to settle
    console.log(`Scroll Down step ${i + 1} completed.`);
  }

  // Take a screenshot of Subsystems section to verify we are there
  await page.screenshot({ path: 'playwright-report/debug-subsystems-before.png' });

  // Hover over the acrostic letter U
  console.log('Hovering over U (Unity) acrostic letter...');
  const uLetter = page.locator('text=Unity').first();
  await expect(uLetter).toBeVisible();
  await uLetter.hover();
  
  // Wait a few seconds for the scramble/marquee animation
  await page.waitForTimeout(3000);
  
  // Take screenshot after hover
  await page.screenshot({ path: 'playwright-report/debug-subsystems-after.png' });

  console.log('Active Errors:', errors);
  expect(errors).toEqual([]);
});
