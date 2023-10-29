import BuzzTabActions from "../../support/pageObjects/buzzTab/BuzzTabActions";
import BuzzTabAssertions from "../../support/pageObjects/buzzTab/BuzzTabAssertions";

const buzzTabActions: BuzzTabActions = new BuzzTabActions();
const buzzTabAssertions: BuzzTabAssertions = new BuzzTabAssertions();
const postInfoPath: string = "cypress/fixtures/buzzTab/postInfo.json";

describe("Buzz: Check Posts Validation", () => {
  beforeEach(() => {
    cy.loginOrangeHRM();
    buzzTabActions.openTimePage();
    cy.writeFile(postInfoPath, {
      content: "Hi, I'm Mohammad Abohasan",
    });
  });

  it("Buzz - The user should be able to add a post", () => {
    cy.fixture("buzzTab/postInfo.json").then((postData) => {
      buzzTabActions.addNewPost(postData.content);
      buzzTabAssertions.checkPostText(postData.content);
    });
  });

  afterEach(() => {
    cy.task("deleteFile", postInfoPath);
  });
});
