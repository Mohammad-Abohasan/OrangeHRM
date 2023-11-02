class BuzzTabAssertions {
  elements = {
    posts: () => cy.get(".oxd-sheet"),
  };

  checkNewPostCreated(postContent: string) {
    this.elements
      .posts()
      .eq(1)
      .contains(postContent)
      .as("Post successfully created");
  }
}

export default BuzzTabAssertions;
