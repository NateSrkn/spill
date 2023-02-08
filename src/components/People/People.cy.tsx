import { People } from "./People";
import "$/styles/globals.scss";

describe("<People />", () => {
  beforeEach(() => {
    cy.mount(<People />);
  });
  it("should render and display header and counter", () => {
    const increaseButton = cy.get('button[name="increase"]');
    const decreaseButton = cy.get('button[name="decrease"]');
    cy.get("h3").contains("People");
    decreaseButton.should("exist");
    increaseButton.should("exist");
  });

  it("should allow the user to increase the amount of people", () => {
    const increaseButton = cy.get('button[name="increase"]');
    increaseButton.click().click().click();
    cy.get("input").should("have.length", 3);
  });

  it("should allow the user to decrease the amount of people", () => {
    const decreaseButton = cy.get('button[name="decrease"]');
    decreaseButton.click();
    cy.get("input").should("have.length", 2);
    decreaseButton.click();
    cy.get("input").should("have.length", 1);
  });

  it("should allow the user to update the input", () => {
    cy.get(":nth-child(2) > input").type("John Smith");
    cy.get(":nth-child(2) > .avatar").should("have.text", "JS");
  });

  it("should allow the user to delete the person they created", () => {
    cy.get(":nth-child(2) > input ~ button").click();
    cy.get(":nth-child(2) > input").should("not.exist");
  });
});
