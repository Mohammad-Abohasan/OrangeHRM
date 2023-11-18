/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export {};
declare global {
  namespace Cypress {
    interface Chainable {
      getByAttribute: (attribute: string, value: string) => Chainable;
      loginOrangeHRM: (userName?: string, password?: string) => void;
      logoutOrangeHRM: () => any;
      clearDownloadsDirectory: Chainable;
    }
  }
}

Cypress.Commands.add("getByAttribute", (attribute: string, value: string) => {
  return cy.get(`[${attribute}="${value}"]`);
});

Cypress.Commands.add(
  "loginOrangeHRM",
  (userName = "Admin", password = "admin123") => {
    cy.intercept("/web/index.php/core/i18n/messages**").then(() => {
      cy.intercept("/web/index.php/api/v2/dashboard/employees/time-at-work**").as(
        "timeAtWork"
      );
      cy.intercept("/web/index.php/api/v2/buzz/feed**").as("buzzFeed");

      cy.visit("/");
      cy.getByAttribute("placeholder", "Username").type(userName);
      cy.getByAttribute("placeholder", "Password").type(password);
      cy.get("button").click();

      cy.wait(["@timeAtWork", "@buzzFeed"]);
    });
  }
);

Cypress.Commands.add("logoutOrangeHRM", () => {
  // cy.request("/web/index.php/auth/logout").as("Logout Successfully");
  cy.intercept("/web/index.php/core/i18n/messages**").as("messages");
  cy.get(".oxd-userdropdown-tab").click();
  cy.contains("[role=menuitem]", "Logout").click();

  cy.wait("@messages");
});

Cypress.Commands.add("clearDownloadsDirectory", () => {
  cy.exec("npm run clean-downloads", { log: false, failOnNonZeroExit: false });
});
