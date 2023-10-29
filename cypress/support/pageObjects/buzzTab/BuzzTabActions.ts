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
    cy.task("deleteFile", "cypress/fixtures/buzzTab/buzz.json");
  }
}

export default BuzzTabActions;
