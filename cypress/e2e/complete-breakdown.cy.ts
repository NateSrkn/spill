export {};
describe("JaJaJa", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000");
    cy.get("input[name='title']").should("exist");
    cy.get("input[name='title']").type("JaJaJa");
    cy.get("input[name='title']").type("JaJaJa");
    const peopleSection = cy.get("#People");
    peopleSection.should("exist");
    const increase = peopleSection.get("button[name='increase']");
    increase.click().click().click().click();
    cy.get("input[name='name']").should("have.length", 4);
    cy.contains("Add Item").click();
  });
});
