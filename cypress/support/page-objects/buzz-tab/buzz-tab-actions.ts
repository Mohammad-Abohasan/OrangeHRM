import SharedHelper from "../../helpers/shared-helper";

class buzzTabActions {
  elements = {
    postInput: () => cy.get(".oxd-buzz-post-input"),
  };

  openBuzzTab() {
    cy.intercept("/web/index.php/api/v2/buzz/feed**").as("buzzFeed");
    SharedHelper.mainMenuItems().contains("Buzz").click();
    cy.wait("@buzzFeed");
  }

  addNewPost(postData: string) {
    this.elements.postInput().type(postData);
    SharedHelper.clickSubmitButtonIsContains("Post");
  }
}

export default buzzTabActions;
