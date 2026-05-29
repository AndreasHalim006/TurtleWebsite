import { test, expect } from '@playwright/test';

test('capture journey phases', async ({ page }) => {
  await page.goto('http://localhost:4323/TurtleWebsite/');
  
  // Wait for hero to load
  await page.waitForSelector('#hero');
  
  const viewportSize = page.viewportSize();
  if (!viewportSize) throw new Error('Could not get viewport size');

  const sections = [
    { name: 'start', scroll: 0 },
    { name: 'about', scroll: 1.2 * viewportSize.height }, // Rough estimate for journey start
    { name: 'about2', scroll: 2.5 * viewportSize.height },
    { name: 'subteams', scroll: 4 * viewportSize.height },
    { name: 'history', scroll: 5.5 * viewportSize.height },
    { name: 'sponsors', scroll: 7 * viewportSize.height },
    { name: 'reveal', scroll: 8.5 * viewportSize.height },
  ];

  for (const section of sections) {
    await page.evaluate((y) => window.scrollTo(0, y), section.scroll);
    // Wait for GSAP scrub lag (1.5s in config)
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `playwright-report/journey-${section.name}.png` });
  }
});
