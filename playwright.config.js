// @ts-check
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
  repeatEach: 1,
  retries: 0,
  workers: 1,
  use: {
    channel: 'chrome',
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
