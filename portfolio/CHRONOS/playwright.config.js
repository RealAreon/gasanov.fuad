// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3456',
    trace: 'on-first-retry',
    browserName: 'chromium',
  },
  webServer: {
    command: 'npx --yes serve . -l 3456',
    url: 'http://127.0.0.1:3456',
    reuseExistingServer: !process.env.CI,
    cwd: __dirname,
  },
  projects: [
    { name: '320x568', use: { viewport: { width: 320, height: 568 } } },
    { name: '375x812', use: { viewport: { width: 375, height: 812 } } },
    { name: '390x844', use: { viewport: { width: 390, height: 844 } } },
    { name: '414x896', use: { viewport: { width: 414, height: 896 } } },
    { name: '768x1024', use: { viewport: { width: 768, height: 1024 } } },
    { name: '1366x768', use: { viewport: { width: 1366, height: 768 } } },
    { name: '1440x900', use: { viewport: { width: 1440, height: 900 } } },
    { name: '1920x1080', use: { viewport: { width: 1920, height: 1080 } } },
  ],
});
