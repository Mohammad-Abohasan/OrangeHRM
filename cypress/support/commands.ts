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
declare namespace Cypress {
  interface Chainable<Subject> {
    getByClass: typeof getByClass;
    getByAttribute: typeof getByAttribute;
    loginOrangeHRM(userName: string, password: string): typeof loginOrangeHRM;
    logoutOrangeHRM: typeof logoutOrangeHRM;
  }
}

function loginOrangeHRM(userName: string, password: string) {
  userName && cy.getByAttribute("placeholder", "Username").type(userName);
  password && cy.getByAttribute("placeholder", "Password").type(password);
  cy.get("button").click();

  cy.get(".oxd-topbar-header-breadcrumb > .oxd-text")
    .contains("Dashboard")
    .as("Login Successfully");
}

function logoutOrangeHRM() {
  cy.get(".oxd-userdropdown-tab").click();
  cy.get(":nth-child(4) > .oxd-userdropdown-link").click();
}

function getByClass(field: string) {
  return cy.get(`.${field}`);
}

function getByAttribute(attribute: string, value: string) {
  return cy.get(`[${attribute}="${value}"]`);
}

Cypress.Commands.add("getByClass", getByClass);
Cypress.Commands.add("getByAttribute", getByAttribute);
Cypress.Commands.add("loginOrangeHRM", loginOrangeHRM);
Cypress.Commands.add("logoutOrangeHRM", logoutOrangeHRM);
