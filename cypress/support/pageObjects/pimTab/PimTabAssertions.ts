class PimTabAssertions {
  elements = {
    resultData: () => cy.get(".oxd-table-cell"),
  };

  searchEmployee([
    id,
    firstName,
    middleName,
    lastName,
    jobTitle,
    employmentStatus,
    subUnit,
    supervisor,
  ]: any) {
    this.elements.resultData().eq(1).should("contain", id);
    this.elements
      .resultData()
      .eq(2)
      .should("contain", `${firstName} ${middleName}`);
    this.elements.resultData().eq(3).should("contain", lastName);
    this.elements.resultData().eq(4).should("contain", jobTitle);
    this.elements.resultData().eq(5).should("contain", employmentStatus);
    this.elements.resultData().eq(6).should("contain", subUnit);
    this.elements.resultData().eq(7).should("contain", supervisor);
  }
}

export default PimTabAssertions;
