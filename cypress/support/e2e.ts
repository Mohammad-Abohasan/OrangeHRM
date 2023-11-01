// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import "@shelex/cypress-allure-plugin";
import "cypress-mochawesome-reporter/register";
import "cypress-plugin-api";
import "../support/utils/apiUtils";
import SharedHelper from "./helpers/SharedHelper";

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});

it("Delete an employee if exists", () => {
  cy.loginOrangeHRM();
  ((employeeId = "201913064") => {
    SharedHelper.mainMenuItems().contains("PIM").click();
    SharedHelper.typeInInputField("Employee Id", employeeId);
    SharedHelper.clickSubmitButtonIsContains("Search");
    SharedHelper.selectAllRecordsFoundAndDelete();
  })();
});
