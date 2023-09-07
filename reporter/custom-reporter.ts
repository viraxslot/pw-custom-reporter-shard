import {
  FullConfig,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";
import { randomBytes } from "crypto";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { resolve } from "path";

export default class CustomReporter implements Reporter {
  readonly reportData: Record<string, any> = {
    passed: 0,
    failed: 0,
  };
  private reportDir = resolve(process.cwd(), "run-results");

  onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const finalStatus =
      test.expectedStatus === result.status ? "passed" : "failed";

    this.reportData[finalStatus]++;
  }

  async onEnd() {
    console.log("Saving results");
    
    try {
      console.log("Report dir", this.reportDir);

      if (!existsSync(this.reportDir)) {
        await mkdir(this.reportDir);
      }

      await writeFile(
        resolve(this.reportDir, randomBytes(4).toString("hex") + ".json"),
        JSON.stringify(this.reportData),
        { encoding: "utf-8" }
      );

    } catch (error) {
      console.error(`Unable to write the report\n`, error);
    }
  }
}
