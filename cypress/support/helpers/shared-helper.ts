import { faker } from "@faker-js/faker";
import { INPUT_TYPE, SystemFields } from "./constant";
export default class SharedHelper {
  static generateRandomString(min: number = 5, max: number = 10) {
    return faker.string.alpha({ length: { min, max } });
  }

  static generateRandomNumber(min: number = 1, max: number = 1000) {
    return faker.number.int({ min, max });
  }

  static verifyDownloadedFileContents(
    downloadedFileName: string,
    originalFilePath: string
  ) {
    cy.readFile(originalFilePath).then((originalFile: any) => {
      cy.readFile(`cypress/downloads/${downloadedFileName}`).then(
        (downloadedFile: any) => {
          expect(downloadedFile).to.deep.equal(
            originalFile,
            "Downloaded file contents are equal to original file contents"
          );
        }
      );
    });
  }

  static getHeaderIndex(headerName: string) {
    return cy
      .get(".oxd-table-header")
      .children()
      .first()
      .contains("[role='columnheader']", headerName)
      .invoke("index");
  }

  static checkRecordsContainsValueInColumn(
    rowNumber: number,
    headerName: string,
    value: string
  ) {
    this.getHeaderIndex(headerName).then((headerIndex) => {
      cy.get(".oxd-table-body")
        .find("div[role=row]")
        .eq(rowNumber)
        .find("div[role=cell]")
        .eq(headerIndex)
        .invoke("text")
        .then(($tableValue: string) => {
          if ($tableValue.length > 0) {
            cy.wrap($tableValue).should("contain", value);
          } else {
            expect($tableValue).to.be.empty;
          }
        });
    });
  }

  static clickSubmitButtonIsContains(buttonText: string, index: number = 0) {
    cy.contains("[type='submit']", ` ${buttonText} `).eq(index).click();
  }

  static mainMenuItems() {
    return cy.get(".oxd-sidepanel-body");
  }

  static topBarItems() {
    return cy.get(".oxd-topbar-body-nav");
  }

  static addButton() {
    return cy
      .get(".orangehrm-header-container")
      .contains("[type='button']", " Add ");
  }

  static clickResetButton() {
    cy.getByAttribute("type", "reset").click();
  }

  static checkToastIsExist(isExist: boolean) {
    cy.get(".oxd-toast").should(isExist ? "exist" : "not.exist");
  }

  static checkToastMessage(message: string) {
    cy.contains(".oxd-toast", message).should("exist");
  }

  static waitUntilItFinished() {
    cy.get(".oxd-loading-spinner-container", { timeout: 50000, log: false }).should("not.exist");
  }

  static deselectOptionsFromMultiSelect(labelName: string) {
    cy.get(".oxd-input-group")
      .contains(".oxd-label", labelName)
      .parents()
      .eq(1)
      .find(".--clear")
      .as("clearItemsButton");
    cy.get("@clearItemsButton").then(($clearItemsButton) => {
      Cypress._.times($clearItemsButton.length, () => {
        cy.get("@clearItemsButton").eq(0).click({force: true});
      });
    });
  }

  static typeInInputField(labelName: string, value: string, index: number = 0) {
    cy.get(".oxd-input-group")
      .find(`.oxd-label:contains(${labelName})`)
      .eq(index)
      .parents()
      .eq(1)
      .find("input")
      .clear()
      .type(value);
  }

  static selectItemFromDropdown(
    labelName: string,
    itemName: string,
    index: number = 0
  ) {
    cy.get(".oxd-input-group")
      .find(`.oxd-label:contains(${labelName})`)
      .eq(index)
      .parents()
      .eq(1)
      .find(".oxd-select-text")
      .click();
    cy.get(".oxd-select-option").contains(itemName).click();
  }

  static selectOptionFromList(labelName: string, value: string, index: number = 0) {
    cy.get(".oxd-input-group")
      .find(`.oxd-label:contains(${labelName})`)
      .eq(index)
      .parents()
      .eq(1)
      .children()
      .eq(1)
      .contains("label", value)
      .children()
      .eq(0)
      .click({ force: true });
  }

  static selectOptionFromListBox(
    labelName: string,
    option: string,
    index: number = 0
  ) {
    cy.get(".oxd-input-group")
      .find(`.oxd-label:contains(${labelName})`)
      .eq(index)
      .parents()
      .eq(1)
      .find("[placeholder='Type for hints...']")
      .type(option);
    cy.getByAttribute("role", "listbox")
      .contains("[role=option]", "Searching....")
      .should("not.exist");
    cy.getByAttribute("role", "listbox").contains("[role=option]", option).click();
  }

  static selectDateFromCalendar(labelName: string, date: string, index: number = 0) {
    cy.get(".oxd-input-group")
      .find(`.oxd-label:contains(${labelName})`)
      .eq(index)
      .parents()
      .eq(1)
      .find(".oxd-date-input > .oxd-input")
      .clear()
      .type(date);
    cy.contains(".oxd-date-input-link", "Close").click();
  }

  static fillInInputField(fieldName: string, value: string, index: number = 0) {
    let labelName: string = fieldName;
    if (labelName.includes("-")) {
      labelName = labelName.substring(labelName.indexOf("-") + 2);
    }
    switch (SystemFields[fieldName]) {
      case INPUT_TYPE.Text:
        this.typeInInputField(labelName, value, index);
        break;
      case INPUT_TYPE.Dropdown:
        this.selectItemFromDropdown(labelName, value, index);
        break;
      case INPUT_TYPE.MultiSelect:
        this.selectOptionFromList(labelName, value, index);
        break;
      case INPUT_TYPE.ListBox:
        this.selectOptionFromListBox(labelName, value, index);
        break;
      case INPUT_TYPE.Date:
        this.selectDateFromCalendar(labelName, value, index);
        break;
      default:
        throw new Error("Invalid Input Type");
    }
  }
}
