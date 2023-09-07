import { ReporterDescription, defineConfig, devices } from "@playwright/test";

const reporters: ReporterDescription[] = [["line"]];

if (process.env.USE_CUSTOM_REPORTER === "true") {
  reporters.push(["./reporter/custom-reporter.ts"]);
}

export default defineConfig({
  testDir: "./tests",
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : undefined,
  reporter: reporters,
  use: {
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
