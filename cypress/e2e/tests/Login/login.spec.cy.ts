import LoginPage from "../../../support/pageObjects/LoginPage";

const loginPage: LoginPage = new LoginPage();

describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.fixture("loginInfo").as("logInfo");
  });

  it("Check valid userName and valid password", () => {
    cy.get("@logInfo").then((infoData: any) => {
      loginPage.login(infoData.userName.valid, infoData.password.valid);
      loginPage.checkValidLogin(infoData.validLogin);
      loginPage.logout();
    });
  });

  it("Check valid userName and invalid password", () => {
    cy.get("@logInfo").then((infoData: any) => {
      loginPage.login(infoData.userName.valid, infoData.password.invalid);
      loginPage.checkInvalidLogin(infoData.errorMsg.invalidLogin);
    });
  });

  it("Check invalid userName and valid password", () => {
    cy.get("@logInfo").then((infoData: any) => {
      loginPage.login(infoData.userName.invalid, infoData.password.valid);
      loginPage.checkInvalidLogin(infoData.errorMsg.invalidLogin);
    });
  });

  it("Check invalid userName and invalid password", () => {
    cy.get("@logInfo").then((infoData: any) => {
      loginPage.login(infoData.userName.invalid, infoData.password.valid);
      loginPage.checkInvalidLogin(infoData.errorMsg.invalidLogin);
    });
  });

  it("Check empty userName and valid password", () => {
    cy.get("@logInfo").then((infoData: any) => {
      loginPage.login(infoData.password.empty, infoData.password.valid);
      loginPage.checkUserNameInputErrorMessageContainsValue(
        infoData.errorMsg.fieldRequired
      );
    });
  });

  it("Check empty userName and invalid password", () => {
    cy.get("@logInfo").then((infoData: any) => {
      loginPage.login(infoData.password.empty, infoData.password.invalid);
      loginPage.checkUserNameInputErrorMessageContainsValue(
        infoData.errorMsg.fieldRequired
      );
    });
  });

  it("Check valid userName and empty password", () => {
    cy.get("@logInfo").then((infoData: any) => {
      loginPage.login(infoData.userName.valid, infoData.password.empty);
      loginPage.checkPasswordInputErrorMessageContainsValue(
        infoData.errorMsg.fieldRequired
      );
    });
  });

  it("Check invalid userName and empty password", () => {
    cy.get("@logInfo").then((infoData: any) => {
      loginPage.login(infoData.userName.invalid, infoData.password.empty);
      // loginPage.checkEmptyPassword(infoData.errorMsg.fieldRequired);
      loginPage.checkPasswordInputErrorMessageContainsValue(
        infoData.errorMsg.fieldRequired
      );
    });
  });

  it("Check empty userName and empty password", () => {
    cy.get("@logInfo").then((infoData: any) => {
      loginPage.login(infoData.password.empty, infoData.password.empty);
      loginPage.checkUserNameInputErrorMessageContainsValue(
        infoData.errorMsg.fieldRequired
      );
      loginPage.checkPasswordInputErrorMessageContainsValue(
        infoData.errorMsg.fieldRequired
      );
    });
  });

  it("Check password visibility", () => {
    cy.get("@logInfo").then((infoData: any) => {
      loginPage.passwordIsHidden();
    });
  });

  it("Check userName sensitivity", () => {
    cy.get("@logInfo").then((infoData: any) => {
      if (infoData.userName.valid == infoData.userName.valid.toUpperCase())
        loginPage.login(
          infoData.userName.valid.toLowerCase(),
          infoData.password.valid
        );
      else
        loginPage.login(
          infoData.userName.valid.toUpperCase(),
          infoData.password.valid
        );
      loginPage.checkValidLogin(infoData.validLogin);
      loginPage.logout();
    });
  });

  it("Check password sensitivity", () => {
    cy.get("@logInfo").then((infoData: any) => {
      if (infoData.password.valid == infoData.password.valid.toUpperCase())
        loginPage.login(
          infoData.password.valid.toLowerCase(),
          infoData.password.valid
        );
      else
        loginPage.login(
          infoData.password.valid.toUpperCase(),
          infoData.password.valid
        );
      loginPage.checkInvalidLogin(infoData.errorMsg.invalidLogin);
    });
  });
});
