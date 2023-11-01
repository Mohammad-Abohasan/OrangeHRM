class MyLeavePage {
  elements = {};

  open() {
    cy.visit("/web/index.php/leave/viewMyLeaveList");
  }
}

export default MyLeavePage;
