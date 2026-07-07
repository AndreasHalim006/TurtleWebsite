import { test, expect } from '@playwright/test';

const pages = [
  { name: 'Home', path: './' },
  { name: 'About Us', path: './about-us' },
  { name: 'Seasons', path: './seasons' },
  { name: 'Garage', path: './garage' },
  { name: 'Subdivisions', path: './subdivisions' },
  { name: 'Sponsors', path: './sponsors' },
  { name: 'Recruitment', path: './recruitment' },
  { name: 'Contact', path: './contact' }
];

const viewports = [
  { name: 'Mobile Portrait', width: 390, height: 844 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Desktop Standard', width: 1440, height: 900 }
];

for (const pageInfo of pages) {
  for (const vp of viewports) {
    test(`Check overflow: ${pageInfo.name} at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      // Set test timeout
      test.setTimeout(90000);

      // Set viewport size
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // Navigate to the page
      console.log(`Checking overflow on ${pageInfo.name} at viewport ${vp.width}x${vp.height}...`);
      await page.goto(pageInfo.path, { waitUntil: 'domcontentloaded' });

      // Wait for layout/fonts to settle
      await page.waitForTimeout(1500);

      // Check if there is any horizontal overflow
      const overflowInfo = await page.evaluate(() => {
        const scrollWidth = document.documentElement.scrollWidth;
        const innerWidth = window.innerWidth;
        const bodyScrollWidth = document.body.scrollWidth;
        
        // Find elements that are exceeding the viewport width
        const overflowingElements: { tag: string, id: string, className: string, width: number, right: number }[] = [];
        const allElements = document.querySelectorAll('*');
        allElements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          // 1px tolerance for browser rounding errors
          if (rect.right > innerWidth + 1.5) {
            overflowingElements.push({
              tag: el.tagName.toLowerCase(),
              id: el.id || '',
              className: el.className || '',
              width: rect.width,
              right: rect.right
            });
          }
        });

        return {
          hasOverflow: scrollWidth > innerWidth || bodyScrollWidth > innerWidth,
          scrollWidth,
          bodyScrollWidth,
          innerWidth,
          overflowingCount: overflowingElements.length,
          overflowingSample: overflowingElements.slice(0, 5) // first 5 samples
        };
      });

      if (overflowInfo.hasOverflow) {
        console.error(`[OVERFLOW DETECTED] Page: ${pageInfo.name}, Viewport: ${vp.width}x${vp.height}`);
        console.error(`Document scrollWidth: ${overflowInfo.scrollWidth}px, Viewport width: ${overflowInfo.innerWidth}px`);
        console.error(`Sample of overflowing elements:`, overflowInfo.overflowingSample);
      }

      // Assert no horizontal scrollbar/overflow
      expect(overflowInfo.hasOverflow).toBe(false);
    });
  }
}
