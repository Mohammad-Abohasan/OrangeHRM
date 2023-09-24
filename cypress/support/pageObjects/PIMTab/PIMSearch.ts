class PIMSearch {

  elements: { [key: string]: Function } = {
    empName: (value: string) => cy.get('input').eq(1).type(value),
    empId: (value: string) => cy.get('input').eq(2).type(value),
    empSupervisorName: (value: string) => {
      cy.get('input').eq(3).type(value, { force: true });
      cy.get('.oxd-autocomplete-option').contains(value).click();
    },
    selectOption: () => cy.get('.oxd-select-option'),

    empStatus: (value: string) => {
      cy.get('.oxd-select-text').eq(0).click();
      this.elements.selectOption().contains(value).click();
    },
    empInclude: (value: string) => {
      cy.get('.oxd-select-text').eq(1).click();
      this.elements.selectOption().contains(value).click();
    },
    empJobTitle: (value: string) => {
      cy.get('.oxd-select-text').eq(2).click();
      this.elements.selectOption().contains(value).click();
    },
    empSubUnit: (value: string) => {
      cy.get('.oxd-select-text').eq(3).click();
      this.elements.selectOption().contains(value).click();
    },


    resultData: () => cy.get('.oxd-table-cell'),

    checkEmpName: (value: string) => {
      const [fName, mName, lName] = value.split(' ');
      this.elements.resultData().eq(2).contains((fName ? fName : '') + ' ' + (mName ? mName : '')).as('First (& Middle) Name are correct');
      this.elements.resultData().eq(3).contains((lName ? lName : '')).as('Last Name is correct');
    },
    checkEmpId: (value: string) => {
      this.elements.resultData().eq(1).contains(value).as('ID is correct');
    },
    checkEmpSupervisorName: (value: string) => {
      this.elements.resultData().eq(7).contains(value).as('Supervisor Name is correct');
    },
    checkEmpStatus: (value: string) => {
      this.elements.resultData().eq(5).contains(value).as('Include is correct');
    },
    checkEmpJobTitle: (value: string) => {
      this.elements.resultData().eq(4).contains(value).as('Job Title is correct');
    },
    checkEmpSubUnit: (value: string) => {
      this.elements.resultData().eq(6).contains(value).as('Sub Unit is correct');
    },

  }

  search(empInfo: { key: string, value: string }) {
    const { key, value } = empInfo;
    if (this.elements.hasOwnProperty(key)) {
      if (value) {
        this.elements[key](value);
      }
    } else {
      throw `${key} not a function.`;
    }
  }

  checkSearch(empInfo: { key: string, value: string }) {
    let { key, value } = empInfo;
    key = key[0].toUpperCase() + key.substring(1);
    if (this.elements.hasOwnProperty(`check${key}`)) {
      if (value) {
        this.elements[`check${key[0].toUpperCase() + key.substring(1)}`](value);
      }
    } else {
      console.log(`${key} not a function.`);
    }
  }

}

export default PIMSearch;