import { defineConfig } from "cypress";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  projectId: process.env.CYPRESS_PROJECT_ID,
  reporter: "cypress-mochawesome-reporter",
  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com",
    specPattern: ["cypress/e2e/**/*.cy.ts", "cypress/e2e/*.feature"],
    async setupNodeEvents(on, config) {
      // implement node event listeners here
      return require("./cypress/plugins")(on, config);
    },
  },
});
