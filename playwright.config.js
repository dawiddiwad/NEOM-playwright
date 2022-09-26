// @ts-check
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  timeout: 90000,
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
  repeatEach: 20,
  retries: 3,
  workers: 20,
  use: {
    actionTimeout: 10000,
    navigationTimeout: 15000,
    headless: true,
    ignoreHTTPSErrors: true,
    trace: {
      mode: 'retain-on-failure',
      screenshots: true,
      snapshots: true
    },
    viewport: { width: 1366, height: 768 },
    video: {
      mode: "retain-on-failure",
      size: {
        width: 1366,
        height: 768
      }
    },
  },
};

module.exports = config;
