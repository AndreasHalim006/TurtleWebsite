import { test, expect } from '@playwright/test';

test('capture journey phases', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('./');
  
  // Wait for hero to load
  await page.waitForSelector('#hero');
  
  // State 0: Start/Hero
  await page.screenshot({ path: 'playwright-report/journey-0-hero.png' });

  // Transition to 'about' (State 1)
  console.log('Transitioning to about...');
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(9000);
  await page.screenshot({ path: 'playwright-report/journey-1-about.png' });

  // Transition to 'subsystems' (State 3)
  console.log('Transitioning to subsystems...');
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(9000);
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(9000);
  await page.screenshot({ path: 'playwright-report/journey-3-subsystems.png' });

  // Transition to 'sponsors' (State 5)
  console.log('Transitioning to sponsors...');
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(9000);
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(9000);
  await page.screenshot({ path: 'playwright-report/journey-5-sponsors.png' });
});
