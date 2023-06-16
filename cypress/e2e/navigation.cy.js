describe("general navigation test", () => {
  it("should visit the default home page and be redirected to the login page", () => {
    cy.visit("/");
    cy.get("[data-cy=loginTitle]").should("exist").should("contain", "Log in");
  });

  it("should visit a random page and be redirected to the not found page", () => {
    cy.visit("/asdasd");
    cy.get("[data-cy=notFoundTitle]").should("exist").should("contain", "Whoops! Seems like nothing was found");
  });
});
