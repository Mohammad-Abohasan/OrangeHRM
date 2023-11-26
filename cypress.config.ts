import { defineConfig } from "cypress";
import { writeFileSync, unlink } from "fs";
import * as XLSX from "xlsx";
import * as path from "path";
import { configureAllureAdapterPlugins } from "@mmisty/cypress-allure-adapter/plugins";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  projectId: process.env.CYPRESS_PROJECT_ID,
  reporter: "cypress-mochawesome-reporter",
  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        convertXlsxToJson(args: [string, boolean]) {
          return new Promise((resolve, reject) => {
            const [filePath, isOriginalFile] = args;
            const workbook = XLSX.readFile(filePath); // read the file
            const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // get the first worksheet
            const jsonData = XLSX.utils.sheet_to_json(worksheet); // convert the worksheet to JSON
            const fileName = path.basename(filePath, ".xlsx"); // get the file name without the extension
            const jsonFilePath = `cypress/fixtures/${
              fileName + (isOriginalFile ? "Original" : "")
            }.json`; // create the json file path
            writeFileSync(jsonFilePath, JSON.stringify(jsonData)); // write the json data to the file
            resolve(jsonFilePath);
          });
        },
        deleteFile(filePath: string) {
          return new Promise((resolve, reject) => {
            unlink(filePath, (err) => {
              if (err) {
                console.error(err);
                return reject(err);
              }
              resolve(null);
            });
          });
        },
      });

      require("cypress-mochawesome-reporter/plugin")(on);
      require("@cypress/grep/src/plugin")(config);
      configureAllureAdapterPlugins(on, config);
      return config;
    },
    env: {
      allure: true,
      allureAttachRequests: true,
      allureShowDuplicateWarn: true,
    },
    screenshotOnRunFailure: true,
  },
});
