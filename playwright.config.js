// @ts-check
import { defineConfig, devices } from '@playwright/test';

const devServerCommand =
  process.platform === 'win32'
    ? 'cmd /c "set ASTRO_TELEMETRY_DISABLED=1&& pnpm.cmd run dev -- --host 127.0.0.1 --port 4321"'
    : 'ASTRO_TELEMETRY_DISABLED=1 pnpm run dev -- --host 127.0.0.1 --port 4321';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'http://127.0.0.1:4321/TurtleWebsite/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: devServerCommand,
    url: 'http://127.0.0.1:4321/TurtleWebsite/',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
