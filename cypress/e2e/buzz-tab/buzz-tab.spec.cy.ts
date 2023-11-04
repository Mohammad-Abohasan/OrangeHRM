import SharedHelper from "../../support/helpers/shared-helper";
import BuzzTabActions from "../../support/page-objects/buzz-tab/buzz-tab-actions";
import BuzzTabAssertions from "../../support/page-objects/buzz-tab/buzz-tab-assertions";

const buzzTabActions: BuzzTabActions = new BuzzTabActions();
const buzzTabAssertions: BuzzTabAssertions = new BuzzTabAssertions();
const postInfoPath: string = "cypress/fixtures/buzz-tab/postInfo.json";

describe("Buzz: Check Posts Validation", () => {
  beforeEach(() => {
    cy.loginOrangeHRM();
    buzzTabActions.openBuzzTab();
    cy.writeFile(postInfoPath, {
      content: `Hi, I'm Mohammad Abohasan - ${SharedHelper.generateRandomString(3, 5)}`,
    });
  });

  it("Buzz - The user should be able to add a post", { retries: 3 }, () => {
    cy.fixture("buzz-tab/postInfo.json").then((postData) => {
      buzzTabActions.addNewPost(postData.content);
      buzzTabActions.openBuzzTab();
      buzzTabAssertions.checkNewPostCreated(postData.content);
    });
  });

  afterEach(() => {
    cy.task("deleteFile", postInfoPath);
  });
});
