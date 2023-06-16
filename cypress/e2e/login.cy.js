describe("correct login scenario", () => {
  it("should successfully login into the app", () => {
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
    cy.get("[data-cy=mainTitle]")
      .should("exist")
      .should("contain", "8K Realistic View Add-on");
  });
});

describe("incorrect login scenario", () => {
  it("should unsuccessfully login into the app", () => {
    cy.intercept("GET", "api/config/sites", { fixture: "sitesConfig.json" }).as(
      "sitesRequest"
    );
    cy.intercept("PUT", "/api/userToken", {
      statusCode: 403,
      fixture: "tokenError.json",
    }).as("loginRequest");
    cy.visit("/login");
    cy.get("[data-cy=username]").should("exist").type("username");
    cy.get("[data-cy=password]").should("exist").type("password");
    cy.get("[data-cy=submitButton]").should("exist").click();
    cy.wait("@sitesRequest");
    cy.wait("@loginRequest");
    cy.get("[data-cy=errorAlert]")
      .should("exist")
      .should("contain", "Staff identity authentication failed");
  });

  it("should unsuccessfully login into the app with a different error response than expected", () => {
    cy.intercept("GET", "api/config/sites", { fixture: "sitesConfig.json" }).as(
      "sitesRequest"
    );
    cy.intercept("PUT", "/api/userToken", {
      statusCode: 403,
      fixture: "tokenErrorFaulty.json",
    }).as("loginRequest");
    cy.visit("/login");
    cy.get("[data-cy=username]").should("exist").type("username");
    cy.get("[data-cy=password]").should("exist").type("password");
    cy.get("[data-cy=submitButton]").should("exist").click();
    cy.wait("@sitesRequest");
    cy.wait("@loginRequest");
    cy.get("[data-cy=errorAlert]")
      .should("exist")
      .should("contain", "Failed to authenticate");
  });
  it("should unsuccessfully login into the app with a different error response than expected", () => {
    cy.intercept("GET", "api/config/sites", { statusCode: 404, body: {} }).as(
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
    cy.get("[data-cy=errorAlert]")
      .should("exist")
      .should("contain", "There was an error obtaining the sites list");
  });
});
