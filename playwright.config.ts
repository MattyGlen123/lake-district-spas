import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const PORT = process.env.PORT || 3000;
const baseURL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Guard: e2e tests must only run against localhost.
// Note: the --base-url CLI flag overrides this at runtime and is not caught here.
const parsedURL = new URL(baseURL);
if (parsedURL.hostname !== 'localhost' && parsedURL.hostname !== '127.0.0.1') {
  throw new Error(`E2E tests must only run against localhost. Blocked: ${baseURL}`);
}

export default defineConfig({
  testDir: path.join(__dirname, 'tests/e2e'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 20 * 1000,
  outputDir: 'test-results/',

  webServer: {
    command: 'npm run dev',
    url: baseURL,
    timeout: 120 * 1000,
    reuseExistingServer: true,
  },

  use: {
    baseURL,
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 13'] } },
  ],
});
