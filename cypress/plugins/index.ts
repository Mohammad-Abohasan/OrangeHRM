import { writeFileSync, unlink } from "fs";
import * as XLSX from "xlsx";
import * as path from "path";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import { configureAllureAdapterPlugins } from "@mmisty/cypress-allure-adapter/plugins";

module.exports = async (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> => {
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

  // Cucumber preprocessor
  const bundler = createBundler({
    plugins: [createEsbuildPlugin(config)],
  });
  on("file:preprocessor", bundler);
  await addCucumberPreprocessorPlugin(on, config);

  // Allure reporter
  configureAllureAdapterPlugins(on, config);

  // Mocha reporter
  await require("cypress-mochawesome-reporter/plugin")(on);

  // Grep plugin
  await require("@cypress/grep/src/plugin")(config);

  return config;
};
