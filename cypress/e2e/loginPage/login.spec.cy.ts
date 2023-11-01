import LoginPageActions from "../../support/pageObjects/loginPage/LoginPageActions";
import LoginPageAssertions from "../../support/pageObjects/loginPage/LoginPageAssertions";

const loginPageActions: LoginPageActions = new LoginPageActions();
const loginPageAssertions: LoginPageAssertions = new LoginPageAssertions();

describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.fixture("loginPage/loginInfo.json").as("logInfo");
  });

  it("Check valid username and valid password", () => {
    cy.get("@logInfo").then((infoData: any) => {
      loginPageActions.login(infoData.username.valid, infoData.password.valid);
      loginPageAssertions.checkValidLogin(infoData.validLogin);
      loginPageActions.logout();
    });
  });

  it("Check valid username and invalid password", () => {
    cy.get("@logInfo").then((infoData: any) => {
      loginPageActions.login(
        infoData.username.valid,
        infoData.password.invalid
      );
      loginPageAssertions.checkInvalidLogin(infoData.errorMsg.invalidLogin);
    });
  });

  it("Check invalid username and valid password", () => {
    cy.get("@logInfo").then((infoData: any) => {
      loginPageActions.login(
        infoData.username.invalid,
        infoData.password.valid
      );
      loginPageAssertions.checkInvalidLogin(infoData.errorMsg.invalidLogin);
    });
  });

  it("Check invalid username and invalid password", () => {
    cy.get("@logInfo").then((infoData: any) => {
      loginPageActions.login(
        infoData.username.invalid,
        infoData.password.valid
      );
      loginPageAssertions.checkInvalidLogin(infoData.errorMsg.invalidLogin);
    });
  });

  it("Check empty username and valid password", () => {
    cy.get("@logInfo").then((infoData: any) => {
      loginPageActions.login(infoData.password.empty, infoData.password.valid);
      loginPageAssertions.checkUsernameInputErrorMessageContainsValue(
        infoData.errorMsg.fieldRequired
      );
    });
  });

  it("Check empty username and invalid password", () => {
    cy.get("@logInfo").then((infoData: any) => {
      loginPageActions.login(
        infoData.password.empty,
        infoData.password.invalid
      );
      loginPageAssertions.checkUsernameInputErrorMessageContainsValue(
        infoData.errorMsg.fieldRequired
      );
    });
  });

  it("Check valid username and empty password", () => {
    cy.get("@logInfo").then((infoData: any) => {
      loginPageActions.login(infoData.username.valid, infoData.password.empty);
      loginPageAssertions.checkPasswordInputErrorMessageContainsValue(
        infoData.errorMsg.fieldRequired
      );
    });
  });

  it("Check invalid username and empty password", () => {
    cy.get("@logInfo").then((infoData: any) => {
      loginPageActions.login(
        infoData.username.invalid,
        infoData.password.empty
      );
      loginPageAssertions.checkPasswordInputErrorMessageContainsValue(
        infoData.errorMsg.fieldRequired
      );
    });
  });

  it("Check empty username and empty password", () => {
    cy.get("@logInfo").then((infoData: any) => {
      loginPageActions.login(infoData.password.empty, infoData.password.empty);
      loginPageAssertions.checkUsernameInputErrorMessageContainsValue(
        infoData.errorMsg.fieldRequired
      );
      loginPageAssertions.checkPasswordInputErrorMessageContainsValue(
        infoData.errorMsg.fieldRequired
      );
    });
  });

  it("Check password visibility", () => {
    cy.get("@logInfo").then((infoData: any) => {
      loginPageAssertions.passwordIsHidden();
    });
  });

  it("Check username sensitivity", () => {
    cy.get("@logInfo").then((infoData: any) => {
      if (infoData.username.valid == infoData.username.valid.toUpperCase())
        loginPageActions.login(
          infoData.username.valid.toLowerCase(),
          infoData.password.valid
        );
      else
        loginPageActions.login(
          infoData.username.valid.toUpperCase(),
          infoData.password.valid
        );
      loginPageAssertions.checkValidLogin(infoData.validLogin);
      loginPageActions.logout();
    });
  });

  it("Check password sensitivity", () => {
    cy.get("@logInfo").then((infoData: any) => {
      if (infoData.password.valid == infoData.password.valid.toUpperCase())
        loginPageActions.login(
          infoData.password.valid.toLowerCase(),
          infoData.password.valid
        );
      else
        loginPageActions.login(
          infoData.password.valid.toUpperCase(),
          infoData.password.valid
        );
      loginPageAssertions.checkInvalidLogin(infoData.errorMsg.invalidLogin);
    });
  });
});
