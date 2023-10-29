import BuzzTabActions from "../../support/pageObjects/buzzTab/BuzzTabActions";
import BuzzTabAssertions from "../../support/pageObjects/buzzTab/BuzzTabAssertions";

const buzzTabActions: BuzzTabActions = new BuzzTabActions();
const buzzTabAssertions: BuzzTabAssertions = new BuzzTabAssertions();

describe("Buzz: Check Posts Validation", () => {
  beforeEach(() => {
    cy.loginOrangeHRM();
    buzzTabActions.openTimePage();
    cy.writeFile("cypress/fixtures/buzzTab/buzz.json", {
      post: "Hi, I'm Mohammad Abohasan",
    });
  });

  it("Buzz - The user should be able to add a post", () => {
    cy.fixture("buzzTab/buzz.json").then((postData) => {
      buzzTabActions.addNewPost(postData.post);
      buzzTabAssertions.checkPostText(postData.post);
    });
  });

  afterEach(() => {
    buzzTabActions.clearBuzzTabDirectoryFromFixtures();
  });
});
