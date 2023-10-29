import SharedHelper from "../../helpers/SharedHelper";

class BuzzTabActions {
  elements = {
    postInputField: () => cy.get(".oxd-buzz-post-input"),
    postButton: () => cy.contains("[type='submit']", " Post "),
  };

  openTimePage() {
    SharedHelper.mainMenuItems().contains("Buzz").click();
  }

  addNewPost(postData: string) {
    this.elements.postInputField().type(postData);
    this.elements.postButton().click();
    SharedHelper.checkToastIsExist(false);
  }

  clearBuzzTabDirectoryFromFixtures() {
    cy.exec("rm -rf cypress/fixtures/buzzTab/buzz.json", {
      log: false,
      failOnNonZeroExit: false,
    });
  }
}

export default BuzzTabActions;
