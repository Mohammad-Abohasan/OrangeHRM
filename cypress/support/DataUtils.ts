class DataUtils {

  adminTab = {
    addEmployee(userName: string, password: string, status: boolean, userRoleId: number, empNumber: number) {
      cy.request({
        method: 'POST',
        url: '/web/index.php/api/v2/admin/users',
        body: {
          username: userName,
          password,
          status,
          userRoleId,
          empNumber
        }
      }).then((response) => {
        expect(response).property(`status`).to.equal(200);
      });
    },

    deleteEmployee(username: string) {
      cy.request(`/web/index.php/api/v2/admin/users?username=${username}`)
        .then((response1) => {
          cy.request({
            method: 'DELETE',
            url: '/web/index.php/api/v2/admin/users',
            body: {
              ids: [response1.body?.data[0]?.id]
            }
          }).then((response2) => {
            expect(response2).property(`status`).to.equal(200);
          });
        });

    }
  }

  pimTab = {
    addEmployee(firstName: string, middleName: string, lastName: string, id: number, userName: string, password: string) {

      cy.request({
        method: 'POST',
        url: '/web/index.php/api/v2/pim/employees',
        body: {
          firstName,
          middleName,
          lastName,
          employeeId: id
        }
      }).then((response) => {
          cy.request({
            method: 'POST',
            url: '/web/index.php/api/v2/admin/users',
            body: {
              username: userName,
              password,
              status: true,
              userRoleId: 2,
              empNumber: response.body.data.empNumber
            }
          }).then((response) => {
            expect(response).property(`status`).to.equal(200);
          });
        expect(response).property(`status`).to.equal(200);
      });

    }
  }

}

export default DataUtils;