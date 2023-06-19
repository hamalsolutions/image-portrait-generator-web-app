beforeEach(() => {
  cy.intercept("GET", "api/config/sites", { fixture: "sitesConfig.json" }).as(
    "sitesRequest"
  );
  cy.intercept("PUT", "/api/userToken", { fixture: "token.json" }).as(
    "loginRequest"
  );
  cy.visit("/login");
  cy.get("[data-cy=username]").should("exist").type("username");
  cy.get("[data-cy=password]").should("exist").type("password");
  cy.get("[data-cy=submitButton]").should("exist").click();
  cy.wait("@sitesRequest");
  cy.wait("@loginRequest");
  cy.get("[data-cy=nav-download]").should("exist").click();
});

describe("correct upload scenario", () => {
  it("should successfully download one file", () => {
    cy.intercept("GET", "/api/services/portrait/*?date=*", {
      fixture: "imageList.json",
    }).as("imageListRequest");
  });
});
