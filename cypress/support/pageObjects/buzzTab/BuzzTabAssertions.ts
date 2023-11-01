class BuzzTabAssertions {
  elements = {
    posts: () => cy.get(".oxd-sheet"),
  };

  checkPostText(postData: string) {
    this.elements.posts().contains("p", postData).as("Successfully added post");
  }
}

export default BuzzTabAssertions;
