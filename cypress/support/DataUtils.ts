class DataUtils {

  addEmployee(username: string, password: string, status: boolean, userRoleId: number, empNumber: number) {
    cy.request({
      method: 'POST',
      url: '/web/index.php/api/v2/admin/users',
      body: {
        username,
        password,
        status,
        userRoleId,
        empNumber
      }
    }).then((response) => {
      expect(response).property(`status`).to.equal(200);
    });
  }

  // getEmployee(username: string) {
  //   let ans: number;
  //   cy.request(`/web/index.php/api/v2/admin/users?username=${username}`)
  //     .then((response) => {
  //       ans = response.body?.data[0]?.id;
  //       expect(response).property(`status`).to.equal(200);
  //     });
  //   return ans;
  // }

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

export default DataUtils;