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
});

describe("correct download scenario", () => {
  it("should successfully preview and download one file", () => {
    cy.intercept("GET", "/api/services/portrait/*?date=*", {
      fixture: "imageList.json",
    }).as("imageListRequest1");
    cy.intercept("GET", "/api/services/portrait?fileName=*", {
      headers: {
        "Content-Type": "blob",
      },
      statusCode: 200,
      fixture: "response.jpg",
    }).as("imgDownload");

    cy.get("[data-cy=nav-download]").should("exist").click();
    cy.wait("@imageListRequest1");
    cy.wait(500);
    cy.get("[data-cy=row-1]").should("exist");
    cy.get("[data-cy=view-1]").should("exist").click();
    cy.get("[data-cy=previewImage]").should("exist");
    cy.wait(1000);
    cy.get('#backdropCy').should("exist").click({force: true});
    cy.get("[data-cy=check-1]").should("exist").click();
    cy.get("[data-cy=downloadButton]").should("exist").click();
    cy.readFile('cypress/downloads/photo_2022-10-10_20-21-25.jpg');
  });

  it("should successfully preview and download one failed file", () => {
    cy.intercept("GET", "/api/services/portrait/*?date=*", {
      fixture: "imageListWithFail.json",
    }).as("imageListRequest2");
    cy.intercept("GET", "/api/services/portrait?fileName=*", {
      headers: {
        "Content-Type": "blob",
      },
      statusCode: 200,
      fixture: "response.jpg",
    }).as("imgDownload");
    cy.get("[data-cy=nav-download]").should("exist").click();
    cy.wait("@imageListRequest2");
    cy.wait(500);
    cy.get("[data-cy=row-4]").should("exist");
    cy.get("[data-cy=view-4]").should("exist").click();
    cy.get("[data-cy=previewImage]").should("exist");
    cy.wait(1000);
    cy.get('#backdropCy').should("exist").click({force: true});
    cy.get("[data-cy=check-4]").should("exist").click();
    cy.get("[data-cy=downloadButton]").should("exist").click();
    cy.readFile('cypress/downloads/siete.png');
  });
});

describe("incorrect download scenario", () => {
  it("should unsuccessfully preview one file", () => {
    cy.intercept("GET", "/api/services/portrait/*?date=*", {
      fixture: "imageList.json",
    }).as("imageListRequest3");
    cy.intercept("GET", "/api/services/portrait?fileName=*", {
      statusCode: 409,
      body: {},
    }).as("imgDownload");
    cy.get("[data-cy=nav-download]").should("exist").click();
    cy.wait("@imageListRequest3");
    cy.wait(500);
    cy.get("[data-cy=row-1]").should("exist");
    cy.get("[data-cy=view-1]").should("exist").click();
    cy.get("[data-cy=previewErrorMessage]").should("exist");
  });

  it("should unsuccessfully download one failed file", () => {
    cy.intercept("GET", "/api/services/portrait/*?date=*", {
      fixture: "imageListWithFail.json",
    }).as("imageListRequest4");
    cy.intercept("GET", "/api/services/portrait?fileName=*", {
      statusCode: 409,
      body: {},
    }).as("imgDownload");
    cy.get("[data-cy=nav-download]").should("exist").click();
    cy.wait("@imageListRequest4");
    cy.wait(500);
    cy.get("[data-cy=row-4]").should("exist");
    cy.get("[data-cy=view-4]").should("exist").click();
    cy.get("[data-cy=previewErrorMessage]").should("exist");
  });
});
