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
  ((employeeId) => {
    SharedHelper.mainMenuItems().contains("PIM").click();
    SharedHelper.typeInInputField("Employee Id", employeeId);
    SharedHelper.clickSubmitButtonIsContains("Search");
    cy.get(".oxd-table-row").then(($rows) => {
      if ($rows.length > 1) {
        cy.get(".oxd-table-header")
          .find("[type='checkbox']")
          .click({ force: true });
        // dbl click 
        cy.get(".oxd-button--label-danger").dblclick();
        cy.get(".oxd-button--label-danger").eq(1).click();
      }
    });
  })("201913064");
});
