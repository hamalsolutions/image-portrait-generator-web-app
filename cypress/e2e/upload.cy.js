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

describe("correct upload scenario", () => {
  it("should successfully upload one file", () => {
    cy.intercept("POST", "/api/services/portrait/uploadFile", {
      fixture: "uploadOk.json",
    }).as("uploadRequest");
    cy.get("[data-cy=name]").should("exist").type("fake client");
    cy.get("[data-cy=email]").should("exist").type("fake@client.lol");
    cy.get("[data-cy=phone]").should("exist").type("1231231231");
    cy.get("[data-cy=location]").should("exist").click();
    cy.get("li[data-value=491521-1]").should("exist").click();
    cy.get('[name="files"]').selectFile("cypress/fixtures/img.PNG");
    cy.get("[data-cy=observation]").should("exist").type("Some Observations!");
    cy.get("[data-cy=submitButton]").should("exist").click();
    cy.wait("@uploadRequest");
    cy.get("[data-cy=successMessage]").should("exist");
  });
  it("should successfully upload several file", () => {
    cy.intercept("POST", "/api/services/portrait/uploadFile", {
      fixture: "uploadOk.json",
    }).as("uploadRequest");
    cy.get("[data-cy=name]").should("exist").type("fake client");
    cy.get("[data-cy=email]").should("exist").type("fake@client.lol");
    cy.get("[data-cy=phone]").should("exist").type("1231231231");
    cy.get("[data-cy=location]").should("exist").click();
    cy.get("li[data-value=491521-1]").should("exist").click();
    cy.get('[name="files"]').selectFile(["cypress/fixtures/img.PNG", "cypress/fixtures/img2.PNG"]);
    cy.get("[data-cy=observation]").should("exist").type("Some Observations!");
    cy.get("[data-cy=submitButton]").should("exist").click();
    cy.wait("@uploadRequest");
    cy.get("[data-cy=successMessage]").should("exist");
  });
});

describe("incorrect upload scenario", () => {
  it("should fail to upload one file", () => {
    cy.intercept("POST", "/api/services/portrait/uploadFile", {
      statusCode: 500,
      fixture: "uploadFail.json"
    }).as("uploadRequest");
    cy.get("[data-cy=name]").should("exist").type("fake client");
    cy.get("[data-cy=email]").should("exist").type("fake@client.lol");
    cy.get("[data-cy=phone]").should("exist").type("1231231231");
    cy.get("[data-cy=location]").should("exist").click();
    cy.get("li[data-value=491521-1]").should("exist").click();
    cy.get('[name="files"]').selectFile("cypress/fixtures/img.PNG");
    cy.get("[data-cy=observation]").should("exist").type("Some Observations!");
    cy.get("[data-cy=submitButton]").should("exist").click();
    cy.wait("@uploadRequest");
    cy.get("[data-cy=errorMessage]").should("exist");
  });

  it("should successfully upload one file and fail with the second file", () => {
    let count = 0;
    cy.intercept("POST", "/api/services/portrait/uploadFile", (req) => {
      if (count === 0) {
        req.reply({ fixture: "uploadOk.json" });
      } else {
        req.reply({ statusCode: 500, fixture: "uploadFail.json" });
      }
      count++;
    }).as("uploadRequest");
    cy.get("[data-cy=name]").should("exist").type("fake client");
    cy.get("[data-cy=email]").should("exist").type("fake@client.lol");
    cy.get("[data-cy=phone]").should("exist").type("1231231231");
    cy.get("[data-cy=location]").should("exist").click();
    cy.get("li[data-value=491521-1]").should("exist").click();
    cy.get('[name="files"]').selectFile(["cypress/fixtures/img.PNG", "cypress/fixtures/img2.PNG"]);
    cy.get("[data-cy=observation]").should("exist").type("Some Observations!");
    cy.get("[data-cy=submitButton]").should("exist").click();
    cy.wait("@uploadRequest");cy.wait("@uploadRequest");
    cy.get("[data-cy=errorMessage]").should("exist")
    .should("contain", "img");
  });
});
