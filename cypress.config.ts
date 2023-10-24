import { writeFileSync } from "fs";
import { defineConfig } from "cypress";
import allureWriter from "@shelex/cypress-allure-plugin/writer";
import * as XLSX from "xlsx";
import * as path from "path";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  projectId: process.env.CYPRESS_PROJECT_ID,
  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        convertXlsxToJson(args : [string, boolean]) {
          const [ filePath, isOriginalFile ] = args;
          const workbook = XLSX.readFile(filePath);
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const fileName = path.basename(filePath, ".xlsx");
          const jsonFilePath = `cypress/fixtures/${
            fileName + (isOriginalFile ? "Original" : "")
          }.json`;
          writeFileSync(jsonFilePath, JSON.stringify(jsonData));
          return path.basename(jsonFilePath);
        },
      });
      allureWriter(on, config);
      return config;
    },
    env: {
      allure: true,
      allureResultsPath: "allure-results",
      download_dir: "./cypress/downloads",
    },
    screenshotOnRunFailure: true,
  },
});
