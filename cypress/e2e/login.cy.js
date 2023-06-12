describe("correct login scenario", () => {
  it("should successfully login into the app", () => {
    cy.intercept("GET", "api/config/sites", { fixture: "sitesConfig.json" });
    cy.intercept("PUT", "/api/userToken", { fixture: "token.json" });
    cy.visit("/login");
    cy.get("[data-cy=username]").should("exist").type("username");
    cy.get("[data-cy=password]").should("exist").type("password");
    cy.get("[data-cy=submitButton]").should("exist").click();
    cy.get("[data-cy=uploadImagesContent]")
      .should("exist")
      .should(
        "contain",
        "This page is currently under construction, please stay tunned for it's release"
      );
  });
});

describe("incorrect login scenario", () => {
  it("should unsuccessfully login into the app", () => {
    cy.intercept("GET", "api/config/sites", { fixture: "sitesConfig.json" });
    cy.intercept("PUT", "/api/userToken", {
      statusCode: 403,
      fixture: "tokenError.json",
    });
    cy.visit("/login");
    cy.get("[data-cy=username]").should("exist").type("username");
    cy.get("[data-cy=password]").should("exist").type("password");
    cy.get("[data-cy=submitButton]").should("exist").click();
    cy.get("[data-cy=errorAlert]")
      .should("exist")
      .should("contain", "Staff identity authentication failed");
  });

  it("should unsuccessfully login into the app with a different error response than expected", () => {
    cy.intercept("GET", "api/config/sites", { fixture: "sitesConfig.json" });
    cy.intercept("PUT", "/api/userToken", {
      statusCode: 403,
      fixture: "tokenErrorFaulty.json",
    });
    cy.visit("/login");
    cy.get("[data-cy=username]").should("exist").type("username");
    cy.get("[data-cy=password]").should("exist").type("password");
    cy.get("[data-cy=submitButton]").should("exist").click();
    cy.get("[data-cy=errorAlert]")
      .should("exist")
      .should("contain", "Failed to authenticate");
  });
  it("should unsuccessfully login into the app with a different error response than expected", () => {
    cy.intercept("GET", "api/config/sites", { statusCode: 404, body: {} });
    cy.intercept("PUT", "/api/userToken", { fixture: "token.json" });
    cy.visit("/login");
    cy.get("[data-cy=username]").should("exist").type("username");
    cy.get("[data-cy=password]").should("exist").type("password");
    cy.get("[data-cy=submitButton]").should("exist").click();
    cy.get("[data-cy=errorAlert]")
      .should("exist")
      .should("contain", "There was an error obtaining the sites list");
  });
});
